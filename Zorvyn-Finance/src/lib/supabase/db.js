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
  console.log('db.listTransactions: Fetching for userId:', userId)
  
  // Debug: Check if we have an active session
  const { data: { session } } = await supabase.auth.getSession()
  console.log('db.listTransactions: Session check:', {
    hasSession: !!session,
    hasAccessToken: !!session?.access_token,
    userId: session?.user?.id
  })
  
  if (!session) {
    throw new Error('No active session - please log in again')
  }
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('id,user_id,amount,category,type,date')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    
    if (error) {
      console.error('db.listTransactions: Error:', error)
      throw error
    }
    
    console.log('db.listTransactions: Success, rows:', data?.length || 0)
    return data ?? []
  } catch (err) {
    console.error('db.listTransactions: Exception:', err)
    throw err
  }
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
