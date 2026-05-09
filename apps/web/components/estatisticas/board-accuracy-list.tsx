"use client"

import { Building2, ChevronRight } from "lucide-react"

interface BoardAccuracyListProps {
    data: {
        board: string
        accuracy: number
    }[]
}

export function BoardAccuracyList({ data }: BoardAccuracyListProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Performance por Banca</p>
                <Building2 className="w-4 h-4 text-muted-foreground/20" />
            </div>

            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.board} className="flex items-center justify-between p-4 bg-muted/5 border border-border/20 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center font-black text-xs text-primary group-hover:scale-105 transition-transform">
                                {item.board.substring(0, 3).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-foreground">{item.board}</h4>
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Baseado em +100 questões</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className={`text-lg font-black ${item.accuracy >= 80 ? 'text-emerald-500' : 'text-primary'}`}>
                                    {item.accuracy}%
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
