"use client"

import { QuestionCard } from "@/components/questoes/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"

interface QuestionPreviewModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    questionData: any
}

export function QuestionPreviewModal({ open, onOpenChange, questionData }: QuestionPreviewModalProps) {
    const previewData = {
        ...questionData,
        id: "preview",
        code: questionData.code ?? "QST-XXXXXX",
        author: { id: "admin", name: "Administrador (Você)" },
        stats: { totalAnswers: 0, correctRate: 0 },
        alternatives: questionData.alternatives.map((alt: any) => ({
            ...alt,
            percentage: 0,
        })),
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-none !w-[55vw]  max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <DialogTitle className="text-sm font-medium">
                            Pré-visualização — visão do aluno
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-64px)]">
                    <div className="p-6">
                        <QuestionCard question={previewData} userRole="STUDENT" />
                        <Separator className="my-6 border-dashed" />
                        <p className="text-center text-xs text-muted-foreground">
                            Fim da pré-visualização
                        </p>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
