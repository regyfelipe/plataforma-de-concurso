"use client"

import { Building2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"

interface BoardAccuracyListProps {
    data: { board: string; accuracy: number }[]
}

export function BoardAccuracyList({ data }: BoardAccuracyListProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Performance por Banca</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                {data.map((item) => (
                    <div key={item.board} className="space-y-1.5 cursor-pointer group">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                    {item.board.substring(0, 3).toUpperCase()}
                                </span>
                                {item.board}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`font-semibold ${item.accuracy >= 80 ? "text-emerald-500" : "text-foreground"}`}>
                                    {item.accuracy}%
                                </span>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <Progress value={item.accuracy} className="h-1.5" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
