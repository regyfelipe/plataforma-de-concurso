"use client"

import * as React from "react"
import { 
    XCircle, 
    Search, 
    BookOpen, 
    RotateCcw,
    ChevronRight, 
    ArrowUpRight,
    History,
    AlertCircle
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"

// --- Mock de Dados para Questões Erradas ---
const WRONG_QUESTIONS = [
    {
        id: "1",
        code: "Q283941",
        subject: "Raciocínio Lógico",
        topic: "Lógica de Argumentação",
        agency: "FCC",
        year: "2024",
        excerpt: "Considere a seguinte afirmação: 'Se estudo, então passo'. A negação lógica dessa afirmação é...",
        lastError: "Há 2 horas",
        attempts: 2
    },
    {
        id: "2",
        code: "Q112045",
        subject: "Direito Administrativo",
        topic: "Atos Administrativos",
        agency: "Cebraspe",
        year: "2023",
        excerpt: "Acerca dos atributos dos atos administrativos, a imperatividade consiste na...",
        lastError: "Ontem",
        attempts: 1
    },
    {
        id: "3",
        code: "Q99823",
        subject: "Informática",
        topic: "Segurança da Informação",
        agency: "Vunesp",
        year: "2024",
        excerpt: "O tipo de malware que se propaga automaticamente pelas redes, explorando vulnerabilidades, é conhecido como...",
        lastError: "Há 3 dias",
        attempts: 3
    }
]

export default function ErradasPage() {
    const [searchQuery, setSearchQuery] = React.useState("")

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background max-w-6xl mx-auto w-full">
            
            {/* Header com Título e Alerta Sutil */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-500/80">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Área de Revisão</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                        Questões Erradas
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground/60">
                        Você tem <span className="text-red-500/80 font-black">{WRONG_QUESTIONS.length} questões</span> para revisar e transformar em acertos.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl border-red-500/20 text-red-500/80 hover:bg-red-500/5 text-[10px] font-black uppercase tracking-widest gap-2 h-10 px-5">
                        <RotateCcw className="w-4 h-4" />
                        Limpar Histórico de Erros
                    </Button>
                </div>
            </div>

            {/* Barra de Busca e Filtros Rápidos */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <Input 
                        placeholder="Buscar entre as que você errou..." 
                        className="pl-10 h-11 bg-card dark:bg-muted/10 border-border/40 rounded-xl text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['Todas', 'Recentes', 'Mais Erradas'].map((tag) => (
                        <Button 
                            key={tag}
                            variant="ghost" 
                            size="sm"
                            className={`px-4 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-transparent ${tag === 'Todas' ? "bg-primary/10 text-primary border-primary/10" : "text-muted-foreground hover:bg-muted/10"}`}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Lista de Questões Erradas */}
            <div className="grid grid-cols-1 gap-4">
                {WRONG_QUESTIONS.map((q) => (
                    <div 
                        key={q.id} 
                        className="group bg-card dark:bg-muted/10 border border-border/40 rounded-[1.5rem] p-6 hover:border-red-500/20 transition-all shadow-sm relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-4 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="bg-red-500/5 border-red-500/10 text-red-500/60 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                        {q.code}
                                    </Badge>
                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{q.agency}</span>
                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-red-500/40 uppercase tracking-widest">
                                        <History className="w-3 h-3" />
                                        Erro: {q.lastError}
                                    </div>
                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                                    <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                                        Tentativas: {q.attempts}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-foreground/60">
                                        {q.subject} <span className="text-muted-foreground/40 mx-1">/</span> {q.topic}
                                    </h3>
                                    <p className="text-sm font-medium leading-relaxed text-foreground/80 line-clamp-2 italic">
                                        "{q.excerpt}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button className="h-10 px-6 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold text-[11px] uppercase tracking-widest transition-all">
                                    Tentar Novamente
                                    <RotateCcw className="w-4 h-4 ml-2" />
                                </Button>
                                <Button variant="ghost" className="h-10 px-4 rounded-xl text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-widest">
                                    Ver Resolução
                                </Button>
                            </div>
                        </div>

                        {/* Detalhe de fundo sutil para erro */}
                        <div className="absolute inset-y-0 left-0 w-1 bg-red-500/20 group-hover:bg-red-500/50 transition-all" />
                    </div>
                ))}
            </div>

            {/* Rodapé Informativo */}
            <div className="flex flex-col items-center gap-4 pt-8 border-t border-border/20">
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] text-center">
                    Dica: Refazer questões que você errou é o segredo da aprovação.
                </p>
                <Button variant="ghost" className="text-muted-foreground/40 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] gap-2">
                    Ver estatísticas de erro
                    <ArrowUpRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
