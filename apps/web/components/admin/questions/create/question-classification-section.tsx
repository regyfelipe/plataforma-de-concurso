"use client"

import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export interface QuestionTaxonomyOptions {
    disciplinas: { id: string; nome: string; code: string }[]
    assuntos: { id: string; nome: string; disciplinaId: string }[]
    topicos: { id: string; nome: string; assuntoId: string }[]
    subtopicos: { id: string; nome: string; topicoId: string }[]
    bancas: { id: string; nome: string; sigla: string }[]
    concursos: { id: string; nome: string; ano: number | null }[]
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
                    <span className="text-xs font-medium">1</span>
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">Classificação da Questão</h2>
            </div>
            <Card>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Linha 1 */}
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
                            placeholder={hasDisciplina ? "Pesquisar assunto..." : "Selecione a disciplina primeiro"} 
                            options={assuntoOptions} 
                            isMulti={false}
                            value={values.assuntoId}
                            disabled={!hasDisciplina}
                            emptyText="Nenhum assunto vinculado a esta disciplina"
                            onValueChange={handleFieldChange('assuntoId')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Tópico" 
                            placeholder={hasAssunto ? "Pesquisar tópico..." : "Selecione o assunto primeiro"} 
                            options={topicoOptions} 
                            isMulti={false}
                            value={values.topicoId}
                            disabled={!hasAssunto}
                            emptyText="Nenhum tópico vinculado a este assunto"
                            onValueChange={handleFieldChange('topicoId')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Subtópico" 
                            placeholder={hasTopico ? "Caso tenha..." : "Selecione o tópico primeiro"} 
                            options={subtopicoOptions} 
                            isMulti={false}
                            value={values.subtopicoId}
                            disabled={!hasTopico}
                            emptyText="Nenhum subtópico vinculado a este tópico"
                            onValueChange={handleFieldChange('subtopicoId')}
                        />
                    </div>

                    {/* Linha 2 */}
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
                            onValueChange={handleFieldChange('bancaId')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Concurso" 
                            placeholder="Pesquisar Concurso..." 
                            options={taxonomy.concursos.map((concurso) => ({
                                label: concurso.ano ? `${concurso.nome} (${concurso.ano})` : concurso.nome,
                                value: concurso.id,
                            }))} 
                            isMulti={false}
                            value={values.concursoId}
                            onValueChange={(val) => {
                                handleFieldChange('concursoId')(val)
                                // Preenchimento automático do cargo se houver no concurso selecionado
                                const selected = taxonomy.concursos.find(c => c.id === val)
                                if (selected?.cargo) {
                                    onFieldChange?.('cargo', selected.cargo)
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Cargo" 
                            placeholder="Selecione ou digite..." 
                            options={Array.from(new Set(taxonomy.concursos.map(c => (c as any).cargo).filter(Boolean)))
                                .map(cargo => ({ label: cargo as string, value: cargo as string }))
                            }
                            isMulti={false}
                            value={values.cargo}
                            onValueChange={(val) => onFieldChange?.('cargo', val)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Carreira" 
                            placeholder="Ex: Auditor" 
                            options={taxonomy.carreiras.map((carreira) => ({
                                label: carreira.nome,
                                value: carreira.id,
                            }))} 
                            isMulti={false}
                            value={values.carreiraId}
                            onValueChange={handleFieldChange('carreiraId')}
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

                    {/* Linha 3 */}
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Ano" 
                            placeholder="Selecione o ano" 
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
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Tipo da Questão" 
                            placeholder="Formato" 
                            options={typeOptions} 
                            value={values.type}
                            onValueChange={handleFieldChange('type')}
                            isMulti={false}
                        />
                    </div>
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
                </CardContent>
            </Card>
        </section>
    )
}
