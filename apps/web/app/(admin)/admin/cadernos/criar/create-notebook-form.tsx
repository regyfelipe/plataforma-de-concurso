"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, CheckCircle2, ArrowRight, ArrowLeft, LayoutList, ListOrdered } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { createAdminNotebook, updateAdminNotebook } from "@/actions/admin-notebooks"
import { createAdminQuestion, type CreateAdminQuestionPayload } from "@/actions/admin-questions"
import { NotebookBasicInfo } from "@/components/admin/cadernos/notebook-basic-info"
import { NotebookQuestionPicker } from "@/components/admin/cadernos/notebook-question-picker"
import { NotebookResolutionSettings } from "@/components/admin/cadernos/notebook-resolution-settings"

type FilterOption = { label: string; value: string }

export interface NotebookQuestionTypeOption {
    id: string
    nome: string
    slug: string
    modelo: string | null
    quantidadeAlternativas: number | null
}

export interface NotebookQuestionOption {
    id: string
    code: string
    text: string
    supportText: string | null
    resolution: string | null
    board: string
    institution: string | null
    career: string | null
    subject: string | null
    topic: string | null
    year: number | null
    educationLevel: string
    discipline: string
    difficulty: string
    isUnique: boolean
    alternatives: {
        id: string
        letter: string
        text: string
        isCorrect: boolean
        explanation: string | null
    }[]
    isPending?: boolean
}

export interface PendingQuestion {
    tempId: string
    payload: CreateAdminQuestionPayload
}

export interface NotebookQuestionContext {
    concursoId: string
    concursoLabel: string
    disciplinaId: string
    disciplinaLabel: string
}

interface CreateNotebookFormProps {
    mode?: "create" | "edit"
    notebookId?: string
    initialValues?: Partial<NotebookFormState>
    initialSelectedQuestionIds?: string[]
    options: {
        concursos: FilterOption[]
        disciplinas: FilterOption[]
        tiposQuestao: NotebookQuestionTypeOption[]
    }
    questions: NotebookQuestionOption[]
}

export interface NotebookFormState {
    nome: string
    descricao: string
    concursoId: string
    disciplinaId: string
    disponivel: boolean
    destaqueHome: boolean
    pendingQuestions: PendingQuestion[]
    permitirComentarios: boolean
    permitirRanking: boolean
    modoResolucao: "study" | "simulated"
    exibirExplicacao: boolean
    embaralhar: boolean
    tempoLimite: string
    tags: string
    professor: string
    observacoes: string
}

const initialForm: NotebookFormState = {
    nome: "",
    descricao: "",
    concursoId: "",
    disciplinaId: "",
    disponivel: true,
    destaqueHome: false,
    pendingQuestions: [],
    permitirComentarios: true,
    permitirRanking: true,
    modoResolucao: "study",
    exibirExplicacao: true,
    embaralhar: false,
    tempoLimite: "",
    tags: "",
    professor: "",
    observacoes: "",
}

