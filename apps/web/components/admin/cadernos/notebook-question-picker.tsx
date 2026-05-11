"use client"

import * as React from "react"
import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { Search, Plus, X, Eye, CheckCircle2, ListFilter, MousePointer2, LayoutList, RefreshCcw, ArrowRight } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { QuestionStatementSection } from "../questions/create/question-statement-section"
import { QuestionAlternativesSection } from "../questions/create/question-alternatives-section"
import { QuestionResolutionSection } from "../questions/create/question-resolution-section"
import { QuestionAlternativeExplanationsSection } from "../questions/create/question-alternative-explanations-section"
import { QuestionMaterialsSection } from "../questions/create/question-materials-section"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import type { CreateQuestionPayload } from "@/actions/admin-questions"
import type { NotebookQuestionContext, NotebookQuestionOption, NotebookQuestionTypeOption, PendingQuestion } from "@/app/(admin)/admin/cadernos/criar/create-notebook-form"
import { QuestionPreview } from "./question-preview"
import { sanitizeHtml } from "@/lib/sanitize-html"

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
    onPendingQuestionCreated: (pending: PendingQuestion) => void
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
    onPendingQuestionCreated,
}: NotebookQuestionPickerProps) {
    const [view, setView] = React.useState<'bank' | 'notebook' | 'production'>('production')
    const defaultQuestionType = questionTypes[0]
    const [questionTypeId, setQuestionTypeId] = React.useState(defaultQuestionType?.id ?? "")
    const [modalError, setModalError] = React.useState<string | null>(null)
    const isPending = false
    
    // Estados do Formulário de Criação Completo
    const [statement, setStatement] = React.useState({ supportText: "", commandText: "" })
    const [alternativas, setAlternativas] = React.useState<DraftAlternative[]>(() => buildAlternatives(defaultQuestionType))
    const [resolution, setResolution] = React.useState("")
    const [materials, setMaterials] = React.useState({ videoUrl: "", objetivo: "", referencia: "", dica: "" })

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

    const selectedQuestionType = questionTypes.find((type) => type.id === questionTypeId)
    const selectedModel = selectedQuestionType?.modelo === "certo_errado" ? "certo_errado" : "multipla_escolha"

    const resetQuestionDraft = React.useCallback(() => {
        setStatement({ supportText: "", commandText: "" })
        setResolution("")
        setMaterials({ videoUrl: "", objetivo: "", referencia: "", dica: "" })
        setQuestionTypeId(defaultQuestionType?.id ?? "")
        setAlternativas(buildAlternatives(defaultQuestionType))
    }, [defaultQuestionType])

    const handleTypeChange = (value: string) => {
        const type = questionTypes.find((item) => item.id === value)
        setQuestionTypeId(value)
        setModalError(null)
        setAlternativas(buildAlternatives(type))
    }

    const handleCreateQuestion = React.useCallback((shouldReset = true) => {
        setModalError(null)

        try {
            const tempId = `temp_${Date.now()}`
            const payload: CreateQuestionPayload = {
                disciplinaId: context.disciplinaId || null,
                assuntoId: null,
                topicoId: null,
                subtopicoId: null,
                bancaId: null,
                concursoId: context.concursoId || null,
                carreiraId: null,
                nivelId: null,
                dificuldadeId: null,
                tipoId: questionTypeId || null,
                instituicao: context.concursoLabel,
                cargo: "",
                ano: null,
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
            }

            onPendingQuestionCreated({
                tempId,
                payload,
            })

            if (shouldReset) {
                resetQuestionDraft()
            }
        } catch (error) {
            setModalError(error instanceof Error ? error.message : "Não foi possível preparar a questão inédita.")
        }
    }, [alternativas, context.concursoId, context.concursoLabel, context.disciplinaId, materials.dica, materials.objetivo, materials.referencia, materials.videoUrl, onPendingQuestionCreated, questionTypeId, resetQuestionDraft, resolution, statement.commandText, statement.supportText])

    // Atalho Ctrl + Enter para salvar
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "Enter" && view === "production") {
                handleCreateQuestion()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [view, handleCreateQuestion])

    return (
        <Card>
            <CardContent className="space-y-6 pt-6">
                {/* Navegação de Visão */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex bg-muted/50 p-1 rounded-xl border">
                            <Button 
                                variant={view === 'production' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setView('production')}
                                className={`rounded-lg gap-2 text-xs font-bold ${view === 'production' ? 'shadow-lg shadow-primary/20' : ''}`}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Produção Contínua
                            </Button>
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

                        <div className="hidden md:flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-dashed">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Herdando:</span>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-background">{context.concursoLabel || "Geral"}</Badge>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-background">{context.disciplinaLabel}</Badge>
                        </div>
                    </div>

                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Busca rápida..."
                            className="pl-10 h-9 bg-muted/20 border-none rounded-xl text-xs"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {view === 'production' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="overflow-hidden border-2 border-primary/10 shadow-xl shadow-primary/5">
                                    <div className="bg-primary/5 p-4 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold">Questão #{questions.filter(q => q.isPending).length + 1}</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Nova Questão Inédita</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="w-[200px]">
                                                <FilterSelect 
                                                    label=""
                                                    placeholder="Formato..."
                                                    isMulti={false}
                                                    options={questionTypes.map((type) => ({
                                                        label: type.nome,
                                                        value: type.id,
                                                    }))}
                                                    value={questionTypeId}
                                                    onValueChange={handleTypeChange}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-dashed border-primary/20">
                                                <Badge variant="outline" className="text-[10px] font-mono bg-muted/50 border-primary/20">CTRL + ENTER</Badge>
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Salvar e Próxima</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4 max-h-[700px] overflow-y-auto">
                                        {modalError && (
                                            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                                {modalError}
                                            </div>
                                        )}

                                        <QuestionStatementSection 
                                            supportText={statement.supportText}
                                            commandText={statement.commandText}
                                            onSupportChange={(val) => setStatement(prev => ({ ...prev, supportText: val }))}
                                            onCommandChange={(val) => setStatement(prev => ({ ...prev, commandText: val }))}
                                        />



                                        <div className="space-y-4">
                                            <QuestionAlternativesSection 
                                                alternativas={alternativas} 
                                                onToggleCorrect={(id) => setAlternativas(prev => prev.map(alt => ({ ...alt, isCorrect: alt.id === id })))}
                                                onChangeText={(id, text) => setAlternativas(prev => prev.map(alt => alt.id === id ? { ...alt, text } : alt))}
                                                onRemove={(id) => setAlternativas(prev => prev.filter(alt => alt.id !== id))}
                                                canRemove={alternativas.length > 2}
                                            />
                                            {selectedModel === "multipla_escolha" && alternativas.length < 5 && (
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
                                            )}
                                        </div>


                                        <QuestionResolutionSection
                                            resolution={resolution}
                                            onResolutionChange={setResolution}
                                        />

                                        <details className="group border rounded-xl overflow-hidden">
                                            <summary className="flex items-center justify-between p-4 cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors list-none">
                                                <div className="flex items-center gap-2">
                                                    <LayoutList className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Configurações Avançadas</span>
                                                </div>
                                                <Plus className="w-4 h-4 transition-transform group-open:rotate-45" />
                                            </summary>
                                            <div className="p-6 border-t space-y-6">
                                                <QuestionAlternativeExplanationsSection 
                                                    alternativas={alternativas}
                                                    onChangeData={(id, value) => setAlternativas(prev => prev.map(alt => alt.id === id ? { ...alt, explanation: value } : alt))}
                                                />
                                                <Separator />
                                                <QuestionMaterialsSection
                                                    values={materials}
                                                    onFieldChange={(field, value) => setMaterials(prev => ({ ...prev, [field]: value }))}
                                                />
                                            </div>
                                        </details>
                                    </div>

                                    <div className="p-4 border-t bg-muted/30 flex items-center justify-between px-6">
                                        <p className="text-[10px] text-muted-foreground font-bold italic">As questões inéditas serão salvas ao finalizar o caderno.</p>
                                        <div className="flex items-center gap-3">
                                            <Button 
                                                variant="outline"
                                                size="sm" 
                                                className="px-6 rounded-lg font-bold border-primary/20 text-primary hover:bg-primary/5" 
                                                onClick={() => handleCreateQuestion(false)} 
                                                disabled={isPending}
                                                title="Salva esta e mantém os textos para a próxima"
                                            >
                                                <RefreshCcw className="w-4 h-4 mr-2" />
                                                Salvar e Duplicar
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                className="px-8 rounded-lg font-bold shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95" 
                                                onClick={() => handleCreateQuestion(true)} 
                                                disabled={isPending}
                                            >
                                                {isPending ? "Processando..." : "Salvar e Próxima"}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

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
                                                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.supportText) }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div
                                                        className="prose dark:prose-invert max-w-none text-base font-semibold leading-relaxed text-foreground/90"
                                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.text) }}
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
                                                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(alternative.text) }}
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
                                                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.resolution) }}
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

                    {/* Barra Lateral Dinâmica */}
                    <div className="lg:col-span-4 sticky top-4 space-y-4">
                        {view === 'production' ? (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <QuestionPreview 
                                    supportText={statement.supportText}
                                    commandText={statement.commandText}
                                    alternativas={alternativas}
                                    concursoLabel={context.concursoLabel}
                                    disciplinaLabel={context.disciplinaLabel}
                                />
                            </div>
                        ) : view === 'bank' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
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
                                                        <p className="text-xs font-bold text-foreground">
                                                            {question.isPending ? `Questão #${questions.filter(q => q.isPending).indexOf(question) + 1}` : question.code}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            {question.isPending && <Badge variant="outline" className="text-[8px] h-3 px-1 bg-primary/10 text-primary border-primary/20 uppercase font-bold">Inédita</Badge>}
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
                </div>
            </CardContent>
        </Card>
    )
}
