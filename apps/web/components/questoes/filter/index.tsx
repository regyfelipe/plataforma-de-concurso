"use client"

import * as React from "react"
import { Search, Plus, BookOpen, Trash2, X, ChevronUp, ChevronDown, Filter as FilterIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { CareerCarousel } from "./career-carousel"
import { FilterSelect } from "./filter-select"
import { 
    DISCIPLINAS_MOCK, 
    BANCAS_MOCK, 
    ASSUNTOS_MOCK, 
    ANOS_MOCK,
    ESCOLARIDADE_MOCK,
    DIFICULDADE_MOCK,
    ALTERNATIVAS_MOCK,
    PROFESSOR_INDICA_MOCK,
    CARGOS_MOCK,
    CADERNOS_PROFESSOR_MOCK,
    TOPICOS_MOCK
} from "@/mocks/filter-options"

type FilterOption = { label: string; value: string }

type ActiveFilter = {
    id: string
    label: string
    category: string
}

interface QuestionFilterOptions {
    disciplinas?: FilterOption[]
    assuntos?: FilterOption[]
    topicos?: FilterOption[]
    bancas?: FilterOption[]
    concursos?: {
        id: string
        name: string
        sigla?: string
        ano?: number | string
        status?: string
        logoUrl?: string
        icon?: "shield" | "scale" | "landmark" | "target"
    }[]
    cargos?: FilterOption[]
    carreiras?: FilterOption[]
    escolaridades?: FilterOption[]
    anos?: FilterOption[]
    dificuldades?: FilterOption[]
}

interface QuestionFilterProps {
    options?: QuestionFilterOptions
}

export function QuestionFilter({ options }: QuestionFilterProps) {
    const [isExpanded, setIsExpanded] = React.useState(true)
    const [selectedConcurso, setSelectedConcurso] = React.useState('all')
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([])

    const removeFilter = (id: string) => {
        if (id.startsWith('concurso-')) setSelectedConcurso('all')
        setActiveFilters(prev => prev.filter(f => f.id !== id))
    }

    const handleConcursoSelect = (concursoId: string, concursoName: string) => {
        setSelectedConcurso(concursoId)
        setActiveFilters(prev => prev.filter(f => f.category !== 'concurso'))
        if (concursoId !== 'all') {
            setActiveFilters(prev => [
                ...prev, 
                { id: `concurso-${concursoId}`, label: `Concurso: ${concursoName}`, category: 'concurso' }
            ])
        }
    }

    return (
        <div className="w-full flex flex-col gap-6 mb-12 animate-in fade-in duration-700">
            {/* Seção 1: Concursos */}
            <CareerCarousel activeId={selectedConcurso} concursos={options?.concursos} onSelect={handleConcursoSelect} />

            {/* Seção Dashboard Principal */}
            <div className="bg-background/40 backdrop-blur-3xl border border-border/40 rounded-[2rem] shadow-sm overflow-hidden transition-all duration-500 ease-in-out">
                
                {/* Cabeçalho do Dashboard / Barra de Controle */}
                <div className="px-6 py-4 border-b border-border/10 flex items-center justify-between bg-muted/5">
                    <div className="flex items-center gap-3">
                        <FilterIcon className="w-4 h-4 text-primary/60" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Painel de Filtros</h3>
                    </div>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-primary/5 text-[10px] font-bold text-primary transition-all group"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                                Recolher Filtros
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                Expandir Filtros
                            </>
                        )}
                    </button>
                </div>

                <div className={`p-6 space-y-6 transition-all duration-500 ${isExpanded ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 py-0 pointer-events-none"}`}>
                    {/* Linha de Busca e Disciplinas */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-3 space-y-1.5">
                            <div className="h-3" />
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Palavra-chave ou código..."
                                    className="pl-11 bg-muted/20 border-none rounded-2xl h-10 text-sm focus-visible:ring-2 focus-visible:ring-primary/5"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <FilterSelect label="Disciplinas" placeholder="Todas as matérias" options={options?.disciplinas ?? DISCIPLINAS_MOCK} />
                        </div>
                        <div className="lg:col-span-3">
                            <FilterSelect label="Assuntos" placeholder="Selecione o assunto" options={options?.assuntos ?? ASSUNTOS_MOCK} />
                        </div>
                        <div className="lg:col-span-3">
                            <FilterSelect label="Tópicos" placeholder="Selecione o tópico" options={options?.topicos ?? TOPICOS_MOCK ?? []} />
                        </div>
                    </div>

                    {/* Grid secundário de filtros */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                        <FilterSelect label="Bancas" placeholder="Selecione a Bancas" options={options?.bancas ?? BANCAS_MOCK} />
                        <FilterSelect label="Carreira" placeholder="Selecione a carreira" options={options?.carreiras ?? []} />
                        <FilterSelect label="Cargo" placeholder="Selecione o cargo" options={options?.cargos ?? []} />
                        <FilterSelect label="Escolaridade" placeholder="Selecione a Escolaridade" options={options?.escolaridades ?? ESCOLARIDADE_MOCK} />
                        <FilterSelect label="Ano" placeholder="Selecione o Ano" options={options?.anos ?? ANOS_MOCK} />
                        <FilterSelect label="Número de Alternativas" placeholder="4 ou 5" options={ALTERNATIVAS_MOCK} />
                        <FilterSelect label="Nível de Dificuldade" placeholder="Todos" options={options?.dificuldades ?? DIFICULDADE_MOCK} />
                        <FilterSelect label="Professor Indica" placeholder="Dicas" options={PROFESSOR_INDICA_MOCK} />
                    </div>

                    {/* Barra de Ações Inferior */}
                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/10">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 border-r border-border/10 pr-6">
                                <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Criar Simulado
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                                    <BookOpen className="w-4 h-4" />
                                    Meus Simulados
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-48">
                                    <FilterSelect 
                                        label="" 
                                        placeholder="Cadernos do Professor" 
                                        options={options?.topicos ?? CADERNOS_PROFESSOR_MOCK} 
                                    />
                                </div>
                                <div className="w-48">
                                    <FilterSelect 
                                        label="" 
                                        placeholder="Status" 
                                        options={[
                                            { label: "Todas", value: "todas" },
                                            { label: "Resolvidas", value: "resolvidas" },
                                            { label: "Não Resolvidas", value: "nao_resolvidas" },
                                            { label: "Acertei", value: "acertei" },
                                            { label: "Errei", value: "errei" }
                                        ]} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => {
                                    setActiveFilters([])
                                    setSelectedConcurso('all')
                                }}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Limpar Filtros
                            </button>
                            <Button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl px-10 h-10 font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex gap-2">
                                <Search className="w-4 h-4" />
                                Filtrar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Área de Filtros Selecionados (SEMPRE VISÍVEL ou aparecendo quando recolhido) */}
                {activeFilters.length > 0 && (
                    <div className={`flex flex-wrap gap-2 px-6 pb-6 animate-in slide-in-from-top-2 duration-500 ${!isExpanded ? "pt-4" : "pt-0 border-t-0"}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/20 self-center mr-2">Filtros Ativos:</span>
                        {activeFilters.map((filter) => (
                            <div 
                                key={filter.id}
                                className="flex items-center gap-2 bg-primary/5 border border-primary/10 pl-3 pr-1.5 py-1.5 rounded-full group hover:border-primary/30 transition-all"
                            >
                                <span className="text-[10px] font-bold text-primary/80">{filter.label}</span>
                                <button 
                                    onClick={() => removeFilter(filter.id)}
                                    className="p-0.5 rounded-full hover:bg-primary/10 text-primary/40 hover:text-primary transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
