"use client"

import { sanitizeHtml } from "@/lib/sanitize-html"
import { CheckCircle2, X } from "lucide-react"

interface Alternative {
    letter: string
    text: string
    isCorrect: boolean
}

interface QuestionAlternativesProps {
    alternatives: Alternative[]
    selectedOption: string | null
    isSubmitted: boolean
    isProfessor: boolean
    excludedOptions: string[]
    hideExclude?: boolean
    hideLetter?: boolean
    smallText?: boolean
    onSelect: (letter: string) => void
    onToggleExclude: (e: React.MouseEvent, letter: string) => void
}

export function QuestionAlternatives({
    alternatives,
    selectedOption,
    isSubmitted,
    isProfessor,
    excludedOptions,
    hideExclude,
    hideLetter,
    smallText,
    onSelect,
    onToggleExclude
}: QuestionAlternativesProps) {
    return (
        <div className={smallText ? "space-y-1" : "space-y-4"}>
            {alternatives.map((alt, i) => {
                const isSelected = selectedOption === alt.letter
                const isExcluded = excludedOptions.includes(alt.letter)
                const isCorrect = alt.isCorrect
                const showCorrect = (isSubmitted || isProfessor) && isCorrect
                const showWrong = isSubmitted && isSelected && !isCorrect

                return (
                    <div key={i} className="group flex items-center gap-2">
                        {!isSubmitted && !isProfessor && !hideExclude && (
                            <button
                                onClick={(e) => onToggleExclude(e, alt.letter)}
                                className={`p-1 rounded-full transition-all border shrink-0 ${
                                    isExcluded 
                                        ? "bg-red-500 text-white border-red-500" 
                                        : "text-muted-foreground border-transparent hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                }`}
                                title="Descartar alternativa"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}

                        <div
                            onClick={() => onSelect(alt.letter)}
                            className={`flex-1 flex items-center gap-2.5 transition-all cursor-pointer ${
                                smallText 
                                ? `py-0.5 ${
                                    isSubmitted
                                        ? showCorrect
                                            ? "text-green-700 dark:text-green-400 font-bold"
                                            : showWrong
                                                ? "text-red-700 dark:text-red-400 font-bold"
                                                : "opacity-40"
                                        : isSelected
                                            ? "text-foreground font-semibold"
                                            : isExcluded
                                                ? "opacity-30 grayscale"
                                                : "hover:text-foreground text-foreground/70"
                                  }`
                                : `p-4 border-2 rounded-xl ${
                                    isSubmitted
                                        ? showCorrect
                                            ? "bg-green-500/10 border-green-500/50 dark:bg-green-500/5"
                                            : showWrong
                                                ? "bg-red-500/10 border-red-500/50 dark:bg-red-500/5"
                                                : "opacity-60 border-transparent bg-muted/20"
                                        : isSelected
                                            ? "border-border/50 bg-transparent shadow-sm"
                                            : isExcluded
                                                ? "opacity-40 grayscale border-transparent bg-muted/10"
                                                : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                                }`
                            }`}
                        >
                            <div className={`flex ${smallText ? 'h-4.5 w-4.5' : 'h-7 w-7'} shrink-0 items-center justify-center rounded-full text-[9px] font-black border transition-all ${
                                isSubmitted
                                    ? showCorrect
                                        ? "bg-green-600 text-white border-green-600"
                                        : showWrong
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-muted text-muted-foreground border-border"
                                    : isSelected
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-transparent text-muted-foreground border-muted-foreground/40"
                            }`}>
                                {isSubmitted && showCorrect ? <CheckCircle2 className="w-2.5 h-2.5" /> : (hideLetter ? null : alt.letter)}
                            </div>
                            <div 
                                className={`leading-tight transition-colors ${smallText ? 'text-[13px]' : 'text-base'} ${
                                    isExcluded ? "line-through opacity-50" : ""
                                } break-words whitespace-normal flex-1`}
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(alt.text) }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
