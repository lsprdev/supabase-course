'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signup } from "./actions"

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full h-12 text-base bg-gray-900 hover:bg-black text-white disabled:opacity-50"
        >
            {pending ? 'Carregando...' : label}
        </button>
    )
}

export default function LoginPage() {
    const [loginState, loginAction] = useFormState(login, { error: "" })
    const [signupState, signupAction] = useFormState(signup, { error: "" })

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border-0 shadow-sm">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
                    <CardDescription className="text-gray-600">Faça login ou crie uma conta para continuar</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-md">
                            <TabsTrigger value="login" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                Login
                            </TabsTrigger>
                            <TabsTrigger value="register" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                Registro
                            </TabsTrigger>
                        </TabsList>

                        {/* Login Form */}
                        <TabsContent value="login">
                            <form action={loginAction} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input id="login-email" name="email" type="email" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Senha</Label>
                                    <Input id="login-password" name="password" type="password" required />
                                </div>
                                {loginState.error && (
                                    <p className="text-sm text-red-600">{loginState.error}</p>
                                )}
                                <div className="pt-4">
                                    <SubmitButton label="Entrar" />
                                </div>
                            </form>
                        </TabsContent>

                        {/* Register Form */}
                        <TabsContent value="register">
                            <form action={signupAction} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="register-username">Nome de Usuário</Label>
                                    <Input id="register-username" name="username" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input id="register-email" name="email" type="email" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Senha</Label>
                                    <Input id="register-password" name="password" type="password" required />
                                </div>
                                {signupState.error && (
                                    <p className="text-sm text-red-600">{signupState.error}</p>
                                )}
                                <div className="pt-4">
                                    <SubmitButton label="Registrar" />
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
