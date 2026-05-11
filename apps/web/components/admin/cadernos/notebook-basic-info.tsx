"use client"

import { Layout, Library, AlignLeft } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import type { NotebookFormState } from "@/app/(admin)/admin/cadernos/criar/create-notebook-form"
 
type FilterOption = { label: string; value: string }
 
interface NotebookBasicInfoProps {
    values: NotebookFormState
    options: {
        concursos: FilterOption[]
        disciplinas: FilterOption[]
    }
    onChange: <K extends keyof NotebookFormState>(field: K, value: NotebookFormState[K]) => void
}

export function NotebookBasicInfo({ values, options, onChange }: NotebookBasicInfoProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Layout className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Identidade do Caderno</CardTitle>
                        <CardDescription className="text-xs">
                            Defina como o caderno será apresentado aos alunos.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Coluna 1: Título */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <Library className="w-3.5 h-3.5 text-muted-foreground" />
                            Título do Caderno
                        </Label>
                        <Input
                            value={values.nome}
                            onChange={(event) => onChange("nome", event.target.value)}
                            placeholder="Ex: PRF 2027 • Direito Constitucional • Agente Administrativo"
                            className="h-12 text-sm"
                        />
                    </div>

                    {/* Coluna 2: Descrição */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                            Descrição Estratégica
                        </Label>
                        <Textarea
                            value={values.descricao}
                            onChange={(event) => onChange("descricao", event.target.value)}
                            placeholder="Descreva o foco deste conjunto de questões e dicas para o estudo..."
                            className="h-12 min-h-[48px] resize-none text-sm"
                        />
                    </div>
                </div>


                {/* Grid de Metadados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <FilterSelect 
                            label="Concurso Base"
                            placeholder="Selecione o Concurso"
                            options={options.concursos}
                            isMulti={false}
                            value={values.concursoId}
                            onValueChange={(value) => onChange("concursoId", value)}
                        />
                    </div>
 
                    <div className="space-y-2">
                        <FilterSelect 
                            label="Disciplina Principal"
                            placeholder="Selecione a Disciplina"
                            options={options.disciplinas}
                            isMulti={false}
                            value={values.disciplinaId}
                            onValueChange={(value) => onChange("disciplinaId", value)}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
