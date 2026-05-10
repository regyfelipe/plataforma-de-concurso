"use client"

import { useState } from "react"
import Link from "next/link"
import { MailCheck } from "lucide-react"
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [sent, setSent] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* ─── Form ──────────────────────────────────── */}
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-3 text-center">
                {sent && (
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                    <MailCheck className="size-7 text-primary" />
                  </div>
                )}
                <h1 className="text-2xl font-bold">Recuperar Senha</h1>
                <p className="text-balance text-muted-foreground text-sm">
                  {sent
                    ? "Verifique seu e-mail e siga as instruções para redefinir sua senha."
                    : "Informe seu e-mail e enviaremos um link para redefinir sua senha."}
                </p>
              </div>

              {!sent && (
                <>
                  <Field>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                  </Field>
                  <Field>
                    <Button type="submit" className="w-full">
                      Enviar link de recuperação
                    </Button>
                  </Field>
                </>
              )}

              {sent && (
                <Field>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = "/login"}>
                    Voltar para o Login
                  </Button>
                </Field>
              )}

              <FieldDescription className="text-center">
                Lembrou a senha?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Entrar
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* ─── Painel Direito ─────────────────────────── */}
          <AuthPanel />

        </CardContent>
      </Card>
    </div>
  )
}
