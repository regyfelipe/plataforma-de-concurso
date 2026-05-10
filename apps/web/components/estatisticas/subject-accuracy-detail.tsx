"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Target, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"

interface SubjectAccuracyDetailProps {
    disciplines: {
        name: string
        precision: number
        solved: number
        topics: { name: string; precision: number }[]
    }[]
}

const PRECISION_COLOR = (p: number) =>
    p >= 80 ? "text-emerald-500" : p >= 60 ? "text-foreground" : "text-orange-500"

const BAR_COLOR = (p: number) =>
    p >= 80 ? "bg-emerald-500" : p >= 60 ? "bg-primary" : "bg-orange-500"

export function SubjectAccuracyDetail({ disciplines }: SubjectAccuracyDetailProps) {
    const [expanded, setExpanded] = React.useState<string | null>(null)

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Detalhamento por Assunto</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
                {disciplines.map((item) => (
                    <div key={item.name} className="rounded-md border overflow-hidden">
                        <button
                            onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${item.precision >= 80 ? "bg-emerald-500" : "bg-primary"}`} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`font-semibold text-sm ${PRECISION_COLOR(item.precision)}`}>
                                    {item.precision}%
                                </span>
                                {expanded === item.name
                                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                }
                            </div>
                        </button>

                        {expanded === item.name && (
                            <div className="px-4 pb-4 space-y-3">
                                <Separator />
                                {item.topics.map((topic) => (
                                    <div key={topic.name} className="flex items-center gap-3 pl-4">
                                        <span className="text-xs text-muted-foreground flex-1 truncate">{topic.name}</span>
                                        <Progress value={topic.precision} className="w-24 h-1.5" />
                                        <span className="text-xs font-medium w-8 text-right">{topic.precision}%</span>
                                    </div>
                                ))}
                                {item.precision < 70 && (
                                    <div className="flex items-center gap-2 text-orange-500 text-xs mt-2 pl-4">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        Foco necessário nesta disciplina
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
