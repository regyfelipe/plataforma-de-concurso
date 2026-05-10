"use client"

import { AlertTriangle, CheckCircle2, ChevronRight, ArrowUpRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

interface ReviewCardProps {
    item: {
        id: string
        code: string
        discipline: string
        subject: string
        topic: string
        subtopic: string
        consecutiveErrors: number
        daysInReview: number
        status: string
        lastAttempt: string
    }
}

const STATUS_COLOR: Record<string, string> = {
    Crítico:     "text-destructive",
    Recuperando: "text-orange-500",
    Quase:       "text-emerald-500",
}

export function ReviewCard({ item }: ReviewCardProps) {
    return (
        <Card>
            <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5">

                {/* Info */}
                <div className="space-y-3 flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className={STATUS_COLOR[item.status] ?? ""}>
                            {item.status}
                        </Badge>
                        <span className="font-mono">{item.code}</span>
                        <span>·</span>
                        <span className={`flex items-center gap-1 ${STATUS_COLOR["Crítico"]}`}>
                            <AlertTriangle className="h-3 w-3" />
                            {item.consecutiveErrors} erros consecutivos
                        </span>
                    </div>

                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                        <span className="text-foreground">{item.discipline}</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>{item.subject}</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>{item.topic}</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>{item.subtopic}</span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Meta: Consolidar conhecimento em 7 dias.
                    </p>
                </div>

                <Separator orientation="vertical" className="hidden md:block h-16" />

                {/* Progresso + Botão */}
                <div className="flex flex-col gap-3 w-full md:w-56 shrink-0">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progresso Semanal</span>
                            <span className="font-medium text-foreground">{item.daysInReview}/7 dias</span>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                        i < item.daysInReview ? "bg-emerald-500" : "bg-muted"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="sm" className="flex-1">
                            Resolver Agora
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                        {item.daysInReview >= 6 && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
