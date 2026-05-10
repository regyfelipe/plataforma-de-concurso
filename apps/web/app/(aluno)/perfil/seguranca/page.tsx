"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function SegurancaPage() {
    const [senhaAtual,   setSenhaAtual]   = useState("")
    const [novaSenha,    setNovaSenha]    = useState("")
    const [confirmar,    setConfirmar]    = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleChangePassword() {
        setLoading(true)
        setMessage(null)
        setError(null)

        if (novaSenha !== confirmar) {
            setError("As senhas não coincidem.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: senhaAtual,
                    newPassword: novaSenha,
                    revokeOtherSessions: true,
                }),
            })

            const result = await response.json().catch(() => null)

            if (!response.ok) {
                setError(result?.message || "Não foi possível alterar a senha.")
                setLoading(false)
                return
            }

            setSenhaAtual("")
            setNovaSenha("")
            setConfirmar("")
            setMessage("Senha alterada com sucesso.")
        } catch {
            setError("Não foi possível alterar a senha.")
        }

        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <CardTitle>Alterar Senha</CardTitle>
                    </div>
                    <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(message || error) && (
                        <div className={`rounded-md border p-3 text-center text-sm font-medium ${
                            error
                                ? "border-destructive/20 bg-destructive/10 text-destructive"
                                : "border-primary/20 bg-primary/10 text-primary"
                        }`}>
                            {error || message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="senha-atual">Senha Atual <span className="text-destructive">*</span></Label>
                        <Input
                            id="senha-atual"
                            type="password"
                            placeholder="Digite sua senha atual"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nova-senha">Nova Senha <span className="text-destructive">*</span></Label>
                        <Input
                            id="nova-senha"
                            type="password"
                            placeholder="Digite sua nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmar-senha">Confirmar Nova Senha <span className="text-destructive">*</span></Label>
                        <Input
                            id="confirmar-senha"
                            type="password"
                            placeholder="Confirme sua nova senha"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            disabled={!senhaAtual || !novaSenha || !confirmar || loading}
                            onClick={handleChangePassword}
                        >
                            <Lock className="mr-2 h-4 w-4" />
                            {loading ? "Alterando..." : "Alterar Senha"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

