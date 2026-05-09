"use client"

import { Lightbulb, AlertCircle, CheckCircle2, Info } from "lucide-react"

interface PerformanceInsightsProps {
    insights: {
        type: string
        message: string
    }[]
}

export function PerformanceInsights({ insights }: PerformanceInsightsProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Análise de Performance</h4>
            </div>

            <div className="space-y-4">
                {insights.map((insight, i) => {
                    const Icon = insight.type === 'warning' ? AlertCircle : insight.type === 'success' ? CheckCircle2 : Info
                    const colorClass = insight.type === 'warning' ? 'text-orange-500 bg-orange-500/5 border-orange-500/10' : 
                                       insight.type === 'success' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' : 
                                       'text-primary bg-primary/5 border-primary/10'

                    return (
                        <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${colorClass} animate-in slide-in-from-right duration-500`} style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm font-medium leading-relaxed">{insight.message}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
