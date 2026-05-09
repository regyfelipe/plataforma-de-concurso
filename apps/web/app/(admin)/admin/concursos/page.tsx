"use client"

import * as React from "react"
import { Plus, Search, Filter, Edit2, Trash2, ClipboardList, AlertTriangle, Calendar } from "lucide-react"
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

export default function ListarConcursosPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh]">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Gestão de Certames</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Concursos Públicos
                    </h1>
                </div>

                <Link href="/admin/concursos/criar">
                    <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        Novo Concurso
                    </Button>
                </Link>
            </div>

            {/* Barra de Ações */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input 
                            placeholder="Buscar concurso..." 
                            className="pl-10 h-11 bg-muted/20 border-border/40 rounded-xl focus-visible:ring-primary/20"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-muted/10 border border-border/40 rounded-xl flex items-center gap-3">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Total</p>
                            <p className="text-sm font-black text-foreground">{CONCURSOS_MOCK.length}</p>
                        </div>
                        <Button variant="outline" className="h-11 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Filter className="w-4 h-4 text-muted-foreground/40" />
                            Filtrar
                        </Button>
                    </div>
                </div>

                {/* Tabela de Concursos */}
                <div className="border border-border/40 rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow className="hover:bg-transparent border-border/40">
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Concurso</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Banca / Ano</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Carreira / Escolaridade</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</TableHead>
                                <TableHead className="py-4 px-6 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {CONCURSOS_MOCK.map((item: any) => (
                                <TableRow key={item.id} className="group border-border/40 hover:bg-muted/10 transition-colors">
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                                                <ClipboardList className="w-4 h-4" />
                                            </div>
                                            <p className="text-xs font-black text-foreground">{item.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex flex-col gap-1">
                                            <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-tight bg-muted/20 border-border/40">
                                                {item.banca}
                                            </Badge>
                                            <p className="text-[10px] font-medium text-muted-foreground/60 flex items-center gap-1">
                                                <Calendar className="w-2.5 h-2.5" />
                                                {item.ano}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-black text-foreground uppercase tracking-tight">{item.carreira}</p>
                                            <p className="text-[9px] font-medium text-muted-foreground/60">{item.escolaridade}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-1.5">
                                            {item.status === 'aberto' && (
                                                <Badge variant="outline" className="gap-1.5 px-3 py-1 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded-full">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                    Aberto
                                                </Badge>
                                            )}
                                            {item.status === 'previsto' && (
                                                <Badge variant="outline" className="gap-1.5 px-3 py-1 border-amber-500/20 bg-amber-500/5 text-amber-600 text-[9px] font-black uppercase tracking-wider rounded-full">
                                                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                                                    Previsto
                                                </Badge>
                                            )}
                                            {item.status === 'encerrado' && (
                                                <Badge variant="outline" className="gap-1.5 px-3 py-1 border-muted-foreground/20 bg-muted/5 text-muted-foreground/60 text-[9px] font-black uppercase tracking-wider rounded-full">
                                                    <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                                                    Encerrado
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/concursos/editar/${item.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger render={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                } />
                                                <AlertDialogContent className="rounded-[2.5rem]">
                                                    <AlertDialogHeader>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                                                <AlertTriangle className="w-6 h-6" />
                                                            </div>
                                                            <AlertDialogTitle className="font-black text-2xl tracking-tighter">Excluir Concurso?</AlertDialogTitle>
                                                        </div>
                                                        <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed">
                                                            Você está prestes a excluir o concurso <strong className="text-foreground">{item.name}</strong>. 
                                                            Isso pode remover o agrupamento de centenas de questões vinculadas.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="gap-3 mt-6">
                                                        <AlertDialogCancel className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 border-border/40">Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-black text-[10px] uppercase tracking-widest h-12 px-8 shadow-lg shadow-destructive/20 transition-all">
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
            </div>
        </div>
    )
}
