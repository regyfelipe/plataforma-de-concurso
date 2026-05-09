"use client"

import { Timer, AlertTriangle } from "lucide-react"

interface TimePerQuestionListProps {
    data: {
        subject: string
        time: number
    }[]
}

export function TimePerQuestionList({ data }: TimePerQuestionListProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Velocidade por Disciplina</p>
                <Timer className="w-4 h-4 text-primary/40" />
            </div>

            <div className="space-y-4 h-[290px] overflow-y-auto pr-2 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {data.map((item) => {
                    const minutes = Math.floor(item.time / 60)
                    const seconds = item.time % 60
                    const isTooSlow = item.time > 120 // Alerta se demorar mais de 2 min

                    return (
                        <div key={item.subject} className="flex items-center justify-between p-4 bg-muted/5 border border-border/20 rounded-2xl group hover:border-primary/30 transition-all shrink-0">
                            <div>
                                <h4 className="text-sm font-black text-foreground">{item.subject}</h4>
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Média da Categoria</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {isTooSlow && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 rounded-lg">
                                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                                        <span className="text-[8px] font-black text-orange-500 uppercase">Lento</span>
                                    </div>
                                )}
                                <div className="text-right">
                                    <span className="text-lg font-black text-foreground">{minutes}m {seconds}s</span>
                                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">por questão</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
