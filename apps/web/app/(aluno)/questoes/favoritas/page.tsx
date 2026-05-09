"use client"

import * as React from "react"
import { 
    Star, 
    Search, 
    Filter, 
    BookOpen, 
    Target, 
    ChevronRight, 
    Trash2,
    ArrowUpRight,
    PlayCircle
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"

// --- Mock de Dados para Favoritos ---
const FAVORITE_QUESTIONS = [
    {
        id: "1",
        code: "Q283941",
        subject: "Direito Constitucional",
        topic: "Direitos e Garantias Fundamentais",
        agency: "FCC",
        year: "2024",
        excerpt: "No que tange aos direitos fundamentais previstos na Constituição Federal de 1988, é correto afirmar que...",
        difficulty: "Média"
    },
    {
        id: "2",
        code: "Q112045",
        subject: "Direito Administrativo",
        topic: "Atos Administrativos",
        agency: "Cebraspe",
        year: "2023",
        excerpt: "Acerca dos atributos dos atos administrativos, a imperatividade consiste na...",
        difficulty: "Difícil"
    },
    {
        id: "3",
        code: "Q99823",
        subject: "Raciocínio Lógico",
        topic: "Lógica de Argumentação",
        agency: "Vunesp",
        year: "2024",
        excerpt: "Considere a seguinte afirmação: 'Se estudo, então passo'. A negação lógica dessa afirmação é...",
        difficulty: "Fácil"
    }
]

export default function FavoritosPage() {
    const [searchQuery, setSearchQuery] = React.useState("")

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background max-w-6xl mx-auto w-full">
            
            {/* Header com Título e Contador */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Star className="w-5 h-5 fill-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Minha Coleção</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                        Questões Favoritas
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground/60">
                        Você possui <span className="text-foreground font-black">{FAVORITE_QUESTIONS.length} questões</span> salvas para revisão.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl border-border/40 text-[10px] font-black uppercase tracking-widest gap-2 h-10 px-5">
                        <PlayCircle className="w-4 h-4" />
                        Iniciar Simulado com Favoritos
                    </Button>
                </div>
            </div>

            {/* Barra de Busca e Filtros Rápidos */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <Input 
                        placeholder="Buscar em seus favoritos..." 
                        className="pl-10 h-11 bg-card dark:bg-muted/10 border-border/40 rounded-xl text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['Todas', 'Direito', 'Lógica', 'Informática'].map((tag) => (
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

            {/* Lista de Favoritos */}
            <div className="grid grid-cols-1 gap-4">
                {FAVORITE_QUESTIONS.map((q) => (
                    <div 
                        key={q.id} 
                        className="group bg-card dark:bg-muted/10 border border-border/40 rounded-[1.5rem] p-6 hover:border-primary/30 transition-all shadow-sm relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-4 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                        {q.code}
                                    </Badge>
                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{q.agency}</span>
                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{q.year}</span>
                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">•</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${q.difficulty === 'Difícil' ? 'text-red-500/60' : q.difficulty === 'Média' ? 'text-orange-500/60' : 'text-emerald-500/60'}`}>
                                        {q.difficulty}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/80">
                                        {q.subject} <span className="text-muted-foreground/40 mx-1">/</span> {q.topic}
                                    </h3>
                                    <p className="text-sm font-medium leading-relaxed text-foreground/80 line-clamp-2 italic">
                                        "{q.excerpt}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                                    Resolver Agora
                                    <ArrowUpRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* Sutil detalhe de brilho no hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {/* Link para voltar ao Dashboard */}
            <div className="flex justify-center pt-8">
                <Button variant="ghost" className="text-muted-foreground/40 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] gap-2">
                    Explorar mais questões
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
