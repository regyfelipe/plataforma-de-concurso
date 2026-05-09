"use client"

import { Target } from "lucide-react"

export function ReviewInfoSection() {
    return (
        <div className="bg-muted/5 border border-border/20 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-black uppercase tracking-widest">Como funciona o Ciclo Master?</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase">01. Detecção</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Errou a mesma questão 2 vezes? O sistema a bloqueia aqui automaticamente.</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase">02. Recuperação</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Você precisa revisar e acertar esta questão durante 7 dias para provar a fixação.</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase">03. Consolidação</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Após o progresso semanal completo, a questão volta para a fila geral como "Dominada".</p>
                </div>
            </div>
        </div>
    )
}
