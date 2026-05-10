"use client"

import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"

interface QuestionStatementSectionProps {
    supportText: string
    commandText: string
    onSupportChange: (val: string) => void
    onCommandChange: (val: string) => void
}

export function QuestionStatementSection({
    supportText,
    commandText,
    onSupportChange,
    onCommandChange,
}: QuestionStatementSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">2</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Enunciado e Textos</h2>
            </div>
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Texto de Apoio / Contexto</Label>
                        <TiptapEditor content={supportText} onChange={onSupportChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Pergunta / Comando Principal</Label>
                        <TiptapEditor content={commandText} onChange={onCommandChange} />
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
