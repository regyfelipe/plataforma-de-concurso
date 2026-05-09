"use client"

import { AlertTriangle, CheckCircle2, ChevronRight, ArrowUpRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"

interface ReviewCardProps {
    item: {
        id: string
        code: string
        discipline: string
        subject: string
        topic: string
        subtopic: string
        consecutiveErrors: number
        daysInReview: number
        status: string
        lastAttempt: string
    }
}

export function ReviewCard({ item }: ReviewCardProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] space-y-6 hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border-none ${
                            item.status === 'Crítico' ? 'bg-red-500/10 text-red-500' : 
                            item.status === 'Recuperando' ? 'bg-orange-500/10 text-orange-500' : 
                            'bg-emerald-500/10 text-emerald-500'
                        }`}>
                            {item.status}
                        </Badge>
                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{item.code}</span>
                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-red-500/60 uppercase tracking-widest">
                            <AlertTriangle className="w-3 h-3" />
                            {item.consecutiveErrors} Erros Consecutivos
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-primary/80">
                            <span>{item.discipline}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/30" />
                            <span>{item.subject}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/30" />
                            <span className="text-muted-foreground/60">{item.topic}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/30" />
                            <span className="text-muted-foreground/40">{item.subtopic}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-foreground/80">Meta: Consolidar conhecimento em 7 dias.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-64 space-y-3">
                    <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Progresso Semanal</p>
                        <span className="text-[10px] font-black text-foreground">{item.daysInReview}/7 Dias</span>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 flex-1 rounded-full transition-all ${
                                    i < item.daysInReview ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-muted/20'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02]">
                        Resolver Agora
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            {item.daysInReview >= 6 && (
                <div className="absolute top-0 right-0 p-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500/20 animate-pulse" />
                </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    )
}
