// login-actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        return { error: error.message }
    }

    redirect('/todos')
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
                full_name: username,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/todos')
}

export async function logout() {
    const supabase = await createClient()

    await supabase.auth.signOut()

    redirect('/login')
}