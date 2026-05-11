"use client"

import { Timer, Shuffle, RefreshCcw, Hash, FileText, Info, BrainCircuit, User, CheckCircle2 } from "lucide-react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import type { NotebookFormState } from "@/app/(admin)/admin/cadernos/criar/create-notebook-form"

interface NotebookResolutionSettingsProps {
    values: NotebookFormState
    onChange: <K extends keyof NotebookFormState>(field: K, value: NotebookFormState[K]) => void
}

export function NotebookResolutionSettings({ values, onChange }: NotebookResolutionSettingsProps) {
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
                    <RadioGroup
                        value={values.modoResolucao}
                        onValueChange={(value) => onChange("modoResolucao", value as NotebookFormState["modoResolucao"])}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <Label
                            htmlFor="study"
                            className="relative flex items-center justify-between p-4 rounded-xl border bg-muted/30 cursor-pointer hover:bg-muted transition-all duration-200 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <RefreshCcw className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">Modo Livre</p>
                                    <p className="text-[11px] text-muted-foreground">Estudo com gabarito imediato.</p>
                                </div>
                            </div>
                            <RadioGroupItem value="study" id="study" className="sr-only" />
                            {values.modoResolucao === "study" && (
                                <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-300" />
                            )}
                        </Label>

                        <Label
                            htmlFor="simulated"
                            className="relative flex items-center justify-between p-4 rounded-xl border bg-muted/30 cursor-pointer hover:bg-muted transition-all duration-200 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Timer className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">Modo Simulado</p>
                                    <p className="text-[11px] text-muted-foreground">Gabarito final e tempo limitado.</p>
                                </div>
                            </div>
                            <RadioGroupItem value="simulated" id="simulated" className="sr-only" />
                            {values.modoResolucao === "simulated" && (
                                <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-300" />
                            )}
                        </Label>
                    </RadioGroup>
                </div>

                <Separator />

                {/* Toggles e Configurações Dinâmicas */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.modoResolucao === "study" && (
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold">Gabarito Imediato</Label>
                                        <p className="text-[11px] text-muted-foreground">Mostrar explicação após responder.</p>
                                    </div>
                                </div>
                                <Switch checked={values.exibirExplicacao} onCheckedChange={(checked) => onChange("exibirExplicacao", checked)} />
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-primary/5 flex items-center justify-center text-primary/60">
                                    <Shuffle className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-semibold">Embaralhar Questões</Label>
                                    <p className="text-[11px] text-muted-foreground">Ordem randômica para cada aluno.</p>
                                </div>
                            </div>
                            <Switch checked={values.embaralhar} onCheckedChange={(checked) => onChange("embaralhar", checked)} />
                        </div>
                    </div>

                    {values.modoResolucao === "simulated" && (
                        <div className="flex items-center gap-6 p-6 bg-red-500/5 border border-red-500/20 rounded-xl animate-in zoom-in-95 duration-300">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 border border-red-500/20 shadow-inner">
                                <Timer className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-red-600/80">Cronômetro do Simulado (Minutos)</Label>
                                    {values.tempoLimite && values.tempoLimite !== "0" && (
                                        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-[10px]">Ativo</Badge>
                                    )}
                                </div>
                                <Input
                                    value={values.tempoLimite}
                                    onChange={(event) => onChange("tempoLimite", event.target.value)}
                                    placeholder="Ex: 240 (4 horas)"
                                    type="number"
                                    className="h-10 bg-transparent border-none px-0 focus-visible:ring-0 font-black text-2xl text-red-600 placeholder:text-red-200"
                                />
                                <p className="text-[10px] text-red-600/60 font-medium italic">* O caderno será finalizado automaticamente ao esgotar o tempo.</p>
                            </div>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Metadados e Gestão */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5 text-muted-foreground" /> Tags de Gestão
                            </Label>
                            <Input
                                value={values.tags}
                                onChange={(event) => onChange("tags", event.target.value)}
                                placeholder="Separe as tags por vírgula..."
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-muted-foreground" /> Professor Responsável
                            </Label>
                            <Input
                                value={values.professor}
                                onChange={(event) => onChange("professor", event.target.value)}
                                placeholder="Nome do professor curador"
                                className="h-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Observações Internas
                        </Label>
                        <Textarea
                            value={values.observacoes}
                            onChange={(event) => onChange("observacoes", event.target.value)}
                            placeholder="Descreva o objetivo pedagógico ou detalhes técnicos para outros administradores..."
                            className="min-h-[100px] resize-none"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
