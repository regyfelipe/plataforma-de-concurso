"use client"

import { useCallback, useMemo, useState, type MouseEvent } from "react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { sanitizeHtml } from "@/lib/sanitize-html"
import { submitQuestionAnswer } from "@/actions/question-progress"
import { QuestionAlternatives } from "./question-alternatives"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface Alternative {
    id?: string
    letter: string
    text: string
    isCorrect: boolean
    explanation?: string
    reference?: string
    tip?: string
}

interface MinimalQuestionCardProps {
    question: {
        id: string
        code: string
        discipline: string
        supportText?: string | null
        questionText: string
        alternatives: Alternative[]
        resolution?: string | null
        objectives?: string[]
        references?: string[]
    }
}

const excludedOptions: string[] = []

export function MinimalQuestionCard({ question }: MinimalQuestionCardProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSavingAnswer, setIsSavingAnswer] = useState(false)

    const supportHtml = useMemo(() => sanitizeHtml(question.supportText), [question.supportText])
    const questionHtml = useMemo(() => sanitizeHtml(question.questionText), [question.questionText])
    const resolutionHtml = useMemo(() => sanitizeHtml(question.resolution), [question.resolution])
    const correctAnswer = useMemo(
        () => question.alternatives.find((alternative) => alternative.isCorrect),
        [question.alternatives]
    )
    const isCorrect = selectedOption === correctAnswer?.letter

    const handleOptionSelect = useCallback((letter: string) => {
        if (!isSubmitted) {
            setSelectedOption(prev => prev === letter ? null : letter)
        }
    }, [isSubmitted])

    const toggleExcludeOption = useCallback((event: MouseEvent) => {
        event.stopPropagation()
    }, [])

    const handleSubmit = useCallback(async () => {
        const selectedAlternative = question.alternatives.find((alternative) => alternative.letter === selectedOption)

        if (selectedAlternative?.id) {
            setIsSavingAnswer(true)
            try {
                const result = await submitQuestionAnswer({
                    questionId: question.id,
                    alternativeId: selectedAlternative.id,
                })
                setIsSubmitted(true)
                toast.success(result.isCorrect ? "Resposta correta!" : "Resposta enviada!")
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Não foi possível salvar sua resposta.")
            } finally {
                setIsSavingAnswer(false)
            }
            return
        }

        if (selectedOption) {
            setIsSubmitted(true)
            toast.success("Resposta enviada!")
        }
    }, [question.alternatives, question.id, selectedOption])

    return (
        <div className="space-y-4">
            {/* 1. DISCIPLINA */}
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-border/40 pb-1 w-fit">
                {question.discipline}
            </div>

            {/* 2. TEXTO DE APOIO (SE TIVER) */}
            {supportHtml && (
                <div className="pt-2">
                    <div 
                        className="text-[13px] text-foreground/70 leading-relaxed font-medium prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: supportHtml }}
                    />
                </div>
            )}

            {/* 3. PERGUNTA (ENUNCIADO) - REDUZIDO PARA text-base */}
            <div 
                className="text-base font-bold leading-relaxed text-foreground/90 tracking-tight"
                dangerouslySetInnerHTML={{ __html: questionHtml }}
            />

            {/* 4. ALTERNATIVAS */}
            <QuestionAlternatives
                alternatives={question.alternatives}
                selectedOption={selectedOption}
                isSubmitted={isSubmitted}
                isProfessor={false}
                hideExclude={true}
                hideLetter={true}
                smallText={true}
                excludedOptions={excludedOptions}
                onSelect={handleOptionSelect}
                onToggleExclude={toggleExcludeOption}
            />

            {/* 5. RESPONDE (AÇÃO) */}
            <div className="flex items-center gap-3 pt-1">
                <Button
                    size="sm"
                    className={`h-8 px-6 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                        isSubmitted 
                            ? "bg-muted text-muted-foreground cursor-not-allowed" 
                            : "bg-primary text-primary-foreground hover:scale-[1.01] active:scale-[0.98]"
                    }`}
                    onClick={handleSubmit}
                    disabled={isSubmitted || !selectedOption || isSavingAnswer}
                >
                    {isSubmitted ? "Respondido" : isSavingAnswer ? "Salvando" : "Responder"}
                </Button>

                {isSubmitted && (
                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                        isCorrect ? "text-green-600" : "text-red-600"
                    }`}>
                        {isCorrect ? (
                            <><CheckCircle2 className="w-3 h-3" /> Correto</>
                        ) : (
                            <><AlertCircle className="w-3 h-3" /> Incorreto</>
                        )}
                    </div>
                )}
            </div>

            {/* 6. COMENTARIO (GABARITO) - MOSTRA AUTOMATICAMENTE AO RESPONDER */}
            {isSubmitted && resolutionHtml && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500 pt-4 border-t border-border/40">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">
                            Gabarito Comentado
                        </div>
                        <div 
                            className="prose dark:prose-invert max-w-none text-[13px] leading-snug text-foreground/70 font-medium w-full overflow-hidden break-words whitespace-normal [overflow-wrap:anywhere] [&_*]:max-w-full [&_*]:break-words [&_*]:whitespace-normal"
                            dangerouslySetInnerHTML={{ __html: resolutionHtml }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
