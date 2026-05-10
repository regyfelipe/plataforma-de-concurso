"use client"

import { CheckCircle2, BookOpen, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription } from "@workspace/ui/components/card"

interface MasteryProgressCardsProps {
    data: { mastered: number; learning: number; new: number }
}

const ITEMS = (data: MasteryProgressCardsProps["data"]) => [
    { label: "Dominados",       value: data.mastered, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Em Aprendizado",  value: data.learning, icon: BookOpen,     color: "text-primary"     },
    { label: "Não Iniciados",   value: data.new,      icon: Sparkles,     color: "text-muted-foreground" },
]

export function MasteryProgressCards({ data }: MasteryProgressCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ITEMS(data).map((item) => (
                <Card key={item.label}>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
                        <div>
                            <CardDescription>{item.label}</CardDescription>
                            <p className="text-2xl font-semibold">{item.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
