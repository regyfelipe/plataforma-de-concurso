"use client"

import * as React from "react"
import { Lock, Eye, Star, FileEdit, Globe, MessageSquare, Trophy, Home, CheckCircle2 } from "lucide-react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"

export function NotebookAccessSettings() {
    return (
        <div className="bg-card dark:bg-muted/5 border border-border/40 rounded-[2rem] p-6 md:p-8 space-y-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Coluna de Info (1/3) */}
                <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-foreground uppercase tracking-widest">Acesso</h3>
                    <p className="text-[10px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-wider">
                        Controle a visibilidade e o comportamento social do material.
                    </p>
                </div>

                {/* Coluna de Campos (2/3) */}
                <div className="md:col-span-2 space-y-10">

                    {/* Opções de Visibilidade */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Status de Publicação</Label>
                        <RadioGroup defaultValue="draft" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Label
                                htmlFor="public"
                                className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-foreground uppercase tracking-tight">Público</p>
                                        <p className="text-[9px] font-medium text-muted-foreground/60">Livre para todos os usuários.</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="public" id="public" className="sr-only" />
                            </Label>

                            <Label
                                htmlFor="premium"
                                className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-foreground uppercase tracking-tight">Premium</p>
                                        <p className="text-[9px] font-medium text-muted-foreground/60">Apenas para alunos pagantes.</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="premium" id="premium" className="sr-only" />
                            </Label>

                            <Label
                                htmlFor="private"
                                className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-foreground uppercase tracking-tight">Privado</p>
                                        <p className="text-[9px] font-medium text-muted-foreground/60">Apenas você ou turmas convidadas.</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="private" id="private" className="sr-only" />
                            </Label>

                            <Label
                                htmlFor="draft"
                                className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                        <FileEdit className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-foreground uppercase tracking-tight">Rascunho</p>
                                        <p className="text-[9px] font-medium text-muted-foreground/60">Em desenvolvimento (oculto).</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="draft" id="draft" className="sr-only" />
                            </Label>
                        </RadioGroup>
                    </div>

                    {/* Toggles de Funcionalidades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-10 border-t border-border/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-black text-foreground">Disponível para Alunos</Label>
                                    <p className="text-[10px] text-muted-foreground/60">Aparece na biblioteca pública.</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40">
                                    <Home className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-black text-foreground">Destacar na Home</Label>
                                    <p className="text-[10px] text-muted-foreground/60">Destaque na página inicial.</p>
                                </div>
                            </div>
                            <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-black text-foreground">Permitir Comentários</Label>
                                    <p className="text-[10px] text-muted-foreground/60">Fórum de discussão ativo.</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40">
                                    <Trophy className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-black text-foreground">Permitir Ranking</Label>
                                    <p className="text-[10px] text-muted-foreground/60">Gamificação entre alunos.</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
