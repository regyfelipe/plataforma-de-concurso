"use client"

import * as React from "react"
import { 
    Search, Edit2, Trash2, AlertTriangle, 
    GraduationCap, BookOpen, Calendar, 
    Building2, Briefcase, Info 
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"

type ConcursoItem = {
    id: string
    nome: string
    cargo?: string
    banca?: string
    carreira?: string
    nivel?: string
    ano?: number
    status: "aberto" | "previsto" | "encerrado"
    active: boolean
    logoUrl?: string
    questionsCount: number
    editHref: string
}

const STATUS_CONFIG = {
    aberto: { label: "Inscrições Abertas", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    previsto: { label: "Previsto", class: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    encerrado: { label: "Encerrado", class: "bg-muted text-muted-foreground border-transparent" },
}

export function ConcursosList({
    items,
    createAction,
    onDelete,
}: {
    items: ConcursoItem[]
    createAction: React.ReactNode
    onDelete: (id: string) => Promise<void>
}) {
    const [search, setSearch] = React.useState("")
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    const filteredItems = React.useMemo(() => {
        return items.filter((item) => {
            const q = search.toLowerCase()
            return (
                !q || 
                item.nome.toLowerCase().includes(q) ||
                item.banca?.toLowerCase().includes(q) ||
                item.carreira?.toLowerCase().includes(q)
            )
        })
    }, [items, search])

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try { await onDelete(id) }
        finally { setDeletingId(null) }
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Gestão de Conteúdo</p>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Concursos</h1>
                </div>
                {createAction}
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar concurso, banca ou carreira..."
                                className="pl-10 h-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-muted/50 border rounded-md flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total</span>
                                <span className="text-sm font-semibold">{items.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Nome do Certame</TableHead>
                                    <TableHead className="w-[180px] text-xs font-semibold uppercase tracking-wider">Banca / Ano</TableHead>
                                    <TableHead className="w-[150px] text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider text-center">Questões</TableHead>
                                    <TableHead className="text-right w-[100px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                                        <TableCell className="py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5 overflow-hidden border">
                                                    {item.logoUrl ? (
                                                        <img src={item.logoUrl} alt={item.nome} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <GraduationCap className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <p className="text-sm font-bold text-foreground leading-tight">
                                                        {item.nome} {item.cargo && <span className="text-muted-foreground font-normal ml-1"> - {item.cargo}</span>}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        {item.carreira && (
                                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                <Briefcase className="w-3 h-3" />
                                                                {item.carreira}
                                                            </div>
                                                        )}
                                                        {item.nivel && (
                                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                <Info className="w-3 h-3" />
                                                                {item.nivel}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-primary" />
                                                    <span className="text-xs font-semibold">{item.banca || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-medium">{item.ano || "Ano N/I"}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-4">
                                            <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CONFIG[item.status].class}`}>
                                                {STATUS_CONFIG[item.status].label}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="py-4 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-md border border-muted-foreground/10">
                                                <BookOpen className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-xs font-bold text-foreground">{item.questionsCount.toLocaleString()}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-4 text-right pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={item.editHref}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>

                                                <AlertDialog>
                                                    <AlertDialogTrigger 
                                                        render={
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                disabled={deletingId === item.id}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        }
                                                    />
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                                                    <AlertTriangle className="w-5 h-5" />
                                                                </div>
                                                                <AlertDialogTitle>Excluir Concurso?</AlertDialogTitle>
                                                            </div>
                                                            <AlertDialogDescription>
                                                                Você está prestes a excluir o concurso <strong className="text-foreground">{item.nome}</strong>.
                                                                Esta ação não pode ser desfeita e afetará as questões vinculadas.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="mt-4">
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                {deletingId === item.id ? "Excluindo..." : "Confirmar Exclusão"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {filteredItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <GraduationCap className="w-8 h-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {search ? "Nenhum resultado encontrado." : "Nenhum concurso cadastrado."}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
