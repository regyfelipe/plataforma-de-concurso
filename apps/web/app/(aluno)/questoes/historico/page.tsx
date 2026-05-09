"use client"

import * as React from "react"
import { Search, Filter, CheckCircle2, XCircle, Clock, ExternalLink, Calendar, BookOpen } from "lucide-react"
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
import { QUESTION_HISTORY, type Question } from "../../../../data/mocks/questoes"

export default function HistoricoQuestoesPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Meu Desempenho</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Histórico de Questões
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-muted/10 border border-border/40 rounded-xl flex items-center gap-3">
                        <div className="space-y-0.5">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Resolvidas</p>
                            <p className="text-sm font-black text-foreground">1,240</p>
                        </div>
                        <div className="w-px h-6 bg-border/20" />
                        <div className="space-y-0.5">
                            <p className="text-[8px] font-black uppercase text-emerald-500/60 tracking-widest">Acertos</p>
                            <p className="text-sm font-black text-emerald-500">78%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard / Filtros */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input 
                            placeholder="Buscar por código ou assunto..." 
                            className="pl-10 h-11 bg-muted/20 border-border/40 rounded-xl focus-visible:ring-primary/20"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-11 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Filter className="w-4 h-4 text-muted-foreground/40" />
                            Todas as Disciplinas
                        </Button>
                        <Button variant="outline" className="h-11 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Calendar className="w-4 h-4 text-muted-foreground/40" />
                            Este Mês
                        </Button>
                    </div>
                </div>

                {/* Tabela de Histórico */}
                <div className="border border-border/40 rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow className="hover:bg-transparent border-border/40">
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resultado</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Questão</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Disciplina / Assunto</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Banca / Ano</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tempo</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data</TableHead>
                                <TableHead className="py-4 px-6 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {QUESTION_HISTORY.map((attempt) => (
                                <TableRow key={attempt.id} className="group border-border/40 hover:bg-muted/10 transition-colors">
                                    <TableCell className="py-5 px-6">
                                        {attempt.result === 'correct' ? (
                                            <div className="flex items-center gap-2 text-emerald-500">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Acertou</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-destructive">
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Errou</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-5 px-6 font-mono text-[11px] font-bold text-foreground">
                                        {attempt.code}
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-black text-foreground">{attempt.subject}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground/60">{attempt.topic}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[9px] font-black px-2 py-0 h-5 border-border/40 uppercase">{attempt.board}</Badge>
                                            <span className="text-[10px] font-bold text-muted-foreground/40">{attempt.year}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-1.5 text-muted-foreground/60">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[11px] font-bold">{attempt.timeSpent}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6 text-[11px] font-medium text-muted-foreground/60">
                                        {attempt.createdAt && new Date(attempt.createdAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell className="py-5 px-6 text-right">
                                        <Button variant="ghost" size="icon" className="rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
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
