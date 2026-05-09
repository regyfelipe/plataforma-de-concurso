"use client"

import { Calendar, MoreVertical, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

interface NoteCardProps {
    note: {
        id: string
        title: string
        subject: string
        content: string
        updatedAt: string
        questionRef?: string | null
    }
    onOpen: (note: any) => void
}

export function NoteCard({ note, onOpen }: NoteCardProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] space-y-4 hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1.5">
                    <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                        {note.subject || "Sem Categoria"}
                    </Badge>
                    <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                        {note.title}
                    </h3>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground/40 hover:text-foreground">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    } />
                    <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest p-3 cursor-pointer">Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest p-3 text-red-500 cursor-pointer">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <p className="text-sm font-medium text-muted-foreground/70 leading-relaxed relative z-10 line-clamp-3">
                {note.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/20 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {note.updatedAt}
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-0 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-transparent"
                    onClick={() => onOpen(note)}
                >
                    Abrir
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    )
}
