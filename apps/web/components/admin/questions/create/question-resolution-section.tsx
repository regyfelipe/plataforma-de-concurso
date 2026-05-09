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
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">4</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Resolução e Explicações</h2>
            </div>
            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-6 space-y-2">
                    <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Comentário do Professor / Gabarito Comentado</Label>
                    <TiptapEditor 
                        content={resolution} 
                        onChange={setResolution} 
                    />
                </CardContent>
            </Card>
        </section>
    )
}
