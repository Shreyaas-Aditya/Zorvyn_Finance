import { supabase } from './client'

// Supabase REST API base config
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper for raw fetch - BYPASSES SUPABASE CLIENT COMPLETELY
async function rawFetch(endpoint, options = {}, accessToken = null) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`
  const headers = {
    'apikey': SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers
  }
  
  const response = await fetch(url, { ...options, headers })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  
  return response.json()
}

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('id,name,role').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function createProfile(userId, name) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, name, role: 'viewer' })
    .select('id,name,role')
    .single()
  if (error) throw error
  return data
}

export async function getOrCreateProfile(userId, name) {
  try {
    return await getProfile(userId)
  } catch (error) {
    if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
      return await createProfile(userId, name)
    }
    throw error
  }
}

// NUCLEAR OPTION: Use raw fetch, receive token from context
export async function listTransactions(userId, accessToken) {
  if (!userId) {
    console.error('❌ listTransactions: No userId')
    return []
  }
  
  console.log('🔍 listTransactions: Fetching for user:', userId)
  console.log('🔑 Token provided:', accessToken ? 'YES' : 'NO')
  
  try {
    const data = await rawFetch(
      `transactions?user_id=eq.${userId}&order=date.desc`,
      { method: 'GET' },
      accessToken
    )
    
    console.log('✅ Fetched', data.length, 'transactions!')
    return data || []
  } catch (err) {
    console.error('❌ listTransactions error:', err)
    throw err
  }
}

export async function createTransaction(payload, accessToken) {
  console.log('➕ createTransaction:', payload)
  return rawFetch('transactions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, accessToken).then(arr => arr[0])
}

export async function updateTransaction(id, patch, accessToken) {
  console.log('✏️ updateTransaction:', id, patch)
  return rawFetch(`transactions?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch)
  }, accessToken).then(arr => arr[0])
}

export async function deleteTransaction(id, accessToken) {
  console.log('🗑️ deleteTransaction:', id)
  await rawFetch(`transactions?id=eq.${id}`, {
    method: 'DELETE'
  }, accessToken)
}
