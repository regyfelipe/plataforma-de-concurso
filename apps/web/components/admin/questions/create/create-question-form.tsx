"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, ChevronLeft, ChevronRight, LayoutList, ListOrdered } from "lucide-react"
import { Progress } from "@workspace/ui/components/progress"
import { Button } from "@workspace/ui/components/button"
import { createAdminQuestion, updateAdminQuestion } from "@/actions/admin-questions"
import { QuestionFormActions } from "./question-form-actions"
import { QuestionClassificationSection, type QuestionTaxonomyOptions } from "./question-classification-section"
import { QuestionStatementSection } from "./question-statement-section"
import { QuestionAlternativesSection } from "./question-alternatives-section"
import { QuestionResolutionSection } from "./question-resolution-section"
import { QuestionAlternativeExplanationsSection } from "./question-alternative-explanations-section"
import { QuestionMaterialsSection } from "./question-materials-section"
import { QuestionSettingsPanel } from "./question-settings-panel"
import { QuestionPreviewPanel } from "./question-preview-panel"
import { QuestionPreviewModal } from "./question-preview-modal"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"

interface CreateQuestionFormProps {
    taxonomy: QuestionTaxonomyOptions
    initialData?: {
        id: string
        disciplinaId?: string | null
        assuntoId?: string | null
        topicoId?: string | null
        subtopicoId?: string | null
        bancaId?: string | null
        concursoId?: string | null
        carreiraId?: string | null
        nivelId?: string | null
        dificuldadeId?: string | null
        tipoId?: string | null
        cargo?: string | null
        ano?: number | null
        isInedita: boolean
        enunciado: string
        textoApoio?: string | null
        resolucao?: string | null
        videoUrl?: string | null
        objetivo?: string | null
        referencia?: string | null
        dica?: string | null
        visibilidade: "publica" | "privada" | "restrita"
        status: "draft" | "published"
        alternativas: {
            letter: string
            text: string
            isCorrect: boolean
            explanation?: string | null
            reference?: string | null
            tip?: string | null
        }[]
    }
}

