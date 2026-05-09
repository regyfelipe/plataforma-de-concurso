"use client"

import * as React from "react"
import { Settings2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"

export function QuestionPreviewPanel() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">7</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Revisão Final</h2>
            </div>
            <Card className="rounded-xl border shadow-none bg-foreground/5 border-foreground/10">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto">
                        <Settings2 className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase">Tudo pronto para salvar?</h3>
                        <p className="text-[10px] text-muted-foreground uppercase max-w-xs mx-auto">Certifique-se de que o gabarito foi selecionado e a classificação está correta.</p>
                    </div>
                    <div className="flex justify-center gap-3 pt-2">
                        <Button size="sm" className="bg-foreground text-background h-10 px-8 text-[10px] font-black uppercase">Publicar Questão Agora</Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
