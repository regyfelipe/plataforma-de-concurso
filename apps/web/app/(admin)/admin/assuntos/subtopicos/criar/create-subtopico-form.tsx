"use client"

import * as React from "react"
import { ChevronLeft, Save, X, Bookmark, BookOpen, Layers, Power } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@workspace/ui/components/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { createSubtopico } from "@/actions/admin-taxonomy"

type TopicoOption = {
    id: string
    nome: string
    assunto: {
        nome: string
        disciplina: {
            nome: string
        }
    }
}

export function CreateSubtopicoForm({ topicos }: { topicos: TopicoOption[] }) {
    const [topicoId, setTopicoId] = React.useState("")

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Arquitetura de Conteúdo</p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Criar Novo Subtópico
                </h1>
            </div>

            {/* Formulário Principal */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Hierarquia de Itens</CardTitle>
                    <CardDescription>
                        Subtópicos permitem um detalhamento maior da matéria. Selecione o tópico principal (pai) para vincular este novo item.
                    </CardDescription>
                </CardHeader>
                <form action={createSubtopico}>
                <input type="hidden" name="topicoId" value={topicoId} />
                <CardContent className="space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                                    Tópico Principal (Assunto Pai)
                                </Label>
                                <Select value={topicoId} onValueChange={setTopicoId}>
                                    <SelectTrigger className="w-full h-10">
                                        <SelectValue placeholder="Selecione o Tópico Pai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {topicos.map((a) => (
                                            <SelectItem key={a.id} value={a.id}>
                                                {a.nome} ({a.assunto.disciplina.nome})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                                    Nome do Subtópico
                                </Label>
                                <Input
                                    name="nome"
                                    required
                                    placeholder="Ex: Elementos do Ato Administrativo"
                                    className="h-10"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Power className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-semibold">Status Ativo</p>
                                <p className="text-xs text-muted-foreground">Define se o sub-item aparecerá na árvore de filtros do aluno.</p>
                            </div>
                        </div>
                        <Switch name="ativo" defaultChecked />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href="/admin/assuntos/subtopicos">
                            <Button variant="ghost" size="sm">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" size="sm" className="gap-2">
                            <Save className="w-4 h-4" />
                            Salvar Subtópico
                        </Button>
                    </div>
                </CardContent>
                </form>
            </Card>
        </div>
    )
}
