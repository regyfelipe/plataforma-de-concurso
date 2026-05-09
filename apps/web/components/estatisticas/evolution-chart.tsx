"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EvolutionChartProps {
    data: {
        week: string
        value: number
    }[]
}

export function EvolutionChart({ data }: EvolutionChartProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm h-[400px]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Evolução de Precisão (%)</p>
            </div>

            <div className="w-full h-full pb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120,120,120,0.1)" />
                        <XAxis 
                            dataKey="week" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor' }} 
                            dy={10}
                            className="text-muted-foreground/40 uppercase tracking-widest"
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor' }} 
                            domain={[0, 100]}
                            className="text-muted-foreground/40"
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                            itemStyle={{ color: 'hsl(var(--primary))' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={4} 
                            dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
