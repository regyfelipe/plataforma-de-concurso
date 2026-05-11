"use client"

import * as React from "react"
import {
    Plus, Search, Edit2, Trash2, AlertTriangle,
    ChevronRight, ChevronDown, CornerDownRight,
    Check, X, BookOpen
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
import { EditDisciplinaModal } from "./edit-disciplina-modal"
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

type TaxonLevel = "disciplina" | "assunto" | "topico" | "subtopico"

type ItemHierarquico = {
    id: string
    rawId: string
    title: string
    subtitle?: string
    meta: string
    active: boolean
    indent: number
    editHref: string
    parentId?: string
    nivel: TaxonLevel
    questionsCount?: number
}

type StatusFilter = "all" | "active" | "inactive"

type InlineAdd = {
    parentCompositeId: string
    nivel: TaxonLevel
    rawParentId: string
    indent: number
} | null

const NIVEL_BADGE: Record<TaxonLevel, string> = {
    disciplina: "bg-blue-500/10 text-blue-600 font-mono",
    assunto: "bg-primary/10 text-primary",
    topico: "bg-amber-500/10 text-amber-600",
    subtopico: "bg-muted text-muted-foreground",
}

export function DisciplinasList({
    items,
    createAction,
    onDelete,
    onCreateAssunto,
    onCreateTopico,
    onCreateSubtopico,
}: {
    items: ItemHierarquico[]
    createAction: React.ReactNode
    onDelete: (id: string, nivel: string) => Promise<void>
    onCreateAssunto: (disciplinaId: string, nome: string) => Promise<void>
    onCreateTopico: (assuntoId: string, nome: string) => Promise<void>
    onCreateSubtopico: (topicoId: string, nome: string) => Promise<void>
}) {
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())
    const [deletingId, setDeletingId] = React.useState<string | null>(null)
    const [editingItem, setEditingItem] = React.useState<DisciplinaItem | null>(null)
    const [inlineAdd, setInlineAdd] = React.useState<InlineAdd>(null)
    const [inlineValue, setInlineValue] = React.useState("")
    const [inlineSaving, setInlineSaving] = React.useState(false)
    const inlineInputRef = React.useRef<HTMLInputElement>(null)

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const filteredItems = React.useMemo(() => {
        let result = items
        if (search.trim()) {
            const q = search.toLowerCase()
            const matchIds = new Set(
                items
                    .filter(
                        (i) =>
                            i.title.toLowerCase().includes(q) ||
                            i.subtitle?.toLowerCase().includes(q) ||
                            i.meta.toLowerCase().includes(q)
                    )
                    .map((i) => i.id)
            )
            const addAncestors = (id: string) => {
                const item = items.find((i) => i.id === id)
                if (item?.parentId) {
                    matchIds.add(item.parentId)
                    addAncestors(item.parentId)
                }
            }
            Array.from(matchIds).forEach(addAncestors)
            result = result.filter((i) => matchIds.has(i.id))
        }
        if (statusFilter !== "all") {
            result = result.filter((i) =>
                statusFilter === "active" ? i.active : !i.active
            )
        }
        return result
    }, [items, search, statusFilter])

    const isVisible = React.useCallback(
        (item: ItemHierarquico): boolean => {
            if (!item.parentId) return true
            if (!expandedIds.has(item.parentId)) return false
            const parent = filteredItems.find((i) => i.id === item.parentId)
            return parent ? isVisible(parent) : true
        },
        [expandedIds, filteredItems]
    )

    const visible = React.useMemo(
        () => filteredItems.filter(isVisible),
        [filteredItems, isVisible]
    )

    const inlineAddAfterId = React.useMemo(() => {
        if (!inlineAdd) return null
        const getAllDescendantIds = (parentId: string): string[] => {
            const children = visible.filter((i) => i.parentId === parentId)
            return children.flatMap((c) => [c.id, ...getAllDescendantIds(c.id)])
        }
        const descendants = getAllDescendantIds(inlineAdd.parentCompositeId)
        return descendants.length > 0
            ? descendants[descendants.length - 1]
            : inlineAdd.parentCompositeId
    }, [inlineAdd, visible])

    const handleOpenInlineAdd = (item: ItemHierarquico) => {
        let nivel: TaxonLevel
        if (item.nivel === "disciplina") nivel = "assunto"
        else if (item.nivel === "assunto") nivel = "topico"
        else if (item.nivel === "topico") nivel = "subtopico"
        else return

        setExpandedIds((prev) => new Set([...prev, item.id]))
        setInlineAdd({
            parentCompositeId: item.id,
            nivel,
            rawParentId: item.rawId,
            indent: item.indent + 1,
        })
        setInlineValue("")
        setTimeout(() => inlineInputRef.current?.focus(), 60)
    }

    const handleInlineSave = async () => {
        if (!inlineAdd || !inlineValue.trim() || inlineSaving) return
        setInlineSaving(true)
        try {
            if (inlineAdd.nivel === "assunto") await onCreateAssunto(inlineAdd.rawParentId, inlineValue.trim())
            else if (inlineAdd.nivel === "topico") await onCreateTopico(inlineAdd.rawParentId, inlineValue.trim())
            else if (inlineAdd.nivel === "subtopico") await onCreateSubtopico(inlineAdd.rawParentId, inlineValue.trim())
            
            setInlineAdd(null)
            setInlineValue("")
        } finally {
            setInlineSaving(false)
        }
    }

    const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); handleInlineSave() }
        if (e.key === "Escape") { setInlineAdd(null); setInlineValue("") }
    }

    const handleDelete = async (item: ItemHierarquico) => {
        setDeletingId(item.id)
        try { await onDelete(item.rawId, item.nivel) }
        finally { setDeletingId(null) }
    }

    const totalDisciplinas = items.filter((i) => i.nivel === "disciplina").length

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Gestão de Conteúdo</p>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Disciplinas</h1>
                </div>
                {createAction}
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou sigla..."
                                className="pl-10 h-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-muted/50 border rounded-md flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total</span>
                                <span className="text-sm font-semibold">{totalDisciplinas}</span>
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
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Nome</TableHead>
                                    <TableHead className="w-[160px] text-xs font-semibold uppercase tracking-wider">Nível / Sigla</TableHead>
                                    <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider">Questões</TableHead>
                                    <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-right w-[120px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visible.map((item) => {
                                    const isRoot = item.indent === 0
                                    const hasChildren = items.some((i) => i.parentId === item.id)
                                    const isExpanded = expandedIds.has(item.id)
                                    const paddingLeft = item.indent
                                        ? `calc(1rem + ${item.indent * 2.5}rem)`
                                        : "1rem"

                                    return (
                                        <React.Fragment key={item.id}>
                                            <TableRow className="group transition-colors hover:bg-muted/30">
                                                <TableCell className="py-3" style={{ paddingLeft }}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 flex items-center justify-center shrink-0">
                                                            {hasChildren ? (
                                                                <button
                                                                    onClick={(e) => toggleExpand(item.id, e)}
                                                                    className="p-0.5 rounded-sm hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                                                                >
                                                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                                </button>
                                                            ) : !isRoot ? (
                                                                <CornerDownRight className="w-4 h-4 text-muted-foreground/40" strokeWidth={2.5} />
                                                            ) : null}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p
                                                                className={`text-foreground ${isRoot ? "font-semibold text-sm cursor-pointer hover:text-primary" : "font-medium text-sm"}`}
                                                                onClick={hasChildren ? (e) => toggleExpand(item.id, e) : undefined}
                                                            >
                                                                {item.title}
                                                            </p>
                                                            {item.subtitle && (
                                                                <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="py-3">
                                                    <Badge variant="secondary" className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${NIVEL_BADGE[item.nivel]}`}>
                                                        {item.meta}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            {item.questionsCount?.toLocaleString() ?? 0}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="py-3">
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

                                                <TableCell className="py-3 text-right pr-4">
                                                    <div className="flex items-center justify-end gap-0.5">
                                                        {item.nivel !== "subtopico" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
                                                                onClick={() => handleOpenInlineAdd(item)}
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}

                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8"
                                                            onClick={() => setEditingItem(item)}
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Button>

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
                                                                        <AlertDialogTitle>Excluir {item.nivel === "disciplina" ? "Disciplina" : item.meta}?</AlertDialogTitle>
                                                                    </div>
                                                                    <AlertDialogDescription>
                                                                        Você está prestes a excluir <strong className="text-foreground">{item.title}</strong>.
                                                                        Esta ação removerá todos os itens vinculados abaixo dela e não pode ser desfeita.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter className="mt-4">
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(item)}>
                                                                        {deletingId === item.id ? "Excluindo..." : "Confirmar Exclusão"}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            {inlineAddAfterId === item.id && inlineAdd && (
                                                <TableRow className="bg-primary/[0.03] border-primary/10">
                                                    <TableCell className="py-2" style={{ paddingLeft: `calc(1rem + ${inlineAdd.indent * 2.5}rem)` }}>
                                                        <div className="flex items-center gap-2">
                                                            <CornerDownRight className="w-4 h-4 text-primary/40 shrink-0" />
                                                            <input
                                                                ref={inlineInputRef}
                                                                type="text"
                                                                value={inlineValue}
                                                                onChange={(e) => setInlineValue(e.target.value)}
                                                                onKeyDown={handleInlineKeyDown}
                                                                placeholder={`Nome do ${inlineAdd.nivel.charAt(0).toUpperCase() + inlineAdd.nivel.slice(1)}...`}
                                                                className="flex-1 bg-transparent border-b border-primary/30 outline-none text-sm py-0.5 text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                                                                disabled={inlineSaving}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2">
                                                        <Badge variant="secondary" className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${NIVEL_BADGE[inlineAdd.nivel]}`}>
                                                            {inlineAdd.nivel.charAt(0).toUpperCase() + inlineAdd.nivel.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell colSpan={2} className="py-2">
                                                        <span className="text-[10px] text-muted-foreground">Enter para salvar</span>
                                                    </TableCell>
                                                    <TableCell className="py-2 pr-4 text-right">
                                                        <div className="flex items-center justify-end gap-0.5">
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10" onClick={handleInlineSave} disabled={!inlineValue.trim() || inlineSaving}>
                                                                {inlineSaving ? <span className="w-3.5 h-3.5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted" onClick={() => setInlineAdd(null)}>
                                                                <X className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    )
                                })}

                                {visible.length === 0 && !inlineAdd && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <BookOpen className="w-8 h-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {search ? "Nenhum resultado encontrado." : "Nenhuma disciplina cadastrada."}
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
            {editingItem && (
                <EditDisciplinaModal 
                    item={editingItem}
                    open={!!editingItem}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                />
            )}
        </div>
    )
}
