"use server"

import { supabase } from '@/lib/supabase'

export async function getDefaultOrgId() {
  // First try to fetch the first organization
  const { data: orgs } = await supabase.from('organizations').select('id').limit(1)
  
  if (orgs && orgs.length > 0) {
    return orgs[0].id
  }

  // If no org exists, create one
  const { data: newOrg, error } = await supabase
    .from('organizations')
    .insert([{ 
      name: 'Default Organization',
      slug: 'default-org'
    }])
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create default org:', error)
    throw new Error('Failed to create default organization')
  }

  return newOrg.id
}
