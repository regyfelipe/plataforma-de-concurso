"use client"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

interface RankingPodiumProps {
    data: any[]
}

const MEDAL_STYLES: Record<number, string> = {
    1: "bg-yellow-400 text-yellow-900",
    2: "bg-slate-300 text-slate-900",
    3: "bg-orange-400 text-orange-900",
}

export function RankingPodium({ data }: RankingPodiumProps) {
    if (!data || data.length < 3) return null

    // Render order: 2nd, 1st, 3rd
    const ordered = [data[1], data[0], data[2]]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {ordered.map((user: any) => {
                const isFirst = user === data[0]
                const isSecond = user === data[1]
                return (
                    <Card
                        key={user.rank}
                        className={`flex flex-col items-center text-center
                            ${isFirst ? "md:order-2 border-primary/30" : isSecond ? "md:order-1" : "md:order-3"}
                        `}
                    >
                        <CardContent className={`flex flex-col items-center gap-4 ${isFirst ? "pt-8 pb-6 px-6" : "pt-6 pb-4 px-6"}`}>
                            {/* Medal badge */}
                            <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${MEDAL_STYLES[user.rank]}`}>
                                {user.rank}º Lugar
                            </span>

                            <Avatar className={isFirst ? "h-20 w-20" : "h-16 w-16"}>
                                <AvatarFallback className={isFirst ? "text-xl" : "text-base"}>
                                    {user.avatar}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <p className={`font-semibold ${isFirst ? "text-lg" : "text-base"}`}>{user.name}</p>
                                <p className="text-sm font-medium text-primary">{user.points.toLocaleString()} pts</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-6 w-full">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Precisão</p>
                                    <p className="text-sm font-semibold">{user.precision}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Resolvidas</p>
                                    <p className="text-sm font-semibold">{user.solved}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
