"use client"

import { ReviewCard } from "@/components/caderno/revisoes/review-card"
import { ReviewInfoSection } from "@/components/caderno/revisoes/review-info-section"
import { REVIEW_QUEUE } from "@/data/mocks/revisoes"
import { Button } from "@workspace/ui/components/button"

export default function RevisoesPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Inteligência Pedagógica</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Ciclo de Revisão</h1>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Questões com <span className="font-medium text-destructive">2+ erros consecutivos</span> entram aqui.
                        Complete 7 dias de acertos para removê-las.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total em Fila</p>
                        <p className="text-2xl font-semibold">{REVIEW_QUEUE.length}</p>
                    </div>
                    <Button size="sm">
                        Iniciar Sessão de Recuperação
                    </Button>
                </div>
            </div>

            {/* Lista */}
            <div className="space-y-3">
                {REVIEW_QUEUE.map((item) => (
                    <ReviewCard key={item.id} item={item} />
                ))}
            </div>

            <ReviewInfoSection />
        </div>
    )
}
