"use client"

import * as React from "react"
import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { Search, Plus, X, Eye, CheckCircle2, ListFilter, MousePointer2, Landmark, BookOpen, Briefcase, Hash } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { QuestionStatementSection } from "../questions/create/question-statement-section"
import { QuestionAlternativesSection } from "../questions/create/question-alternatives-section"
import { QuestionResolutionSection } from "../questions/create/question-resolution-section"
import { QuestionAlternativeExplanationsSection } from "../questions/create/question-alternative-explanations-section"
import { QuestionMaterialsSection } from "../questions/create/question-materials-section"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { createAdminQuestion } from "@/actions/admin-questions"
import type { NotebookQuestionContext, NotebookQuestionOption, NotebookQuestionTypeOption } from "@/app/(admin)/admin/cadernos/criar/create-notebook-form"

interface DraftAlternative {
    id: string
    letter: string
    text: string
    isCorrect: boolean
    explanation?: string
}

interface NotebookQuestionPickerProps {
    questions: NotebookQuestionOption[]
    context: NotebookQuestionContext
    questionTypes: NotebookQuestionTypeOption[]
    selectedQuestionIds: string[]
    onSelectedQuestionIdsChange: React.Dispatch<React.SetStateAction<string[]>>
    onQuestionCreated: (question: NotebookQuestionOption) => void | Promise<void>
}

function buildAlternatives(type?: NotebookQuestionTypeOption): DraftAlternative[] {
    if (type?.modelo === "certo_errado") {
        return [
            { id: "c", letter: "C", text: "Certo", isCorrect: false, explanation: "" },
            { id: "e", letter: "E", text: "Errado", isCorrect: false, explanation: "" },
        ]
    }

    const quantity = Math.min(Math.max(type?.quantidadeAlternativas ?? 5, 2), 5)

    return Array.from({ length: quantity }, (_, index) => ({
        id: String(index + 1),
        letter: String.fromCharCode(65 + index),
        text: "",
        isCorrect: false,
        explanation: "",
    }))
}

