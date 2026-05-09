"use client"

import { Calendar, BookOpen, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"

interface NoteViewModalProps {
    note: any | null
    onClose: () => void
}

export function NoteViewModal({ note, onClose }: NoteViewModalProps) {
    return (
        <Dialog open={!!note} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border/40 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                <div className="p-10 space-y-8">
                    <div className="space-y-4">
                        <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                            {note?.subject || "Sem Categoria"}
                        </Badge>
                        <h2 className="text-3xl font-black tracking-tighter leading-tight text-foreground">
                            {note?.title}
                        </h2>
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">
                            <Calendar className="w-3 h-3" />
                            {note?.updatedAt}
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-border/20" />

                    <div className="min-h-[100px]">
                        <p className="text-base font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                            {note?.content}
                        </p>
                    </div>

                    {note?.questionRef && (
                        <div className="pt-6 border-t border-border/10">
                            <Button variant="ghost" className="h-auto p-0 text-primary font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-transparent hover:underline">
                                <BookOpen className="w-4 h-4" />
                                Ver Questão Original ({note.questionRef})
                            </Button>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted/20 transition-all text-muted-foreground/40 hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>
            </DialogContent>
        </Dialog>
    )
}
