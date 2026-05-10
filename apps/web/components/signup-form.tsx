"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { AuthPanel } from "@/components/auth-panel"
import { signUpSchema } from "@/actions/auth.schema"
import { useRouter } from "next/navigation"

function PasswordInput({
  id,
  name,
  placeholder = "••••••••",
  required,
}: {
  id: string
  name: string
  placeholder?: string
  required?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    const validatedFields = signUpSchema.safeParse(data)

    if (!validatedFields.success) {
      const fieldError = Object.values(validatedFields.error.flatten().fieldErrors)
        .flat()
        .find((message): message is string => Boolean(message))

      setError(fieldError || "Verifique os dados informados.")
      setLoading(false)
      return
    }

    try {
      const { name, email, password } = validatedFields.data
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        setError(result?.message || "Erro ao realizar cadastro.")
        setLoading(false)
        return
      }

      setSuccess("Cadastro realizado com sucesso. Bem-vindo!")
      setTimeout(() => {
        router.replace("/dashboard")
        router.refresh()
      }, 700)
    } catch {
      setError("Erro ao realizar cadastro.")
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* ─── Form ──────────────────────────────────── */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Crie sua conta</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Comece agora sua preparação para concursos
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm font-medium text-primary bg-primary/10 rounded-md border border-primary/20 text-center">
                  {success}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="Seu nome" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </Field>

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <PasswordInput id="password" name="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirmar</FieldLabel>
                    <PasswordInput id="confirmPassword" name="confirmPassword" required />
                  </Field>
                </Field>
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </Field>

              

              <FieldDescription className="text-center">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Entrar
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <AuthPanel />
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos{" "}
        <Link href="/termos" className="underline underline-offset-4 hover:text-primary">Termos de Uso</Link>{" "}
        e{" "}
        <Link href="/privacidade" className="underline underline-offset-4 hover:text-primary">Política de Privacidade</Link>.
      </FieldDescription>
    </div>
  )
}
