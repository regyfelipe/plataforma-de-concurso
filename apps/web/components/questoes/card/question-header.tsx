"use client"

import { useState } from "react"
import { Hash } from "lucide-react"

interface QuestionHeaderProps {
    code: string
    discipline: string
    subject?: string | null
    topic?: string | null
    supportText?: string | null
    difficulty: string
    isUnique: boolean
    year?: string | number
    board?: string | null
    institution?: string | null
    career?: string | null
    educationLevel?: string | null
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "facil": return "text-emerald-500"
        case "medio": return "text-amber-500"
        case "dificil": return "text-orange-500"
        case "muito_dificil": return "text-red-500"
        default: return "text-slate-500"
    }
}

const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
        case "facil": return "Fácil"
        case "medio": return "Médio"
        case "dificil": return "Difícil"
        case "muito_dificil": return "Muito Difícil"
        default: return difficulty
    }
}

export function QuestionHeader({
    code, discipline, subject, topic, supportText, difficulty, isUnique, year, board, institution, career, educationLevel
}: QuestionHeaderProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const difficultyColor = getDifficultyColor(difficulty)

    // Lógica para decidir se o texto precisa de truncamento (mais de 4 linhas ou longo demais)
    const needsTruncation = supportText
        ? supportText.split('\n').length > 4 || supportText.length > 250
        : false

    return (
        <div className="p-6 pb-0 space-y-4">
            {/* Main Info Line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="flex items-center gap-1 font-bold text-foreground">
                    <Hash className="w-3.5 h-3.5 text-primary" />
                    {code}
                </span>

                <span className="text-muted-foreground/30">|</span>

                <span className="font-semibold text-foreground/80">{discipline}</span>

                {subject && (
                    <>
                        <span className="text-muted-foreground/30">/</span>
                        <span className="text-muted-foreground">{subject}</span>
                    </>
                )}

                <div className="ml-auto flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${difficultyColor}`}>
                        {getDifficultyLabel(difficulty)}
                    </span>
                    {isUnique && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                            Inédita
                        </span>
                    )}
                </div>
            </div>

            {/* Sub Meta Line */}
            <div className="flex flex-wrap items-center gap-x-4 text-[11px] font-medium text-muted-foreground/60">
                {year && <span>{year}</span>}
                {board && <span>• {board}</span>}
                {institution && <span>• {institution}</span>}
                {career && <span>• {career}</span>}
                {educationLevel && <span>• {educationLevel}</span>}
            </div>

            {/* Texto de Apoio Minimalista */}
            {supportText && (
                <div className="pt-4 mt-2 border-t border-border/40">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                            Texto de Apoio
                        </span>

                        <div className={`relative transition-all duration-300 ${isExpanded ? "" : needsTruncation ? "max-h-[100px] overflow-hidden" : ""}`}>
                            <div className={`text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium ${isExpanded ? "" : needsTruncation ? "line-clamp-4" : ""}`}>
                                {supportText}
                            </div>

                            {needsTruncation && !isExpanded && (
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent" />
                            )}
                        </div>

                        {needsTruncation && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-[11px] font-bold text-primary hover:underline w-fit mt-1"
                            >
                                {isExpanded ? "Ver menos" : "Ver texto completo"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
