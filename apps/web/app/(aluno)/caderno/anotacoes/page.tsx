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
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Base de Conhecimento</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Minhas Anotações
                    </h1>
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

            {/* Modal de Visualização */}
            <NoteViewModal 
                note={viewingNote} 
                onClose={() => setViewingNote(null)} 
            />
        </div>
    )
}
