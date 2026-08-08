"use server"

import { createAdminClient } from '@/lib/supabase-server'

export async function searchOrganizations(query: string) {
  if (!query || query.length < 2) return []
  
  try {
    const supabase = await createAdminClient()
    
    // Search by name or slug
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, slug, logo_url')
      .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
      .limit(5)
      
    if (error) {
      console.error('Search error:', error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('Failed to search organizations:', err)
    return []
  }
}
