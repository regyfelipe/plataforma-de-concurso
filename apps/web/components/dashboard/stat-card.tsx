"use client"

import { ArrowUpRight } from "lucide-react"

interface StatCardProps {
    title: string
    value: string
    subtitle?: string
    icon: any
    trend?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 p-5 rounded-[1.5rem] space-y-4 hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between relative z-10">
                <div className="p-2 rounded-xl bg-muted/20 dark:bg-white/5 border border-border/20 dark:border-white/5 text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all">
                    <Icon className="w-4 h-4" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-tighter">
                        <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                        {trend}
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 dark:text-muted-foreground/30 leading-none">{title}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <h4 className="text-2xl font-black tracking-tighter text-foreground leading-none">{value}</h4>
                    {subtitle && (
                        <span className="text-[10px] font-bold text-muted-foreground/50 dark:text-muted-foreground/40 lowercase tracking-tight italic">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    )
}
