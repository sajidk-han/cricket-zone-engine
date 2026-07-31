"use server"

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// Temporary mock org ID for V1 (Single tenant mode for now)
import { getDefaultOrgId } from '@/app/actions/org'
import { createTournamentSchema, ApiResponse } from '@/features/tournaments/schemas/tournament.schema'

export async function createTournament(formData: FormData): Promise<ApiResponse<any>> {
  // 1. Zod Validation
  const rawData = {
    name: formData.get('name'),
    location: formData.get('location') || undefined,
    startDate: formData.get('startDate') || undefined,
    endDate: formData.get('endDate') || undefined,
  };

  const parsed = createTournamentSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Validation error' };
  }

  // 2. Fetch Default Org (Will be replaced by Session Org Context)
  const orgId = await getDefaultOrgId()

  // 3. Database Insertion
  const { data, error } = await supabase
    .from('tournaments')
    .insert([{ 
      org_id: orgId,
      name: parsed.data.name, 
      location: parsed.data.location || null,
      status: 'scheduled',
      start_date: parsed.data.startDate || null,
      end_date: parsed.data.endDate || null,
      format: parsed.data.format,
      overs: parsed.data.overs
    }])
    .select()
    .single()

  if (error) {
    console.error('Fetch tournaments error:', error.message, error.details, error.hint)
    return { success: false, error: error.message }
  }

  revalidatePath('/tournaments')
  return { success: true, data }
}

export async function fetchTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch tournaments error:', error.message, error.details, error.hint)
    return []
  }

  return data
}
