"use client"

import * as React from "react"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export function QuestionHeader() {
    return (
        <div className="flex items-center justify-between border-b pb-6 sticky top-0 bg-background/95 backdrop-blur z-20">
            <div className="space-y-1">
                <Link href="/admin/questoes" className="hover:text-foreground transition-colors flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    <ArrowLeft className="w-3 h-3" /> Voltar
                </Link>
                <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Criar Questão</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-[9px] font-black uppercase border-border">
                    Salvar Rascunho
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-[9px] font-black uppercase border-border">
                    <Eye className="w-3 h-3 mr-2" /> Pré-visualizar
                </Button>
                <Button size="sm" className="h-8 px-5 rounded-lg text-[9px] font-black uppercase bg-foreground text-background hover:bg-foreground/90">
                    Publicar / Enviar Revisão
                </Button>
            </div>
        </div>
    )
}
