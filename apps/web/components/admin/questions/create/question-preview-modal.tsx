"use client"

import { QuestionCard } from "@/components/questoes/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

interface QuestionPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    questionData: any;
}

export function QuestionPreviewModal({ open, onOpenChange, questionData }: QuestionPreviewModalProps) {
    const previewData = {
        ...questionData,
        id: "preview",
        code: questionData.code || "QST-XXXXXX",
        author: { id: "admin", name: "Administrador (Você)" },
        stats: { totalAnswers: 0, correctRate: 0 },
        alternatives: questionData.alternatives.map((alt: any) => ({
            ...alt,
            percentage: 0
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-none !w-[55vw] max-h-[95vh] p-0 overflow-hidden border-border/50 bg-background shadow-2xl rounded-3xl">
                <DialogHeader className="p-6 border-b border-border/50 bg-muted/5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <DialogTitle className="text-sm font-black uppercase tracking-widest text-foreground/80">
                                Pré-visualização em Tempo Real
                            </DialogTitle>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Simulando visão do aluno</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                
                <ScrollArea className="h-full max-h-[calc(95vh-80px)]">
                    <div className="p-8 bg-muted/5">
                        <div className="w-full">
                            <QuestionCard 
                                question={previewData} 
                                userRole="STUDENT" 
                            />
                        </div>
                        
                        <div className="mt-8 py-6 border-t border-dashed border-border/60 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                                Fim da Pré-visualização
                            </p>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
