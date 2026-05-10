"use client"

import * as React from "react"
import { Layout, Library, AlignLeft, Image as ImageIcon, Briefcase, Landmark, BookOpen, BarChart3, Calendar } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@workspace/ui/components/select"
import { DISCIPLINAS_MOCK, BANCAS_MOCK, CONCURSOS_MOCK } from "@/data/mocks/admin"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Plus } from "lucide-react"

export function NotebookBasicInfo() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Layout className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Identidade do Caderno</CardTitle>
                        <CardDescription className="text-xs">
                            Defina como o caderno será apresentado aos alunos.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Título e Capa */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <Library className="w-3.5 h-3.5 text-muted-foreground" />
                                Título do Caderno
                            </Label>
                            <Input
                                placeholder="Ex: Caderno PF 2026 - Direito Constitucional"
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                Capa Opcional
                            </Label>
                            <div className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer group gap-2">
                                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Upload de Imagem</span>
                            </div>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                            Descrição Estratégica
                        </Label>
                        <Textarea
                            placeholder="Descreva o foco deste conjunto de questões e dicas para o estudo..."
                            className="min-h-[160px] resize-none"
                        />
                    </div>
                </div>

                <Separator />

                {/* Grid de Metadados */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                            Carreira
                        </Label>
                        <Select>
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Selecione a Carreira" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="policial">Policial</SelectItem>
                                <SelectItem value="tribunais">Tribunais</SelectItem>
                                <SelectItem value="administrativa">Administrativa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
                            Concurso Base
                        </Label>
                        <Select>
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Selecione o Concurso" />
                            </SelectTrigger>
                            <SelectContent>
                                {CONCURSOS_MOCK.map(c => (
                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                            Disciplina Principal
                        </Label>
                        <Select>
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Selecione a Disciplina" />
                            </SelectTrigger>
                            <SelectContent>
                                {DISCIPLINAS_MOCK.map(d => (
                                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
                            Dificuldade
                        </Label>
                        <Select>
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Nível" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="facil">Fácil</SelectItem>
                                <SelectItem value="medio">Médio</SelectItem>
                                <SelectItem value="dificil">Difícil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            Ano de Referência
                        </Label>
                        <Input placeholder="2024" className="h-10" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
