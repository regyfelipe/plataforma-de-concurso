"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, CornerDownRight, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

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

export function TaxonomyList({
  title,
  description,
  createHref,
  createLabel,
  createAction,
  items,
}: {
  title: string
  description: string
  createHref: string
  createLabel: string
  createAction?: React.ReactNode
  items: TaxonomyListItem[]
}) {
  const basePath = createHref.replace("/criar", "")
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isItemVisible = React.useCallback((item: TaxonomyListItem): boolean => {
    if (!item.parentId) return true
    if (!expandedIds.has(item.parentId)) return false
    const parent = items.find(i => i.id === item.parentId)
    return parent ? isItemVisible(parent) : true
  }, [expandedIds, items])

  const visibleItems = items.filter(isItemVisible)

  return (
    <div className="mx-auto flex-1 space-y-8 bg-background p-8 pt-6 w-full max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-primary/80">{description}</p>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{title}</h1>
        </div>
        {createAction ? (
          createAction
        ) : (
          <Button render={<Link href={createHref} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Button>
        )}
      </div>

      <div className="border border-border/50 rounded-2xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%] text-xs font-bold uppercase tracking-wider text-muted-foreground py-4 pl-4">Nome do Item</TableHead>
              <TableHead className="w-[30%] text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Informação Adicional</TableHead>
              <TableHead className="w-[15%] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Status</TableHead>
              <TableHead className="w-[15%] text-right text-xs font-bold uppercase tracking-wider text-muted-foreground py-4 pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item) => {
              const isRoot = !item.indent || item.indent === 0;
              const paddingLeft = item.indent ? `calc(1rem + ${item.indent * 2.5}rem)` : '1rem';
              const hasChildren = items.some(i => i.parentId === item.id);
              const isExpanded = expandedIds.has(item.id);

              return (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="py-4" style={{ paddingLeft }}>
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
                          className={`text-foreground ${isRoot ? 'font-bold text-base cursor-pointer hover:text-primary transition-colors' : 'font-medium text-sm'}`}
                          onClick={hasChildren ? (e) => toggleExpand(item.id, e) : undefined}
                        >
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs font-medium text-muted-foreground/80">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    {item.meta && (
                      <Badge variant="outline" className="bg-muted/30 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider border-border/50">
                        {item.meta}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    {typeof item.active === "boolean" && (
                      <Badge 
                        variant="outline" 
                        className={`font-black text-[10px] uppercase tracking-widest border-0 ${
                          item.active 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.active ? "Ativo" : "Inativo"}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button 
                        render={<Link href={item.editHref || `${basePath}/editar/${item.id}`} />} 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
                      <p className="font-bold text-lg text-foreground">Nenhum registro encontrado</p>
                      <p className="text-sm font-medium text-muted-foreground">Clique no botão acima para adicionar o primeiro item.</p>
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
