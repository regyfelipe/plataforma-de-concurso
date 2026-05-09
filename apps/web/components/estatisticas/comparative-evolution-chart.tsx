"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

interface ComparativeEvolutionChartProps {
    data: {
        week: string
        value: number
        goal: number
        avg: number
    }[]
}

export function ComparativeEvolutionChart({ data }: ComparativeEvolutionChartProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm h-[450px]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Evolução Comparativa (%)</p>
            </div>

            <div className="w-full h-full pb-12">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.05} />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.4 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.4 }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px' }}
                            formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{value === 'value' ? 'Você' : value === 'goal' ? 'Meta' : 'Média Geral'}</span>}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            strokeWidth={4}
                            animationDuration={2000}
                        />
                        <Line
                            type="monotone"
                            dataKey="goal"
                            stroke="#ffae00"
                            strokeWidth={4}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="rgba(148, 163, 184, 0.5)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
