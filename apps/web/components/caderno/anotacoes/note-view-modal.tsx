"use client"

import { Calendar, BookOpen } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog"

interface NoteViewModalProps {
    note: any | null
    onClose: () => void
}

export function NoteViewModal({ note, onClose }: NoteViewModalProps) {
    return (
        <Dialog open={!!note} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">
                            {note?.subject || "Sem Categoria"}
                        </Badge>
                    </div>
                    <DialogTitle className="text-xl">{note?.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {note?.updatedAt}
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap min-h-[100px]">
                    {note?.content}
                </p>

                {note?.questionRef && (
                    <>
                        <Separator />
                        <Button variant="ghost" size="sm" className="w-fit gap-2 text-primary">
                            <BookOpen className="h-4 w-4" />
                            Ver Questão Original ({note.questionRef})
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
