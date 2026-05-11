"use client"

import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { Card, CardContent } from "@workspace/ui/components/card"

export interface QuestionTaxonomyOptions {
    disciplinas: { id: string; nome: string; code: string }[]
    assuntos: { id: string; nome: string; disciplinaId: string }[]
    topicos: { id: string; nome: string; assuntoId: string }[]
    subtopicos: { id: string; nome: string; topicoId: string }[]
    bancas: { id: string; nome: string; sigla: string }[]
    concursos: { id: string; nome: string; ano: number | null; cargo?: string | null; bancaId?: string | null; carreiraId?: string | null }[]
    carreiras: { id: string; nome: string }[]
    niveis: { id: string; nome: string }[]
    dificuldades: { id: string; nome: string; slug: string }[]
    tiposQuestao: { 
        id: string; 
        nome: string; 
        slug: string; 
        modelo: string | null; 
        quantidadeAlternativas: number | null 
    }[]
}

interface QuestionClassificationSectionProps {
    onTypeChange?: (type: string) => void
    onFieldChange?: (field: string, value: string) => void
    values: Record<string, string>
    taxonomy: QuestionTaxonomyOptions
}

export function QuestionClassificationSection({ onTypeChange, onFieldChange, values, taxonomy }: QuestionClassificationSectionProps) {
    const handleFieldChange = (field: string) => (value: string) => {
        if (field === "type") {
            const selectedType = taxonomy.tiposQuestao.find((type) => type.slug === value)
            onFieldChange?.("type", value)
            onFieldChange?.("tipoId", selectedType?.id ?? "")
            onTypeChange?.(value)
            return
        }

        onFieldChange?.(field, value)
    }

    const hasDisciplina = Boolean(values.disciplinaId)
    const hasAssunto = Boolean(values.assuntoId)
    const hasTopico = Boolean(values.topicoId)

    const assuntoOptions = hasDisciplina
        ? taxonomy.assuntos
            .filter((assunto) => assunto.disciplinaId === values.disciplinaId)
            .map((assunto) => ({ label: assunto.nome, value: assunto.id }))
        : []

    const topicoOptions = hasAssunto
        ? taxonomy.topicos
            .filter((topico) => topico.assuntoId === values.assuntoId)
            .map((topico) => ({ label: topico.nome, value: topico.id }))
        : []

    const subtopicoOptions = hasTopico
        ? taxonomy.subtopicos
            .filter((subtopico) => subtopico.topicoId === values.topicoId)
            .map((subtopico) => ({ label: subtopico.nome, value: subtopico.id }))
        : []

    const typeOptions = taxonomy.tiposQuestao.length > 0
        ? taxonomy.tiposQuestao.map((type) => ({ label: type.nome, value: type.slug }))
        : [
            { label: "Múltipla Escolha", value: "multipla_escolha" },
            { label: "Certo / Errado", value: "certo_errado" },
        ]

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-6 w-6 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-xs font-black">1</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Classificação da Questão</h2>
            </div>
            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-6 space-y-8">
                    {/* Linha 1: DISCIPLINA | ASSUNTO | TOPICO | SUBTOPICO | DIFICULDADE */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Disciplina" 
                                placeholder="Pesquisar disciplina..." 
                                options={taxonomy.disciplinas.map((disciplina) => ({
                                    label: `${disciplina.code} - ${disciplina.nome}`,
                                    value: disciplina.id,
                                }))} 
                                isMulti={false}
                                value={values.disciplinaId}
                                onValueChange={handleFieldChange('disciplinaId')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Assunto" 
                                placeholder={hasDisciplina ? "Pesquisar assunto..." : "Selecione a disciplina"} 
                                options={assuntoOptions} 
                                isMulti={false}
                                value={values.assuntoId}
                                disabled={!hasDisciplina}
                                emptyText="Nenhum assunto vinculado"
                                onValueChange={handleFieldChange('assuntoId')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Tópico" 
                                placeholder={hasAssunto ? "Pesquisar tópico..." : "Selecione o assunto"} 
                                options={topicoOptions} 
                                isMulti={false}
                                value={values.topicoId}
                                disabled={!hasAssunto}
                                emptyText="Nenhum tópico vinculado"
                                onValueChange={handleFieldChange('topicoId')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Subtópico" 
                                placeholder={hasTopico ? "Caso tenha..." : "Selecione o tópico"} 
                                options={subtopicoOptions} 
                                isMulti={false}
                                value={values.subtopicoId}
                                disabled={!hasTopico}
                                emptyText="Nenhum subtópico vinculado"
                                onValueChange={handleFieldChange('subtopicoId')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Dificuldade" 
                                placeholder="Nível estimado" 
                                options={taxonomy.dificuldades.map((dificuldade) => ({
                                    label: dificuldade.nome,
                                    value: dificuldade.id,
                                }))} 
                                isMulti={false}
                                value={values.dificuldadeId}
                                onValueChange={handleFieldChange('dificuldadeId')}
                            />
                        </div>
                    </div>

                    {/* Linha 2: BANCA | ORGAO(CARREIRA) | CONCURSO | CARGO | TIPO DE COBRANÇA */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Banca" 
                                placeholder="Ex: FGV, CESPE" 
                                options={taxonomy.bancas.map((banca) => ({
                                    label: banca.sigla,
                                    value: banca.id,
                                }))} 
                                isMulti={false}
                                value={values.bancaId}
                                onValueChange={(val) => {
                                    handleFieldChange('bancaId')(val)
                                    // Se mudar a banca e o concurso atual não for dessa banca, limpa o concurso
                                    if (values.concursoId) {
                                        const conc = taxonomy.concursos.find(c => c.id === values.concursoId)
                                        if (conc && conc.bancaId !== val) {
                                            handleFieldChange('concursoId')("")
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Órgão (Carreira)" 
                                placeholder="Ex: PRF, PF" 
                                options={taxonomy.carreiras.map((carreira) => ({
                                    label: carreira.nome,
                                    value: carreira.id,
                                }))} 
                                isMulti={false}
                                value={values.carreiraId}
                                onValueChange={(val) => {
                                    handleFieldChange('carreiraId')(val)
                                    // Se mudar a carreira e o concurso atual não for dessa carreira, limpa o concurso
                                    if (values.concursoId) {
                                        const conc = taxonomy.concursos.find(c => c.id === values.concursoId)
                                        if (conc && conc.carreiraId !== val) {
                                            handleFieldChange('concursoId')("")
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Concurso" 
                                placeholder="Pesquisar..." 
                                options={taxonomy.concursos
                                    .filter(c => {
                                        const matchBanca = !values.bancaId || c.bancaId === values.bancaId
                                        const matchCarreira = !values.carreiraId || c.carreiraId === values.carreiraId
                                        return matchBanca && matchCarreira
                                    })
                                    .map((concurso) => ({
                                        label: concurso.ano ? `${concurso.nome} (${concurso.ano})` : concurso.nome,
                                        value: concurso.id,
                                    }))} 
                                isMulti={false}
                                value={values.concursoId}
                                onValueChange={(val) => {
                                    handleFieldChange('concursoId')(val)
                                    const selected = taxonomy.concursos.find(c => c.id === val)
                                    if (selected) {
                                        if (selected.cargo) {
                                            onFieldChange?.('cargo', selected.cargo)
                                        }
                                        if (selected.carreiraId) {
                                            handleFieldChange('carreiraId')(selected.carreiraId)
                                        }
                                        if (selected.bancaId) {
                                            handleFieldChange('bancaId')(selected.bancaId)
                                        }
                                        if (selected.ano) {
                                            handleFieldChange('year')(String(selected.ano))
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Cargo" 
                                placeholder="Ex: Agente" 
                                options={Array.from(new Set(taxonomy.concursos.map(c => c.cargo).filter(Boolean)))
                                    .map(cargo => ({ label: cargo ?? "", value: cargo ?? "" }))
                                }
                                isMulti={false}
                                value={values.cargo}
                                onValueChange={(val) => onFieldChange?.('cargo', val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Tipo de Cobrança" 
                                placeholder="Ex: Doutrina, Lei" 
                                options={[
                                    { label: "Lei Seca", value: "lei_seca" },
                                    { label: "Doutrina", value: "doutrina" },
                                    { label: "Jurisprudência", value: "jurisprudencia" },
                                    { label: "Súmulas", value: "sumulas" },
                                ]} 
                                isMulti={false}
                                value={values.tipoCobranca || ""}
                                onValueChange={(val) => onFieldChange?.('tipoCobranca', val)}
                            />
                        </div>
                    </div>

                    {/* Linha 3: QUESTAO INEDITA | FONTE | TEMPO ESTIMADO | TIPO DE QUESTAO | NIVEL DE ESCOLARIDADE */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Questão Inédita?" 
                                placeholder="Selecione" 
                                options={[
                                    { label: "Sim", value: "sim" },
                                    { label: "Não", value: "nao" }
                                ]} 
                                isMulti={false}
                                value={values.isUnique}
                                onValueChange={handleFieldChange('isUnique')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Fonte" 
                                placeholder="Ano ou Origem" 
                                options={Array.from({ length: new Date().getFullYear() - 2000 + 2 }, (_, i) => {
                                    const year = (new Date().getFullYear() + 1 - i).toString();
                                    return { label: year, value: year };
                                })} 
                                isMulti={false}
                                value={values.year}
                                onValueChange={handleFieldChange('year')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Tempo Estimado" 
                                placeholder="Ex: 2 min" 
                                options={[
                                    { label: "1 minuto", value: "60" },
                                    { label: "2 minutos", value: "120" },
                                    { label: "3 minutos", value: "180" },
                                    { label: "4 minutos", value: "240" },
                                    { label: "5 minutos", value: "300" },
                                ]} 
                                isMulti={false}
                                value={values.tempoEstimado || ""}
                                onValueChange={(val) => onFieldChange?.('tempoEstimado', val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Tipo de Questão" 
                                placeholder="Formato" 
                                options={typeOptions} 
                                value={values.type}
                                onValueChange={handleFieldChange('type')}
                                isMulti={false}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FilterSelect 
                                label="Escolaridade" 
                                placeholder="Selecione nível" 
                                options={taxonomy.niveis.map((nivel) => ({
                                    label: nivel.nome,
                                    value: nivel.id,
                                }))} 
                                isMulti={false}
                                value={values.nivelId}
                                onValueChange={handleFieldChange('nivelId')}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
