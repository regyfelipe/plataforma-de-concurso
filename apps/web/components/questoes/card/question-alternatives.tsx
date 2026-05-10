"use client"

import { CheckCircle2, X } from "lucide-react"
import { Progress } from "@workspace/ui/components/progress"

interface Alternative {
    letter: string
    text: string
    isCorrect: boolean
    percentage?: number // Novo campo para as estatísticas
}

interface QuestionAlternativesProps {
    alternatives: Alternative[]
    selectedOption: string | null
    isSubmitted: boolean
    isProfessor: boolean
    excludedOptions: string[]
    onSelect: (letter: string) => void
    onToggleExclude: (e: React.MouseEvent, letter: string) => void
}

export function QuestionAlternatives({
    alternatives,
    selectedOption,
    isSubmitted,
    isProfessor,
    excludedOptions,
    onSelect,
    onToggleExclude
}: QuestionAlternativesProps) {
    return (
        <div className="space-y-4">
            {alternatives.map((alt, i) => {
                const isSelected = selectedOption === alt.letter
                const isExcluded = excludedOptions.includes(alt.letter)
                const isCorrect = alt.isCorrect
                const showCorrect = (isSubmitted || isProfessor) && isCorrect
                const showWrong = isSubmitted && isSelected && !isCorrect

                return (
                    <div key={i} className="group flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {!isSubmitted && !isProfessor && (
                                <button
                                    onClick={(e) => onToggleExclude(e, alt.letter)}
                                    className={`p-2 rounded-full transition-all border-2 shrink-0 ${
                                        isExcluded 
                                            ? "bg-red-500 text-white border-red-500" 
                                            : "text-muted-foreground border-transparent hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                    }`}
                                    title="Descartar alternativa"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            <div
                                onClick={() => onSelect(alt.letter)}
                                className={`flex-1 flex flex-col gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                    isSubmitted
                                        ? showCorrect
                                            ? "bg-green-500/10 border-green-500/50 dark:bg-green-500/5"
                                            : showWrong
                                                ? "bg-red-500/10 border-red-500/50 dark:bg-red-500/5"
                                                : "opacity-60 border-transparent bg-muted/20"
                                        : isSelected
                                            ? "border-border/50 bg-transparent" // Mantém a borda e fundo neutros
                                            : isExcluded
                                                ? "opacity-40 grayscale border-transparent bg-muted/10"
                                                : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-black border-2 transition-all ${
                                            isSubmitted
                                                ? showCorrect
                                                    ? "bg-green-500 text-white border-green-500"
                                                    : showWrong
                                                        ? "bg-red-500 text-white border-red-500"
                                                        : "bg-muted text-muted-foreground border-border"
                                                : isSelected
                                                    ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:border-slate-50 shadow-md"
                                                    : "bg-background text-muted-foreground border-muted-foreground/20 group-hover:border-primary/50"
                                        }`}>
                                            {isSubmitted && showCorrect ? <CheckCircle2 className="w-4 h-4" /> : alt.letter}
                                        </div>
                                        <div 
                                            className={`text-base leading-relaxed transition-colors ${
                                                isSelected ? "text-foreground font-semibold" : "text-foreground/70"
                                            } ${isProfessor && isCorrect ? "font-bold text-green-700 dark:text-green-400" : ""} ${isExcluded ? "line-through opacity-50" : ""}`}
                                            dangerouslySetInnerHTML={{ __html: alt.text }}
                                        />
                                    </div>

                                    {/* Porcentagem no topo, à direita */}
                                    {(isSubmitted || isProfessor) && alt.percentage !== undefined && (
                                        <span className="text-[10px] font-black tracking-widest text-muted-foreground/60 shrink-0 mt-1">
                                            {alt.percentage}%
                                        </span>
                                    )}
                                </div>

                                {/* Barra de Estatística bem colada */}
                                {(isSubmitted || isProfessor) && alt.percentage !== undefined && (
                                    <div className="ml-11 -mt-1 animate-in fade-in duration-500">
                                        <Progress 
                                            value={alt.percentage} 
                                            className={`h-1 ${isCorrect ? "[&>div]:bg-green-500" : "[&>div]:bg-muted-foreground/30"}`} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
