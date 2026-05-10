"use client"

import * as React from "react"
import { Save, Bookmark, BookOpen, Layers, Power } from "lucide-react"
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
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

import { createAssunto } from "@/actions/admin-taxonomy"

type DisciplinaOption = {
  id: string
  nome: string
}

type AssuntoOption = {
  id: string
  nome: string
  disciplina: {
    nome: string
  }
}

export function CreateAssuntoForm({
  disciplinas,
  assuntos,
}: {
  disciplinas: DisciplinaOption[]
  assuntos: AssuntoOption[]
}) {
  const [disciplinaId, setDisciplinaId] = React.useState("")
  const [assuntoPaiId, setAssuntoPaiId] = React.useState("none")

  const disciplinaSelecionada = disciplinas.find((d) => d.id === disciplinaId)

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-background max-w-7xl mx-auto w-full">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          Arquitetura de Conteúdo
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Criar Tópico ou Subtópico
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Taxonomia Integrada</CardTitle>

          <CardDescription>
            Para criar um Tópico Principal, deixe o campo "Assunto Pai" vazio.
            Para criar um Subtópico, selecione o pai correspondente.
          </CardDescription>
        </CardHeader>

        <form action={createAssunto}>
          <input type="hidden" name="disciplinaId" value={disciplinaId} />

          <input
            type="hidden"
            name="parentId"
            value={assuntoPaiId === "none" ? "" : assuntoPaiId}
          />

          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    Disciplina Vinculada
                  </Label>

                  <Select
                    value={disciplinaId}
                    onValueChange={setDisciplinaId}
                    required
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Selecione a Disciplina">
                        {disciplinaSelecionada?.nome}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {disciplinas.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                    Nome do Assunto
                  </Label>

                  <Input
                    name="nome"
                    required
                    placeholder="Ex: Atos Administrativos"
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
                  <p className="text-sm font-semibold">Status do Item</p>
                  <p className="text-xs text-muted-foreground">
                    Define se o tópico aparecerá na árvore de assuntos do aluno.
                  </p>
                </div>
              </div>

              <Switch name="ativo" defaultChecked />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Link href="/admin/assuntos">
                <Button type="button" variant="ghost" size="sm">
                  Cancelar
                </Button>
              </Link>

              <Button type="submit" size="sm" className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Assunto
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}