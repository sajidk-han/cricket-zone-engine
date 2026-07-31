"use server"

import { createClient } from '@/lib/supabase-server'
import { createInviteSchema, acceptInviteSchema, ApiResponse } from '../schemas/invite.schema'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

export async function sendInvite(formData: FormData): Promise<ApiResponse<any>> {
  const supabase = await createClient()
  
  // 1. Zod Validation
  const rawData = {
    email: formData.get('email'),
    role: formData.get('role'),
    orgId: formData.get('orgId'),
  }

  const parsed = createInviteSchema.safeParse(rawData)
  
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Validation error' }
  }

  // 2. Auth & RBAC Check (Must be Admin of the Org)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: internalUser } = await supabase.from('users').select('id').eq('auth_id', user.id).single()
  if (!internalUser) return { success: false, error: 'User profile not found' }

  // Check admin rights
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('org_id', parsed.data.orgId)
    .eq('user_id', internalUser.id)
    .single()

  if (!membership || membership.role !== 'admin') {
    return { success: false, error: 'You do not have permission to invite users to this organization' }
  }

  // 3. Generate Secure Token & Expiry (7 days)
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  // 4. Insert Invitation
  const { error } = await supabase
    .from('organization_invitations')
    .insert([{
      org_id: parsed.data.orgId,
      email: parsed.data.email,
      role: parsed.data.role,
      token,
      invited_by: internalUser.id,
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    }])

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { success: false, error: 'A pending invitation already exists for this email' }
    }
    console.error('Invite error:', error)
    return { success: false, error: 'Failed to send invitation' }
  }

  // 5. Fire Audit Log (Server side, bypassing RLS if needed, or via Trigger)
  await supabase.from('audit_logs').insert([{
    org_id: parsed.data.orgId,
    user_id: internalUser.id,
    action: 'INVITE_SENT',
    entity_type: 'organization_invitations',
    metadata: { email: parsed.data.email, role: parsed.data.role }
  }])

  // FUTURE: Trigger Email Service Here

  revalidatePath('/settings')
  return { success: true, data: { message: 'Invitation sent successfully' } }
}
