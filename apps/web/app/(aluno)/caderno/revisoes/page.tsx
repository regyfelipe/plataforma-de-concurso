"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ReviewCard } from "@/components/caderno/revisoes/review-card"
import { ReviewInfoSection } from "@/components/caderno/revisoes/review-info-section"
import { REVIEW_QUEUE } from "@/data/mocks/revisoes"

export default function RevisoesPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master com Lógica do Ciclo */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">Inteligência Pedagógica</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Ciclo de Revisão
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground/60 max-w-md">
                        Questões com <span className="text-red-500 font-bold">2+ erros consecutivos</span> entram aqui. Complete 7 dias de acertos para removê-las.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Total em Fila</p>
                        <p className="text-2xl font-black text-foreground">{REVIEW_QUEUE.length}</p>
                    </div>
                    <Button className="rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-widest h-11 px-6 hover:scale-[1.02] transition-all">
                        Iniciar Sessão de Recuperação
                    </Button>
                </div>
            </div>

            {/* Grid de Revisão Intensive */}
            <div className="grid grid-cols-1 gap-4">
                {REVIEW_QUEUE.map((item) => (
                    <ReviewCard key={item.id} item={item} />
                ))}
            </div>

            {/* Explicação da Lógica para o Aluno */}
            <ReviewInfoSection />
        </div>
    )
}
