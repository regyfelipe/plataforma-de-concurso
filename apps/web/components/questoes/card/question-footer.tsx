"use client"

import { Button } from "@workspace/ui/components/button"
import { Eye, Edit } from "lucide-react"

interface QuestionFooterProps {
    isProfessor: boolean
    isSubmitted: boolean
    canEdit: boolean
    onViewDetails: () => void
    onEdit: () => void
}

export function QuestionFooter({
    isProfessor,
    isSubmitted,
    canEdit,
    onViewDetails,
    onEdit
}: QuestionFooterProps) {
    return (
        <div className="flex justify-between items-center bg-muted/30 py-4 px-6 rounded-b-xl border-t border-border/50">
            <div className="flex-1">
                {/* Espaço para futuras informações do rodapé */}
            </div>

            <div className="flex gap-3 items-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full font-bold h-9 px-4 hover:bg-primary/5 hover:text-primary transition-all"
                    onClick={onViewDetails}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    {isProfessor ? "Detalhes" : "Ver Detalhes"}
                </Button>

                {canEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary transition-colors"
                        onClick={onEdit}
                        title="Editar questão"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
