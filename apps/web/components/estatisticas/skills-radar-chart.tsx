"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface SkillsRadarChartProps {
    data: { subject: string; A: number; fullMark: number }[]
}

export function SkillsRadarChart({ data }: SkillsRadarChartProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Domínio por Área</CardTitle>
            </CardHeader>
            <CardContent className="h-[380px] pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Domínio"
                            dataKey="A"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.25}
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
