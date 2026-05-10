"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface WeeklyTimeChartProps {
    data: { day: string; hours: number }[]
}

export function WeeklyTimeChart({ data }: WeeklyTimeChartProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carga Horária Semanal (Horas Líquidas)</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip
                            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                        />
                        <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                            {data.map((entry, i) => (
                                <Cell
                                    key={`cell-${i}`}
                                    fill={entry.hours >= 4 ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
