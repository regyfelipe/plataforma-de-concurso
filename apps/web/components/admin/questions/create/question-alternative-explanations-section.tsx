"use client"

import { useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { MessageSquareText } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface Alternative {
    id: string
    letter: string
    text: string
    isCorrect: boolean
    explanation?: string
}

interface QuestionAlternativeExplanationsSectionProps {
    alternativas: Alternative[]
    onChangeData: (id: string, value: string) => void
}

export function QuestionAlternativeExplanationsSection({ alternativas, onChangeData }: QuestionAlternativeExplanationsSectionProps) {
    const incorrectAlts = alternativas.filter((alt) => !alt.isCorrect)
    const [activeTab, setActiveTab] = useState<string | undefined>(incorrectAlts[0]?.id)

    if (activeTab && !incorrectAlts.find((a) => a.id === activeTab) && incorrectAlts.length > 0) {
        setActiveTab(incorrectAlts[0]?.id)
    }

    const currentAlt = incorrectAlts.find((a) => a.id === activeTab)

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">5</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Justificativa das Incorretas</h2>
            </div>

            <Card className="overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b">
                    {incorrectAlts.map((alt) => (
                        <button
                            key={alt.id}
                            type="button"
                            onClick={() => setActiveTab(alt.id)}
                            className={cn(
                                "flex-1 py-2.5 px-4 text-xs font-medium transition-colors border-r last:border-r-0",
                                activeTab === alt.id
                                    ? "text-primary border-b-2 border-b-primary bg-background"
                                    : "text-muted-foreground hover:bg-muted/40"
                            )}
                        >
                            Opção {alt.letter}
                        </button>
                    ))}
                </div>

                <CardContent className="p-6">
                    {currentAlt ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageSquareText className="h-4 w-4" />
                                <span>Por que esta alternativa está incorreta?</span>
                            </div>
                            <Textarea
                                value={currentAlt.explanation ?? ""}
                                onChange={(e) => onChangeData(currentAlt.id, e.target.value)}
                                placeholder={`Explicação técnica da alternativa ${currentAlt.letter}...`}
                                className="min-h-[100px] resize-none text-sm"
                            />
                        </div>
                    ) : (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Selecione uma letra acima
                        </p>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}
