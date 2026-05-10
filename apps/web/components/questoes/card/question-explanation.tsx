"use client"

import { useState } from "react"
import { BookOpen, ListChecks, FileText, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface Alternative {
    letter: string
    text: string
    isCorrect: boolean
    explanation?: string
    reference?: string
    tip?: string
}

interface QuestionExplanationProps {
    resolution?: string | null
    objectives?: string[]
    references?: string[]
    alternatives?: Alternative[]
    show: boolean
}

export function QuestionExplanation({ resolution, objectives, references, alternatives, show }: QuestionExplanationProps) {
    const [activeTab, setActiveTab] = useState<"resolution" | "alternatives" | "academic">("resolution")

    if (!show) return null

    return (
        <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Barra de Navegação IDÊNTICA ao QuestionActions */}
            <div className="flex items-center gap-2 py-3 border-t border-b overflow-x-auto no-scrollbar border-none mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex gap-2 text-muted-foreground hover:text-primary ${activeTab === "resolution" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => setActiveTab("resolution")}
                >
                    <BookOpen className="w-4 h-4" />
                    Resolução
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex gap-2 text-muted-foreground hover:text-primary ${activeTab === "alternatives" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => setActiveTab("alternatives")}
                >
                    <ListChecks className="w-4 h-4" />
                    Alternativas
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex gap-2 text-muted-foreground hover:text-primary ${activeTab === "academic" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => setActiveTab("academic")}
                >
                    <FileText className="w-4 h-4" />
                    Saiba Mais
                </Button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="mt-2">
                {activeTab === "resolution" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        {resolution ? (
                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                                <div 
                                    className="prose dark:prose-invert max-w-none text-base leading-relaxed text-foreground/80 font-medium"
                                    dangerouslySetInnerHTML={{ __html: resolution }}
                                />
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
                                Nenhuma resolução detalhada disponível.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "alternatives" && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                        {alternatives?.map((alt) => (
                            <div
                                key={alt.letter}
                                className={`p-4 rounded-xl border-l-4 transition-all ${alt.isCorrect
                                        ? "bg-green-500/5 border-l-green-500 border border-border/40"
                                        : "bg-muted/30 border-l-muted-foreground/30 border border-border/40"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black border-2 ${alt.isCorrect
                                            ? "bg-green-500 text-white border-green-500"
                                            : "bg-muted text-muted-foreground border-border"
                                        }`}>
                                        {alt.isCorrect ? <CheckCircle2 className="w-3 h-3" /> : alt.letter}
                                    </div>
                                    <span className={`text-sm font-bold ${alt.isCorrect ? "text-green-600 dark:text-green-400" : "text-foreground/70"}`}>
                                        Alternativa {alt.letter} {alt.isCorrect ? "(Gabarito)" : "(Incorreta)"}
                                    </span>
                                </div>

                                <div className="ml-9 space-y-3">
                                    <div 
                                        className="text-sm text-foreground/80 italic line-clamp-1 opacity-60"
                                        dangerouslySetInnerHTML={{ __html: alt.text }}
                                    />

                                    {alt.explanation ? (
                                        <div className="flex gap-2 text-sm text-foreground/90 leading-relaxed font-medium">
                                            <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary/60" />
                                            <div dangerouslySetInnerHTML={{ __html: alt.explanation }} />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">Sem justificativa detalhada.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "academic" && (
                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                        {objectives && objectives.length > 0 && (
                            <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                <h5 className="text-sm font-black flex items-center gap-2 mb-3 text-primary uppercase tracking-widest">
                                    <ListChecks className="w-4 h-4" /> Objetivos
                                </h5>
                                <ul className="text-xs space-y-2 text-muted-foreground font-medium">
                                    {objectives.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {references && references.length > 0 && (
                            <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                <h5 className="text-sm font-black flex items-center gap-2 mb-3 text-primary uppercase tracking-widest">
                                    <FileText className="w-4 h-4" /> Referências
                                </h5>
                                <ul className="text-xs space-y-2 text-muted-foreground font-medium italic">
                                    {references.map((ref, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-1.5 shrink-0" />
                                            {ref}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
