"use client"

import { Flag } from "lucide-react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogFooter
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { toast } from "sonner"

interface QuestionReportModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuestionReportModal({ open, onOpenChange }: QuestionReportModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                        <Flag className="w-5 h-5 text-red-500" />
                        Reportar erro na questão
                    </DialogTitle>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="error-description" className="text-sm font-semibold">
                            O que está errado?
                        </Label>
                        <Textarea 
                            id="error-description"
                            placeholder="Descreva o problema (ex: gabarito incorreto, erro de digitação, etc.)"
                            className="min-h-[120px] rounded-xl resize-none border-border/60 focus:border-primary"
                        />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight italic">
                        Sua denúncia será analisada por nossa equipe pedagógica. Obrigado por ajudar a melhorar o conteúdo!
                    </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">
                        Cancelar
                    </Button>
                    <Button 
                        className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold"
                        onClick={() => {
                            toast.success("Erro reportado com sucesso!")
                            onOpenChange(false)
                        }}
                    >
                        Enviar Denúncia
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
