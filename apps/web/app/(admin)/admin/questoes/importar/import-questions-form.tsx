"use client"

import { type CSSProperties, useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { FileText, Upload, ClipboardCheck, ArrowRight, AlertCircle, SearchCheck, Info, AlertTriangle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { QuestionClassificationSection, type QuestionTaxonomyOptions } from "@/components/admin/questions/create/question-classification-section"
import { analyzeAdminQuestionImport, importAdminQuestions } from "@/actions/admin-question-import"
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

type ImportHistoryItem = {
  id: string
  arquivoNome: string | null
  tipoArquivo: string
  status: "processando" | "validado" | "com_erro" | "importado" | "cancelado"
  totalQuestoes: number
  totalImportadas: number
  totalErros: number
  totalAvisos: number
  erros: unknown
  avisos: unknown
  criadoEm: string
  usuario: string
}

const STATUS_LABEL: Record<ImportHistoryItem["status"], string> = {
  processando: "Processando",
  validado: "Validado",
  com_erro: "Com erro",
  importado: "Importado",
  cancelado: "Cancelado",
}

export function ImportQuestionsForm({
  taxonomy,
  history,
}: {
  taxonomy: QuestionTaxonomyOptions
  history: ImportHistoryItem[]
}) {
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
  const [fileMeta, setFileMeta] = useState<{ name?: string; type?: string }>({ type: "texto" })
  const [result, setResult] = useState<{ imported: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<Awaited<ReturnType<typeof analyzeAdminQuestionImport>> | null>(null)
  const [isPending, startTransition] = useTransition()

  const importPayload = {
    content,
    fileName: fileMeta.name,
    fileType: fileMeta.type,
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
  }

  useEffect(() => {
    const draft = window.localStorage.getItem("question-import-draft")
    if (!draft) return

    try {
      const parsed = JSON.parse(draft) as { content?: string; classification?: Record<string, string> }
      window.queueMicrotask(() => {
        if (parsed.content) setContent(parsed.content)
        if (parsed.classification) {
          setClassification((current) => ({ ...current, ...parsed.classification }))
        }
      })
    } catch {
      window.localStorage.removeItem("question-import-draft")
    }
  }, [])

  function handleSaveDraft() {
    window.localStorage.setItem(
      "question-import-draft",
      JSON.stringify({
        content,
        classification,
        savedAt: new Date().toISOString(),
      })
    )
    toast.success("Rascunho da importação salvo neste navegador.")
  }

  function handleImport() {
    setError(null)
    setResult(null)

    startTransition(async () => {
      try {
        const response = await importAdminQuestions(importPayload)
        setResult({ imported: response.imported })
        setContent("")
        setAnalysis(null)
        toast.success(`${response.imported} questão(ões) enviada(s) para revisão.`)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Não foi possível importar as questões."
        setError(message)
        toast.error(message)
      }
    })
  }

  function handleAnalyze() {
    setError(null)
    setResult(null)

    startTransition(async () => {
      try {
        const response = await analyzeAdminQuestionImport(importPayload)
        setAnalysis(response)
        toast.success(`${response.total} questão(ões) analisada(s).`)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Não foi possível analisar as questões."
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

    if (name.endsWith(".xlsx") || name.endsWith(".docx") || name.endsWith(".pdf")) {
      setError("Este formato ainda precisa de parser próprio. Por enquanto, cole o texto do Word ou envie .txt, .csv ou .json.")
      return
    }

    if (!name.endsWith(".txt") && !name.endsWith(".json") && !name.endsWith(".csv")) {
      setError("Envie um arquivo .txt, .csv ou .json.")
      return
    }

    if (file.size > 500_000) {
      setError("O arquivo deve ter no máximo 500KB.")
      return
    }

    setContent(await file.text())
    setFileMeta({ name: file.name, type: name.endsWith(".json") ? "json" : name.endsWith(".csv") ? "csv" : "txt" })
    setError(null)
    setResult(null)
    setAnalysis(null)
  }

  function handleUseExample() {
    const selectedType = taxonomy.tiposQuestao.find((type) => type.id === classification.tipoId || type.slug === classification.type)
    const isTrueFalse = selectedType?.modelo === "certo_errado" || selectedType?.slug?.includes("certo")

    setContent(isTrueFalse ? TRUE_FALSE_SAMPLE : MULTIPLE_CHOICE_SAMPLE)
    setFileMeta({ type: "texto" })
    setError(null)
    setResult(null)
    setAnalysis(null)
  }

  function downloadJson(filename: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function handleNewImport() {
    setContent("")
    setFileMeta({ type: "texto" })
    setError(null)
    setResult(null)
    setAnalysis(null)
    window.localStorage.removeItem("question-import-draft")
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
              accept=".txt,.csv,.json,.xlsx,.docx,.pdf,text/plain,text/csv,application/json"
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
            <AlertDescription>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>{result.imported} questão(ões) enviada(s) para revisão.</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button nativeButton={false} size="sm" render={<Link href="/admin/questoes/revisao" />}>
                    Ver questões importadas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNewImport}>
                    Nova importação
                  </Button>
                </div>
              </div>
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
                onChange={(event) => {
                  setContent(event.target.value)
                  setAnalysis(null)
                  setResult(null)
                }}
                placeholder={classification.type?.includes("certo") ? TRUE_FALSE_SAMPLE : MULTIPLE_CHOICE_SAMPLE}
                className="h-[520px] max-h-[70vh] min-h-[320px] resize-y overflow-y-auto font-mono text-xs leading-relaxed"
                spellCheck={false}
                style={{ fieldSizing: "fixed" } as CSSProperties}
              />
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

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Preview parseado</CardTitle>
              <CardDescription>
                {analysis.total} questão(ões), {analysis.errors} erro(s), {analysis.warnings} aviso(s), {analysis.infos} informação(ões).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.items.map((item) => {
                const state = item.errors.length > 0 ? "erro" : item.warnings.length > 0 ? "aviso" : "sucesso"
                return (
                  <div key={item.index} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Questão {item.index}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.title}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          state === "erro"
                            ? "border-destructive/40 text-destructive"
                            : state === "aviso"
                              ? "border-yellow-500/40 text-yellow-600"
                              : "border-emerald-500/40 text-emerald-600"
                        }
                      >
                        {state}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                      <span>Alternativas: {item.alternatives}</span>
                      <span>Gabarito: {item.correctLetter}</span>
                      <span>Bloqueios: {item.errors.length}</span>
                    </div>
                    {item.errors.map((message) => (
                      <p key={message} className="mt-2 flex items-center gap-2 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" /> {message}
                      </p>
                    ))}
                    {item.warnings.map((message) => (
                      <p key={message} className="mt-2 flex items-center gap-2 text-xs text-yellow-600">
                        <AlertTriangle className="h-3 w-3" /> {message}
                      </p>
                    ))}
                    {item.infos.map((message) => (
                      <p key={message} className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-3 w-3" /> {message}
                      </p>
                    ))}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Histórico de importações</CardTitle>
            <CardDescription>Últimos lotes processados pela equipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Questões</TableHead>
                  <TableHead className="text-center">Erros</TableHead>
                  <TableHead className="text-right">Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length > 0 ? (
                  history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{item.arquivoNome || "Texto colado"}</p>
                          <p className="text-xs text-muted-foreground">{item.tipoArquivo}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.usuario}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "com_erro"
                              ? "border-destructive/40 text-destructive"
                              : item.status === "validado"
                                ? "border-blue-500/40 text-blue-600"
                                : item.status === "importado"
                                  ? "border-emerald-500/40 text-emerald-600"
                                  : "border-yellow-500/40 text-yellow-600"
                          }
                        >
                          {STATUS_LABEL[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">
                        {item.totalImportadas}/{item.totalQuestoes}
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">{item.totalErros}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(item.criadoEm))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={item.totalErros === 0 && item.totalAvisos === 0}
                          onClick={() => downloadJson(`importacao-${item.id}.json`, { erros: item.erros, avisos: item.avisos })}
                        >
                          Relatório
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      Nenhuma importação registrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Button nativeButton={false} variant="outline" render={<Link href="/admin/questoes" />}>
            Cancelar
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={content.trim().length === 0}>
              Salvar rascunho
            </Button>
            <Button variant="outline" onClick={handleAnalyze} disabled={isPending || content.trim().length === 0}>
              <SearchCheck className="mr-2 h-4 w-4" />
              {isPending ? "Analisando..." : "Analisar questões"}
            </Button>
            <Button
              onClick={handleImport}
              disabled={isPending || content.trim().length === 0 || !analysis || analysis.errors > 0}
            >
              {isPending ? "Importando..." : "Importar para revisão"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
