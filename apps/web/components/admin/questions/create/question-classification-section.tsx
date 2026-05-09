"use client"

import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { Card, CardContent } from "@workspace/ui/components/card"

interface QuestionClassificationSectionProps {
    onTypeChange?: (type: string) => void
    onFieldChange?: (field: string, value: string) => void
    values: Record<string, string>
}

export function QuestionClassificationSection({ onTypeChange, onFieldChange, values }: QuestionClassificationSectionProps) {
    // Mocks para demonstração do FilterSelect
    const MOCK_OPTIONS = [
        { label: "Opção Exemplo 1", value: "1" },
        { label: "Opção Exemplo 2", value: "2" },
        { label: "Opção Exemplo 3", value: "3" },
    ]

    const handleFieldChange = (field: string) => (value: string) => {
        if (onFieldChange) onFieldChange(field, value)
        if (field === 'type' && onTypeChange) onTypeChange(value)
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-md bg-muted/10 flex items-center justify-center border">
                    <span className="text-[10px] font-black">1</span>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/70">Classificação da Questão</h2>
            </div>
            <Card className="rounded-xl border shadow-none bg-muted/5">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Linha 1 */}
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Disciplina" 
                            placeholder="Pesquisar disciplina..." 
                            options={MOCK_OPTIONS} 
                            isMulti={false}
                            onValueChange={handleFieldChange('discipline')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Assunto" 
                            placeholder="Pesquisar assunto..." 
                            options={MOCK_OPTIONS} 
                            isMulti={false}
                            onValueChange={handleFieldChange('subject')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Tópico" 
                            placeholder="Pesquisar tópico..." 
                            options={MOCK_OPTIONS} 
                            isMulti={false}
                            onValueChange={handleFieldChange('topic')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Subtópico" 
                            placeholder="Caso tenha..." 
                            options={MOCK_OPTIONS} 
                            isMulti={false}
                            onValueChange={handleFieldChange('subtopic')}
                        />
                    </div>

                    {/* Linha 2 */}
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Banca" 
                            placeholder="Ex: FGV, CESPE" 
                            options={MOCK_OPTIONS} 
                            isMulti={false}
                            onValueChange={handleFieldChange('board')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Órgão/Instituição" 
                            placeholder="Pesquisar órgão..." 
                            options={MOCK_OPTIONS} 
                            isMulti={false}
                            onValueChange={handleFieldChange('institution')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Concurso/Cargo" 
                            placeholder="Ex: Auditor" 
                            options={MOCK_OPTIONS} 
                            isMulti={false}
                            onValueChange={handleFieldChange('career')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Escolaridade" 
                            placeholder="Selecione nível" 
                            options={[
                                { label: "Superior", value: "superior" },
                                { label: "Médio", value: "medio" },
                                { label: "Fundamental", value: "fundamental" }
                            ]} 
                            isMulti={false}
                            onValueChange={handleFieldChange('educationLevel')}
                        />
                    </div>

                    {/* Linha 3 */}
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Ano" 
                            placeholder="Selecione o ano" 
                            options={[
                                { label: "2024", value: "2024" },
                                { label: "2023", value: "2023" },
                                { label: "2022", value: "2022" }
                            ]} 
                            isMulti={false}
                            onValueChange={handleFieldChange('year')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Dificuldade" 
                            placeholder="Nível estimado" 
                            options={[
                                { label: "Muito Fácil", value: "muito_facil" },
                                { label: "Fácil", value: "facil" },
                                { label: "Médio", value: "medio" },
                                { label: "Difícil", value: "dificil" },
                                { label: "Muito Difícil", value: "muito_dificil" }
                            ]} 
                            isMulti={false}
                            onValueChange={handleFieldChange('difficulty')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FilterSelect 
                            label="Tipo da Questão" 
                            placeholder="Formato" 
                            options={[
                                { label: "Múltipla Escolha", value: "multipla_escolha" },
                                { label: "Certo / Errado", value: "certo_errado" }
                            ]} 
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
                            onValueChange={handleFieldChange('isUnique')}
                        />
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
