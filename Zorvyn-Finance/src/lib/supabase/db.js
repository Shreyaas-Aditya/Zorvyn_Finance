import { supabase } from './client'

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
    // If profile doesn't exist, create it
    if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
      return await createProfile(userId, name)
    }
    throw error
  }
}

export async function listTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('id,user_id,amount,category,type,date,note')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createTransaction(payload) {
  const { data, error } = await supabase.from('transactions').insert(payload).select('*').single()
  if (error) throw error
  return data
}

export async function updateTransaction(id, patch) {
  const { data, error } = await supabase.from('transactions').update(patch).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
