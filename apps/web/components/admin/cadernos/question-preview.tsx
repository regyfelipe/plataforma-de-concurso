"use client"

import * as React from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"

interface Alternative {
    id: string
    letter: string
    text: string
    isCorrect: boolean
}

interface QuestionPreviewProps {
    supportText: string
    commandText: string
    alternativas: Alternative[]
    concursoLabel?: string
    disciplinaLabel?: string
}

export function QuestionPreview({
    supportText,
    commandText,
    alternativas,
    concursoLabel = "CONCURSO EXEMPLO",
    disciplinaLabel = "DISCIPLINA EXEMPLO",
}: QuestionPreviewProps) {
    return (
        <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-primary/70">Preview em Tempo Real</h2>
                <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">Modo Aluno</Badge>
            </div>

            <Card className="border-2 border-primary/5 shadow-sm overflow-hidden">
                <div className="p-4 bg-muted/30 border-b flex items-center gap-2">
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase">{concursoLabel}</Badge>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase">{disciplinaLabel}</Badge>
                </div>
                
                <CardContent className="p-6 space-y-6">
                    {/* Texto de Apoio */}
                    {supportText && supportText !== "<p></p>" && (
                        <div 
                            className="text-sm text-muted-foreground leading-relaxed tiptap-preview"
                            dangerouslySetInnerHTML={{ __html: supportText }}
                        />
                    )}

                    {/* Pergunta */}
                    <div 
                        className="text-base font-medium leading-snug tiptap-preview"
                        dangerouslySetInnerHTML={{ __html: commandText || "<i>Aguardando enunciado...</i>" }}
                    />

                    <Separator className="opacity-50" />

                    {/* Alternativas */}
                    <div className="space-y-3">
                        {alternativas.map((alt) => (
                            <div 
                                key={alt.id}
                                className={cn(
                                    "group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-default",
                                    alt.isCorrect 
                                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                                        : "bg-background hover:border-muted-foreground/20"
                                )}
                            >
                                <div className={cn(
                                    "shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-colors",
                                    alt.isCorrect 
                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                        : "bg-muted/30 text-muted-foreground"
                                )}>
                                    {alt.letter}
                                </div>
                                <div className="flex-1 pt-1.5 text-sm leading-tight text-foreground/90">
                                    {alt.text || <span className="text-muted-foreground italic">Alternativa vazia</span>}
                                </div>
                                {alt.isCorrect && (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-tighter h-4 px-1">Gabarito</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>

                <div className="p-3 bg-muted/10 border-t flex items-center justify-center">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Vista prévia do sistema de resolução</p>
                </div>
            </Card>

            <style jsx global>{`
                .tiptap-preview p {
                    margin-bottom: 0.5rem;
                }
                .tiptap-preview p:last-child {
                    margin-bottom: 0;
                }
                .tiptap-preview ul {
                    list-style-type: disc;
                    padding-left: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                .tiptap-preview ol {
                    list-style-type: decimal;
                    padding-left: 1.25rem;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    )
}
