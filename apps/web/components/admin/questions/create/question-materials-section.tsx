"use client"

import { Video, BookOpen, Lightbulb, Target } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"

const FIELDS = [
    { key: "videoUrl", icon: Video, color: "text-red-500", label: "Link da Videoaula", placeholder: "https://youtube.com/..." },
    { key: "objetivo", icon: Target, color: "text-blue-500", label: "Objetivo de Aprendizagem", placeholder: "O que o aluno deve dominar aqui?" },
    { key: "referencia", icon: BookOpen, color: "text-primary", label: "Base Legal / Bibliografia", placeholder: "Ex: Art. 37, CF/88 ou Doutrina..." },
    { key: "dica", icon: Lightbulb, color: "text-amber-500", label: "Dica / Macete (Tip)", placeholder: "O segredo para matar essa questão rápido..." },
]

interface QuestionMaterialsSectionProps {
    values: Record<string, string>
    onFieldChange: (field: string, value: string) => void
}

export function QuestionMaterialsSection({ values, onFieldChange }: QuestionMaterialsSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">6</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Materiais de Apoio e Macetes</h2>
            </div>
            <Card>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FIELDS.map(({ key, icon: Icon, color, label, placeholder }) => (
                        <div key={label} className="space-y-2">
                            <Label className="flex items-center gap-1.5">
                                <Icon className={`h-3.5 w-3.5 ${color}`} />
                                {label}
                            </Label>
                            <Input
                                value={values[key] ?? ""}
                                placeholder={placeholder}
                                onChange={(event) => onFieldChange(key, event.target.value)}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    )
}
