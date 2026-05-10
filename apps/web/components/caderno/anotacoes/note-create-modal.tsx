"use client"

import * as React from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Anotação
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Criar Anotação</DialogTitle>
                    <DialogDescription>Registre um insight, mnemônico ou resumo.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="nota-titulo">Título</Label>
                        <Input
                            id="nota-titulo"
                            placeholder="Ex: Diferença entre Crime e Contravenção"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nota-materia">Matéria</Label>
                        <Input
                            id="nota-materia"
                            placeholder="Ex: Direito Penal"
                            value={newNote.subject}
                            onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nota-conteudo">Conteúdo</Label>
                        <Textarea
                            id="nota-conteudo"
                            className="min-h-[140px] resize-none"
                            placeholder="Escreva sua explicação ou mnemônico aqui..."
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={!newNote.title || !newNote.content}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
