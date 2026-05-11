"use client"

import { type CSSProperties, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { FileText, Upload, ClipboardCheck, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { QuestionClassificationSection, type QuestionTaxonomyOptions } from "@/components/admin/questions/create/question-classification-section"
import { importAdminQuestions } from "@/actions/admin-question-import"
import { toast } from "sonner"

const MULTIPLE_CHOICE_SAMPLE = `QUESTÃO 1:
ENUNCIADO:
Texto da primeira questão.

A) Alternativa A.
B) Alternativa B.
C) Alternativa C.
D) Alternativa D.

GABARITO: C

RESOLUÇÃO:
Comentário da primeira questão.

EXPLICAÇÃO A:
...

EXPLICAÇÃO B:
...

QUESTÃO 2:
TEXTO DE APOIO:
Texto base da segunda questão.

ENUNCIADO:
Com base no texto, assinale a correta.

A) Alternativa A.
B) Alternativa B.
C) Alternativa C.
D) Alternativa D.

GABARITO: A

RESOLUÇÃO:
Comentário da segunda questão.

OBJETIVO:
Identificar regra de concordância verbal.

REFERÊNCIA:
Gramática normativa - concordância verbal.

DICA:
Verbos impessoais ficam no singular.

VIDEOAULA:
https://exemplo.com/videoaula`

const TRUE_FALSE_SAMPLE = `QUESTÃO 1:
ENUNCIADO:
Texto da primeira questão.

C) Certo
E) Errado

GABARITO: C

RESOLUÇÃO:
Comentário da primeira questão.

EXPLICAÇÃO C:
Correta. Justificativa da afirmação.

EXPLICAÇÃO E:
Errada. Justificativa da alternativa.

QUESTÃO 2:
TEXTO DE APOIO:
Texto base da segunda questão.

ENUNCIADO:
Com base no texto, julgue o item.

C) Certo
E) Errado

GABARITO: E

RESOLUÇÃO:
Comentário da segunda questão.

OBJETIVO:
Identificar regra de concordância verbal.

REFERÊNCIA:
Gramática normativa - concordância verbal.

DICA:
Verbos impessoais ficam no singular.

VIDEOAULA:
https://exemplo.com/videoaula`

export function ImportQuestionsForm({ taxonomy }: { taxonomy: QuestionTaxonomyOptions }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [classification, setClassification] = useState<Record<string, string>>({
    type: "multipla_escolha",
    tipoId: "",
    disciplinaId: "",
    assuntoId: "",
    topicoId: "",
    subtopicoId: "",
    bancaId: "",
    concursoId: "",
    cargo: "",
    carreiraId: "",
    nivelId: "",
    dificuldadeId: "",
    year: String(new Date().getFullYear()),
    isUnique: "nao",
  })
  const [content, setContent] = useState("")
  const [result, setResult] = useState<{ imported: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleImport() {
    setError(null)
    setResult(null)

    startTransition(async () => {
      try {
        const response = await importAdminQuestions({
          content,
          defaults: {
            disciplinaId: classification.disciplinaId,
            assuntoId: classification.assuntoId,
            topicoId: classification.topicoId,
            subtopicoId: classification.subtopicoId,
            bancaId: classification.bancaId,
            concursoId: classification.concursoId,
            carreiraId: classification.carreiraId,
            nivelId: classification.nivelId,
            dificuldadeId: classification.dificuldadeId,
            tipoId: classification.tipoId,
            cargo: classification.cargo,
            year: classification.year,
            isUnique: classification.isUnique as "sim" | "nao",
          },
        })
        setResult({ imported: response.imported })
        setContent("")
        toast.success(`${response.imported} questão(ões) enviada(s) para revisão.`)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Não foi possível importar as questões."
        setError(message)
        toast.error(message)
      }
    })
  }

  function handleFieldChange(field: string, value: string) {
    setClassification((current) => {
      const next = { ...current, [field]: value }

      if (field === "type") {
        const selectedType = taxonomy.tiposQuestao.find((type) => type.slug === value)
        next.tipoId = selectedType?.id ?? ""
      }

      if (field === "disciplinaId") {
        next.assuntoId = ""
        next.topicoId = ""
        next.subtopicoId = ""
      }

      if (field === "assuntoId") {
        next.topicoId = ""
        next.subtopicoId = ""
      }

      if (field === "topicoId") {
        next.subtopicoId = ""
      }

      return next
    })
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    const name = file.name.toLowerCase()

    if (!name.endsWith(".txt") && !name.endsWith(".json")) {
      setError("Envie um arquivo .txt ou .json.")
      return
    }

    if (file.size > 500_000) {
      setError("O arquivo deve ter no máximo 500KB.")
      return
    }

    setContent(await file.text())
    setError(null)
    setResult(null)
  }

  function handleUseExample() {
    const selectedType = taxonomy.tiposQuestao.find((type) => type.id === classification.tipoId || type.slug === classification.type)
    const isTrueFalse = selectedType?.modelo === "certo_errado" || selectedType?.slug?.includes("certo")

    setContent(isTrueFalse ? TRUE_FALSE_SAMPLE : MULTIPLE_CHOICE_SAMPLE)
    setError(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-border/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <FileText className="h-3 w-3" />
                Word / texto
              </Badge>
              <Badge variant="outline">Vai para revisão</Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Importar Questões <span className="text-primary">.</span>
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Cole o texto do Word ou envie um arquivo de texto. Todas as questões importadas entram como rascunho e aparecem em revisão antes de serem publicadas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json,text/plain,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Enviar arquivo
            </Button>
            <Button variant="outline" size="sm" onClick={handleUseExample}>
              Usar exemplo
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Importação bloqueada</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert>
            <ClipboardCheck className="h-4 w-4" />
            <AlertTitle>Importação concluída</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              <span>{result.imported} questão(ões) enviada(s) para revisão.</span>
              <Button nativeButton={false} size="sm" render={<Link href="/admin/questoes/revisao" />}>
                Abrir revisão
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <QuestionClassificationSection
          values={classification}
          taxonomy={taxonomy}
          onFieldChange={handleFieldChange}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Questões para importar</CardTitle>
              <CardDescription>Cole abaixo as questões copiadas do Word. A classificação selecionada acima será aplicada a todo o lote.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={classification.type?.includes("certo") ? TRUE_FALSE_SAMPLE : MULTIPLE_CHOICE_SAMPLE}
                className="h-[520px] max-h-[70vh] min-h-[320px] resize-y overflow-y-auto font-mono text-xs leading-relaxed"
                spellCheck={false}
                style={{ fieldSizing: "fixed" } as CSSProperties}
              />
              <div className="flex justify-end">
                <Button onClick={handleImport} disabled={isPending || content.trim().length === 0}>
                  {isPending ? "Importando..." : "Importar para Revisão"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras do lote</CardTitle>
              <CardDescription>Validações aplicadas antes de salvar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-lg border p-3">
                <p className="font-medium text-foreground">Destino</p>
                <p>As questões importadas são salvas como rascunho e aparecem em revisão.</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-foreground">Formato do professor</p>
                <p>Use QUESTÃO:, A), B), GABARITO:, RESOLUÇÃO: e EXPLICAÇÃO A: quando houver explicação por alternativa.</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-foreground">Alternativas</p>
                <p>Cada questão precisa ter de 2 a 5 alternativas e exatamente uma correta no gabarito.</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-foreground">Taxonomia</p>
                <p>Os filtros preenchidos acima viram padrão para todas as questões coladas. Linhas no texto ainda podem sobrescrever uma questão específica.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
