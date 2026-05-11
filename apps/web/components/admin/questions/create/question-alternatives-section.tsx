"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

interface Alternative {
    id: string
    letter: string
    text: string
    isCorrect: boolean
}

interface QuestionAlternativesSectionProps {
    alternativas: Alternative[]
    onToggleCorrect: (id: string) => void
    onChangeText: (id: string, text: string) => void
    onRemove: (id: string) => void
    canRemove: boolean
}

export function QuestionAlternativesSection({
    alternativas,
    onToggleCorrect,
    onChangeText,
    onRemove,
    canRemove,
}: QuestionAlternativesSectionProps) {
    return (
        <section className="space-y-2">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">3</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Alternativas</h2>
            </div>
            <Card>
                <CardContent className="p-2 space-y-2">
                    {alternativas.map((alt) => (
                        <div key={alt.id} className="flex gap-3">
                            {/* Letra / toggle gabarito */}
                            <button
                                type="button"
                                onClick={() => onToggleCorrect(alt.id)}
                                className={cn(
                                    "shrink-0 h-[38px] w-[38px] rounded-md border flex items-center justify-center text-sm font-semibold transition-colors",
                                    alt.isCorrect
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-background hover:border-foreground/30"
                                )}
                            >
                                {alt.letter}
                            </button>

                            {/* Textarea + botão remover */}
                            <div className="relative flex-1">
                                <Textarea
                                    value={alt.text}
                                    onChange={(e) => onChangeText(alt.id, e.target.value)}
                                    placeholder={`Texto da alternativa ${alt.letter}...`}
                                    className={cn(
                                        "min-h-[38px] py-2 resize-none pr-8 text-sm",
                                        alt.isCorrect && "border-foreground/30"
                                    )}
                                />
                                {canRemove && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemove(alt.id)}
                                        className="absolute top-1.5 right-1.5 h-6 w-6 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    )
}
