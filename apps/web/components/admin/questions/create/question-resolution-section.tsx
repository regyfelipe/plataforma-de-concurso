import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"

interface QuestionResolutionSectionProps {
    resolution: string
    onResolutionChange: (value: string) => void
}

export function QuestionResolutionSection({ resolution, onResolutionChange }: QuestionResolutionSectionProps) {
    return (
        <section className="space-y-2">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">4</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Resolução e Explicações</h2>
            </div>
            <Card>
                <CardContent className="p-2 space-y-1">
                    <Label className="text-[11px] font-bold text-muted-foreground ml-1">Comentário do Professor / Gabarito Comentado</Label>
                    <TiptapEditor content={resolution} onChange={onResolutionChange} />
                </CardContent>
            </Card>
        </section>
    )
}
