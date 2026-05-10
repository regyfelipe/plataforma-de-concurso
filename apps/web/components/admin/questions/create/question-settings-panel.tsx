"use client"

import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Globe, MessageSquare, GraduationCap } from "lucide-react"
import { Separator } from "@workspace/ui/components/separator"

const SETTINGS = [
    {
        icon: Globe,
        color: "text-emerald-500",
        label: "Visibilidade Pública",
        description: "Disponível no Banco Geral",
        defaultChecked: true,
    },
    {
        icon: MessageSquare,
        color: "text-primary",
        label: "Permitir Comentários",
        description: "Interação entre alunos",
        defaultChecked: true,
    },
    {
        icon: GraduationCap,
        color: "text-purple-500",
        label: "Modo Revisão",
        description: "Habilitar chat com professor",
        defaultChecked: false,
    },
]

interface QuestionSettingsPanelProps {
    values: {
        isPublic: boolean
        allowComments: boolean
        reviewMode: boolean
    }
    onFieldChange: (field: "isPublic" | "allowComments" | "reviewMode", value: boolean) => void
}

export function QuestionSettingsPanel({ values, onFieldChange }: QuestionSettingsPanelProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">7</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Configurações de Publicação</h2>
            </div>
            <Card>
                <CardContent className="p-4 divide-y">
                    {SETTINGS.map(({ icon: Icon, color, label, description }) => {
                        const field = label === "Visibilidade Pública"
                            ? "isPublic"
                            : label === "Permitir Comentários"
                                ? "allowComments"
                                : "reviewMode"

                        return (
                        <div key={label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <Icon className={`h-4 w-4 ${color}`} />
                                <div>
                                    <Label className="text-sm font-medium cursor-pointer">{label}</Label>
                                    <p className="text-xs text-muted-foreground">{description}</p>
                                </div>
                            </div>
                            <Switch
                                checked={values[field]}
                                onCheckedChange={(checked) => onFieldChange(field, checked)}
                            />
                        </div>
                    )})}
                </CardContent>
            </Card>
        </section>
    )
}
