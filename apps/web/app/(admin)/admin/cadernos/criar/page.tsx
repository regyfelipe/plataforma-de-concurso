"use client"

import * as React from "react"
import { ChevronLeft, Save, X, Eye, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"

// Importação dos sub-componentes
import { NotebookBasicInfo } from "@/components/admin/cadernos/notebook-basic-info"
import { NotebookAccessSettings } from "@/components/admin/cadernos/notebook-access-settings"
import { NotebookQuestionPicker } from "@/components/admin/cadernos/notebook-question-picker"
import { NotebookResolutionSettings } from "@/components/admin/cadernos/notebook-resolution-settings"

import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export default function CriarCadernoStepsPage() {
    const [step, setStep] = React.useState(1)
    const totalSteps = 4

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    return (
        <div className="relative min-h-screen bg-background pb-24 max-w-7xl mx-auto w-full">
            {/* Header Compacto */}
            <div className="p-8 pt-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] font-semibold">
                                Passo {step}/{totalSteps}
                            </Badge>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {step === 1 && "Informações Básicas"}
                                {step === 2 && "Configurações de Acesso"}
                                {step === 3 && "Seleção de Questões"}
                                {step === 4 && "Regras de Resolução"}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {step === 1 && "Defina a identidade do novo caderno oficial."}
                            {step === 2 && "Configure visibilidade e engajamento."}
                            {step === 3 && "Curadoria técnica do banco de questões."}
                            {step === 4 && "Defina o comportamento pedagógico do sistema."}
                        </p>
                    </div>

                    {/* Progress Bar Compacta */}
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((s) => (
                            <div 
                                key={s} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'w-10 bg-primary' : 'w-4 bg-muted'}`} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="px-8">
                {step === 1 && <NotebookBasicInfo />}
                {step === 2 && <NotebookAccessSettings />}
                {step === 3 && <NotebookQuestionPicker />}
                {step === 4 && <NotebookResolutionSettings />}
            </div>

            {/* Footer Padronizado */}
            <div className="fixed bottom-0 left-0 md:left-66 right-0 z-50  bg-background  shadow-2xl">
                <div className="max-w-7xl mx-auto p-4 flex items-center justify-between gap-4 px-8">
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="gap-2 h-9 text-xs font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Anterior
                        </Button>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-xs font-bold text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-semibold">
                            <Save className="w-4 h-4" />
                            Rascunho
                        </Button>

                        {step < totalSteps ? (
                            <Button 
                                size="sm"
                                onClick={nextStep}
                                className="h-9 px-6 gap-2 text-xs font-semibold"
                            >
                                Próximo
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button 
                                size="sm"
                                className="h-9 px-6 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 text-xs font-semibold"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Finalizar
                            </Button>
                        )}

                        <Separator orientation="vertical" className="h-4" />

                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
