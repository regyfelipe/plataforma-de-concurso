"use client"

import { useState, useMemo, useCallback, useRef, Fragment, MouseEvent, KeyboardEvent, ReactNode, ChangeEvent } from "react"
import {
    Search, Edit2, Trash2, AlertTriangle,
    Briefcase, BookOpen, ChevronRight, ChevronDown,
    Plus, Check, X, CornerDownRight, Camera, Building2
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
import { EditCarreiraModal } from "./edit-carreira-modal"
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
import { toast } from "sonner"
import { uploadToR2 } from "@/actions/upload"

type CarreiraLevel = "carreira" | "subcarreira" | "orgao" | "cargo"

type CarreiraItem = {
    id: string
    title: string
    subtitle?: string
    active: boolean
    iconUrl?: string
    questionsCount: number
    editHref: string
    parentId?: string
    indent: number
    nivel: CarreiraLevel
    concursosCount: number
    concursos: { id: string; nome: string; ano: number | null }[]
}

type StatusFilter = "all" | "active" | "inactive"

type InlineAdd = {
    parentId: string
    nivel: CarreiraLevel
    indent: number
} | null

export function CarreirasList({
    items,
    createAction,
    onDelete,
    onCreateSubcarreira,
}: {
    items: CarreiraItem[]
    createAction: ReactNode
    onDelete: (id: string) => Promise<void>
    onCreateSubcarreira: (parentId: string, nome: string) => Promise<void>
}) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [editingItem, setEditingItem] = useState<{ id: string, nome: string, descricao?: string, iconUrl?: string } | null>(null)
    const [inlineAdd, setInlineAdd] = useState<InlineAdd>(null)
    const [inlineValue, setInlineValue] = useState("")
    const [inlineSaving, setInlineSaving] = useState(false)
    const [inlineFile, setInlineFile] = useState<File | null>(null)
    const [inlinePreview, setInlinePreview] = useState<string | null>(null)
    const inlineInputRef = useRef<HTMLInputElement>(null)
    const inlineFileRef = useRef<HTMLInputElement>(null)

    const toggleExpand = (id: string, e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const filteredItems = useMemo(() => {
        let result = items
        if (search.trim()) {
            const q = search.toLowerCase()
            const matchIds = new Set(
                items
                    .filter(
                        (i) =>
                            i.title.toLowerCase().includes(q) ||
                            i.subtitle?.toLowerCase().includes(q)
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

    const isVisible = useCallback(
        (item: CarreiraItem): boolean => {
            if (!item.parentId) return true
            if (!expandedIds.has(item.parentId)) return false
            const parent = filteredItems.find((i) => i.id === item.parentId)
            return parent ? isVisible(parent) : true
        },
        [expandedIds, filteredItems]
    )

    const visible = useMemo(
        () => filteredItems.filter(isVisible),
        [filteredItems, isVisible]
    )

    const handleOpenInlineAdd = (item: CarreiraItem) => {
        let nivel: CarreiraLevel
        if (item.nivel === "carreira") nivel = "subcarreira"
        else if (item.nivel === "subcarreira") nivel = "orgao"
        else if (item.nivel === "orgao") nivel = "cargo"
        else return

        setExpandedIds((prev) => new Set([...prev, item.id]))
        setInlineAdd({
            parentId: item.id,
            nivel,
            indent: item.indent + 1,
        })
        setInlineValue("")
        setInlineFile(null)
        setInlinePreview(null)
        setTimeout(() => inlineInputRef.current?.focus(), 60)
    }

    const handleInlineFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setInlineFile(file)
            setInlinePreview(URL.createObjectURL(file))
        }
    }

    const handleInlineSave = async () => {
        if (!inlineAdd || !inlineValue.trim() || inlineSaving) return
        setInlineSaving(true)
        try {
            let iconUrl = ""
            if (inlineFile) {
                const formData = new FormData()
                formData.append("file", inlineFile)
                formData.append("path", "careers")
                const result = await uploadToR2(formData)
                if (result.success && result.url) {
                    iconUrl = result.url
                }
            }

            await onCreateSubcarreira(inlineAdd.parentId, inlineValue.trim(), iconUrl)
            setInlineAdd(null)
            setInlineValue("")
            setInlineFile(null)
            setInlinePreview(null)
            toast.success("Adicionado com sucesso!")
        } catch (error) {
            toast.error("Erro ao adicionar.")
        } finally {
            setInlineSaving(false)
        }
    }

    const handleInlineKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); handleInlineSave() }
        if (e.key === "Escape") { setInlineAdd(null); setInlineValue("") }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try { await onDelete(id) }
        finally { setDeletingId(null) }
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Carreiras</h1>
                </div>
                {createAction}
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar carreira..."
                                className="pl-10 h-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-muted/50 border rounded-md flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total Raiz</span>
                                <span className="text-sm font-semibold">{items.filter(i => !i.parentId).length}</span>
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
                                <TableRow className="bg-muted/50 hover:bg-muted/50 ">
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider pl-11">Nome</TableHead>
                                    <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider text-center">Questões</TableHead>
                                    <TableHead className="w-[200px] text-xs font-semibold uppercase tracking-wider text-center">Concursos Vinculados</TableHead>
                                    <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider text-center">Status</TableHead>
                                    <TableHead className="text-right w-[100px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visible.map((item) => {
                                    const paddingLeft = item.indent * 24 + 16
                                    const isExpanded = expandedIds.has(item.id)
                                    const hasChildren = items.some(i => i.parentId === item.id)

                                    return (
                                        <Fragment key={item.id}>
                                            <TableRow className="group transition-colors hover:bg-muted/30">
                                                <TableCell className="py-3" style={{ paddingLeft }}>
                                                    <div className="flex items-center gap-2">
                                                        {hasChildren ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5 p-0 hover:bg-muted"
                                                                onClick={(e) => toggleExpand(item.id, e)}
                                                            >
                                                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                            </Button>
                                                        ) : (
                                                            <div className="w-5" />
                                                        )}

                                                        <div className="relative">
                                                            {item.indent > 0 && (
                                                                <CornerDownRight className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/30" />
                                                            )}
                                                            <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border/10 flex items-center justify-center overflow-hidden">
                                                                {item.iconUrl ? (
                                                                    <img src={item.iconUrl} alt={item.title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Briefcase className="w-4 h-4 text-muted-foreground/40" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold tracking-tight">{item.title}</span>
                                                            {item.subtitle && <span className="text-[10px] text-muted-foreground leading-tight">{item.subtitle}</span>}
                                                        </div>

                                                        {item.nivel !== "cargo" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                                                                onClick={() => handleOpenInlineAdd(item)}
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 text-center">
                                                    <Badge variant="outline" className="gap-1.5 h-6 bg-muted/5 px-2 font-medium text-[10px]">
                                                        <BookOpen className="w-3 h-3 text-muted-foreground/50" />
                                                        {item.questionsCount}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3 text-center">
                                                    {item.concursosCount > 0 ? (
                                                        <Badge variant="outline" className="gap-1.5 h-6 bg-amber-500/5 text-amber-600 border-amber-500/10 px-2 font-bold text-[10px]">
                                                            <Building2 className="w-3 h-3 opacity-70" />
                                                            {item.concursosCount}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground/20 italic">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3 text-center">
                                                    <Badge variant={item.active ? "default" : "secondary"} className="h-5 px-1.5 text-[9px] font-black uppercase tracking-wider">
                                                        <div className={`mr-1.5 h-1 w-1 rounded-full ${item.active ? "bg-current" : "bg-muted-foreground/40"}`} />
                                                        {item.active ? "Ativo" : "Inativo"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-muted"
                                                            onClick={() => setEditingItem({
                                                                id: item.id,
                                                                nome: item.title,
                                                                descricao: item.subtitle,
                                                                iconUrl: item.iconUrl
                                                            })}
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger render={
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            } />
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Excluir Carreira?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente a carreira <strong>{item.title}</strong> e desvinculará todas as questões associadas.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        onClick={() => handleDelete(item.id)}
                                                                    >
                                                                        {deletingId === item.id ? "Excluindo..." : "Excluir"}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            {inlineAdd?.parentId === item.id && (
                                                <TableRow className="bg-primary/5 border-l-2 border-l-primary animate-in slide-in-from-left-1 duration-200">
                                                    <TableCell className="py-3" style={{ paddingLeft: inlineAdd.indent * 24 + 16 }}>
                                                        <div className="flex items-center gap-3">
                                                            <CornerDownRight className="w-3.5 h-3.5 text-primary/50" />

                                                            <div className="relative group/upload">
                                                                <div className="w-8 h-8 rounded-lg bg-background border border-dashed border-primary/30 flex items-center justify-center overflow-hidden">
                                                                    {inlinePreview ? (
                                                                        <img src={inlinePreview} alt="Preview" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Camera className="w-3.5 h-3.5 text-primary/40" />
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    ref={inlineFileRef}
                                                                    accept="image/*"
                                                                    onChange={handleInlineFileChange}
                                                                />
                                                                <button
                                                                    onClick={() => inlineFileRef.current?.click()}
                                                                    className="absolute inset-0 bg-primary/10 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                                                                >
                                                                    <Camera className="w-3 h-3 text-primary" />
                                                                </button>
                                                            </div>

                                                            <div className="flex-1 max-w-sm">
                                                                <Input
                                                                    ref={inlineInputRef}
                                                                    value={inlineValue}
                                                                    onChange={(e) => setInlineValue(e.target.value)}
                                                                    onKeyDown={handleInlineKeyDown}
                                                                    placeholder={`Nome da ${inlineAdd.nivel === 'subcarreira' ? 'subcarreira' :
                                                                            inlineAdd.nivel === 'orgao' ? 'órgão' : 'cargo'
                                                                        }...`}
                                                                    className="h-8 text-xs bg-background border-primary/20 focus-visible:ring-primary/20"
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell colSpan={2} />
                                                    <TableCell className="py-2 pr-4 text-right">
                                                        <div className="flex items-center justify-end gap-0.5">
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10" onClick={handleInlineSave} disabled={!inlineValue.trim() || inlineSaving}>
                                                                {inlineSaving ? <span className="w-3.5 h-3.5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted" onClick={() => { setInlineAdd(null); setInlineFile(null); setInlinePreview(null) }}>
                                                                <X className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    )
                                })}

                                {visible.length === 0 && !inlineAdd && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Briefcase className="w-8 h-8 text-muted-foreground/40" />
                                                <p className="text-sm text-muted-foreground">Nenhuma carreira encontrada.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <EditCarreiraModal
                carreira={editingItem}
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
            />
        </div>
    )
}
