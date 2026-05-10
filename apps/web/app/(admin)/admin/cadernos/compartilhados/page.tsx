"use client"

import * as React from "react"
import { Search, Filter, Library, User, BookOpen, Share2, Eye, Download, Star } from "lucide-react"
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
import { Card, CardContent } from "@workspace/ui/components/card"

const COMPARTILHADOS_MOCK = [
    { id: 'sc1', name: 'Resumo de Atos Administrativos', author: 'João Silva', disciplina: 'Direito Administrativo', downloads: 1250, rating: 4.8, questions: 45, date: '2024-05-01' },
    { id: 'sc2', name: 'Questões CESPE - Polícia Federal', author: 'Maria Oliveira', disciplina: 'Múltiplas', downloads: 3400, rating: 4.9, questions: 120, date: '2024-04-28' },
    { id: 'sc3', name: 'Português: Crase e Regência', author: 'Prof. Marcos', disciplina: 'Língua Portuguesa', downloads: 850, rating: 4.5, questions: 30, date: '2024-05-03' },
    { id: 'sc4', name: 'Matemática para Concursos', author: 'Pedro Santos', disciplina: 'Raciocínio Lógico', downloads: 560, rating: 4.2, questions: 25, date: '2024-05-02' },
];

export default function CadernosCompartilhadosPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Comunidade e Compartilhamento</p>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Cadernos Compartilhados
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Minhas Compartilhas
                    </Button>
                </div>
            </div>

            {/* Barra de Ações */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar nos cadernos da comunidade..." 
                                className="pl-10 h-10"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-muted/50 border rounded-md flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Populares</span>
                                <span className="text-sm font-semibold">{COMPARTILHADOS_MOCK.length}</span>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                Filtrar
                            </Button>
                        </div>
                    </div>

                    {/* Tabela de Cadernos Compartilhados */}
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Caderno / Material</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Autor / Matéria</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-center">Popularidade</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Data</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {COMPARTILHADOS_MOCK.map((item) => (
                                    <TableRow key={item.id} className="group transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                    <Library className="w-4 h-4" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{item.questions} Questões</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <User className="w-3 h-3" />
                                                    <p className="text-[11px] font-medium">{item.author}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-primary/70">
                                                    <BookOpen className="w-3 h-3" />
                                                    <p className="text-[10px] font-bold uppercase tracking-wider">{item.disciplina}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col items-center gap-1.5">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    <span className="text-xs font-bold">{item.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Download className="w-2.5 h-2.5" />
                                                    <span>{item.downloads.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                {new Date(item.date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                                                    <Download className="w-3.5 h-3.5" />
                                                </Button>
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
