import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function check() {
  const { data, error } = await supabase.storage.from('team-logos').list('a346bf4c-92cf-4a3d-a084-768b2d428c7a')
  console.log('Inside org folder:', data)
  
  if (data && data.length > 0) {
     const { data: inner } = await supabase.storage.from('team-logos').list('a346bf4c-92cf-4a3d-a084-768b2d428c7a/' + data[0].name)
     console.log('Inside team folder:', inner)
  }
}
check()
