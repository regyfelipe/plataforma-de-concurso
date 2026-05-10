"use client"

import * as React from "react"
import { ChevronLeft, Save, X, BookOpen, Hash, AlignLeft, Power } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { createDisciplina } from "@/actions/admin-taxonomy"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export default function CriarDisciplinaPage() {
    const [nome, setNome] = React.useState("")
    const [codigo, setCodigo] = React.useState("")
    const [isManual, setIsManual] = React.useState(false)

    // Função para gerar o código/sigla automaticamente
    const generateCode = (name: string) => {
        return name
            .split(' ')
            .filter(word => word.length > 2) // Pula "de", "da", "do", etc.
            .map(word => word.substring(0, 3).toUpperCase())
            .join('-')
    }

    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setNome(val)
        if (!isManual) {
            setCodigo(generateCode(val))
        }
    }

    const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCodigo(e.target.value.toUpperCase())
        setIsManual(true) // Se o usuário digitou, desativa o automático
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background max-w-7xl mx-auto w-full">
            
            {/* Header de Navegação */}
            <div className="space-y-4">
                

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Gestão de Conteúdo</p>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Criar Nova Disciplina
                        </h1>
                    </div>
                </div>
            </div>

            {/* Formulário Principal */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Informações da Disciplina</CardTitle>
                    <CardDescription>
                        Defina os detalhes básicos para identificação da nova disciplina no sistema.
                    </CardDescription>
                </CardHeader>
                <form action={createDisciplina}>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                Nome da Disciplina
                            </Label>
                            <Input 
                                name="nome"
                                required
                                value={nome}
                                onChange={handleNomeChange}
                                placeholder="Ex: Direito Administrativo" 
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                Código / Sigla
                            </Label>
                            <Input 
                                name="code"
                                required
                                value={codigo}
                                onChange={handleCodigoChange}
                                placeholder="Ex: DIR-ADM" 
                                className="h-10 font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-2">
                            <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                            Descrição Completa
                        </Label>
                        <Textarea 
                            name="descricao"
                            placeholder="Descreva os principais tópicos cobertos por esta disciplina..." 
                            className="min-h-[120px] resize-none"
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Power className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-semibold">Status Ativo</p>
                                <p className="text-xs text-muted-foreground">Define se a disciplina estará disponível para novas questões e simulados.</p>
                            </div>
                        </div>
                        <Switch name="ativo" defaultChecked />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href="/admin/disciplinas">
                            <Button variant="ghost" size="sm">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" size="sm" className="gap-2">
                            <Save className="w-4 h-4" />
                            Salvar Disciplina
                        </Button>
                    </div>
                </CardContent>
                </form>
            </Card>
        </div>
    )
  }
