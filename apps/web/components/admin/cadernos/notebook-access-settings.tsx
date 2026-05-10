"use client"

import * as React from "react"
import { Lock, Eye, Star, FileEdit, Globe, MessageSquare, Trophy, Home, CheckCircle2 } from "lucide-react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export function NotebookAccessSettings() {
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
                {/* Opções de Visibilidade */}
                <div className="space-y-4">
                    <Label className="text-xs font-semibold">Status de Publicação</Label>
                    <RadioGroup defaultValue="draft" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Label
                            htmlFor="public"
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">Público</p>
                                    <p className="text-[11px] text-muted-foreground">Livre para todos os usuários.</p>
                                </div>
                            </div>
                            <RadioGroupItem value="public" id="public" className="sr-only" />
                        </Label>

                        <Label
                            htmlFor="premium"
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Star className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">Premium</p>
                                    <p className="text-[11px] text-muted-foreground">Apenas para alunos pagantes.</p>
                                </div>
                            </div>
                            <RadioGroupItem value="premium" id="premium" className="sr-only" />
                        </Label>

                        <Label
                            htmlFor="private"
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">Privado</p>
                                    <p className="text-[11px] text-muted-foreground">Apenas você ou turmas convidadas.</p>
                                </div>
                            </div>
                            <RadioGroupItem value="private" id="private" className="sr-only" />
                        </Label>

                        <Label
                            htmlFor="draft"
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
                                    <FileEdit className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">Rascunho</p>
                                    <p className="text-[11px] text-muted-foreground">Em desenvolvimento (oculto).</p>
                                </div>
                            </div>
                            <RadioGroupItem value="draft" id="draft" className="sr-only" />
                        </Label>
                    </RadioGroup>
                </div>

                <Separator />

                {/* Toggles de Funcionalidades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
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
                        <Switch defaultChecked />
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
                        <Switch />
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
                        <Switch defaultChecked />
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
                        <Switch defaultChecked />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
