"use client"

import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface ComparativeEvolutionChartProps {
    data: { week: string; value: number; goal: number; avg: number }[]
}

export function ComparativeEvolutionChart({ data }: ComparativeEvolutionChartProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Evolução Comparativa (%)</CardTitle>
            </CardHeader>
            <CardContent className="h-[380px] pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 8 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} dy={8} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
                            formatter={(v) => v === "value" ? "Você" : v === "goal" ? "Meta" : "Média Geral"}
                        />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValue)" strokeWidth={2} />
                        <Line type="monotone" dataKey="goal" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" dataKey="avg"  stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeOpacity={0.5} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
