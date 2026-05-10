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
  FieldSeparator,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { AuthPanel } from "@/components/auth-panel"
import { signInSchema } from "@/actions/auth.schema"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    const validatedFields = signInSchema.safeParse(data)

    if (!validatedFields.success) {
      const fieldError = Object.values(validatedFields.error.flatten().fieldErrors)
        .flat()
        .find((message): message is string => Boolean(message))

      setError(fieldError || "Verifique os dados informados.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedFields.data),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        setError(result?.message || "E-mail ou senha incorretos.")
        setLoading(false)
        return
      }

      router.replace("/dashboard")
      router.refresh()
    } catch {
      setError("Erro ao realizar login.")
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
                <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                <p className="text-balance text-muted-foreground text-sm">
                  Acesse sua conta no Concurso Master
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Link
                    href="/recuperar-senha"
                    className="text-sm text-muted-foreground underline-offset-2 hover:underline hover:text-primary transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </Field>

              

              <FieldDescription className="text-center">
                Não tem uma conta?{" "}
                <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                  Cadastre-se
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
