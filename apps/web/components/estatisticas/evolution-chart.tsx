"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface EvolutionChartProps {
    data: { week: string; value: number }[]
}

export function EvolutionChart({ data }: EvolutionChartProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Evolução de Precisão (%)</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                            itemStyle={{ color: "hsl(var(--primary))" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--card))" }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
