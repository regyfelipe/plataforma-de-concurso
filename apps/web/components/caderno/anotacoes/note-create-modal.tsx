"use client"

import * as React from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"

interface NoteCreateModalProps {
    onSave: (note: { title: string; subject: string; content: string }) => void
}

export function NoteCreateModal({ onSave }: NoteCreateModalProps) {
    const [open, setOpen] = React.useState(false)
    const [newNote, setNewNote] = React.useState({ title: "", subject: "", content: "" })

    const handleSave = () => {
        if (!newNote.title || !newNote.content) return
        onSave(newNote)
        setNewNote({ title: "", subject: "", content: "" })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger 
                render={
                    <Button className="rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-widest h-11 px-6 hover:scale-[1.02] transition-all gap-2">
                        <Plus className="w-4 h-4" />
                        Nova Anotação
                    </Button>
                } 
            />
            <DialogContent className="sm:max-w-[500px] bg-card border-border/40 rounded-[2rem] p-8">
                <DialogHeader className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Novo Insight</p>
                    <DialogTitle className="text-2xl font-black tracking-tighter">Criar Anotação</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Título</label>
                        <Input 
                            placeholder="Ex: Diferença entre Crime e Contravenção" 
                            className="h-12 bg-muted/20 border-border/40 rounded-xl text-sm"
                            value={newNote.title}
                            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Matéria</label>
                        <Input 
                            placeholder="Ex: Direito Penal" 
                            className="h-12 bg-muted/20 border-border/40 rounded-xl text-sm"
                            value={newNote.subject}
                            onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Conteúdo</label>
                        <Textarea 
                            className="min-h-[150px] bg-muted/20 border-border/40 rounded-xl resize-none p-4 text-sm leading-relaxed"
                            placeholder="Escreva sua explicação ou mnemônico aqui..."
                            value={newNote.content}
                            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:justify-end">
                    <Button variant="ghost" className="rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button className="rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest px-8 hover:scale-[1.02] transition-all" onClick={handleSave}>
                        <Save className="w-3.5 h-3.5 mr-2" />
                        Salvar Anotação
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
