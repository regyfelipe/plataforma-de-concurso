"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AccuracyGaugeProps {
    value: number
}

export function AccuracyGauge({ value }: AccuracyGaugeProps) {
    const data = [
        { name: 'Acertos', value: value },
        { name: 'Restante', value: 100 - value },
    ];

    const COLORS = ['#3b82f6', 'rgba(148, 163, 184, 0.1)'];

    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-4 shadow-sm flex flex-col items-center justify-center relative overflow-hidden h-[350px]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 absolute top-8 left-8">Taxa de Acerto Global</p>

            <div className="w-full h-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="70%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="65%"
                            outerRadius="90%"
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            animationDuration={2000}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-6xl font-black tracking-tighter text-foreground">{value}%</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-2">Nível Competitivo</p>
            </div>
        </div>
    )
}
