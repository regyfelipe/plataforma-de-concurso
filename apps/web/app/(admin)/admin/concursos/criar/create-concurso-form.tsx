"use client"

import * as React from "react"
import { ChevronLeft, Save, X, ClipboardList, Landmark, Briefcase, School, Calendar, Power } from "lucide-react"
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
import { createConcurso } from "@/actions/admin-taxonomy"

type Option = {
    id: string
    nome: string
    sigla?: string
}

export function CreateConcursoForm({
    bancas,
    carreiras,
    niveis,
}: {
    bancas: Option[]
    carreiras: Option[]
    niveis: Option[]
}) {
    const [bancaId, setBancaId] = React.useState("none")
    const [carreiraId, setCarreiraId] = React.useState("none")
    const [nivelId, setNivelId] = React.useState("none")

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Gestão de Certames</p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Criar Novo Concurso
                </h1>
            </div>

            {/* Formulário Principal */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Dados do Certame</CardTitle>
                    <CardDescription>
                        O concurso agrupa as questões por ano e instituição. Certifique-se de selecionar os dados corretos.
                    </CardDescription>
                </CardHeader>
                <form action={createConcurso}>
                <input type="hidden" name="bancaId" value={bancaId} />
                <input type="hidden" name="carreiraId" value={carreiraId} />
                <input type="hidden" name="nivelId" value={nivelId} />
                <input type="hidden" name="status" value="previsto" />
                <CardContent className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
                                Nome do Concurso
                            </Label>
                            <Input
                                name="nome"
                                required
                                placeholder="Ex: Polícia Rodoviária Federal 2024"
                                className="h-10"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
                                    Banca Examinadora
                                </Label>
                                <Select value={bancaId} onValueChange={setBancaId}>
                                    <SelectTrigger className="w-full h-10">
                                        <SelectValue placeholder="Selecione a Banca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Não definida</SelectItem>
                                        {bancas.map((b) => (
                                            <SelectItem key={b.id} value={b.id}>{b.sigla} - {b.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    Ano do Certame
                                </Label>
                                <Input
                                    name="ano"
                                    type="number"
                                    placeholder="2024"
                                    className="h-10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                                    Carreira
                                </Label>
                                <Select value={carreiraId} onValueChange={setCarreiraId}>
                                    <SelectTrigger className="w-full h-10">
                                        <SelectValue placeholder="Selecione a Carreira" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Não definida</SelectItem>
                                        {carreiras.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold flex items-center gap-2">
                                    <School className="w-3.5 h-3.5 text-muted-foreground" />
                                    Escolaridade
                                </Label>
                                <Select value={nivelId} onValueChange={setNivelId}>
                                    <SelectTrigger className="w-full h-10">
                                        <SelectValue placeholder="Selecione o Nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Não definido</SelectItem>
                                        {niveis.map((e) => (
                                            <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                <p className="text-sm font-semibold">Status do Concurso</p>
                                <p className="text-xs text-muted-foreground">Ative para permitir o vínculo de questões.</p>
                            </div>
                        </div>
                        <Switch name="ativo" defaultChecked />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href="/admin/concursos">
                            <Button variant="ghost" size="sm">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" size="sm" className="gap-2">
                            <Save className="w-4 h-4" />
                            Salvar Concurso
                        </Button>
                    </div>
                </CardContent>
                </form>
            </Card>
        </div>
    )
}
