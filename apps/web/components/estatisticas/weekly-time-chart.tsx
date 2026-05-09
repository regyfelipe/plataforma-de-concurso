"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyTimeChartProps {
    data: {
        day: string
        hours: number
    }[]
}

export function WeeklyTimeChart({ data }: WeeklyTimeChartProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm h-[400px]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Carga Horária Semanal (Horas Líquidas)</p>
            </div>

            <div className="w-full h-full pb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.05} />
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.4 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.4 }} 
                            className="text-muted-foreground/40"
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(120,120,120,0.05)' }}
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        />
                        <Bar 
                            dataKey="hours" 
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.hours >= 4 ? '#3b82f6' : 'rgba(148, 163, 184, 0.2)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
