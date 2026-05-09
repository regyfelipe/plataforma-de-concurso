"use client"

import * as React from "react"
import { ChevronLeft, Save, X, Eye, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

// Importação dos sub-componentes
import { NotebookBasicInfo } from "@/components/admin/cadernos/notebook-basic-info"
import { NotebookAccessSettings } from "@/components/admin/cadernos/notebook-access-settings"
import { NotebookQuestionPicker } from "@/components/admin/cadernos/notebook-question-picker"
import { NotebookResolutionSettings } from "@/components/admin/cadernos/notebook-resolution-settings"

export default function CriarCadernoStepsPage() {
    const [step, setStep] = React.useState(1)
    const totalSteps = 4

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    return (
        <div className="relative min-h-screen bg-background pb-24">
            {/* Header Compacto */}
            <div className="p-6 max-w-6xl mx-auto space-y-4">
                <Link href="/admin/cadernos" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors w-fit">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Voltar para Cadernos
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded">Passo {step}/{totalSteps}</span>
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                {step === 1 && "Informações Básicas"}
                                {step === 2 && "Configurações de Acesso"}
                                {step === 3 && "Seleção de Questões"}
                                {step === 4 && "Regras de Resolução"}
                            </h1>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {step === 1 && "Defina a identidade do novo caderno oficial."}
                            {step === 2 && "Configure visibilidade e engajamento."}
                            {step === 3 && "Curadoria técnica do banco de questões."}
                            {step === 4 && "Defina o comportamento pedagógico do sistema."}
                        </p>
                    </div>

                    {/* Progress Bar Compacta */}
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((s) => (
                            <div 
                                key={s} 
                                className={`h-1 rounded-full transition-all duration-300 ${s <= step ? 'w-8 bg-primary' : 'w-4 bg-muted'}`} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Conteúdo em Card Padrão */}
            <div className="max-w-6xl mx-auto px-6">
                {step === 1 && <NotebookBasicInfo />}
                {step === 2 && <NotebookAccessSettings />}
                {step === 3 && <NotebookQuestionPicker />}
                {step === 4 && <NotebookResolutionSettings />}
            </div>

            {/* Footer Padronizado */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="text-[10px] font-bold uppercase tracking-wider gap-2 h-9"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Anterior
                        </Button>
                        <div className="w-[1px] h-4 bg-border/40" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{Math.round((step / totalSteps) * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 text-[10px] font-bold uppercase tracking-wider gap-2">
                            <Save className="w-3.5 h-3.5" />
                            Rascunho
                        </Button>

                        {step < totalSteps ? (
                            <Button 
                                size="sm"
                                onClick={nextStep}
                                className="h-9 px-6 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wider gap-2"
                            >
                                Próximo
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        ) : (
                            <Button 
                                size="sm"
                                className="h-9 px-6 bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider gap-2 hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Finalizar
                            </Button>
                        )}

                        <div className="w-[1px] h-4 bg-border/40 mx-1" />

                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
