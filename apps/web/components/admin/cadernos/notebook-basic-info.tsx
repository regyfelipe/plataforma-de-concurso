"use client"

import * as React from "react"
import { Layout, Library, AlignLeft, Image as ImageIcon, Briefcase, Landmark, BookOpen, BarChart3, Calendar } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { FilterSelect } from "@/components/questoes/filter/filter-select"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Coluna 1: Título */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <Library className="w-3.5 h-3.5 text-muted-foreground" />
                            Título do Caderno
                        </Label>
                        <Input
                            placeholder="Ex: Caderno PF 2026 - Direito Constitucional"
                            className="h-12 text-sm"
                        />
                    </div>

                    {/* Coluna 2: Descrição */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                            Descrição Estratégica
                        </Label>
                        <Textarea
                            placeholder="Descreva o foco deste conjunto de questões e dicas para o estudo..."
                            className="h-12 min-h-[48px] resize-none text-sm"
                        />
                    </div>
                </div>

                <Separator />

                {/* Grid de Metadados */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <FilterSelect 
                            label="Carreira"
                            placeholder="Selecione a Carreira"
                            options={[
                                { label: "Policial", value: "policial" },
                                { label: "Tribunais", value: "tribunais" },
                                { label: "Administrativa", value: "administrativa" },
                            ]}
                            isMulti={false}
                        />
                    </div>

                    <div className="space-y-2">
                        <FilterSelect 
                            label="Concurso Base"
                            placeholder="Selecione o Concurso"
                            options={CONCURSOS_MOCK.map(c => ({ label: c.name, value: c.id }))}
                            isMulti={false}
                        />
                    </div>

                    <div className="space-y-2">
                        <FilterSelect 
                            label="Disciplina Principal"
                            placeholder="Selecione a Disciplina"
                            options={DISCIPLINAS_MOCK.map(d => ({ label: d.name, value: d.id }))}
                            isMulti={false}
                        />
                    </div>

                    <div className="space-y-2">
                        <FilterSelect 
                            label="Dificuldade"
                            placeholder="Nível"
                            options={[
                                { label: "Fácil", value: "facil" },
                                { label: "Médio", value: "medio" },
                                { label: "Difícil", value: "dificil" },
                            ]}
                            isMulti={false}
                        />
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
