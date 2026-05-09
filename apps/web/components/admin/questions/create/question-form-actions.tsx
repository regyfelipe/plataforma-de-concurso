"use client"

import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

interface QuestionFormActionsProps {
    onPreview?: () => void;
    onSaveDraft?: () => void;
    onPublish?: () => void;
}

export function QuestionFormActions({ onPreview, onSaveDraft, onPublish }: QuestionFormActionsProps) {
    return (
        <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border/10">
            <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
                <div className="space-y-0.5">
                    <Link 
                        href="/admin/questoes" 
                        className="group flex items-center gap-1.5 text-[9px] font-black uppercase text-muted-foreground/60 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" /> 
                        Voltar para Lista
                    </Link>
                    <h1 className="text-lg font-black tracking-tighter text-foreground uppercase italic">
                        Criar Questão <span className="text-primary not-italic">.</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onSaveDraft}
                        className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/20"
                    >
                        Salvar Rascunho
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={onPreview}
                        className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/60 hover:bg-muted/10 transition-all"
                    >
                        <Eye className="w-3.5 h-3.5 mr-2" /> Pré-visualizar
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={onPublish}
                        className="h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-foreground/10 transition-all"
                    >
                        Publicar Agora
                    </Button>
                </div>
            </div>
        </div>
    )
}
