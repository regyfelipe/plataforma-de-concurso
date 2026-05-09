"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Card, CardContent } from "@workspace/ui/components/card"

interface Alternative {
    id: string;
    letter: string;
    text: string;
    isCorrect: boolean;
}

interface QuestionAlternativesSectionProps {
    alternativas: Alternative[];
    onToggleCorrect: (id: string) => void;
    onChangeText: (id: string, text: string) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}

export function QuestionAlternativesSection({ alternativas, onToggleCorrect, onChangeText, onRemove, canRemove }: QuestionAlternativesSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                        <span className="text-[10px] font-black">3</span>
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Alternativas</h2>
                </div>
            </div>
            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-6 space-y-4">
                    {alternativas.map((alt) => (
                        <div key={alt.id} className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => onToggleCorrect(alt.id)}
                                className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-[11px] border transition-all ${alt.isCorrect ? 'bg-foreground text-background border-foreground shadow-lg shadow-foreground/10' : 'bg-background border-border hover:border-foreground/20'}`}
                            >
                                {alt.letter}
                            </button>
                            <div className="flex-1 relative">
                                <Textarea 
                                    value={alt.text}
                                    onChange={(e) => onChangeText(alt.id, e.target.value)}
                                    className={`min-h-[60px] rounded-lg text-xs resize-none py-3 bg-background ${alt.isCorrect ? 'border-foreground/20' : 'border-border/50'}`} 
                                    placeholder={`Texto da alternativa ${alt.letter}...`} 
                                />
                                {canRemove && (
                                    <button 
                                        type="button"
                                        onClick={() => onRemove(alt.id)}
                                        className="absolute top-3 right-3 text-muted-foreground/30 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    )
}
