"use client"

import { Timer, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"

interface TimePerQuestionListProps {
    data: { subject: string; time: number }[]
}

export function TimePerQuestionList({ data }: TimePerQuestionListProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Velocidade por Disciplina</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1 max-h-[320px] overflow-y-auto">
                {data.map((item, i) => {
                    const minutes = Math.floor(item.time / 60)
                    const seconds = item.time % 60
                    const isTooSlow = item.time > 120

                    return (
                        <div key={item.subject}>
                            {i > 0 && <Separator className="my-1" />}
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium">{item.subject}</p>
                                    <p className="text-xs text-muted-foreground">Média da categoria</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isTooSlow && (
                                        <Badge variant="outline" className="text-orange-500 border-orange-500/30 gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            Lento
                                        </Badge>
                                    )}
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">{minutes}m {seconds}s</p>
                                        <p className="text-xs text-muted-foreground">por questão</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
