"use client"

import { Video, ExternalLink } from "lucide-react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@workspace/ui/components/dialog"

interface VideoLesson {
    title: string
    url: string
}

interface QuestionVideoModalProps {
    videos?: VideoLesson[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuestionVideoModal({ videos, open, onOpenChange }: QuestionVideoModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground/90">
                        <Video className="w-4 h-4 text-primary" />
                        Aulas
                    </DialogTitle>
                </DialogHeader>
                
                <div className="p-2 pb-6">
                    {videos && videos.length > 0 ? (
                        <div className="divide-y divide-border/40">
                            {videos.map((video, index) => (
                                <a 
                                    key={index}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group rounded-lg"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                            {video.title}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                            Vídeo Aula
                                        </span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            Nenhuma aula disponível.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
