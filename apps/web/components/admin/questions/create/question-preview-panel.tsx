"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"

interface QuestionPreviewPanelProps {
    onPublish: () => void
    isSubmitting: boolean
    isEditing?: boolean
}

export function QuestionPreviewPanel({ onPublish, isSubmitting, isEditing = false }: QuestionPreviewPanelProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">7</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Revisão Final</h2>
            </div>
            <Card>
                <CardContent className="p-8 text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <Settings2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold">Tudo pronto para salvar?</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Certifique-se de que o gabarito foi selecionado e a classificação está correta.
                        </p>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={onPublish} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Salvando..." : isEditing ? "Salvar Edição Agora" : "Publicar Questão Agora"}
                    </Button>
                </CardContent>
            </Card>
        </section>
    )
}
