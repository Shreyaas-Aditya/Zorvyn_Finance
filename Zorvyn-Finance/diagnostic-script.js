// ================================================
// EMERGENCY DIAGNOSTIC: Test Supabase Connection
// Open browser console and paste this entire script
// ================================================

console.log('🔍 Starting Supabase Connection Diagnostic...\n')

async function runDiagnostics() {
  try {
    // Test 1: Check environment variables
    console.log('📋 Test 1: Environment Variables')
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    console.log('   URL:', url ? '✅ Set' : '❌ Missing')
    console.log('   Key:', key ? '✅ Set' : '❌ Missing')
    if (!url || !key) {
      console.error('❌ Missing environment variables! Check your .env file')
      return
    }
    console.log('\n')

    // Test 2: Get current session
    console.log('📋 Test 2: Current Session')
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError)
      return
    }
    
    console.log('   Logged in:', sessionData.session ? '✅ Yes' : '❌ No')
    if (sessionData.session) {
      console.log('   User ID:', sessionData.session.user.id)
      console.log('   Email:', sessionData.session.user.email)
      console.log('   Token expires:', new Date(sessionData.session.expires_at * 1000).toLocaleString())
    }
    console.log('\n')

    if (!sessionData.session) {
      console.error('❌ No active session. Please log in first.')
      return
    }

    // Test 3: Check profile
    console.log('📋 Test 3: User Profile')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single()
    
    if (profileError) {
      console.error('❌ Profile error:', profileError)
    } else {
      console.log('   Profile found:', profile ? '✅ Yes' : '❌ No')
      if (profile) {
        console.log('   Name:', profile.name)
        console.log('   Role:', profile.role)
      }
    }
    console.log('\n')

    // Test 4: Check database connectivity
    console.log('📋 Test 4: Database Connectivity Test')
    console.log('   Testing simple query...')
    const startTime = Date.now()
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    const duration = Date.now() - startTime
    
    if (testError) {
      console.error('❌ Query failed:', testError)
    } else {
      console.log('   ✅ Database responding')
      console.log('   Response time:', duration, 'ms')
    }
    console.log('\n')

    // Test 5: Transaction query test
    console.log('📋 Test 5: Transaction Query Test')
    console.log('   Querying transactions...')
    const txStartTime = Date.now()
    
    const { data: transactions, error: txError, status, statusText } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order('date', { ascending: false })
    
    const txDuration = Date.now() - txStartTime
    
    console.log('   Response time:', txDuration, 'ms')
    console.log('   Status:', status, statusText)
    
    if (txError) {
      console.error('❌ Transaction query error:', txError)
      console.error('   Error code:', txError.code)
      console.error('   Error message:', txError.message)
      console.error('   Error details:', txError.details)
      console.error('   Error hint:', txError.hint)
    } else {
      console.log('   ✅ Query successful')
      console.log('   Transactions found:', transactions?.length || 0)
      if (transactions && transactions.length > 0) {
        console.table(transactions.map(t => ({
          date: t.date,
          amount: t.amount,
          category: t.category,
          type: t.type
        })))
      } else {
        console.warn('   ⚠️ No transactions found in database')
        console.warn('   To create sample data:')
        console.warn('   1. Go to Supabase Dashboard → SQL Editor')
        console.warn('   2. Run CREATE-SAMPLE-DATA.sql from your project')
      }
    }
    console.log('\n')

    // Test 6: Network inspection
    console.log('📋 Test 6: Network Check')
    console.log('   Open DevTools → Network tab')
    console.log('   Filter by: "transactions"')
    console.log('   Look for POST requests to /rest/v1/transactions')
    console.log('   Check status codes (should be 200)')
    console.log('\n')

    console.log('✅ Diagnostic complete!')
    console.log('\n📊 Summary:')
    console.log('   - Environment: ' + (url && key ? '✅ OK' : '❌ Issue'))
    console.log('   - Session: ' + (sessionData.session ? '✅ OK' : '❌ Not logged in'))
    console.log('   - Profile: ' + (profile ? '✅ OK' : '❌ Issue'))
    console.log('   - Database: ' + (testError ? '❌ Issue' : '✅ OK'))
    console.log('   - Transactions: ' + (txError ? '❌ Error' : transactions?.length > 0 ? '✅ Data found' : '⚠️ No data'))

  } catch (err) {
    console.error('❌ Diagnostic failed:', err)
    console.error(err.stack)
  }
}

runDiagnostics()
