"use client"

import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

interface QuestionFormActionsProps {
    onPreview?: () => void
    onSaveDraft?: () => void
    onPublish?: () => void
}

export function QuestionFormActions({ onPreview, onSaveDraft, onPublish }: QuestionFormActionsProps) {
    return (
        <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur border-b">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="space-y-0.5">

                    <h1 className="text-base font-semibold">Criar Questão</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onSaveDraft}>
                        Salvar Rascunho
                    </Button>
                    <Button variant="outline" size="sm" onClick={onPreview}>
                        <Eye className="mr-2 h-3.5 w-3.5" />
                        Pré-visualizar
                    </Button>
                    <Button size="sm" onClick={onPublish}>
                        Publicar Agora
                    </Button>
                </div>
            </div>
        </div>
    )
}
