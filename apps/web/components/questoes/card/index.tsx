"use client"

import { useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { QuestionHeader } from "./question-header"
import { QuestionAlternatives } from "./question-alternatives"
import { QuestionActions } from "./question-actions"
import { QuestionExplanation } from "./question-explanation"
import { QuestionStats } from "./question-stats"
import { QuestionVideoModal } from "./question-video-modal"
import { QuestionReportModal } from "./question-report-modal"

interface Alternative {
    letter: string
    text: string
    isCorrect: boolean
    explanation?: string
    reference?: string
    tip?: string
}

interface QuestionCardProps {
    question: {
        id: string
        code: string
        discipline: string
        subject?: string | null
        topic?: string | null
        supportText?: string | null
        questionText: string
        alternatives: Alternative[]
        difficulty: string
        isUnique: boolean
        year?: string | number
        board?: string | null
        institution?: string | null
        career?: string | null
        educationLevel?: string | null
        resolution?: string | null
        objectives?: string[]
        references?: string[]
        stats?: any
        commentsCount?: number
        videos?: { title: string; url: string }[]
        author: {
            id: string
            name: string
        }
    }
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
    userRole?: string
    currentUserId?: string
}

export function QuestionCard({ question, onDelete, onDuplicate, userRole = 'STUDENT', currentUserId }: QuestionCardProps) {
    const router = useRouter()
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [showVideos, setShowVideos] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [excludedOptions, setExcludedOptions] = useState<string[]>([])

    const isOwner = currentUserId === question.author.id
    const isAdmin = userRole === 'ADMIN'
    const isProfessor = userRole === 'PROFESSOR' || isAdmin
    const canEdit = isOwner || isAdmin

    const handleOptionSelect = (letter: string) => {
        if (!isSubmitted && !excludedOptions.includes(letter)) {
            setSelectedOption(prev => prev === letter ? null : letter)
        }
    }

    const toggleExcludeOption = (e: React.MouseEvent, letter: string) => {
        e.stopPropagation()
        if (isSubmitted) return
        setExcludedOptions(prev =>
            prev.includes(letter) ? prev.filter(l => l !== letter) : [...prev, letter]
        )
        if (selectedOption === letter) setSelectedOption(null)
    }

    const handleSubmit = async () => {
        if (selectedOption) {
            setIsSubmitted(true)
            toast.success("Resposta enviada!")
        }
    }

    const correctAnswer = question.alternatives.find(a => a.isCorrect)
    const isCorrect = selectedOption === correctAnswer?.letter

    return (
        <Card className="hover:shadow-lg transition-shadow border-border/50 overflow-hidden bg-background">
            <QuestionHeader
                code={question.code}
                discipline={question.discipline}
                subject={question.subject}
                topic={question.topic}
                supportText={question.supportText}
                difficulty={question.difficulty}
                isUnique={question.isUnique}
                year={question.year}
                board={question.board}
                institution={question.institution}
                career={question.career}
                educationLevel={question.educationLevel}
            />

            <CardContent className="pt-8 space-y-8">

                <div 
                    className="prose dark:prose-invert max-w-none text-xl font-semibold leading-relaxed text-foreground/90 tracking-tight"
                    dangerouslySetInnerHTML={{ __html: question.questionText }}
                />

                <QuestionAlternatives
                    alternatives={question.alternatives}
                    selectedOption={selectedOption}
                    isSubmitted={isSubmitted}
                    isProfessor={isProfessor}
                    excludedOptions={excludedOptions}
                    onSelect={handleOptionSelect}
                    onToggleExclude={toggleExcludeOption}
                />

                <div className="space-y-8">
                    <QuestionActions
                        isSubmitted={isSubmitted}
                        selectedOption={selectedOption}
                        isCorrect={isCorrect}
                        isProfessor={isProfessor}
                        showExplanation={showExplanation}
                        showStats={showStats}
                        onToggleExplanation={() => {
                            setShowExplanation(!showExplanation)
                            if (!showExplanation) setShowStats(false)
                        }}
                        onToggleStats={() => {
                            setShowStats(!showStats)
                            if (!showStats) setShowExplanation(false)
                        }}
                        onShowVideos={() => setShowVideos(true)}
                        onReportError={() => setShowReportModal(true)}
                        onSubmit={handleSubmit}
                    />

                    {/* Estatísticas aparecem se solicitado pelo botão ou para professor */}
                    {(showStats || isProfessor) && question.stats && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <QuestionStats stats={question.stats} />
                        </div>
                    )}

                    <QuestionExplanation
                        resolution={question.resolution}
                        objectives={question.objectives}
                        references={question.references}
                        alternatives={question.alternatives}
                        show={showExplanation}
                    />
                </div>
            </CardContent>

            {/* Modais Extraídos */}
            <QuestionVideoModal
                videos={question.videos}
                open={showVideos}
                onOpenChange={setShowVideos}
            />
            <QuestionReportModal
                open={showReportModal}
                onOpenChange={setShowReportModal}
            />
        </Card>
    )
}
