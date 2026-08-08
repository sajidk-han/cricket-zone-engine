import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDb() {
  console.log('Checking organizations...')
  const { data: orgs } = await supabase.from('organizations').select('id, name, slug')
  console.log('Organizations:', orgs)

  if (orgs && orgs.length > 0) {
    for (const org of orgs) {
      const { data: matches } = await supabase.from('matches').select('id, status, org_id').eq('org_id', org.id)
      console.log(`Matches for ${org.name}:`, matches?.length || 0)
    }
  }
}

checkDb()
