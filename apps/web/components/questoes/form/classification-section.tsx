"use client"

import * as React from "react"
import { 
    BookOpen, 
    Layers, 
    Tag, 
    Building2, 
    FileSearch, 
    GraduationCap, 
    Calendar, 
    Zap, 
    CheckSquare 
} from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

export function ClassificationSection() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">1</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Classificação da Questão</h2>
            </div>
            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Linha 1 */}
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Disciplina</Label>
                        <Select>
                            <SelectTrigger className="h-9 rounded-md text-[11px] bg-background">
                                <SelectValue placeholder="Pesquisar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2 border-b"><Input placeholder="Filtrar..." className="h-7 text-[10px]" /></div>
                                <SelectItem value="port">Português</SelectItem>
                                <SelectItem value="const">Direito Constitucional</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Layers className="w-3 h-3" /> Assunto</Label>
                        <Select>
                            <SelectTrigger className="h-9 rounded-md text-[11px] bg-background">
                                <SelectValue placeholder="Pesquisar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sint">Sintaxe</SelectItem>
                                <SelectItem value="morf">Morfologia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Tag className="w-3 h-3" /> Tópico</Label>
                        <Select>
                            <SelectTrigger className="h-9 rounded-md text-[11px] bg-background">
                                <SelectValue placeholder="Especifique o tópico" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="conc">Concordância Verbal</SelectItem>
                                <SelectItem value="reg">Regência</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Linha 2 */}
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Banca</Label>
                        <Select>
                            <SelectTrigger className="h-9 rounded-md text-[11px] bg-background">
                                <SelectValue placeholder="Ex: FGV, CESPE" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fgv">FGV</SelectItem>
                                <SelectItem value="cesp">CEBRASPE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Órgão/Instituição</Label>
                        <Input placeholder="Pesquisar..." className="h-9 rounded-md text-[11px] bg-background" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><FileSearch className="w-3 h-3" /> Concurso/Cargo</Label>
                        <Input placeholder="Ex: Auditor" className="h-9 rounded-md text-[11px] bg-background" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><GraduationCap className="w-3 h-3" /> Escolaridade</Label>
                        <Select>
                            <SelectTrigger className="h-9 rounded-md text-[11px] bg-background">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sup">Superior</SelectItem>
                                <SelectItem value="med">Médio</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Linha 3 */}
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Ano</Label>
                        <Input type="number" placeholder="2024" className="h-9 rounded-md text-[11px] bg-background" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Zap className="w-3 h-3" /> Dificuldade</Label>
                        <Select>
                            <SelectTrigger className="h-9 rounded-md text-[11px] bg-background">
                                <SelectValue placeholder="Estimada" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="f">Fácil</SelectItem>
                                <SelectItem value="m">Médio</SelectItem>
                                <SelectItem value="d">Difícil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><CheckSquare className="w-3 h-3" /> Tipo da Questão</Label>
                        <Select>
                            <SelectTrigger className="h-9 rounded-md text-[11px] bg-background">
                                <SelectValue placeholder="Múltipla Escolha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mc">Múltipla Escolha</SelectItem>
                                <SelectItem value="ce">Certo/Errado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
