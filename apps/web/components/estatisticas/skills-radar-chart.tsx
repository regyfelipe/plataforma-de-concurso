"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillsRadarChartProps {
    data: {
        subject: string
        A: number
        fullMark: number
    }[]
}

export function SkillsRadarChart({ data }: SkillsRadarChartProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm h-[450px]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Domínio por Área</p>
            </div>

            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="currentColor" strokeOpacity={0.1} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.6 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="Domínio"
                            dataKey="A"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.7}
                            strokeWidth={4}
                            animationDuration={2500}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
