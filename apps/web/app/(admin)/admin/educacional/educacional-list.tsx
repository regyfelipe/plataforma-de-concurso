"use client"

import * as React from "react"
import { 
    Search, Edit2, Trash2, AlertTriangle, 
    GraduationCap, BookOpen
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

type EducacionalItem = {
    id: string
    title: string
    active: boolean
    questionsCount: number
    editHref: string
}

type StatusFilter = "all" | "active" | "inactive"

export function EducacionalList({
    items,
    createAction,
    onDelete,
}: {
    items: EducacionalItem[]
    createAction: React.ReactNode
    onDelete: (id: string) => Promise<void>
}) {
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    const filteredItems = React.useMemo(() => {
        return items.filter((item) => {
            const matchSearch = 
                !search.trim() || 
                item.title.toLowerCase().includes(search.toLowerCase())

            const matchStatus = 
                statusFilter === "all" || 
                (statusFilter === "active" ? item.active : !item.active)

            return matchSearch && matchStatus
        })
    }, [items, search, statusFilter])

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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Níveis Educacionais</h1>
                </div>
                {createAction}
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome..."
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
                            <div className="flex items-center rounded-md border overflow-hidden">
                                {(["all", "active", "inactive"] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setStatusFilter(f)}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 ${statusFilter === f
                                            ? "bg-foreground text-background"
                                            : "bg-transparent text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {f === "all" ? "Todos" : f === "active" ? "Ativos" : "Inativos"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Nome do Nível</TableHead>
                                    <TableHead className="w-[150px] text-xs font-semibold uppercase tracking-wider text-center">Questões</TableHead>
                                    <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-right w-[100px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                                    <GraduationCap className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {item.title}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-4 text-center">
                                            <Badge variant="outline" className="gap-1.5 font-medium">
                                                <BookOpen className="w-3 h-3 text-muted-foreground" />
                                                {item.questionsCount.toLocaleString()}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="py-4">
                                            {item.active ? (
                                                <Badge variant="outline" className="gap-1.5 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[10px] rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Ativo
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="gap-1.5 text-muted-foreground text-[10px] rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                                    Inativo
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="py-4 text-right pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={item.editHref}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
                                                                <AlertDialogTitle>Excluir Nível?</AlertDialogTitle>
                                                            </div>
                                                            <AlertDialogDescription>
                                                                Você está prestes a excluir o nível <strong className="text-foreground">{item.title}</strong>.
                                                                Esta ação não pode ser desfeita.
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
                                        <TableCell colSpan={4} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <GraduationCap className="w-8 h-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {search ? "Nenhum resultado encontrado." : "Nenhum nível cadastrado."}
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