export function CreateNotebookForm({
    mode = "create",
    notebookId,
    initialValues,
    initialSelectedQuestionIds = [],
    options,
    questions,
}: CreateNotebookFormProps) {
    const router = useRouter()
    const [isWizardMode, setIsWizardMode] = React.useState(true)
    const [step, setStep] = React.useState(1)
    const [form, setForm] = React.useState<NotebookFormState>(() => ({
        ...initialForm,
        ...initialValues,
    }))
    const [availableQuestions, setAvailableQuestions] = React.useState<NotebookQuestionOption[]>(questions)
    const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<string[]>(initialSelectedQuestionIds)
    const [error, setError] = React.useState<string | null>(null)
    const [isPending, startTransition] = React.useTransition()
    const totalSteps = 3

    const updateField = <K extends keyof NotebookFormState>(field: K, value: NotebookFormState[K]) => {
        setError(null)
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))
    const optionLabel = (items: FilterOption[], value: string) =>
        items.find((item) => item.value === value)?.label ?? ""

    // Automação do Título do Caderno
    React.useEffect(() => {
        if (!form.concursoId || !form.disciplinaId) return

        const concursoLabel = optionLabel(options.concursos, form.concursoId)
        const disciplinaLabel = optionLabel(options.disciplinas, form.disciplinaId)

        if (concursoLabel && disciplinaLabel) {
            // Formato esperado: "Banca • Nome Ano • Cargo • Carreira"
            const parts = concursoLabel.split(" • ")
            const nomeAno = parts[1] || ""
            const cargo = parts[2] || "Geral"

            const autoTitle = `${nomeAno} • ${disciplinaLabel} • ${cargo}`
            
            // Só atualiza se o nome estiver vazio ou se parecer um nome gerado automaticamente
            // Para simplificar e atender o "Título do Caderno (automaticamente)", vamos sempre atualizar
            setForm(prev => ({ ...prev, nome: autoTitle }))
        }
    }, [form.concursoId, form.disciplinaId])
    const questionContext: NotebookQuestionContext = {
        concursoId: form.concursoId,
        concursoLabel: (() => {
            const label = optionLabel(options.concursos, form.concursoId)
            if (!label) return ""
            const parts = label.split(" • ")
            return parts[1] || label // Pega apenas o "Nome Ano"
        })(),
        disciplinaId: form.disciplinaId,
        disciplinaLabel: optionLabel(options.disciplinas, form.disciplinaId),
    }

    const buildNotebookPayload = (asDraft = false, questionIds = selectedQuestionIds) => ({
        nome: form.nome,
        descricao: form.descricao,
        concursoId: form.concursoId,
        disciplinaId: form.disciplinaId,
        visibilidade: asDraft ? "privado" : "publico",
        questionIds,
    } as const)

    const handleFinish = (asDraft = false) => {
        setError(null)

        startTransition(async () => {
            try {
                let finalQuestionIds = [...selectedQuestionIds]

                // 1. Salvar questões inéditas pendentes primeiro
                if (form.pendingQuestions.length > 0) {
                    const savedQuestions = await Promise.all(
                        form.pendingQuestions.map(async (pending) => {
                            const questao = await createAdminQuestion(pending.payload)
                            return { tempId: pending.tempId, realId: questao.id }
                        })
                    )

                    // Substituir IDs temporários pelos reais no array final
                    finalQuestionIds = finalQuestionIds.map(id => {
                        const saved = savedQuestions.find(s => s.tempId === id)
                        return saved ? saved.realId : id
                    })
                }

                const payload = buildNotebookPayload(asDraft, finalQuestionIds)

                if (mode === "edit" && notebookId) {
                    await updateAdminNotebook(notebookId, payload)
                } else {
                    await createAdminNotebook({
                        ...payload,
                        capaUrl: "",
                    })
                }

                router.push("/admin/cadernos")
                router.refresh()
            } catch (err) {
                setError(err instanceof Error ? err.message : "Não foi possível salvar o caderno.")
            }
        })
    }

    const title = isWizardMode
        ? step === 1
            ? "Informações Básicas"
            : step === 2
                ? "Seleção de Questões"
                : "Regras de Resolução"
        : "Visão Geral do Caderno"

    const description = isWizardMode
        ? step === 1
            ? "Defina a identidade do novo caderno oficial."
            : step === 2
                ? "Curadoria técnica do banco de questões."
                : "Defina o comportamento pedagógico do sistema."
        : "Edite todas as etapas do caderno em uma única página."

    const renderStepContent = (stepNumber: number) => {
        switch (stepNumber) {
            case 1:
                return (
                    <NotebookBasicInfo
                        values={form}
                        options={options}
                        onChange={updateField}
                    />
                )
            case 2:
                return (
                    <NotebookQuestionPicker
                        questions={[...availableQuestions, ...form.pendingQuestions.map(p => ({
                            id: p.tempId,
                            code: "PENDENTE",
                            text: p.payload.enunciado,
                            supportText: p.payload.textoApoio || null,
                            resolution: p.payload.resolucao || null,
                            board: "Inédita",
                            institution: p.payload.instituicao || null,
                            career: null,
                            subject: null,
                            topic: null,
                            year: p.payload.ano,
                            educationLevel: "Nível não informado",
                            discipline: "Pendente",
                            difficulty: "medio",
                            isUnique: true,
                            isPending: true,
                            alternatives: p.payload.alternativas.map((alt, idx) => ({
                                id: String(idx),
                                letter: alt.letter,
                                text: alt.text,
                                isCorrect: alt.isCorrect,
                                explanation: alt.explanation || null
                            }))
                        }))]}
                        context={questionContext}
                        questionTypes={options.tiposQuestao}
                        selectedQuestionIds={selectedQuestionIds}
                        onSelectedQuestionIdsChange={setSelectedQuestionIds}
                        onPendingQuestionCreated={(pending) => {
                            updateField("pendingQuestions", [...form.pendingQuestions, pending])
                            setSelectedQuestionIds(prev => [...prev, pending.tempId])
                        }}
                        onQuestionCreated={(question) => {
                            const nextQuestionIds = selectedQuestionIds.includes(question.id)
                                ? selectedQuestionIds
                                : [...selectedQuestionIds, question.id]

                            setAvailableQuestions((prev) => [question, ...prev.filter((item) => item.id !== question.id)])
                            setSelectedQuestionIds(nextQuestionIds)
                        }}
                    />
                )
            case 3:
                return (
                    <NotebookResolutionSettings
                        values={form}
                        onChange={updateField}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="relative min-h-screen bg-background pb-10 max-w-8xl mx-auto w-full">
            {/* Header Compacto */}
            <div className="p-8 pt-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] font-semibold">
                                {isWizardMode ? `Passo ${step}/${totalSteps}` : "Visão Geral"}
                            </Badge>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                        

                        {isWizardMode && (
                            <div className="flex gap-1.5">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'w-10 bg-primary' : 'w-4 bg-muted'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevStep}
                            disabled={!isWizardMode || step === 1 || isPending}
                            className="gap-2 h-9 text-xs font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Anterior
                        </Button>
                        <Separator orientation="vertical" className="hidden h-4 md:block" />
                        <span className="text-xs font-bold text-muted-foreground">
                            {isWizardMode ? `${Math.round((step / totalSteps) * 100)}% concluído` : "Página única"}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 text-xs font-semibold"
                            disabled={isPending}
                            onClick={() => handleFinish(true)}
                        >
                            <Save className="w-4 h-4" />
                            Rascunho
                        </Button>

                        {isWizardMode && step < totalSteps ? (
                            <Button
                                size="sm"
                                onClick={nextStep}
                                disabled={isPending}
                                className="h-9 px-6 gap-2 text-xs font-semibold"
                            >
                                Próximo
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleFinish()}
                                className="h-9 px-6 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 text-xs font-semibold"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {isPending ? "Salvando..." : mode === "edit" ? "Salvar Alterações" : "Finalizar"}
                            </Button>
                        )}

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9"
                            onClick={() => setIsWizardMode(!isWizardMode)}
                            title={isWizardMode ? "Ver página única" : "Voltar para o modo passo a passo"}
                        >
                            {isWizardMode ? (
                                <LayoutList className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            ) : (
                                <Eye className="w-4 h-4 text-primary" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="px-8">
                {isWizardMode ? (
                    renderStepContent(step)
                ) : (
                    <div className="space-y-8">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber}>{renderStepContent(stepNumber)}</div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
