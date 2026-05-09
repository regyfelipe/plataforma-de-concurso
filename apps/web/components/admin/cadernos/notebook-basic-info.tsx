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

export function NotebookBasicInfo() {
    return (
        <div className="bg-card dark:bg-muted/5 border border-border/40 rounded-[2rem] p-6 md:p-8 space-y-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Coluna de Info (1/3) */}
                <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Layout className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-foreground uppercase tracking-widest">Identidade</h3>
                    <p className="text-[10px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-wider">
                        Defina como o caderno será apresentado. Use títulos claros e capas chamativas.
                    </p>
                </div>

                {/* Coluna de Campos (2/3) */}
                <div className="md:col-span-2 space-y-8">

                    {/* Título e Capa */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Library className="w-3 h-3" />
                                Título do Caderno
                            </Label>
                            <Input
                                placeholder="Ex: Caderno PF 2026 - Direito Constitucional"
                                className="h-12 px-5 bg-muted/10 border-border/40 rounded-xl focus-visible:ring-primary/20 font-medium"
                            />
                        </div>
                        <div className="w-full md:w-48 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" />
                                Capa Opcional
                            </Label>
                            <div className="h-12 border-2 border-dashed border-border/40 rounded-xl flex items-center justify-center hover:bg-muted/10 transition-colors cursor-pointer group">
                                <Plus className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <AlignLeft className="w-3 h-3" />
                            Descrição Estratégica
                        </Label>
                        <Textarea
                            placeholder="Descreva o foco deste conjunto de questões e dicas para o estudo..."
                            className="bg-muted/10 border-border/40 rounded-xl p-5 min-h-[100px] resize-none focus-visible:ring-primary/20 font-medium"
                        />
                    </div>

                    {/* Grid de Metadados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/10">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Briefcase className="w-3 h-3" />
                                Carreira
                            </Label>
                            <Select>
                                <SelectTrigger className="w-full h-11 bg-muted/10 border-border/40 rounded-xl focus:ring-primary/20">
                                    <SelectValue placeholder="Selecione a Carreira" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="policial">Policial</SelectItem>
                                    <SelectItem value="tribunais">Tribunais</SelectItem>
                                    <SelectItem value="administrativa">Administrativa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Landmark className="w-3 h-3" />
                                Concurso Base
                            </Label>
                            <Select>
                                <SelectTrigger className="w-full h-11 bg-muted/10 border-border/40 rounded-xl focus:ring-primary/20">
                                    <SelectValue placeholder="Selecione o Concurso" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {CONCURSOS_MOCK.map(c => (
                                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <BookOpen className="w-3 h-3" />
                                Disciplina Principal
                            </Label>
                            <Select>
                                <SelectTrigger className="w-full h-11 bg-muted/10 border-border/40 rounded-xl focus:ring-primary/20">
                                    <SelectValue placeholder="Selecione a Disciplina" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {DISCIPLINAS_MOCK.map(d => (
                                        <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <BarChart3 className="w-3 h-3" />
                                    Dificuldade
                                </Label>
                                <Select>
                                    <SelectTrigger className="w-full h-11 bg-muted/10 border-border/40 rounded-xl focus:ring-primary/20">
                                        <SelectValue placeholder="Nível" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="facil">Fácil</SelectItem>
                                        <SelectItem value="medio">Médio</SelectItem>
                                        <SelectItem value="dificil">Difícil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Ano
                                </Label>
                                <Input placeholder="2024" className="h-9 bg-muted/10 border-border/40 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { Plus } from "lucide-react"
