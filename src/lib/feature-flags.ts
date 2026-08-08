import { createClient } from '@/lib/supabase-server'

export type FeatureFlagName = 
  | 'ENABLE_COMMENTARY'
  | 'ENABLE_WIN_PROBABILITY'
  | 'ENABLE_ADVANCED_GRAPHS'
  | 'ENABLE_SPONSORS'
  | 'ENABLE_HIGHLIGHTS'
  | 'ENABLE_NOTIFICATIONS'
  | 'ENABLE_TRENDING'

// Default fallback values if DB fetch fails or flag is missing
const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  ENABLE_COMMENTARY: false,
  ENABLE_WIN_PROBABILITY: false,
  ENABLE_ADVANCED_GRAPHS: false,
  ENABLE_SPONSORS: false,
  ENABLE_HIGHLIGHTS: false,
  ENABLE_NOTIFICATIONS: false,
  ENABLE_TRENDING: false,
}

/**
 * Fetches feature flags for a specific organization or global scope.
 * Utilizes Next.js fetch caching since flags rarely change.
 */
export async function getFeatureFlags(orgId?: string): Promise<Record<FeatureFlagName, boolean>> {
  try {
    const supabase = await createClient()
    
    // Fetch global flags (org_id IS NULL) and org-specific flags
    let query = supabase.from('feature_flags').select('flag_name, is_enabled')
    if (orgId) {
      query = query.or(`org_id.is.null,org_id.eq.${orgId}`)
    } else {
      query = query.is('org_id', null)
    }

    const { data, error } = await query

    if (error || !data) {
      return DEFAULT_FLAGS
    }

    const flags = { ...DEFAULT_FLAGS }
    
    data.forEach(flag => {
      if (flag.flag_name in flags) {
        flags[flag.flag_name as FeatureFlagName] = flag.is_enabled
      }
    })

    return flags
  } catch (error) {
    console.error('Error fetching feature flags:', error)
    return DEFAULT_FLAGS
  }
}

/**
 * Convenience function to check a single flag.
 */
export async function isFeatureEnabled(flagName: FeatureFlagName, orgId?: string): Promise<boolean> {
  const flags = await getFeatureFlags(orgId)
  return flags[flagName]
}
