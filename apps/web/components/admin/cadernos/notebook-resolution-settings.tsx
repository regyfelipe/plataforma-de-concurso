"use client"

import * as React from "react"
import { Timer, Shuffle, RefreshCcw, Tag, Hash, FileText, Info, BrainCircuit, User } from "lucide-react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"

export function NotebookResolutionSettings() {
    return (
        <div className="bg-card dark:bg-muted/5 border border-border/40 rounded-[1.5rem] p-5 md:p-6 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna de Info - Comportamento */}
                <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BrainCircuit className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black tracking-widest text-foreground uppercase">Regras</h3>
                    <p className="text-[9px] font-medium text-muted-foreground/50 leading-tight uppercase tracking-wider">
                        Defina a experiência e o comportamento pedagógico.
                    </p>
                </div>

                {/* Coluna de Campos - Lógica de Resolução */}
                <div className="md:col-span-2 space-y-6">
                    {/* Modo de Resolução */}
                    <div className="space-y-3">
                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 ml-1">Modo de Resolução</Label>
                        <RadioGroup defaultValue="study" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Label
                                htmlFor="study"
                                className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <RefreshCcw className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="space-y-0">
                                        <p className="text-[10px] font-black text-foreground uppercase">Modo Livre</p>
                                        <p className="text-[8px] font-medium text-muted-foreground/60">Gabarito imediato.</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="study" id="study" className="sr-only" />
                            </Label>

                            <Label
                                htmlFor="simulated"
                                className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-red-500/10 flex items-center justify-center text-red-500">
                                        <Timer className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="space-y-0">
                                        <p className="text-[10px] font-black text-foreground uppercase">Modo Simulado</p>
                                        <p className="text-[8px] font-medium text-muted-foreground/60">Final e tempo limitado.</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="simulated" id="simulated" className="sr-only" />
                            </Label>
                        </RadioGroup>
                    </div>

                    {/* Toggles de Lógica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-border/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                                    <Info className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0">
                                    <Label className="text-[10px] font-black text-foreground">Explicação</Label>
                                    <p className="text-[8px] text-muted-foreground/60">Comentário pós-resposta.</p>
                                </div>
                            </div>
                            <Switch className="scale-75" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                                    <Shuffle className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0">
                                    <Label className="text-[10px] font-black text-foreground">Embaralhar</Label>
                                    <p className="text-[8px] text-muted-foreground/60">Ordem randômica.</p>
                                </div>
                            </div>
                            <Switch className="scale-75" />
                        </div>

                        <div className="flex items-center gap-3 md:col-span-2 p-3 bg-muted/10 border border-border/40 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground/40 border border-border/40">
                                <Timer className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Minutos Limite</Label>
                                <Input
                                    placeholder="0 = Sem limite"
                                    type="number"
                                    className="h-7 bg-transparent border-none px-0 focus-visible:ring-0 font-bold text-base text-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metadados e Obs Internas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/10">
                <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        <Tag className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black tracking-tight text-foreground uppercase tracking-widest">Metadados</h3>
                    <p className="text-[9px] font-medium text-muted-foreground/50 leading-normal">
                        Tags e observações para gestão interna.
                    </p>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-1.5">
                                <Hash className="w-2.5 h-2.5" /> Tags
                            </Label>
                            <Input placeholder="Separe por vírgula..." className="h-9 text-xs bg-muted/10 border-border/40 rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-1.5">
                                <User className="w-2.5 h-2.5" /> Professor
                            </Label>
                            <Input placeholder="Nome" className="h-9 text-xs bg-muted/10 border-border/40 rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-1.5">
                            <FileText className="w-2.5 h-2.5" /> Observações Internas
                        </Label>
                        <Textarea
                            placeholder="Objetivo pedagógico..."
                            className="bg-muted/10 border-border/40 rounded-lg p-3 min-h-[60px] text-xs resize-none focus-visible:ring-primary/20 font-medium"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}