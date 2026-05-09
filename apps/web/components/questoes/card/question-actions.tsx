"use client"

import { Button } from "@workspace/ui/components/button"
import { BookOpen, Video, FileText, Target, Flag, Star, CheckCircle2, AlertCircle } from "lucide-react"

interface QuestionActionsProps {
    isSubmitted: boolean
    selectedOption: string | null
    isCorrect?: boolean
    isProfessor?: boolean
    showExplanation: boolean
    showStats: boolean
    onToggleExplanation: () => void
    onToggleStats: () => void
    onShowVideos: () => void
    onReportError: () => void
    onSubmit: () => void
}

export function QuestionActions({ 
    isSubmitted, 
    selectedOption,
    isCorrect,
    isProfessor,
    showExplanation, 
    showStats, 
    onToggleExplanation, 
    onToggleStats,
    onShowVideos,
    onReportError,
    onSubmit
}: QuestionActionsProps) {
    return (
        <div className="flex flex-col gap-4 py-3">
            {/* Botão Responder e Mensagem de Texto Minimalista (Sem fundo) */}
            <div className="flex items-center gap-4">
                <Button
                    size="sm"
                    className={`w-full sm:w-auto font-semibold rounded-lg transition-all active:scale-[0.98] px-8 h-10 shadow-none border-none ${
                        isSubmitted 
                            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70" 
                            : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    }`}
                    onClick={onSubmit}
                    disabled={isSubmitted || !selectedOption}
                >
                    {isSubmitted ? "Respondido" : "Responder"}
                </Button>

                {isSubmitted && !isProfessor && (
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-2 duration-500 ${
                        isCorrect 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                    }`}>
                        {isCorrect ? (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> Gabarito Correto</>
                        ) : (
                            <><AlertCircle className="w-3.5 h-3.5" /> Resposta Incorreta</>
                        )}
                    </div>
                )}
            </div>

            {/* Barra de Ferramentas de Apoio */}
            <div className="flex items-center gap-2 py-3 border-t border-b overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex gap-2 text-muted-foreground hover:text-primary ${showExplanation ? "bg-primary/10 text-primary" : ""}`}
                        onClick={onToggleExplanation}
                        disabled={!isSubmitted}
                    >
                        <BookOpen className="w-4 h-4" />
                        Gabarito Comentado
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex gap-2 text-muted-foreground hover:text-primary"
                        onClick={onShowVideos}
                    >
                        <Video className="w-4 h-4" />
                        Aulas
                    </Button>
                    <Button variant="ghost" size="sm" className="flex gap-2 text-muted-foreground hover:text-primary">
                        <FileText className="w-4 h-4" />
                        Comentários
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`flex gap-2 text-muted-foreground hover:text-primary ${showStats ? "bg-primary/10 text-primary" : ""}`}
                        onClick={onToggleStats}
                        disabled={!isSubmitted}
                    >
                        <Target className="w-4 h-4" />
                        Estatísticas
                    </Button>
                </div>

                {/* Ícones de Utilidade no lado direito */}
                <div className="ml-auto flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-9 h-9 p-0 text-muted-foreground hover:text-red-500 rounded-full transition-colors" 
                        title="Reportar erro"
                        onClick={onReportError}
                    >
                        <Flag className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-muted-foreground hover:text-amber-500 rounded-full transition-colors" title="Favoritar">
                        <Star className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
