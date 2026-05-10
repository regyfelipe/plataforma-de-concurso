"use client"

import * as React from "react"
import { Search, Filter, Edit2, Trash2, ClipboardList, AlertTriangle, Calendar, ChevronLeft, Archive } from "lucide-react"
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
import { CONCURSOS_MOCK } from "@/data/mocks/admin"
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

export default function ConcursosEncerradosPage() {
    const encerrados = CONCURSOS_MOCK.filter((c: any) => c.status === 'encerrado')

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Histórico de Certames</p>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Archive className="w-6 h-6 text-muted-foreground" />
                        Concursos Encerrados
                    </h1>
                </div>

                <Link href="/admin/concursos">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        Ver Ativos
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
                                placeholder="Buscar no histórico..." 
                                className="pl-10 h-10"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-muted/50 border rounded-md flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total</span>
                                <span className="text-sm font-semibold">{encerrados.length}</span>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                Filtrar
                            </Button>
                        </div>
                    </div>

                    {/* Tabela de Concursos Encerrados */}
                    <div className="rounded-md border overflow-hidden opacity-90">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Concurso</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Banca / Ano</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Carreira / Escolaridade</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {encerrados.map((item: any) => (
                                    <TableRow key={item.id} className="group transition-colors grayscale-[0.5] hover:grayscale-0">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground border border-border/50">
                                                    <ClipboardList className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="secondary" className="w-fit text-[10px] font-bold opacity-70">
                                                    {item.banca}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {item.ano}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-xs font-semibold text-muted-foreground/80">{item.carreira}</p>
                                                <p className="text-[11px] text-muted-foreground/60">{item.escolaridade}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1.5 text-muted-foreground text-[10px] rounded-full">
                                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                                Arquivado
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/admin/concursos/editar/${item.id}`}>
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
                                                                <AlertDialogTitle>Excluir do Histórico?</AlertDialogTitle>
                                                            </div>
                                                            <AlertDialogDescription>
                                                                Você está prestes a excluir permanentemente o concurso <strong className="text-foreground">{item.name}</strong> do histórico.
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
