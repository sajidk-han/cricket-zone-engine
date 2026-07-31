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

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
