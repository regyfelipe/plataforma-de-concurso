"use client"

import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight, LayoutList, ListOrdered } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { QuestionFormActions } from "./question-form-actions"
import { QuestionClassificationSection } from "./question-classification-section"
import { QuestionStatementSection } from "./question-statement-section"
import { QuestionAlternativesSection } from "./question-alternatives-section"
import { QuestionResolutionSection } from "./question-resolution-section"
import { QuestionAlternativeExplanationsSection } from "./question-alternative-explanations-section"
import { QuestionMaterialsSection } from "./question-materials-section"
import { QuestionSettingsPanel } from "./question-settings-panel"
import { QuestionPreviewPanel } from "./question-preview-panel"
import { QuestionPreviewModal } from "./question-preview-modal"

export function CreateQuestionForm() {
    const [isWizardMode, setIsWizardMode] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    
    // Estados do Formulário
    const [classification, setClassification] = useState<Record<string, string>>({
        type: "multipla_escolha",
        discipline: "",
        subject: "",
        topic: "",
        board: "",
        year: "2024",
        difficulty: "medio"
    })
    
    const [statement, setStatement] = useState({
        supportText: "",
        commandText: ""
    })

    const [alternativas, setAlternativas] = useState([
        { id: "1", letter: "A", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
        { id: "2", letter: "B", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
        { id: "3", letter: "C", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
    ])

    const totalSteps = 7

    const handleFieldChange = (field: string, value: string) => {
        setClassification(prev => ({ ...prev, [field]: value }))
        if (field === 'type') handleTypeChange(value)
    }

    const handleTypeChange = (type: string) => {
        if (type === "certo_errado") {
            setAlternativas([
                { id: "c", letter: "C", text: "Certo", isCorrect: false, explanation: "", reference: "", tip: "" },
                { id: "e", letter: "E", text: "Errado", isCorrect: false, explanation: "", reference: "", tip: "" },
            ])
        } else {
            setAlternativas([
                { id: "1", letter: "A", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
                { id: "2", letter: "B", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
                { id: "3", letter: "C", text: "", isCorrect: false, explanation: "", reference: "", tip: "" },
            ])
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
        if (classification.type === "multipla_escolha" && alternativas.length <= 3) {
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

    // Mapeamento para o QuestionCard
    const getQuestionPreviewData = () => ({
        code: "PREVIEW-001",
        discipline: classification.discipline || "Disciplina não selecionada",
        subject: classification.subject,
        topic: classification.topic,
        board: classification.board,
        year: classification.year,
        difficulty: classification.difficulty,
        supportText: statement.supportText,
        questionText: statement.commandText || "Enunciado não preenchido",
        alternatives: alternativas,
        isUnique: classification.isUnique === 'sim'
    })

    const renderStep = (stepNumber: number) => {
        switch (stepNumber) {
            case 1: return (
                <QuestionClassificationSection 
                    values={classification} 
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
                        canRemove={classification.type === "multipla_escolha" && alternativas.length > 3}
                    />
                    {classification.type === "multipla_escolha" && alternativas.length < 5 && (
                        <div className="flex justify-center -mt-2">
                            <Button 
                                type="button"
                                variant="outline" 
                                size="sm" 
                                onClick={handleAddAlternative}
                                className="h-8 rounded-full px-4 text-[10px] font-black uppercase border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                                <Plus className="w-3 h-3 mr-2" /> Adicionar Alternativa
                            </Button>
                        </div>
                    )}
                </div>
            )
            case 4: return <QuestionResolutionSection />
            case 5: return (
                <QuestionAlternativeExplanationsSection 
                    alternativas={alternativas}
                    onChangeData={handleAlternativeDataChange}
                />
            )
            case 6: return <QuestionMaterialsSection />
            case 7: return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <QuestionPreviewPanel />
                    </div>
                    <div>
                        <QuestionSettingsPanel />
                    </div>
                </div>
            )
            default: return null
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
            <QuestionFormActions onPreview={() => setIsPreviewOpen(true)} />

            <div className="max-w-6xl mx-auto pb-20 px-4">
                {/* Seletor de Modo e Progresso */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 pt-4 border-t border-border/10">
                    <div className="flex items-center gap-2 p-1 bg-muted/10 rounded-xl border border-border/50">
                        <Button 
                            variant={!isWizardMode ? "secondary" : "ghost"} 
                            size="sm"
                            onClick={() => setIsWizardMode(false)}
                            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        >
                            <LayoutList className="w-3 h-3 mr-2" /> Visão Geral
                        </Button>
                        <Button 
                            variant={isWizardMode ? "secondary" : "ghost"} 
                            size="sm"
                            onClick={() => setIsWizardMode(true)}
                            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        >
                            <ListOrdered className="w-3 h-3 mr-2" /> Passo a Passo
                        </Button>
                    </div>

                    {isWizardMode && (
                        <div className="flex items-center gap-4 flex-1 max-w-md">
                            <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase whitespace-nowrap">
                                Etapa {currentStep} de {totalSteps}
                            </span>
                        </div>
                    )}
                </div>

                {/* Área de Conteúdo */}
                <div className="min-h-[400px]">
                    {!isWizardMode ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {[1, 2, 3, 4, 5, 6, 7].map(step => (
                                <div key={step}>{renderStep(step)}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
                            {renderStep(currentStep)}
                            
                            {/* Navegação do Wizard */}
                            <div className="flex items-center justify-between pt-8 border-t border-border/10">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
                                </Button>
                                
                                {currentStep < totalSteps ? (
                                    <Button
                                        onClick={nextStep}
                                        className="h-10 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                    >
                                        Próxima Etapa <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        className="h-10 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                    >
                                        Finalizar e Publicar
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
        </div>
    )
}
