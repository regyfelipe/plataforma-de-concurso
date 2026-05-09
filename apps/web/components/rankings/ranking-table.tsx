"use client"

import { ArrowUp, Target, BarChart3 } from "lucide-react"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"

interface RankingTableProps {
    data: any[]
}

export function RankingTable({ data }: RankingTableProps) {
    const tableData = data.slice(3); // Mostra do 4º lugar em diante

    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/20 bg-muted/5">
                            <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Posição</th>
                            <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Estudante</th>
                            <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Precisão</th>
                            <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-right">Pontuação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((user: any) => (
                            <tr 
                                key={user.rank} 
                                className={`group hover:bg-muted/10 transition-colors border-b border-border/10 last:border-0 ${user.isCurrentUser ? 'bg-primary/5' : ''}`}
                            >
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-foreground">{user.rank}º</span>
                                        {user.trend === 'up' && <ArrowUp className="w-3 h-3 text-emerald-500" />}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8 border border-border/40">
                                            <AvatarFallback className="text-[10px] font-black">{user.avatar}</AvatarFallback>
                                        </Avatar>
                                        <p className={`text-sm font-black text-foreground ${user.isCurrentUser ? 'text-primary' : ''}`}>
                                            {user.name} {user.isCurrentUser && "(Você)"}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="text-sm font-bold text-foreground/70">{user.precision}%</span>
                                </td>
                                <td className="p-6 text-right">
                                    <span className="text-sm font-black text-foreground tabular-nums">{user.points.toLocaleString()} pts</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
