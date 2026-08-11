"use server"

import { createClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['organizer', 'manager', 'scorer', 'viewer']) // Allow standard roles, but we'll enforce rules below
})

export async function inviteUserWithPassword(formData: FormData) {
  try {
    const validatedData = inviteSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    })

    const { email, password, role } = validatedData

    // 1. Authenticate inviter and verify permissions
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return { success: false, message: 'Not authenticated' }
    }

    const adminSupabase = getAdminClient()

    // Get inviter's user record and organization using admin client to bypass RLS
    const { data: inviterUser } = await adminSupabase
      .from('users')
      .select('id')
      .eq('auth_id', authUser.id)
      .single()

    if (!inviterUser) {
      return { success: false, message: 'Inviter profile not found' }
    }

    const { data: membership } = await adminSupabase
      .from('organization_members')
      .select('org_id, role')
      .eq('user_id', inviterUser.id)
      .limit(1)
      .maybeSingle()

    if (!membership) {
      return { success: false, message: 'You must belong to an organization to invite users' }
    }

    // Only owner or admin can invite
    if (membership.role !== 'owner' && membership.role !== 'admin') {
      return { success: false, message: 'You do not have permission to invite users' }
    }

    // Ensure they aren't trying to create another owner/admin unless they are owner/admin?
    // Wait, the prompt says: "The client must NOT be allowed to submit: role = owner, admin, super_admin".
    if ((role as string) === 'owner' || (role as string) === 'admin' || (role as string) === 'super_admin') {
      return { success: false, message: 'Cannot grant administrative roles through this interface' }
    }

    const orgId = membership.org_id

    // 2. Check for duplicate email directly using RPC or Auth admin if possible.
    // Easiest is to try finding the user in public.users
    const { data: existingUser } = await adminSupabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' }
    }

    // 3. Create user via Auth Admin (this does NOT expose the password anywhere else)
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      // Return a safe error message
      console.error('Auth creation error:', authError)
      return { success: false, message: 'Failed to create user account. Please try again.' }
    }

    const newAuthUserId = authData.user.id

    // 4. The `handle_new_user` trigger automatically creates:
    // - public.users record
    // - an isolated organizations record
    // - an isolated organization_members record (as 'owner')
    // We must wait a brief moment for the trigger to complete.
    await new Promise(resolve => setTimeout(resolve, 500))

    // Fetch the newly created public user
    const { data: newUser } = await adminSupabase
      .from('users')
      .select('id')
      .eq('auth_id', newAuthUserId)
      .single()

    if (!newUser) {
      // Rollback auth user if trigger failed
      await adminSupabase.auth.admin.deleteUser(newAuthUserId)
      return { success: false, message: 'System error: Profile creation failed. Rolled back.' }
    }

    // 5. Add user to the INVITER'S organization with the requested role
    const { error: memberError } = await adminSupabase
      .from('organization_members')
      .insert({
        org_id: orgId,
        user_id: newUser.id,
        role: role
      })

    if (memberError) {
      // Rollback auth user
      await adminSupabase.auth.admin.deleteUser(newAuthUserId)
      return { success: false, message: 'Failed to add user to organization. Rolled back.' }
    }

    // 6. Audit Logging
    await adminSupabase
      .from('security_audit_logs')
      .insert({
        user_id: inviterUser.id,
        organization_id: orgId,
        action: 'organizer_created',
        metadata: {
          created_by: inviterUser.id,
          organization_id: orgId,
          created_user_id: newUser.id,
          role: role,
          timestamp: new Date().toISOString()
        }
      })

    return { success: true, message: 'User created successfully. Share credentials securely.' }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: (error as any).errors[0].message }
    }
    console.error('Invite error:', error)
    return { success: false, message: 'An unexpected error occurred.' }
  }
}
