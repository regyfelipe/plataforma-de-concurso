"use client"

import { useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { MessageSquareText } from "lucide-react"

interface Alternative {
    id: string;
    letter: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
}

interface QuestionAlternativeExplanationsSectionProps {
    alternativas: Alternative[];
    onChangeData: (id: string, value: string) => void;
}

export function QuestionAlternativeExplanationsSection({ alternativas, onChangeData }: QuestionAlternativeExplanationsSectionProps) {
    const incorrectAlts = alternativas.filter(alt => !alt.isCorrect)
    const [activeTab, setActiveTab] = useState<string | undefined>(incorrectAlts[0]?.id)

    if (activeTab && !incorrectAlts.find(a => a.id === activeTab) && incorrectAlts.length > 0) {
        setActiveTab(incorrectAlts[0]?.id)
    }

    const currentAlt = incorrectAlts.find(a => a.id === activeTab)

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">5</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Justificativa das Incorretas</h2>
            </div>

            <Card className="rounded-xl border shadow-none bg-muted/5 overflow-hidden">
                <div className="flex border-b border-border/40 bg-background/50">
                    {incorrectAlts.map((alt) => (
                        <button
                            key={alt.id}
                            type="button"
                            onClick={() => setActiveTab(alt.id)}
                            className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all border-r border-border/40 last:border-r-0 ${
                                activeTab === alt.id 
                                ? "bg-background text-primary border-b-2 border-b-primary" 
                                : "text-muted-foreground/50 hover:bg-muted/10"
                            }`}
                        >
                            Opção {alt.letter}
                        </button>
                    ))}
                </div>

                <CardContent className="p-6">
                    {currentAlt ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MessageSquareText className="w-3.5 h-3.5" />
                                <label className="text-[10px] font-black uppercase tracking-widest">Por que esta alternativa está {currentAlt.letter === 'B' ? 'correta' : 'incorreta'}?</label>
                            </div>
                            <Textarea 
                                value={currentAlt.explanation || ""}
                                onChange={(e) => onChangeData(currentAlt.id, e.target.value)}
                                placeholder={`Explicação técnica da alternativa ${currentAlt.letter}...`}
                                className="min-h-[100px] text-[11px] bg-background rounded-xl resize-none border-border/60"
                            />
                        </div>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground/30 text-[10px] font-black uppercase tracking-widest">
                            Selecione uma letra acima
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}
