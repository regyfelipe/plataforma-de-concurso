"use client"

import { Calendar, MoreVertical, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
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
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                <div className="space-y-1.5 min-w-0">
                    <Badge variant="secondary" className="text-xs">
                        {note.subject || "Sem Categoria"}
                    </Badge>
                    <h3 className="text-sm font-semibold leading-tight line-clamp-1">
                        {note.title}
                    </h3>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    } />
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {note.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {note.updatedAt}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => onOpen(note)}
                    >
                        Abrir
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
