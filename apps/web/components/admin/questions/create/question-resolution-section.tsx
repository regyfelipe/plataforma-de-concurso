"use client"

import { useState } from "react"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"

export function QuestionResolutionSection() {
    const [resolution, setResolution] = useState("")

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">4</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Resolução e Explicações</h2>
            </div>
            <Card>
                <CardContent className="p-6 space-y-2">
                    <Label>Comentário do Professor / Gabarito Comentado</Label>
                    <TiptapEditor content={resolution} onChange={setResolution} />
                </CardContent>
            </Card>
        </section>
    )
}
