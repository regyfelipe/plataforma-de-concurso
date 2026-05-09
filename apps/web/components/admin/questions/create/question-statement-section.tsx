"use client"

import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"

interface QuestionStatementSectionProps {
    supportText: string;
    commandText: string;
    onSupportChange: (val: string) => void;
    onCommandChange: (val: string) => void;
}

export function QuestionStatementSection({ 
    supportText, 
    commandText, 
    onSupportChange, 
    onCommandChange 
}: QuestionStatementSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">2</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Enunciado e Textos</h2>
            </div>
            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Texto de Apoio / Contexto</Label>
                        <TiptapEditor 
                            content={supportText} 
                            onChange={onSupportChange} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Pergunta / Comando Principal</Label>
                        <TiptapEditor 
                            content={commandText} 
                            onChange={onCommandChange} 
                        />
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
