"use client"

import * as React from "react"
import Link from "next/link"
import {
  Plus,
  Edit,
  Trash2,
  CornerDownRight,
  ChevronRight,
  ChevronDown,
  Search,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
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

type TaxonomyListItem = {
  id: string
  title: string
  subtitle?: string
  meta?: string
  active?: boolean
  indent?: number
  editHref?: string
  parentId?: string
}

type StatusFilter = "all" | "active" | "inactive"

export function TaxonomyList({
  title,
  description,
  createHref,
  createLabel,
  createAction,
  items,
  searchable = true,
  searchPlaceholder = "Buscar...",
  metaLabel = "Informação Adicional",
  metaMono = false,
  onDelete,
  deleteDialogTitle = "Excluir item?",
  deleteDialogDescription,
}: {
  title: string
  description: string
  createHref: string
  createLabel: string
  createAction?: React.ReactNode
  items: TaxonomyListItem[]
  searchable?: boolean
  searchPlaceholder?: string
  metaLabel?: string
  metaMono?: boolean
  onDelete?: (id: string) => Promise<void> | void
  deleteDialogTitle?: string
  deleteDialogDescription?: string
}) {
  const basePath = createHref.replace("/criar", "")
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredItems = React.useMemo(() => {
    let result = items

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchingIds = new Set(
        items
          .filter(
            (item) =>
              item.title.toLowerCase().includes(query) ||
              item.subtitle?.toLowerCase().includes(query) ||
              item.meta?.toLowerCase().includes(query)
          )
          .map((item) => item.id)
      )
      // Include ancestors so tree structure stays intact
      const addAncestors = (id: string) => {
        const item = items.find((i) => i.id === id)
        if (item?.parentId) {
          matchingIds.add(item.parentId)
          addAncestors(item.parentId)
        }
      }
      Array.from(matchingIds).forEach(addAncestors)
      result = result.filter((item) => matchingIds.has(item.id))
    }

    if (statusFilter !== "all") {
      result = result.filter((item) =>
        typeof item.active === "boolean"
          ? statusFilter === "active"
            ? item.active
            : !item.active
          : true
      )
    }

    return result
  }, [items, searchQuery, statusFilter])

  const isItemVisible = React.useCallback(
    (item: TaxonomyListItem): boolean => {
      if (!item.parentId) return true
      if (!expandedIds.has(item.parentId)) return false
      const parent = filteredItems.find((i) => i.id === item.parentId)
      return parent ? isItemVisible(parent) : true
    },
    [expandedIds, filteredItems]
  )

  const visibleItems = filteredItems.filter(isItemVisible)

  const handleDelete = async (id: string) => {
    if (!onDelete) return
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Ativos" },
    { value: "inactive", label: "Inativos" },
  ]

  return (
    <div className="mx-auto flex-1 space-y-6 bg-background p-8 pt-6 w-full max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{description}</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>

        {createAction ? (
          createAction
        ) : (
          <Button
            render={<Link href={createHref} />}
            className="gap-2 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4" />
            {createLabel}
          </Button>
        )}
      </div>

      {/* Search + Filter + Counter bar */}
      {searchable && (
        <div className="rounded-xl border bg-card shadow-sm p-5 space-y-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Total counter */}
              <div className="px-3 py-1.5 bg-muted/50 border rounded-md flex items-center gap-3">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </span>
                <span className="text-sm font-semibold">{items.length}</span>
              </div>

              {/* Status filter */}
              <div className="flex items-center rounded-md border overflow-hidden">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 ${
                      statusFilter === f.value
                        ? "bg-foreground text-background"
                        : "bg-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[40%] text-xs font-semibold uppercase tracking-wider py-3 pl-4">
                Nome do Item
              </TableHead>
              <TableHead className="w-[25%] text-xs font-semibold uppercase tracking-wider py-3">
                {metaLabel}
              </TableHead>
              <TableHead className="w-[15%] text-center text-xs font-semibold uppercase tracking-wider py-3">
                Status
              </TableHead>
              <TableHead className="w-[20%] text-right text-xs font-semibold uppercase tracking-wider py-3 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item) => {
              const isRoot = !item.indent || item.indent === 0
              const paddingLeft = item.indent
                ? `calc(1rem + ${item.indent * 2.5}rem)`
                : "1rem"
              const hasChildren = filteredItems.some((i) => i.parentId === item.id)
              const isExpanded = expandedIds.has(item.id)

              const deleteDesc =
                deleteDialogDescription ??
                `Você está prestes a excluir "${item.title}". Esta ação não pode ser desfeita.`

              return (
                <TableRow
                  key={item.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Nome */}
                  <TableCell className="py-3.5" style={{ paddingLeft }}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 flex items-center justify-center shrink-0">
                        {hasChildren ? (
                          <button
                            onClick={(e) => toggleExpand(item.id, e)}
                            className="p-0.5 rounded-sm hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        ) : !isRoot ? (
                          <CornerDownRight
                            className="w-4 h-4 text-muted-foreground/40"
                            strokeWidth={2.5}
                          />
                        ) : null}
                      </div>

                      <div className="space-y-0.5">
                        <p
                          className={`text-foreground ${
                            isRoot
                              ? "font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
                              : "font-medium text-sm"
                          }`}
                          onClick={
                            hasChildren
                              ? (e) => toggleExpand(item.id, e)
                              : undefined
                          }
                        >
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[400px]">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Meta (Sigla / Info) */}
                  <TableCell className="py-3.5">
                    {item.meta && (
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                          metaMono
                            ? "font-mono"
                            : "uppercase tracking-wider"
                        }`}
                      >
                        {item.meta}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5 text-center">
                    {typeof item.active === "boolean" &&
                      (item.active ? (
                        <Badge
                          variant="outline"
                          className="gap-1.5 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[10px] rounded-full"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1.5 text-muted-foreground text-[10px] rounded-full"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                          Inativo
                        </Badge>
                      ))}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        render={
                          <Link
                            href={
                              item.editHref || `${basePath}/editar/${item.id}`
                            }
                          />
                        }
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>

                      {onDelete ? (
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
                                <AlertDialogTitle>
                                  {deleteDialogTitle}
                                </AlertDialogTitle>
                              </div>
                              <AlertDialogDescription>
                                {deleteDesc}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(item.id)}
                              >
                                {deletingId === item.id
                                  ? "Excluindo..."
                                  : "Confirmar Exclusão"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {visibleItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-lg text-foreground">
                        {searchQuery
                          ? "Nenhum resultado encontrado"
                          : "Nenhum registro encontrado"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? "Tente uma busca diferente."
                          : "Clique no botão acima para adicionar o primeiro item."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
