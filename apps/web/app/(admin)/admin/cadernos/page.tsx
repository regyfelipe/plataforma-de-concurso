"use client"

import * as React from "react"
import { Plus, Search, Filter, Edit2, Trash2, Library, AlertTriangle, User, BookOpen } from "lucide-react"
import Link from "next/link"
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
import { CADERNOS_MOCK } from "@/data/mocks/admin"
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

import { Card, CardContent } from "@workspace/ui/components/card"

export default function ListarCadernosAdminPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Materiais Oficiais</p>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Cadernos Oficiais
                    </h1>
                </div>

                <Link href="/admin/cadernos/criar">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Caderno
                    </Button>
                </Link>
            </div>

            {/* Barra de Ações */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar caderno..." 
                                className="pl-10 h-10"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-muted/50 border rounded-md flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total</span>
                                <span className="text-sm font-semibold">{CADERNOS_MOCK.length}</span>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                Filtrar
                            </Button>
                        </div>
                    </div>

                    {/* Tabela de Cadernos */}
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Caderno / Título</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Autor / Matéria</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-center">Questões</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {CADERNOS_MOCK.map((item: any) => (
                                    <TableRow key={item.id} className="group transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                    <Library className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <User className="w-3 h-3" />
                                                    <p className="text-[11px] font-medium">{item.professor}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-primary/70">
                                                    <BookOpen className="w-3 h-3" />
                                                    <p className="text-[10px] font-bold uppercase tracking-wider">{item.disciplina}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="font-mono text-[10px] px-2.5">
                                                {item.questions.toLocaleString()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                {item.status === 'published' ? (
                                                    <Badge variant="outline" className="gap-1.5 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[10px] rounded-full">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        Publicado
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="gap-1.5 border-amber-500/20 bg-amber-500/5 text-amber-600 text-[10px] rounded-full">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        Rascunho
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/admin/cadernos/editar/${item.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                                
                                                <AlertDialog>
                                                    <AlertDialogTrigger render={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    } />
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                                                    <AlertTriangle className="w-5 h-5" />
                                                                </div>
                                                                <AlertDialogTitle>Excluir Caderno?</AlertDialogTitle>
                                                            </div>
                                                            <AlertDialogDescription>
                                                                Você está prestes a excluir o caderno <strong className="text-foreground">{item.name}</strong>. 
                                                                Isso removerá o acesso de todos os alunos que utilizam este material.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="mt-4">
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Confirmar Exclusão
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
