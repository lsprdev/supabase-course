'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { LogOut, Plus, Trash2 } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { fetchTodos, toggleTodo, deleteTodo, addTodo } from './actions'

type Todo = {
  id: number
  description: string
  is_complete: boolean
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadTodos = async () => {
      const data = await fetchTodos()
      setTodos(data)
    }
    loadTodos()
  }, [])

  const handleAdd = async () => {
    if (!newTodo.trim()) return

    const formData = new FormData()
    formData.append('description', newTodo)

    startTransition(() => {
      addTodo(formData).then(() => {
        setNewTodo('')
        fetchTodos().then(setTodos)
      })
    })
  }

  const handleToggle = (todo: Todo) => {
    startTransition(() => {
      toggleTodo(todo.id, todo.is_complete).then(() =>
        fetchTodos().then(setTodos)
      )
    })
  }

  const handleDelete = (id: number) => {
    startTransition(() => {
      deleteTodo(id).then(() => fetchTodos().then(setTodos))
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-4 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-bold">TAREFAS</h1>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="icon" className="rounded-full">
            <LogOut className="h-5 w-5" />
          </Button>
        </form>
      </header>

      {/* Lista de tarefas */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-3">
          {todos.map((todo) => (
            <Card key={todo.id} className="shadow-sm border-gray-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.is_complete}
                      onCheckedChange={() => handleToggle(todo)}
                      className="h-4 w-4 rounded-full"
                    />
                  </div>
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-base ${todo.is_complete ? 'line-through text-gray-500' : 'text-gray-900'}`}
                  >
                    {todo.description}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(todo.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Input fixo */}
      <div className="bg-white border-t p-4 sm:p-6 sticky bottom-0 z-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar nova tarefa..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 h-12 rounded-full border-gray-300 px-4 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-0"
            />
            <Button
              onClick={handleAdd}
              size="icon"
              className="h-12 w-12 rounded-full bg-gray-900 hover:bg-black"
              disabled={isPending}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