export function CreateQuestionForm({ taxonomy, initialData }: CreateQuestionFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const isEditing = Boolean(initialData?.id)
    const [isWizardMode, setIsWizardMode] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    
    // Estados do Formulário
    const [classification, setClassification] = useState<Record<string, string>>({
        type: initialData?.tipoId ? (taxonomy.tiposQuestao.find(t => t.id === initialData.tipoId)?.slug || "multipla_escolha") : "multipla_escolha",
        tipoId: initialData?.tipoId || "",
        disciplinaId: initialData?.disciplinaId || "",
        assuntoId: initialData?.assuntoId || "",
        topicoId: initialData?.topicoId || "",
        subtopicoId: initialData?.subtopicoId || "",
        bancaId: initialData?.bancaId || "",
        concursoId: initialData?.concursoId || "",
        cargo: initialData?.cargo || "",
        carreiraId: initialData?.carreiraId || "",
        nivelId: initialData?.nivelId || "",
        dificuldadeId: initialData?.dificuldadeId || "",
        year: initialData?.ano ? String(initialData.ano) : String(new Date().getFullYear()),
        isUnique: initialData?.isInedita ? "sim" : "nao",
    })
    
    const [statement, setStatement] = useState({
        supportText: initialData?.textoApoio || "",
        commandText: initialData?.enunciado || ""
    })

    const [resolution, setResolution] = useState(initialData?.resolucao || "")
    const [materials, setMaterials] = useState<Record<string, string>>({
        videoUrl: initialData?.videoUrl || "",
        objetivo: initialData?.objetivo || "",
        referencia: initialData?.referencia || "",
        dica: initialData?.dica || "",
    })
    const [settings, setSettings] = useState({
        isPublic: initialData?.visibilidade === "publica",
        allowComments: true,
        reviewMode: false,
    })

    const [alternativas, setAlternativas] = useState(
        initialData?.alternativas?.map((alt, i) => ({
            id: String(i + 1),
            letter: alt.letter,
            text: alt.text,
            isCorrect: alt.isCorrect,
            explanation: alt.explanation || "",
            reference: alt.reference || "",
            tip: alt.tip || ""
        })) || [
            { id: "1", letter: "A", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
            { id: "2", letter: "B", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
            { id: "3", letter: "C", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
        ]
    )


    const totalSteps = 7

    const handleFieldChange = (field: string, value: string) => {
        setFormError(null)
        setClassification(prev => {
            const next = { ...prev, [field]: value }

            if (field === "disciplinaId") {
                next.assuntoId = ""
                next.topicoId = ""
                next.subtopicoId = ""
            }

            if (field === "assuntoId") {
                next.topicoId = ""
                next.subtopicoId = ""
            }

            if (field === "topicoId") {
                next.subtopicoId = ""
            }

            return next
        })
        if (field === 'type') handleTypeChange(value)
    }

    const handleTypeChange = (typeSlug: string) => {
        const typeConfig = taxonomy.tiposQuestao.find(t => t.slug === typeSlug)
        
        if (!typeConfig) return

        if (typeConfig.modelo === "certo_errado") {
            setAlternativas([
                { id: "c", letter: "C", text: "Certo", isCorrect: false, explanation: "", reference: "", tip: "" },
                { id: "e", letter: "E", text: "Errado", isCorrect: false, explanation: "", reference: "", tip: "" },
            ])
        } else {
            const qty = typeConfig.quantidadeAlternativas || 5
            const newAlts = Array.from({ length: qty }, (_, i) => ({
                id: (i + 1).toString(),
                letter: String.fromCharCode(65 + i), // A, B, C, D, E
                text: "",
                isCorrect: false,
                explanation: "",
                reference: "",
                tip: ""
            }))
            setAlternativas(newAlts)
        }
    }

    const handleToggleCorrect = (id: string) => {
        setAlternativas(prev => prev.map(alt => ({
            ...alt,
            isCorrect: alt.id === id
        })))
    }

    const handleTextChange = (id: string, text: string) => {
        setAlternativas(prev => prev.map(alt => 
            alt.id === id ? { ...alt, text } : alt
        ))
    }

    const handleAlternativeDataChange = (id: string, value: string) => {
        setAlternativas(prev => prev.map(alt => 
            alt.id === id ? { ...alt, explanation: value } : alt
        ))
    }

    const handleRemoveAlternative = (id: string) => {
        if ((classification.type ?? "").replaceAll("-", "_") === "multipla_escolha" && alternativas.length <= 3) {
            return
        }
        setAlternativas(prev => {
            const filtered = prev.filter(alt => alt.id !== id)
            return filtered.map((alt, index) => ({
                ...alt,
                letter: String.fromCharCode(65 + index)
            }))
        })
    }

    const handleAddAlternative = () => {
        if (alternativas.length >= 5) {
            return
        }
        const nextLetter = String.fromCharCode(65 + alternativas.length) // A, B, C...
        setAlternativas(prev => [
            ...prev,
            { id: Date.now().toString(), letter: nextLetter, text: "", isCorrect: false, explanation: "", reference: "", tip: "" }
        ])
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const labels = useMemo(() => {
        const find = (items: { id: string; nome: string }[], id?: string) =>
            items.find((item) => item.id === id)?.nome ?? ""

        return {
            discipline: find(taxonomy.disciplinas, classification.disciplinaId),
            subject: find(taxonomy.assuntos, classification.assuntoId),
            topic: find(taxonomy.topicos, classification.topicoId),
            board: taxonomy.bancas.find((banca) => banca.id === classification.bancaId)?.sigla ?? "",
            institution: taxonomy.concursos.find((concurso) => concurso.id === classification.concursoId)?.nome ?? "",
            career: find(taxonomy.carreiras, classification.carreiraId),
            educationLevel: find(taxonomy.niveis, classification.nivelId),
            difficulty: taxonomy.dificuldades.find((difficulty) => difficulty.id === classification.dificuldadeId)?.slug ?? "medio",
        }
    }, [classification, taxonomy])

    const buildPayload = (status: "draft" | "published") => ({
        disciplinaId: classification.disciplinaId || null,
        assuntoId: classification.assuntoId || null,
        topicoId: classification.topicoId || null,
        subtopicoId: classification.subtopicoId || null,
        bancaId: classification.bancaId || null,
        concursoId: classification.concursoId || null,
        cargo: classification.cargo || undefined,
        carreiraId: classification.carreiraId || null,
        nivelId: classification.nivelId || null,
        dificuldadeId: classification.dificuldadeId || null,
        tipoId: classification.tipoId || null,
        instituicao: labels.institution,
        ano: classification.year ? Number(classification.year) : null,
        isInedita: classification.isUnique === "sim",
        enunciado: statement.commandText,
        textoApoio: statement.supportText,
        resolucao: resolution,
        videoUrl: materials.videoUrl,
        objetivo: materials.objetivo,
        referencia: materials.referencia,
        dica: materials.dica,
        visibilidade: (settings.isPublic ? "publica" : "privada") as "publica" | "privada",
        status,
        alternativas: alternativas.map(({ letter, text, isCorrect, explanation, reference, tip }) => ({
            letter,
            text,
            isCorrect,
            explanation,
            reference,
            tip,
        })),
    })

    const handleSubmit = (status: "draft" | "published") => {
        setFormError(null)

        startTransition(async () => {
            try {
                if (initialData?.id) {
                    await updateAdminQuestion(initialData.id, buildPayload(status))
                    toast.success(status === 'published' ? "Questão atualizada com sucesso!" : "Rascunho atualizado com sucesso!")
                    router.push("/admin/questoes")
                    router.refresh()
                } else {
                    await createAdminQuestion(buildPayload(status))
                    
                    if (status === 'published') {
                        setShowSuccessModal(true)
                    } else {
                        toast.success("Rascunho salvo com sucesso!")
                        router.push("/admin/questoes")
                        router.refresh()
                    }
                }
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : "Não foi possível salvar a questão."
                setFormError(message)
            }
        })
    }

    const handleResetForm = (keepClassification: boolean) => {
        // Limpar campos de conteúdo (sempre limpa)
        setStatement({ supportText: "", commandText: "" })
        setResolution("")
        setMaterials({ videoUrl: "", objetivo: "", referencia: "", dica: "" })
        setAlternativas([
            { id: "1", letter: "A", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
            { id: "2", letter: "B", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
            { id: "3", letter: "C", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
            { id: "4", letter: "D", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
            { id: "5", letter: "E", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
        ])

        if (!keepClassification) {
            setClassification({
                type: "multipla_escolha",
                tipoId: "",
                disciplinaId: "",
                assuntoId: "",
                topicoId: "",
                subtopicoId: "",
                bancaId: "",
                concursoId: "",
                cargo: "",
                carreiraId: "",
                nivelId: "",
                dificuldadeId: "",
                year: String(new Date().getFullYear()),
                isUnique: "nao",
            })
        }
        
        setShowSuccessModal(false)
        setCurrentStep(1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        toast.success("Pronto! Vamos para a próxima.")
    }

    // Mapeamento para o QuestionCard
    const getQuestionPreviewData = () => ({
        code: "PREVIEW-001",
        discipline: labels.discipline || "Disciplina não selecionada",
        subject: labels.subject,
        topic: labels.topic,
        board: labels.board,
        institution: labels.institution,
        career: labels.career,
        educationLevel: labels.educationLevel,
        year: classification.year,
        difficulty: labels.difficulty,
        supportText: statement.supportText,
        questionText: statement.commandText || "Enunciado não preenchido",
        resolution,
        objectives: materials.objetivo ? [materials.objetivo] : [],
        references: materials.referencia ? [materials.referencia] : [],
        videos: materials.videoUrl ? [{ title: "Videoaula", url: materials.videoUrl }] : [],
        alternatives: alternativas,
        isUnique: classification.isUnique === 'sim'
    })

    const renderStep = (stepNumber: number) => {
        switch (stepNumber) {
            case 1: return (
                <QuestionClassificationSection 
                    values={classification} 
                    taxonomy={taxonomy}
                    onFieldChange={handleFieldChange} 
                />
            )
            case 2: return (
                <QuestionStatementSection 
                    supportText={statement.supportText}
                    commandText={statement.commandText}
                    onSupportChange={(val) => setStatement(prev => ({ ...prev, supportText: val }))}
                    onCommandChange={(val) => setStatement(prev => ({ ...prev, commandText: val }))}
                />
            )
            case 3: return (
                <div className="space-y-4">
                    <QuestionAlternativesSection 
                        alternativas={alternativas} 
                        onToggleCorrect={handleToggleCorrect}
                        onChangeText={handleTextChange}
                        onRemove={handleRemoveAlternative}
                        canRemove={(classification.type ?? "").replaceAll("-", "_") === "multipla_escolha" && alternativas.length > 3}
                    />
                    {(classification.type ?? "").replaceAll("-", "_") === "multipla_escolha" && alternativas.length < 5 && (
                        <div className="flex justify-center -mt-2">
                            <Button 
                                type="button"
                                variant="outline" 
                                size="sm" 
                                onClick={handleAddAlternative}
                               
                                className="border-dashed"
                            >
                                <Plus className="mr-2 h-3 w-3" /> Adicionar Alternativa
                            </Button>
                        </div>
                    )}
                </div>
            )
            case 4: return (
                <QuestionResolutionSection
                    resolution={resolution}
                    onResolutionChange={setResolution}
                />
            )
            case 5: return (
                <QuestionAlternativeExplanationsSection 
                    alternativas={alternativas}
                    onChangeData={handleAlternativeDataChange}
                />
            )
            case 6: return (
                <QuestionMaterialsSection
                    values={materials}
                    onFieldChange={(field, value) => setMaterials(prev => ({ ...prev, [field]: value }))}
                />
            )
            case 7: return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <QuestionPreviewPanel 
                            onPublish={() => handleSubmit('published')}
                            isSubmitting={isPending}
                            isEditing={isEditing}
                        />
                    </div>
                    <div>
                        <QuestionSettingsPanel
                            values={settings}
                            onFieldChange={(field, value) => setSettings(prev => ({ ...prev, [field]: value }))}
                        />
                    </div>
                </div>
            )
            default: return null
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
            <QuestionFormActions
                onPreview={() => setIsPreviewOpen(true)}
                onSaveDraft={() => handleSubmit("draft")}
                onPublish={() => handleSubmit("published")}
                isSubmitting={isPending}
                isEditing={isEditing}
            />

            <div className="max-w-6xl mx-auto pb-20 px-4">
                {formError && (
                    <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {formError}
                    </div>
                )}

                {/* Seletor de Modo e Progresso */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={!isWizardMode ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setIsWizardMode(false)}
                        >
                            <LayoutList className="mr-2 h-3.5 w-3.5" /> Visão Geral
                        </Button>
                        <Button
                            variant={isWizardMode ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setIsWizardMode(true)}
                        >
                            <ListOrdered className="mr-2 h-3.5 w-3.5" /> Passo a Passo
                        </Button>
                    </div>

                    {isWizardMode && (
                        <div className="flex items-center gap-3 flex-1 max-w-md">
                            <Progress value={(currentStep / totalSteps) * 100} className="flex-1 h-1.5" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                Etapa {currentStep} de {totalSteps}
                            </span>
                        </div>
                    )}
                </div>

                {/* Área de Conteúdo */}
                <div className="min-h-[400px]">
                    {!isWizardMode ? (
                        <div className="space-y-8">
                            {[1, 2, 3, 4, 5, 6, 7].map(step => (
                                <div key={step}>{renderStep(step)}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {renderStep(currentStep)}
                            
                            {/* Navegação do Wizard */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                                </Button>

                                {currentStep < totalSteps ? (
                                    <Button size="sm" onClick={nextStep}>
                                        Próxima Etapa <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        disabled={isPending}
                                        onClick={() => handleSubmit("published")}
                                    >
                                        {isEditing ? "Finalizar Edição" : "Finalizar e Publicar"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <QuestionPreviewModal 
                open={isPreviewOpen} 
                onOpenChange={setIsPreviewOpen} 
                questionData={getQuestionPreviewData()} 
            />

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            Questão Publicada!
                        </DialogTitle>
                        <DialogDescription>
                            O que você deseja fazer agora?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-4">
                        <Button 
                            variant="default" 
                            className="justify-start gap-3 h-12 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleResetForm(true)}
                        >
                            <LayoutList className="w-4 h-4" />
                            Continuar nesta Classificação
                            <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded">Recomendado</span>
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            className="justify-start gap-3 h-12"
                            onClick={() => handleResetForm(false)}
                        >
                            <Plus className="w-4 h-4" />
                            Criar Nova (Limpar Tudo)
                        </Button>

                        <Button 
                            variant="ghost" 
                            className="justify-start gap-3 h-12 text-muted-foreground"
                            onClick={() => router.push("/admin/questoes")}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Sair e ir para Listagem
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
