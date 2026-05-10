"use client"

import * as React from "react"
import { ChevronLeft, Save, X, SignalHigh, Hash, Power } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { createDificuldade } from "@/actions/admin-taxonomy"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export default function CriarDificuldadePage() {
    const [nome, setNome] = React.useState("")
    const [slug, setSlug] = React.useState("")

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background max-w-7xl mx-auto w-full">
            
            {/* Header */}
            <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Configurações de Sistema</p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Criar Nível de Dificuldade
                </h1>
            </div>

            {/* Formulário Principal */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Escala de Dificuldade</CardTitle>
                    <CardDescription>
                        Defina os níveis que serão atribuídos às questões para controle de complexidade.
                    </CardDescription>
                </CardHeader>
                <form action={createDificuldade}>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <SignalHigh className="w-3.5 h-3.5 text-muted-foreground" />
                                Nome do Nível
                            </Label>
                            <Input 
                                name="nome"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: Muito Difícil" 
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                Slug / Identificador
                            </Label>
                            <Input 
                                name="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                                placeholder="Ex: muito_dificil" 
                                className="h-10 font-mono text-xs"
                            />
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
                                <p className="text-xs text-muted-foreground">Define se este nível poderá ser selecionado ao criar questões.</p>
                            </div>
                        </div>
                        <Switch name="ativo" defaultChecked />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href="/admin/dificuldade">
                            <Button variant="ghost" size="sm">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" size="sm" className="gap-2">
                            <Save className="w-4 h-4" />
                            Salvar Nível
                        </Button>
                    </div>
                </CardContent>
                </form>
            </Card>
        </div>
    )
}
