"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { LogOut, Plus, Trash2 } from "lucide-react"
import { logout } from "@/app/login/actions"

// Mock data para as tarefas
const initialTodos = [
  { id: 1, text: "Estudar React", completed: true },
  { id: 2, text: "Criar projeto Next.js", completed: false },
  { id: 3, text: "Aprender Tailwind CSS", completed: false },
  { id: 4, text: "Implementar autenticação", completed: false },
]

export default function TodosPage() {
  const [todos, setTodos] = useState(initialTodos)
  const [newTodo, setNewTodo] = useState("")

  // Adicionar nova tarefa
  const addTodo = () => {
    if (newTodo.trim() === "") return

    const newTask = {
      id: todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1,
      text: newTodo,
      completed: false,
    }

    setTodos([...todos, newTask])
    setNewTodo("")
  }

  // Alternar status de conclusão
  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Remover tarefa
  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
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

      {/* Lista de tarefas - área com scroll */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-3">
          {todos.map((todo) => (
            <Card key={todo.id} className="shadow-sm border-gray-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4 rounded-full"
                    />
                  </div>
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-base ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                  >
                    {todo.text}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTodo(todo.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Input fixo na parte inferior */}
      <div className="bg-white border-t p-4 sm:p-6 sticky bottom-0 z-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar nova tarefa..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              className="flex-1 h-12 rounded-full border-gray-300 px-4 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-0"
            />
            <Button onClick={addTodo} size="icon" className="h-12 w-12 rounded-full bg-gray-900 hover:bg-black">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
