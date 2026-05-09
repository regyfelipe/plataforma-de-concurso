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

export function NotebookQuestionPicker() {
    const [selectedCount, setSelectedCount] = React.useState(0)

    return (
        <div className="bg-card dark:bg-muted/5 border border-border/40 rounded-[1.5rem] p-4 md:p-5 space-y-5 shadow-sm">
            <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <ListFilter className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black tracking-tight text-foreground uppercase tracking-widest">Curadoria</h3>
                        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Selecione e valide o conteúdo oficial.</p>
                    </div>
                </div>

                {/* Filtros Compactos */}
                <div className="bg-muted/10 border border-border/40 rounded-xl p-3 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                        <Input
                            placeholder="Código ou texto..."
                            className="pl-8 h-8 bg-background border-border/40 rounded-lg focus-visible:ring-primary/20 text-[11px] font-medium"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                        <Select>
                            <SelectTrigger className="w-[120px] h-7 bg-background border-border/40 rounded-md text-[8px] font-black uppercase tracking-widest">
                                <SelectValue placeholder="Disciplina" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                <SelectItem value="adm" className="text-[10px]">D. Administrativo</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[100px] h-7 bg-background border-border/40 rounded-md text-[8px] font-black uppercase tracking-widest">
                                <SelectValue placeholder="Banca" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                <SelectItem value="cespe" className="text-[10px]">CEBRASPE</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[70px] h-7 bg-background border-border/40 rounded-md text-[8px] font-black uppercase tracking-widest">
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                <SelectItem value="2024" className="text-[10px]">2024</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" className="h-7 px-2 rounded-md text-[8px] font-black uppercase tracking-widest text-primary/60 hover:bg-primary/5">
                            Limpar
                        </Button>
                    </div>
                </div>

                {/* Grid Compacto */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                    {/* Lista (8/12) */}
                    <div className="lg:col-span-8 space-y-2.5">
                        <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1">Disponíveis (1.240)</h4>

                        <ScrollArea className="h-[500px] pr-3">
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="group p-3 bg-muted/5 border border-border/20 rounded-xl hover:border-primary/30 transition-all">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[7px] font-black uppercase border-primary/20 text-primary px-1.5 h-3.5 leading-none">Q128374</Badge>
                                                    <span className="text-[7px] font-bold text-muted-foreground/30 uppercase tracking-widest">CEBRASPE • 2024</span>
                                                </div>
                                                <p className="text-[11px] font-medium text-foreground/80 leading-relaxed line-clamp-2">
                                                    No que se refere aos atos administrativos, assinale a opção correta considerando a jurisprudência dos tribunais superiores...
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="icon" variant="outline" className="h-7 w-7 rounded-md border-border/40 text-muted-foreground/60 hover:text-primary hover:bg-primary/5">
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="!max-w-none w-[60vw] h-[80vh] rounded-[1.5rem] p-0 overflow-hidden">
                                                        <ScrollArea className="h-full">
                                                            <div className="p-6 space-y-4">
                                                                <h2 className="text-sm font-black uppercase tracking-widest">Visualização</h2>
                                                                <div className="p-4 bg-muted/5 rounded-lg border border-border/10 text-xs italic">
                                                                    Conteúdo da questão...
                                                                </div>
                                                            </div>
                                                        </ScrollArea>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button
                                                    size="icon"
                                                    className="h-7 w-7 rounded-md bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                                                    onClick={() => setSelectedCount(prev => prev + 1)}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Cesta (4/12) */}
                    <div className="lg:col-span-4 sticky top-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl">
                                <div className="flex items-center gap-2 text-primary">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <h4 className="text-[8px] font-black uppercase tracking-widest">Selecionadas</h4>
                                </div>
                                <Badge className="bg-primary text-primary-foreground font-black text-[9px] px-1.5 h-4">{selectedCount}</Badge>
                            </div>

                            <ScrollArea className="h-[350px] rounded-xl border border-border/40 bg-muted/5 p-2">
                                <div className="space-y-1.5">
                                    {selectedCount > 0 ? (
                                        Array.from({ length: selectedCount }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 bg-background border border-border/40 rounded-lg group">
                                                <div className="cursor-grab text-muted-foreground/20">
                                                    <GripVertical className="w-3 h-3" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[8px] font-black text-foreground/80 uppercase truncate">#{128370 + i}</p>
                                                    <p className="text-[7px] font-bold text-muted-foreground/40 uppercase truncate leading-none">D. Administrativo</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-md text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setSelectedCount(prev => prev - 1)}
                                                >
                                                    <X className="w-2.5 h-2.5" />
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-[150px] flex flex-col items-center justify-center text-center p-4 opacity-20">
                                            <MousePointer2 className="w-5 h-5 mb-2" />
                                            <p className="text-[8px] font-black uppercase tracking-widest">Vazio</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}