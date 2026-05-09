"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { TrendingUp, BarChart3 } from "lucide-react"

interface StatMiniCardProps {
    label: string
    value: string
    trend?: string
    isPositive?: boolean
}

export function StatMiniCard({ label, value, trend, isPositive }: StatMiniCardProps) {
    return (
        <Card className="bg-muted/5 border-border/40 p-6 rounded-3xl shadow-none hover:bg-muted/10 transition-colors group">
            <CardContent className="p-0 space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary transition-colors">
                    {label}
                </p>
                <div className="flex items-end gap-3">
                    <span className="text-2xl font-black text-foreground italic">{value}</span>
                    {trend && (
                        <span className={`text-[10px] font-black flex items-center gap-0.5 mb-1.5 ${
                            isPositive ? "text-emerald-500" : "text-red-500"
                        }`}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <BarChart3 className="w-3 h-3 rotate-180" />}
                            {trend}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
