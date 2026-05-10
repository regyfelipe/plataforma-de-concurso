"use client"

import * as React from "react"
import { Timer, Shuffle, RefreshCcw, Tag, Hash, FileText, Info, BrainCircuit, User } from "lucide-react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export function NotebookResolutionSettings() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <BrainCircuit className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Regras de Resolução</CardTitle>
                        <CardDescription className="text-xs">
                            Defina a experiência e o comportamento pedagógico do material.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Modo de Resolução */}
                <div className="space-y-4">
                    <Label className="text-xs font-semibold">Modo de Resolução</Label>
                    <RadioGroup defaultValue="study" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Label
                            htmlFor="study"
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <RefreshCcw className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">Modo Livre</p>
                                    <p className="text-[11px] text-muted-foreground">Estudo com gabarito imediato.</p>
                                </div>
                            </div>
                            <RadioGroupItem value="study" id="study" className="sr-only" />
                        </Label>

                        <Label
                            htmlFor="simulated"
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Timer className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">Modo Simulado</p>
                                    <p className="text-[11px] text-muted-foreground">Gabarito final e tempo limitado.</p>
                                </div>
                            </div>
                            <RadioGroupItem value="simulated" id="simulated" className="sr-only" />
                        </Label>
                    </RadioGroup>
                </div>

                <Separator />

                {/* Toggles e Limite de Tempo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-primary/5 flex items-center justify-center text-primary/60">
                                <Info className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Explicação</Label>
                                <p className="text-[11px] text-muted-foreground">Exibir comentário após resposta.</p>
                            </div>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-primary/5 flex items-center justify-center text-primary/60">
                                <Shuffle className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Embaralhar</Label>
                                <p className="text-[11px] text-muted-foreground">Ordem randômica das questões.</p>
                            </div>
                        </div>
                        <Switch />
                    </div>

                    <div className="flex items-center gap-4 md:col-span-2 p-4 bg-muted/30 border rounded-lg">
                        <div className="w-10 h-10 rounded bg-background flex items-center justify-center text-muted-foreground border shadow-sm">
                            <Timer className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tempo Limite (Minutos)</Label>
                            <Input
                                placeholder="0 = Sem limite de tempo"
                                type="number"
                                className="h-9 bg-transparent border-none px-0 focus-visible:ring-0 font-bold text-lg text-primary"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Metadados e Gestão */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5 text-muted-foreground" /> Tags de Gestão
                            </Label>
                            <Input placeholder="Separe as tags por vírgula..." className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-muted-foreground" /> Professor Responsável
                            </Label>
                            <Input placeholder="Nome do professor curador" className="h-10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Observações Internas
                        </Label>
                        <Textarea
                            placeholder="Descreva o objetivo pedagógico ou detalhes técnicos para outros administradores..."
                            className="min-h-[100px] resize-none"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}