'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fetchTodos() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function addTodo(formData: FormData) {
    const description = formData.get('description') as string
    const supabase = await createClient()

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) throw new Error("Usuário não autenticado")

    const { error } = await supabase.from('todos').insert({
        description,
        user_id: user.id, // <-- esse é o campo exigido pela política
    })

    if (error) throw new Error(error.message)

    revalidatePath('/todos')
}

export async function toggleTodo(id: number, completed: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('todos')
        .update({ is_complete: !completed })
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/todos')
}

export async function deleteTodo(id: number) {
    const supabase = await createClient()
    const { error } = await supabase.from('todos').delete().eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/todos')
}
