"use client"

import * as React from "react"
import { Shield, Target, Landmark, Scale, ChevronLeft, ChevronRight } from "lucide-react"


interface CareerCarouselProps {
    activeId?: string
    onSelect?: (id: string, name: string) => void
    concursos?: {
        id: string
        name: string
        sigla?: string
        ano?: number | string
        status?: string
        icon?: "shield" | "scale" | "landmark" | "target"
    }[]
}

const ICONS = {
    shield: Shield,
    scale: Scale,
    landmark: Landmark,
    target: Target,
}

export function CareerCarousel({ activeId = 'all', onSelect, concursos }: CareerCarouselProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const items = concursos && concursos.length > 0
        ? [
            { id: "all", name: "Todos", displayName: "Todos", displayYear: "", status: "GERAL", icon: Target },
            ...concursos.map((concurso) => ({
                ...concurso,
                displayName: concurso.sigla ,
                displayYear: concurso.ano || "---",
                status: concurso.status ?? "CONCURSO",
                icon: ICONS[concurso.icon ?? "landmark"],
            })),
        ]
        : [
            { id: "all", name: "Todos", displayName: "Todos", displayYear: "", status: "GERAL", icon: Target },
        ]

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth * 0.5 
                : scrollLeft + clientWidth * 0.5
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    return (
        <div className="space-y-4 group/carousel relative">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 ml-1">Concursos</h3>
            
            <div className="relative">
                <button 
                    onClick={() => scroll('left')}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border/40 shadow-xl flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 hover:bg-background text-muted-foreground hover:text-primary"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div 
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
                >
                    {items.map((concurso) => {
                        const Icon = concurso.icon
                        const isActive = activeId === concurso.id
                        return (
                            <button
                                key={concurso.id}
                                onClick={() => onSelect?.(concurso.id, concurso.name)}
                                className={`flex flex-col items-center justify-center min-w-[120px] h-36 rounded-3xl border transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 ${
                                    isActive 
                                        ? "bg-background border-primary shadow-lg ring-1 ring-primary/20 dark:ring-primary/40" 
                                        : "bg-muted/5 border-border/40 hover:border-primary/20 hover:bg-muted/10"
                                }`}
                            >
                                <div className={`p-3 rounded-2xl mb-2 transition-colors ${isActive ? "bg-primary/5" : "bg-muted/5"}`}>
                                    <Icon className={`w-8 h-8 ${isActive ? "text-primary" : "text-muted-foreground/30"}`} />
                                </div>
                                
                                <span className={`text-sm font-black tracking-tight ${isActive ? "text-foreground" : "text-muted-foreground/80"}`}>
                                    {concurso.displayName}
                                </span>

                                <span className={`text-[10px] font-bold ${isActive ? "text-primary/70" : "text-muted-foreground/40"}`}>
                                    {concurso.displayYear}
                                </span>

                                <span className="text-[8px] font-bold mt-2 text-muted-foreground/30 uppercase tracking-[0.15em] border-t border-border/10 pt-2 w-full text-center">
                                    {concurso.status}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <button 
                    onClick={() => scroll('right')}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border/40 shadow-xl flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 hover:bg-background text-muted-foreground hover:text-primary"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
