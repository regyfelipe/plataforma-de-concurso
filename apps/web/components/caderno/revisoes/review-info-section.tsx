"use client"

import { Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

const STEPS = [
    {
        label: "01. Detecção",
        desc: "Errou a mesma questão 2 vezes? O sistema a bloqueia aqui automaticamente.",
    },
    {
        label: "02. Recuperação",
        desc: "Você precisa revisar e acertar esta questão durante 7 dias para provar a fixação.",
    },
    {
        label: "03. Consolidação",
        desc: 'Após o progresso semanal completo, a questão volta para a fila geral como "Dominada".',
    },
]

export function ReviewInfoSection() {
    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4" />
                    Como funciona o Ciclo Master?
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STEPS.map((step) => (
                        <div key={step.label} className="space-y-1.5">
                            <p className="text-xs font-medium text-primary">{step.label}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
