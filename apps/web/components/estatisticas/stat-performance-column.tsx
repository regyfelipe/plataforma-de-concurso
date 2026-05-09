"use client"

import { ChevronRight, ChevronDown } from "lucide-react"

interface StatItemProps {
    rank: number
    title: string
    stats: string
    percentage: number
    color: string
}

function StatItem({ rank, title, stats, percentage, color }: StatItemProps) {
    const isTop3 = rank <= 3
    return (
        <div className="flex items-center gap-4 group cursor-pointer py-3 hover:bg-muted/5 transition-colors rounded-xl px-2 -mx-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                isTop3 ? "bg-foreground text-background" : "bg-muted text-muted-foreground/40"
            }`}>
                {rank}
            </div>

            <div className="flex-1 flex items-center gap-4 min-w-0">
                <div className="flex-1 min-w-[120px]">
                    <h4 className="text-[13px] font-black tracking-tight text-foreground/90 truncate">{title}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase leading-none mt-1">{stats}</p>
                </div>

                <div className="flex-1 h-1 bg-muted/20 rounded-full overflow-hidden hidden sm:block max-w-[100px]">
                    <div 
                        className={`h-full ${color} transition-all duration-1000`} 
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-[12px] font-black italic min-w-[40px] text-right ${percentage === 100 ? "text-emerald-500" : "text-primary"}`}>
                        {percentage}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                </div>
            </div>
        </div>
    )
}

interface StatColumnProps {
    title: string
    subtitle: string
    icon: any
    items: any[]
    count: number
}

export function StatPerformanceColumn({ title, subtitle, icon: Icon, items, count }: StatColumnProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-muted/5 border border-border/40 flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-foreground/80" />
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-foreground">{title}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">{subtitle}</p>
                    </div>
                </div>
                <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/10" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="113" strokeDashoffset="55" className="text-foreground" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[9px] font-black">51%</span>
                        <span className="text-[6px] font-bold text-muted-foreground/40 uppercase -mt-0.5">Acerto</span>
                    </div>
                </div>
            </div>

            <div className="space-y-1 divide-y divide-border/5">
                {items.map((item: any, i: number) => (
                    <StatItem key={i} rank={i + 1} {...item} />
                ))}
            </div>

            <div className="pt-2">
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 hover:text-primary transition-colors pl-12 group">
                    <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /> 
                    Ver mais {count} {title.split(' ').pop().toLowerCase()}
                </button>
            </div>
        </div>
    )
}
