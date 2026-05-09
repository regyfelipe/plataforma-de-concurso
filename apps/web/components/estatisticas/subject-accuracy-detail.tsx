"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Target, AlertCircle } from "lucide-react"

interface SubjectAccuracyDetailProps {
    disciplines: {
        name: string
        precision: number
        solved: number
        topics: { name: string; precision: number }[]
    }[]
}

export function SubjectAccuracyDetail({ disciplines }: SubjectAccuracyDetailProps) {
    const [expanded, setExpanded] = React.useState<string | null>(null)

    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Detalhamento por Assunto</p>
                <Target className="w-4 h-4 text-primary/40" />
            </div>

            <div className="space-y-3">
                {disciplines.map((item) => (
                    <div key={item.name} className="border border-border/20 rounded-2xl overflow-hidden transition-all">
                        <button 
                            onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted/5 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${item.precision >= 80 ? 'bg-emerald-500' : 'bg-primary'}`} />
                                <span className="text-sm font-black text-foreground">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-black text-foreground">{item.precision}%</span>
                                {expanded === item.name ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
                            </div>
                        </button>

                        {expanded === item.name && (
                            <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top duration-300">
                                <div className="h-[1px] bg-border/20 w-full" />
                                {item.topics.map((topic) => (
                                    <div key={topic.name} className="flex items-center justify-between pl-6">
                                        <span className="text-xs font-medium text-muted-foreground">{topic.name}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${topic.precision >= 80 ? 'bg-emerald-500' : topic.precision >= 60 ? 'bg-primary' : 'bg-orange-500'}`}
                                                    style={{ width: `${topic.precision}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-foreground w-8">{topic.precision}%</span>
                                        </div>
                                    </div>
                                ))}
                                {item.precision < 70 && (
                                    <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center gap-3">
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                        <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Alerta: Foco necessário nesta disciplina</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
