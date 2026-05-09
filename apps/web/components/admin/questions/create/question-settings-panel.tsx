"use client"

import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Globe, MessageSquare, GraduationCap } from "lucide-react"

export function QuestionSettingsPanel() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">6</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Configurações de Publicação</h2>
            </div>
            
            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-4 space-y-3">
                    {/* Item 1: Visibilidade */}
                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[11px] font-bold leading-none cursor-pointer">Visibilidade Pública</Label>
                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Disponível no Banco Geral</p>
                            </div>
                        </div>
                        <Switch className="scale-90" defaultChecked />
                    </div>

                    {/* Item 2: Comentários */}
                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[11px] font-bold leading-none cursor-pointer">Permitir Comentários</Label>
                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Interação entre alunos</p>
                            </div>
                        </div>
                        <Switch className="scale-90" defaultChecked />
                    </div>

                    {/* Item 3: Revisão Pedagógica */}
                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/5 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[11px] font-bold leading-none cursor-pointer">Modo Revisão</Label>
                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Habilitar chat com prof.</p>
                            </div>
                        </div>
                        <Switch className="scale-90" />
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
