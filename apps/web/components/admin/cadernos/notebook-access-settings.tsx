"use client"

import { Lock, MessageSquare, Trophy, Home, CheckCircle2 } from "lucide-react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import type { NotebookFormState } from "@/app/(admin)/admin/cadernos/criar/create-notebook-form"

interface NotebookAccessSettingsProps {
    values: NotebookFormState
    onChange: <K extends keyof NotebookFormState>(field: K, value: NotebookFormState[K]) => void
}

export function NotebookAccessSettings({ values, onChange }: NotebookAccessSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Lock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Configurações de Acesso</CardTitle>
                        <CardDescription className="text-xs">
                            Controle a visibilidade e o comportamento social do material.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Toggles de Funcionalidades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-primary/5 flex items-center justify-center text-primary/60">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Disponível para Alunos</Label>
                                <p className="text-[11px] text-muted-foreground">Aparece na biblioteca pública.</p>
                            </div>
                        </div>
                        <Switch checked={values.disponivel} onCheckedChange={(checked) => onChange("disponivel", checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-primary/5 flex items-center justify-center text-primary/60">
                                <Home className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Destacar na Home</Label>
                                <p className="text-[11px] text-muted-foreground">Destaque na página inicial.</p>
                            </div>
                        </div>
                        <Switch checked={values.destaqueHome} onCheckedChange={(checked) => onChange("destaqueHome", checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-primary/5 flex items-center justify-center text-primary/60">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Permitir Comentários</Label>
                                <p className="text-[11px] text-muted-foreground">Fórum de discussão ativo.</p>
                            </div>
                        </div>
                        <Switch checked={values.permitirComentarios} onCheckedChange={(checked) => onChange("permitirComentarios", checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-primary/5 flex items-center justify-center text-primary/60">
                                <Trophy className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Permitir Ranking</Label>
                                <p className="text-[11px] text-muted-foreground">Gamificação entre alunos.</p>
                            </div>
                        </div>
                        <Switch checked={values.permitirRanking} onCheckedChange={(checked) => onChange("permitirRanking", checked)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