export function NotebookQuestionPicker({
    questions,
    context,
    questionTypes,
    selectedQuestionIds,
    onSelectedQuestionIdsChange,
    onQuestionCreated,
}: NotebookQuestionPickerProps) {
    const [view, setView] = React.useState<'bank' | 'notebook'>('bank')
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const defaultQuestionType = questionTypes[0]
    const [questionTypeId, setQuestionTypeId] = React.useState(defaultQuestionType?.id ?? "")
    const [modalError, setModalError] = React.useState<string | null>(null)
    const [isPending, startTransition] = React.useTransition()
    const selectedQuestions = questions.filter((question) => selectedQuestionIds.includes(question.id))
    const selectedCount = selectedQuestionIds.length

    const toggleQuestion = (questionId: string) => {
        onSelectedQuestionIdsChange((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        )
    }

    const removeQuestion = (questionId: string) => {
        onSelectedQuestionIdsChange((prev) => prev.filter((id) => id !== questionId))
    }

    // Estados do Formulário de Criação Completo
    const [statement, setStatement] = React.useState({ supportText: "", commandText: "" })
    const [alternativas, setAlternativas] = React.useState<DraftAlternative[]>(() => buildAlternatives(defaultQuestionType))
    const [resolution, setResolution] = React.useState("")
    const [materials, setMaterials] = React.useState({ videoUrl: "", objetivo: "", referencia: "", dica: "" })
    const selectedYear = Number.parseInt(context.ano, 10)
    const selectedQuestionType = questionTypes.find((type) => type.id === questionTypeId)
    const selectedModel = selectedQuestionType?.modelo === "certo_errado" ? "certo_errado" : "multipla_escolha"

    const resetQuestionDraft = () => {
        setStatement({ supportText: "", commandText: "" })
        setResolution("")
        setMaterials({ videoUrl: "", objetivo: "", referencia: "", dica: "" })
        setQuestionTypeId(defaultQuestionType?.id ?? "")
        setAlternativas(buildAlternatives(defaultQuestionType))
    }

    const handleTypeChange = (value: string) => {
        const type = questionTypes.find((item) => item.id === value)

        setQuestionTypeId(value)
        setModalError(null)
        setAlternativas(buildAlternatives(type))
    }

    const handleCreateQuestion = () => {
        setModalError(null)

        startTransition(async () => {
            try {
                const questao = await createAdminQuestion({
                    disciplinaId: context.disciplinaId || null,
                    assuntoId: null,
                    topicoId: null,
                    subtopicoId: null,
                    bancaId: null,
                    concursoId: context.concursoId || null,
                    carreiraId: context.carreiraId || null,
                    nivelId: null,
                    dificuldadeId: context.dificuldadeId || null,
                    tipoId: questionTypeId || null,
                    instituicao: context.concursoLabel,
                    cargo: "",
                    ano: Number.isFinite(selectedYear) ? selectedYear : null,
                    isInedita: true,
                    enunciado: statement.commandText,
                    textoApoio: statement.supportText,
                    resolucao: resolution,
                    videoUrl: materials.videoUrl,
                    objetivo: materials.objetivo,
                    referencia: materials.referencia,
                    dica: materials.dica,
                    visibilidade: "publica",
                    status: "published",
                    alternativas: alternativas.map(({ letter, text, isCorrect, explanation }) => ({
                        letter,
                        text,
                        isCorrect,
                        explanation,
                        reference: "",
                        tip: "",
                    })),
                })

                await onQuestionCreated({
                    id: questao.id,
                    code: questao.code,
                    text: statement.commandText,
                    supportText: statement.supportText || null,
                    resolution: resolution || null,
                    board: "Inédita",
                    institution: context.concursoLabel || null,
                    career: context.carreiraLabel || null,
                    subject: null,
                    topic: null,
                    year: Number.isFinite(selectedYear) ? selectedYear : null,
                    educationLevel: "Nível não informado",
                    discipline: context.disciplinaLabel || "Sem disciplina",
                    difficulty: "medio",
                    isUnique: true,
                    alternatives: alternativas.map((alternativa) => ({
                        id: alternativa.id,
                        letter: alternativa.letter,
                        text: alternativa.text,
                        isCorrect: alternativa.isCorrect,
                        explanation: alternativa.explanation ?? null,
                    })),
                })
                resetQuestionDraft()
                setIsCreateOpen(false)
            } catch (error) {
                setModalError(error instanceof Error ? error.message : "Não foi possível criar a questão inédita.")
            }
        })
    }

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

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger
                                render={
                                    <Button className="h-9 rounded-xl gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-xs font-bold px-4">
                                        <Plus className="w-4 h-4" />
                                        Criar Inédita
                                    </Button>
                                }
                            />
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
                                                <span className="text-[10px] font-bold uppercase truncate">{context.disciplinaLabel || "Sem disciplina"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/20">
                                                <Briefcase className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold uppercase truncate">{context.carreiraLabel || "Sem carreira"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/20">
                                                <Landmark className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold uppercase truncate">{context.concursoLabel || "Sem concurso"}</span>
                                            </div>
                                        </div>

                                        {modalError && (
                                            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                                {modalError}
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="space-y-4">
                                            <FilterSelect 
                                                label="Modelo de Resposta"
                                                placeholder="Selecione o formato..."
                                                options={[
                                                    ...questionTypes.map((type) => ({
                                                        label: type.nome,
                                                        value: type.id,
                                                    })),
                                                ]}
                                                value={questionTypeId}
                                                onValueChange={handleTypeChange}
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
                                                alternativas={alternativas} 
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
                                                    if (alternativas.length >= 5) return
                                                    const nextLetter = String.fromCharCode(65 + alternativas.length)
                                                    setAlternativas(prev => [...prev, { id: Date.now().toString(), letter: nextLetter, text: "", isCorrect: false, explanation: "" }])
                                                }}
                                                disabled={selectedModel === "certo_errado" || alternativas.length >= 5}
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
                                            alternativas={alternativas}
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
                                    <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)} disabled={isPending}>Cancelar</Button>
                                    <Button size="sm" className="px-8 rounded-lg font-bold shadow-lg shadow-primary/20" onClick={handleCreateQuestion} disabled={isPending}>
                                        {isPending ? "Salvando..." : "Salvar e Adicionar"}
                                    </Button>
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
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Disponíveis no Banco ({questions.length})</span>
                                </div>

                                <ScrollArea className="h-[600px] pr-4 border rounded-2xl bg-muted/5">
                                    <div className="p-3 space-y-3">
                                        {questions.map((question) => {
                                            const isSelected = selectedQuestionIds.includes(question.id)

                                            return (
                                            <div key={question.id} className="group p-4 bg-background border rounded-xl hover:border-primary/50 transition-colors shadow-sm">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="font-mono text-[10px] h-5 px-2 bg-primary/5 text-primary border-primary/20">{question.code}</Badge>
                                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                                                                {question.board} • {question.year ?? "S/A"} • {question.educationLevel}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-foreground/90 leading-relaxed line-clamp-2">
                                                            {question.text}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 pt-1">
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>

                                                        <Button
                                                            size="icon"
                                                            variant={isSelected ? "secondary" : "default"}
                                                            className="h-8 w-8"
                                                            onClick={() => toggleQuestion(question.id)}
                                                        >
                                                            {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )})}

                                        {questions.length === 0 && (
                                            <div className="h-[240px] flex flex-col items-center justify-center text-center p-6 opacity-60">
                                                <ListFilter className="w-8 h-8 mb-3 text-muted-foreground" />
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Nenhuma questão publicada disponível</p>
                                            </div>
                                        )}
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
                                        {selectedQuestions.map((question, index) => (
                                            <Card key={question.id} className="overflow-hidden rounded-2xl border bg-background shadow-lg shadow-black/5">
                                                <div className="border-b bg-muted/20 p-5 space-y-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-3 min-w-0">
                                                            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                                {index + 1}
                                                            </div>
                                                            <div className="min-w-0 space-y-2">
                                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                                   
                                                                    <span className="text-[11px] font-semibold text-foreground/70">{question.discipline}</span>
                                                                    {question.subject && <span className="text-[11px] text-muted-foreground">/ {question.subject}</span>}
                                                                    {question.topic && <span className="text-[11px] text-muted-foreground">/ {question.topic}</span>}
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                   
                                                                    {question.institution && <span>{question.institution}</span>}
                                                                    
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                                            onClick={() => removeQuestion(question.id)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="p-6 space-y-6">
                                                    {question.supportText && (
                                                        <div className="rounded-xl border bg-muted/10 p-4 space-y-2">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Texto de Apoio</p>
                                                            <div
                                                                className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/80"
                                                                dangerouslySetInnerHTML={{ __html: question.supportText }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div
                                                        className="prose dark:prose-invert max-w-none text-base font-semibold leading-relaxed text-foreground/90"
                                                        dangerouslySetInnerHTML={{ __html: question.text }}
                                                    />

                                                    <div className="space-y-3">
                                                        {question.alternatives.length > 0 ? (
                                                            question.alternatives.map((alternative) => (
                                                                <div key={alternative.id} className="flex items-start gap-3 rounded-xl border bg-muted/5 p-4">
                                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border bg-background text-xs font-bold text-muted-foreground">
                                                                        {alternative.letter}
                                                                    </div>
                                                                    <div
                                                                        className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/80"
                                                                        dangerouslySetInnerHTML={{ __html: alternative.text }}
                                                                    />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="rounded-xl border border-dashed bg-muted/5 p-4 text-sm text-muted-foreground">
                                                                Alternativas não cadastradas para esta questão.
                                                            </div>
                                                        )}
                                                    </div>

                                                    {question.resolution && (
                                                        <div className="rounded-xl border bg-emerald-500/5 p-4 space-y-2">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Resolução</p>
                                                            <div
                                                                className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/80"
                                                                dangerouslySetInnerHTML={{ __html: question.resolution }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}

                                        {selectedQuestions.length === 0 && (
                                            <div className="h-[240px] flex flex-col items-center justify-center text-center p-6 opacity-50 border rounded-2xl bg-muted/5">
                                                <MousePointer2 className="w-8 h-8 mb-3 text-muted-foreground" />
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Selecione questões no banco</p>
                                            </div>
                                        )}
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
                                        selectedQuestions.map((question) => (
                                            <div key={question.id} className="flex items-center gap-3 p-3 bg-background border rounded-xl shadow-sm group">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-foreground">{question.code}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate uppercase font-medium">{question.discipline}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeQuestion(question.id)}
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
