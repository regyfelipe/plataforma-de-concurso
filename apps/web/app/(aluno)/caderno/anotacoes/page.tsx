"use client"

import * as React from "react"
import { NoteCard } from "@/components/caderno/anotacoes/note-card"
import { NoteFilters } from "@/components/caderno/anotacoes/note-filters"
import { NoteViewModal } from "@/components/caderno/anotacoes/note-view-modal"
import { NoteCreateModal } from "@/components/caderno/anotacoes/note-create-modal"
import { INITIAL_NOTES } from "@/data/mocks/anotacoes"

export default function AnotacoesPage() {
    const [notes, setNotes] = React.useState(INITIAL_NOTES)
    const [viewingNote, setViewingNote] = React.useState<any>(null)

    const handleSaveNote = (newNote: { title: string; subject: string; content: string }) => {
        const note = {
            id: Math.random().toString(36).substr(2, 9),
            ...newNote,
            updatedAt: "Agora mesmo",
            questionRef: null
        }
        setNotes([note, ...notes])
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Minhas Anotações</h1>
                    <p className="text-sm text-muted-foreground">Base de conhecimento pessoal</p>
                </div>
                <NoteCreateModal onSave={handleSaveNote} />
            </div>

            <NoteFilters />

            {/* Grid de Anotações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onOpen={setViewingNote}
                    />
                ))}
            </div>

            <NoteViewModal
                note={viewingNote}
                onClose={() => setViewingNote(null)}
            />
        </div>
    )
}
