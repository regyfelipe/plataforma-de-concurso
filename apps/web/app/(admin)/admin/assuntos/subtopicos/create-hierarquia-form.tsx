"use client"

import * as React from "react"
import { Save, Bookmark, Layers, Power, Target } from "lucide-react"
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

import { createSubtopico, createTopico } from "@/actions/admin-taxonomy"

type AssuntoOption = {
  id: string
  nome: string
  disciplina: {
    nome: string
  }
}

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

export function CreateHierarquiaForm({
  assuntos,
  topicos,
}: {
  assuntos: AssuntoOption[]
  topicos: TopicoOption[]
}) {
  const [tipo, setTipo] = React.useState<"topico" | "subtopico">("topico")
  const [parentId, setParentId] = React.useState("")

  const parentSelecionado =
    tipo === "topico"
      ? assuntos.find((p) => p.id === parentId)
      : topicos.find((p) => p.id === parentId)
  const parentLabel = tipo === "topico"
    ? (() => {
        const parent = parentSelecionado as AssuntoOption | undefined
        return parent ? `${parent.nome} (${parent.disciplina.nome})` : undefined
      })()
    : (() => {
        const parent = parentSelecionado as TopicoOption | undefined
        return parent ? `${parent.nome} (${parent.assunto.disciplina.nome})` : undefined
      })()

  const selectTipo = (nextTipo: "topico" | "subtopico") => {
    setTipo(nextTipo)
    setParentId("")
  }

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
          <CardTitle className="text-base">Definição de Nível</CardTitle>

          <CardDescription>
            Escolha se deseja criar um novo Tópico vinculado a um Assunto ou um
            Subtópico vinculado a um Tópico existente.
          </CardDescription>
        </CardHeader>

        <form action={tipo === "topico" ? createTopico : createSubtopico}>
          <input
            type="hidden"
            name={tipo === "topico" ? "assuntoId" : "topicoId"}
            value={parentId}
          />

          <CardContent className="space-y-8">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => selectTipo("topico")}
                variant={tipo === "topico" ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Novo Tópico
              </Button>

              <Button
                type="button"
                onClick={() => selectTipo("subtopico")}
                variant={tipo === "subtopico" ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <Layers className="w-4 h-4" />
                Novo Subtópico
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  {tipo === "topico" ? (
                    <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  Selecionar {tipo === "topico" ? "Assunto Pai" : "Tópico Pai"}
                </Label>

                <Select value={parentId} onValueChange={(value) => setParentId(value ?? "")} required>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue
                      placeholder={`Selecione o ${
                        tipo === "topico" ? "Assunto" : "Tópico"
                      }`}
                    >
                      {parentLabel}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {tipo === "topico"
                      ? assuntos.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nome} ({p.disciplina.nome})
                          </SelectItem>
                        ))
                      : topicos.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nome} ({p.assunto.disciplina.nome})
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-muted-foreground" />
                  Nome do Novo {tipo === "topico" ? "Tópico" : "Subtópico"}
                </Label>

                <Input
                  name="nome"
                  required
                  placeholder={`Ex: ${
                    tipo === "topico"
                      ? "Elementos do Ato"
                      : "Competência e Finalidade"
                  }`}
                  className="h-10"
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
                  <p className="text-sm font-semibold">Status de Ativação</p>
                  <p className="text-xs text-muted-foreground">
                    Define se este item estará disponível para filtros de
                    questões.
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

              <Button
                type="submit"
                size="sm"
                className="gap-2"
                disabled={!parentId}
              >
                <Save className="w-4 h-4" />
                Salvar {tipo === "topico" ? "Tópico" : "Subtópico"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
