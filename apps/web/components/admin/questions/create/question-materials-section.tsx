"use client"

import { Video, BookOpen, Lightbulb, Target } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"

export function QuestionMaterialsSection() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">6</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Materiais de Apoio e Macetes</h2>
            </div>

            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Vídeo */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Video className="w-3.5 h-3.5 text-red-500" />
                            <label className="text-[10px] font-black uppercase tracking-widest">Link da Videoaula</label>
                        </div>
                        <Input 
                            placeholder="https://youtube.com/..." 
                            className="h-10 rounded-xl text-[11px] bg-background border-border/60" 
                        />
                    </div>

                    {/* Objetivos */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Target className="w-3.5 h-3.5 text-blue-500" />
                            <label className="text-[10px] font-black uppercase tracking-widest">Objetivo de Aprendizagem</label>
                        </div>
                        <Input 
                            placeholder="O que o aluno deve dominar aqui?" 
                            className="h-10 rounded-xl text-[11px] bg-background border-border/60" 
                        />
                    </div>

                    {/* Referência Global */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black uppercase tracking-widest">Base Legal / Bibliografia</label>
                        </div>
                        <Input 
                            placeholder="Ex: Art. 37, CF/88 ou Doutrina de Direito Administrativo" 
                            className="h-10 rounded-xl text-[11px] bg-background border-border/60" 
                        />
                    </div>

                    {/* Dica Global */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <label className="text-[10px] font-black uppercase tracking-widest">Dica / Macete (Tip)</label>
                        </div>
                        <Input 
                            placeholder="O segredo para matar essa questão rápido..." 
                            className="h-10 rounded-xl text-[11px] bg-background border-border/60" 
                        />
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
