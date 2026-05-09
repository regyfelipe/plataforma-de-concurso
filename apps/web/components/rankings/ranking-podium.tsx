"use client"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"

interface RankingPodiumProps {
    data: any[]
}

export function RankingPodium({ data }: RankingPodiumProps) {
    if (!data || data.length < 3) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
            {/* Estrutura 2-1-3 */}
            {[data[1], data[0], data[2]].map((user: any, i: number) => {
                const isFirst = user === data[0];
                const isSecond = user === data[1];

                return (
                    <div 
                        key={user.rank} 
                        className={`relative group bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-all ${
                            isFirst ? 'py-12 px-8 border-primary/20 shadow-lg shadow-primary/5 z-10' : 'py-10 px-8'
                        } ${isSecond ? 'md:order-1' : isFirst ? 'md:order-2' : 'md:order-3'}`}
                    >
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-border/40 shadow-sm ${
                            isFirst ? 'bg-yellow-500 text-black border-yellow-400' : 
                            isSecond ? 'bg-slate-300 text-black border-slate-200' : 
                            'bg-orange-400 text-black border-orange-300'
                        }`}>
                            {user.rank}º Lugar
                        </div>

                        <Avatar className={`${isFirst ? 'w-24 h-24' : 'w-20 h-20'} border-2 border-border/40 group-hover:border-primary transition-all`}>
                            <AvatarFallback className="text-xl font-black">{user.avatar}</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <h3 className={`${isFirst ? 'text-xl' : 'text-lg'} font-black tracking-tighter text-foreground`}>{user.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">{user.points} pts</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border/20">
                            <div className="text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Precisão</p>
                                <p className="text-sm font-black text-foreground">{user.precision}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Resolvidas</p>
                                <p className="text-sm font-black text-foreground">{user.solved}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
