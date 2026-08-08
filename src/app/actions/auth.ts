"use server"

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required.' }
    }

    const supabase = await createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (signUpError) {
          return { error: signUpError.message }
        }
      } else {
        return { error: signInError.message }
      }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled Server Action Error in login:', err)
    return { error: err.message || 'An unexpected server error occurred.' }
  }
}

export async function registerOrganization(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const orgName = formData.get('orgName') as string

    if (!email || !password || !fullName || !orgName) {
      return { error: 'All fields are required.' }
    }

    const supabase = await createClient()

    const { createAdminClient } = await import('@/lib/supabase-server')
    const adminClient = createAdminClient()

    // 1. Sign up using Admin API to completely bypass rate limits
    const { error: signUpError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    
    if (signUpError && !signUpError.message.includes('already registered') && !signUpError.message.includes('already exists')) {
      return { error: signUpError.message }
    }

    // Now sign in to establish the secure session cookie
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return { error: 'Failed to establish session: ' + signInError.message }
    }

    const authUser = signInData.user
    if (!authUser) {
      return { error: 'Failed to retrieve user account.' }
    }

    // 2. Create the Organization (Pending Status)

    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)
    
    const { data: orgData, error: orgError } = await adminClient
      .from('organizations')
      .insert([{ name: orgName, slug: slug, status: 'pending' }])
      .select('id')
      .single()

    if (orgError) {
      return { error: 'Failed to create organization: ' + orgError.message }
    }

    // 3. Get or Create the User Record in public schema
    let userData;
    const { data: existingUser } = await adminClient
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      userData = existingUser
    } else {
      const { data: newUser, error: userError } = await adminClient
        .from('users')
        .insert([{ auth_id: authUser.id, email: email, full_name: fullName }])
        .select('id')
        .single()

      if (userError) {
        return { error: 'Failed to create user profile: ' + userError.message }
      }
      userData = newUser
    }

    // 4. Link User to Organization as Admin
    const { error: memberError } = await adminClient
      .from('organization_members')
      .insert([{ org_id: orgData.id, user_id: userData.id, role: 'admin' }])

    if (memberError) {
      return { error: 'Failed to assign admin role: ' + memberError.message }
    }

    // Since org is pending, we shouldn't necessarily redirect to dashboard, but let's log them in and let the dashboard show a "pending" screen.
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled Server Action Error in registerOrganization:', err)
    return { error: err.message || 'An unexpected server error occurred.' }
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
