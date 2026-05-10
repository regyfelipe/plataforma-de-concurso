"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, CheckCircle2, ArrowRight, ArrowLeft, LayoutList, ListOrdered } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { createAdminNotebook, updateAdminNotebook } from "@/actions/admin-notebooks"
import { NotebookBasicInfo } from "@/components/admin/cadernos/notebook-basic-info"
import { NotebookAccessSettings } from "@/components/admin/cadernos/notebook-access-settings"
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
}

export interface NotebookQuestionContext {
    carreiraId: string
    carreiraLabel: string
    concursoId: string
    concursoLabel: string
    disciplinaId: string
    disciplinaLabel: string
    dificuldadeId: string
    ano: string
}

interface CreateNotebookFormProps {
    mode?: "create" | "edit"
    notebookId?: string
    initialValues?: Partial<NotebookFormState>
    initialSelectedQuestionIds?: string[]
    options: {
        carreiras: FilterOption[]
        concursos: FilterOption[]
        disciplinas: FilterOption[]
        dificuldades: FilterOption[]
        tiposQuestao: NotebookQuestionTypeOption[]
    }
    questions: NotebookQuestionOption[]
}

export interface NotebookFormState {
    nome: string
    descricao: string
    carreiraId: string
    concursoId: string
    disciplinaId: string
    dificuldade: string
    ano: string
    disponivel: boolean
    destaqueHome: boolean
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
    carreiraId: "",
    concursoId: "",
    disciplinaId: "",
    dificuldade: "",
    ano: String(new Date().getFullYear()),
    disponivel: true,
    destaqueHome: false,
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
    const [isWizardMode, setIsWizardMode] = React.useState(false)
    const [step, setStep] = React.useState(1)
    const [form, setForm] = React.useState<NotebookFormState>(() => ({
        ...initialForm,
        ...initialValues,
    }))
    const [availableQuestions, setAvailableQuestions] = React.useState<NotebookQuestionOption[]>(questions)
    const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<string[]>(initialSelectedQuestionIds)
    const [error, setError] = React.useState<string | null>(null)
    const [isPending, startTransition] = React.useTransition()
    const totalSteps = 4

    const updateField = <K extends keyof NotebookFormState>(field: K, value: NotebookFormState[K]) => {
        setError(null)
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))
    const anoReferencia = Number.parseInt(form.ano, 10)
    const optionLabel = (items: FilterOption[], value: string) =>
        items.find((item) => item.value === value)?.label ?? ""
    const questionContext: NotebookQuestionContext = {
        carreiraId: form.carreiraId,
        carreiraLabel: optionLabel(options.carreiras, form.carreiraId),
        concursoId: form.concursoId,
        concursoLabel: optionLabel(options.concursos, form.concursoId),
        disciplinaId: form.disciplinaId,
        disciplinaLabel: optionLabel(options.disciplinas, form.disciplinaId),
        dificuldadeId: form.dificuldade,
        ano: form.ano,
    }

    const buildNotebookPayload = (asDraft = false, questionIds = selectedQuestionIds) => ({
        nome: form.nome,
        descricao: form.descricao,
        carreiraId: form.carreiraId,
        concursoId: form.concursoId,
        disciplinaId: form.disciplinaId,
        dificuldadeId: form.dificuldade,
        anoReferencia: Number.isFinite(anoReferencia) ? anoReferencia : null,
        visibilidade: asDraft ? "privado" : "publico",
        questionIds,
    } as const)

    const handleFinish = (asDraft = false) => {
        setError(null)

        startTransition(async () => {
            try {
                const payload = buildNotebookPayload(asDraft)

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
                ? "Configurações de Acesso"
                : step === 3
                    ? "Seleção de Questões"
                    : "Regras de Resolução"
        : "Visão Geral do Caderno"

    const description = isWizardMode
        ? step === 1
            ? "Defina a identidade do novo caderno oficial."
            : step === 2
                ? "Configure visibilidade e engajamento."
                : step === 3
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
                    <NotebookAccessSettings
                        values={form}
                        onChange={updateField}
                    />
                )
            case 3:
                return (
                    <NotebookQuestionPicker
                        questions={availableQuestions}
                        context={questionContext}
                        questionTypes={options.tiposQuestao}
                        selectedQuestionIds={selectedQuestionIds}
                        onSelectedQuestionIdsChange={setSelectedQuestionIds}
                        onQuestionCreated={async (question) => {
                            const nextQuestionIds = selectedQuestionIds.includes(question.id)
                                ? selectedQuestionIds
                                : [...selectedQuestionIds, question.id]

                            setAvailableQuestions((prev) => [question, ...prev.filter((item) => item.id !== question.id)])
                            setSelectedQuestionIds(nextQuestionIds)

                            if (mode === "edit" && notebookId) {
                                await updateAdminNotebook(notebookId, buildNotebookPayload(false, nextQuestionIds))
                                router.refresh()
                            }
                        }}
                    />
                )
            case 4:
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
        <div className="relative min-h-screen bg-background pb-10 max-w-7xl mx-auto w-full">
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
                        <div className="flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
                            <Button
                                variant={!isWizardMode ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setIsWizardMode(false)}
                                className="h-8 gap-2 rounded-lg text-xs font-semibold"
                            >
                                <LayoutList className="h-3.5 w-3.5" />
                                Visão Geral
                            </Button>
                            <Button
                                variant={isWizardMode ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setIsWizardMode(true)}
                                className="h-8 gap-2 rounded-lg text-xs font-semibold"
                            >
                                <ListOrdered className="h-3.5 w-3.5" />
                                Passo a Passo
                            </Button>
                        </div>

                        {isWizardMode && (
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4].map((s) => (
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

                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
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
                        {[1, 2, 3, 4].map((stepNumber) => (
                            <div key={stepNumber}>{renderStepContent(stepNumber)}</div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
