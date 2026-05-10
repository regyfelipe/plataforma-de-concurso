"use client"

import * as React from "react"
import { Search, Plus, X, Eye, GripVertical, CheckCircle2, ListFilter, MousePointer2 } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@workspace/ui/components/select"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export function NotebookQuestionPicker() {
    const [selectedCount, setSelectedCount] = React.useState(0)

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <ListFilter className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Curadoria de Conteúdo</CardTitle>
                        <CardDescription className="text-xs">
                            Selecione e valide as questões que farão parte deste caderno.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Filtros */}
                <div className="bg-muted/30 border rounded-lg p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por código ou texto da questão..."
                            className="pl-10 h-10"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Select>
                            <SelectTrigger className="w-[160px] h-9">
                                <SelectValue placeholder="Disciplina" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="adm">Direito Administrativo</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[140px] h-9">
                                <SelectValue placeholder="Banca" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cespe">CEBRASPE</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[100px] h-9">
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" size="sm" className="h-9 text-xs font-semibold text-primary">
                            Limpar Filtros
                        </Button>
                    </div>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Lista (8/12) */}
                    <div className="lg:col-span-8 space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Disponíveis (1.240)</span>
                        </div>

                        <ScrollArea className="h-[500px] pr-4 border rounded-lg bg-muted/5">
                            <div className="p-3 space-y-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="group p-4 bg-background border rounded-lg hover:border-primary/50 transition-colors shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-mono text-[10px] h-5 px-2 bg-primary/5 text-primary border-primary/20">Q128374</Badge>
                                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">CEBRASPE • 2024 • Superior</span>
                                                </div>
                                                <p className="text-sm font-medium text-foreground/90 leading-relaxed line-clamp-2">
                                                    No que se refere aos atos administrativos, assinale a opção correta considerando a jurisprudência dos tribunais superiores...
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 pt-1">
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl h-[80vh] p-0">
                                                        <ScrollArea className="h-full p-6">
                                                            <div className="space-y-6">
                                                                <div className="flex items-center gap-3">
                                                                    <Badge variant="secondary">Questão Q128374</Badge>
                                                                    <h2 className="text-lg font-bold">Visualização Completa</h2>
                                                                </div>
                                                                <div className="p-6 rounded-lg border bg-muted/30 text-sm leading-relaxed whitespace-pre-wrap">
                                                                    Conteúdo da questão detalhado aqui...
                                                                </div>
                                                            </div>
                                                        </ScrollArea>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setSelectedCount(prev => prev + 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Selecionadas (4/12) */}
                    <div className="lg:col-span-4 sticky top-4 space-y-4">
                        <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="flex items-center gap-2 text-primary">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Selecionadas</span>
                            </div>
                            <Badge className="bg-primary text-primary-foreground font-bold px-2">{selectedCount}</Badge>
                        </div>

                        <ScrollArea className="h-[438px] rounded-lg border bg-muted/5 p-2">
                            <div className="space-y-2">
                                {selectedCount > 0 ? (
                                    Array.from({ length: selectedCount }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-background border rounded-lg shadow-sm group">
                                            <div className="cursor-grab text-muted-foreground/30 hover:text-primary transition-colors">
                                                <GripVertical className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-foreground">#12837{i}</p>
                                                <p className="text-[10px] text-muted-foreground truncate uppercase font-medium">D. Administrativo</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => setSelectedCount(prev => prev - 1)}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-[200px] flex flex-col items-center justify-center text-center p-6 opacity-40">
                                        <MousePointer2 className="w-8 h-8 mb-3 text-muted-foreground" />
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Nenhuma selecionada</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}