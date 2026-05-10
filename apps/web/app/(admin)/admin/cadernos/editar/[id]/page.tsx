"use client"

import * as React from "react"
import { ChevronLeft, Save, Library, BookOpen, AlignLeft, Power, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@workspace/ui/components/select"
import { useParams } from "next/navigation"
import { CADERNOS_MOCK, DISCIPLINAS_MOCK } from "@/data/mocks/admin"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export default function EditarCadernoAdminPage() {
    const params = useParams()
    const id = params.id as string
    
    const caderno = CADERNOS_MOCK.find((c: any) => c.id === id)

    const [nome, setNome] = React.useState(caderno?.name || "")

    if (!caderno) {
        return <div className="p-8 text-center text-muted-foreground">Caderno não encontrado.</div>
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background">
            
            {/* Header Master */}
            <div className="flex flex-col gap-4">
                

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-primary">Edição de Material</p>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Editar Caderno Oficial
                        </h1>
                    </div>
                </div>
            </div>

            {/* Formulário Principal */}
            <Card>
                <CardContent className="p-8 space-y-10">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-foreground">Informações Gerais</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Alterar o título ou a disciplina ajuda na organização do catálogo oficial.
                            </p>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <Library className="w-3.5 h-3.5 text-muted-foreground" />
                                    Título do Caderno
                                </Label>
                                <Input 
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Ex: Simulado PRF 2024" 
                                    className="h-10 px-4"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold flex items-center gap-2">
                                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                        Disciplina Foco
                                    </Label>
                                    <Select defaultValue={caderno.disciplina === 'Múltiplas' ? 'multiplas' : caderno.disciplina}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Selecione a Matéria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="multiplas">Múltiplas Disciplinas</SelectItem>
                                            {DISCIPLINAS_MOCK.map((d) => (
                                                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                                        Autor Responsável
                                    </Label>
                                    <Input 
                                        defaultValue={caderno.professor}
                                        className="h-10 px-4 bg-muted/50"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                                    Descrição do Caderno
                                </Label>
                                <Textarea 
                                    placeholder="Descreva os objetivos deste material para os alunos..." 
                                    className="min-h-[120px] resize-none"
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                                        <Power className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-semibold text-foreground">Status de Publicação</p>
                                        <p className="text-[11px] text-muted-foreground">Define se o caderno está visível no portal do aluno.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked={caderno.status === 'published'} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/cadernos">
                            <Button variant="ghost" className="h-10 px-6 font-semibold">
                                Cancelar
                            </Button>
                        </Link>
                        <Button className="h-10 px-8 font-semibold gap-2">
                            <Save className="w-4 h-4" />
                            Salvar Alterações
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
