"use client"

import * as React from "react"
import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { Search, Plus, X, Eye, GripVertical, CheckCircle2, ListFilter, MousePointer2, Landmark, BookOpen, Briefcase } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Label } from "@workspace/ui/components/label"
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { QuestionStatementSection } from "../questions/create/question-statement-section"
import { QuestionAlternativesSection } from "../questions/create/question-alternatives-section"
import { QuestionResolutionSection } from "../questions/create/question-resolution-section"
import { QuestionAlternativeExplanationsSection } from "../questions/create/question-alternative-explanations-section"
import { QuestionMaterialsSection } from "../questions/create/question-materials-section"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export function NotebookQuestionPicker() {
    const [selectedCount, setSelectedCount] = React.useState(0)
    const [view, setView] = React.useState<'bank' | 'notebook'>('bank')

    // Estados do Formulário de Criação Completo
    const [statement, setStatement] = React.useState({ supportText: "", commandText: "" })
    const [alternativas, setAlternativas] = React.useState([
        { id: "1", letter: "A", text: "", isCorrect: false, explanation: "" },
        { id: "2", letter: "B", text: "", isCorrect: false, explanation: "" },
        { id: "3", letter: "C", text: "", isCorrect: false, explanation: "" },
    ])
    const [resolution, setResolution] = React.useState("")
    const [materials, setMaterials] = React.useState({ videoUrl: "", objetivo: "", referencia: "", dica: "" })

    return (
        <Card>
            <CardContent className="space-y-6 pt-6">
                {/* Navegação de Visão */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex bg-muted/50 p-1 rounded-xl border">
                            <Button 
                                variant={view === 'bank' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setView('bank')}
                                className={`rounded-lg gap-2 text-xs font-bold ${view === 'bank' ? 'shadow-lg shadow-primary/20' : ''}`}
                            >
                                <Search className="w-3.5 h-3.5" />
                                Banco de Questões
                            </Button>
                            <Button 
                                variant={view === 'notebook' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setView('notebook')}
                                className={`rounded-lg gap-2 text-xs font-bold ${view === 'notebook' ? 'shadow-lg shadow-primary/20' : ''}`}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Meu Caderno ({selectedCount})
                            </Button>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="h-9 rounded-xl gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-xs font-bold px-4">
                                    <Plus className="w-4 h-4" />
                                    Criar Inédita
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="!max-w-none !w-[55vw] max-h-[85vh] p-0 overflow-hidden flex flex-col">
                                <div className="p-6 border-b bg-muted/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold">Criar Questão Inédita</h2>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Contexto automático do caderno</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Container de Scroll Nativo com Barra Invisível */}
                                <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <div className="max-w-3xl mx-auto space-y-8 pb-8">
                                        {/* Tags de Contexto Heredadas */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/20">
                                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold uppercase truncate">D. Administrativo</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/20">
                                                <Briefcase className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold uppercase truncate">Policial</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/20">
                                                <Landmark className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold uppercase truncate">PF 2024</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <FilterSelect 
                                                label="Modelo de Resposta"
                                                placeholder="Selecione o formato..."
                                                options={[
                                                    { label: "Múltipla Escolha (A até E)", value: "multipla_escolha" },
                                                    { label: "Certo / Errado (Cebraspe)", value: "certo_errado" },
                                                ]}
                                                value="multipla_escolha"
                                                onValueChange={() => {}}
                                            />
                                        </div>
                                        <Separator />

                                        {/* 2. Enunciado e Textos */}
                                        <QuestionStatementSection 
                                            supportText={statement.supportText}
                                            commandText={statement.commandText}
                                            onSupportChange={(val) => setStatement(prev => ({ ...prev, supportText: val }))}
                                            onCommandChange={(val) => setStatement(prev => ({ ...prev, commandText: val }))}
                                        />

                                        <Separator />

                                        {/* 3. Alternativas */}
                                        <div className="space-y-4">
                                            <QuestionAlternativesSection 
                                                alternativas={alternativas as any} 
                                                onToggleCorrect={(id) => setAlternativas(prev => prev.map(alt => ({ ...alt, isCorrect: alt.id === id })))}
                                                onChangeText={(id, text) => setAlternativas(prev => prev.map(alt => alt.id === id ? { ...alt, text } : alt))}
                                                onRemove={(id) => setAlternativas(prev => prev.filter(alt => alt.id !== id))}
                                                canRemove={alternativas.length > 2}
                                            />
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full border-dashed"
                                                onClick={() => {
                                                    const nextLetter = String.fromCharCode(65 + alternativas.length)
                                                    setAlternativas(prev => [...prev, { id: Date.now().toString(), letter: nextLetter, text: "", isCorrect: false, explanation: "" }])
                                                }}
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Adicionar Alternativa
                                            </Button>
                                        </div>

                                        <Separator />

                                        {/* 4. Resolução e Explicações */}
                                        <QuestionResolutionSection
                                            resolution={resolution}
                                            onResolutionChange={setResolution}
                                        />

                                        <Separator />

                                        {/* 5. Justificativa das Incorretas */}
                                        <QuestionAlternativeExplanationsSection 
                                            alternativas={alternativas as any}
                                            onChangeData={(id, value) => setAlternativas(prev => prev.map(alt => alt.id === id ? { ...alt, explanation: value } : alt))}
                                        />

                                        <Separator />

                                        {/* 6. Materiais de Apoio e Macetes */}
                                        <QuestionMaterialsSection
                                            values={materials}
                                            onFieldChange={(field, value) => setMaterials(prev => ({ ...prev, [field]: value }))}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 border-t bg-muted/5 flex items-center justify-end gap-3 px-8">
                                    <Button variant="ghost" size="sm">Cancelar</Button>
                                    <Button size="sm" className="px-8 rounded-lg font-bold shadow-lg shadow-primary/20">Salvar e Adicionar</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Busca rápida..."
                            className="pl-10 h-9 bg-muted/20 border-none rounded-xl text-xs"
                        />
                    </div>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Conteúdo Principal (8/12) */}
                    <div className="lg:col-span-8 space-y-3">
                        {view === 'bank' && (
                            <>
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Disponíveis no Banco (1.240)</span>
                                </div>

                                <ScrollArea className="h-[600px] pr-4 border rounded-2xl bg-muted/5">
                                    <div className="p-3 space-y-3">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="group p-4 bg-background border rounded-xl hover:border-primary/50 transition-colors shadow-sm">
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
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>

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
                            </>
                        )}

                        {view === 'notebook' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between px-1">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Modo de Visualização do Aluno</span>
                                        <p className="text-[10px] text-muted-foreground">Esta é a ordem e aparência final das questões.</p>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary border-primary/20">{selectedCount} Questões</Badge>
                                </div>

                                <ScrollArea className="h-[600px] pr-4">
                                    <div className="space-y-8 pb-12">
                                        {[1, 2].map((i) => (
                                            <Card key={i} className="border-none bg-background shadow-lg shadow-black/5 overflow-hidden rounded-2xl">
                                                <div className="p-6 space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                                {i}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Questão Q128374</span>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <p className="text-base font-medium leading-relaxed text-foreground/90">
                                                            De acordo com a Lei nº 8.112/1990, o servidor público que for demitido em razão de prática de improbidade administrativa ficará impedido de retornar ao serviço público federal pelo prazo de:
                                                        </p>
                                                        
                                                        <div className="space-y-3">
                                                            {['5 anos', '10 anos', '15 anos', 'Permanentemente', 'Indeterminadamente'].map((opt, idx) => (
                                                                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border bg-muted/5 hover:bg-muted/30 transition-all cursor-pointer group">
                                                                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center font-bold text-[10px] group-hover:border-primary transition-colors">
                                                                        {String.fromCharCode(65 + idx)}
                                                                    </div>
                                                                    <span className="text-sm">{opt}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </div>

                    {/* Barra Lateral: Selecionadas (Só aparece no Banco) */}
                    {view === 'bank' && (
                        <div className="lg:col-span-4 sticky top-4 space-y-4">
                            <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
                                <div className="flex items-center gap-2 text-primary">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Selecionadas</span>
                                </div>
                                <Badge className="bg-primary text-primary-foreground font-bold px-2">{selectedCount}</Badge>
                            </div>

                            <ScrollArea className="h-[540px] rounded-2xl border bg-muted/5 p-2">
                                <div className="space-y-2">
                                    {selectedCount > 0 ? (
                                        Array.from({ length: selectedCount }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-background border rounded-xl shadow-sm group">
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
                    )}
                </div>
            </CardContent>
        </Card>
    )
}