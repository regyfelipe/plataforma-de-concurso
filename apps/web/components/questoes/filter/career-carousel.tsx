"use client"

import * as React from "react"
import { Shield, Target, Landmark, Scale, ChevronLeft, ChevronRight } from "lucide-react"

const CAREERS = [
  { id: "all", name: "Todas", icon: Target, status: "GERAL" },
  { id: "pf", name: "PF", icon: Shield, status: "PRÉ-EDITAL" },
  { id: "prf", name: "PRF", icon: Shield, status: "PRÉ-EDITAL" },
  { id: "pmto", name: "PM TO", icon: Shield, status: "PÓS-EDITAL" },
  { id: "pcto", name: "PC TO", icon: Scale, status: "EM BREVE" },
  { id: "pcba", name: "PC BA", icon: Scale, status: "PRÉ-EDITAL" },
  { id: "pmce", name: "PM CE", icon: Shield, status: "AUTORIZADO" },
  { id: "pcdf", name: "PC DF", icon: Scale, status: "AUTORIZADO" },
  { id: "pcgo", name: "PC GO", icon: Scale, status: "PÓS-EDITAL" },
  { id: "pmsp", name: "PM SP", icon: Shield, status: "PRÉ-EDITAL" },
  { id: "cbmce", name: "CBM CE", icon: Shield, status: "EM BREVE" },
  { id: "tjsp", name: "TJ SP", icon: Landmark, status: "AUTORIZADO" },
  { id: "trt", name: "TRT", icon: Landmark, status: "PRÉ-EDITAL" },
  { id: "tre", name: "TRE", icon: Landmark, status: "EM BREVE" },
  { id: "trf", name: "TRF", icon: Landmark, status: "PÓS-EDITAL" },
  { id: "tcu", name: "TCU", icon: Scale, status: "AUTORIZADO" },
  { id: "tce", name: "TCE", icon: Scale, status: "PRÉ-EDITAL" },
  { id: "rfb", name: "Receita", icon: Landmark, status: "EM BREVE" },
  { id: "sefaz", name: "SEFAZ", icon: Scale, status: "AUTORIZADO" },
  { id: "inss", name: "INSS", icon: Landmark, status: "PRÉ-EDITAL" },
  { id: "ibge", name: "IBGE", icon: Landmark, status: "EM BREVE" },
  { id: "prefeitura", name: "Pref.", icon: Landmark, status: "ABERTO" },
]

interface CareerCarouselProps {
    activeId?: string
    onSelect?: (id: string, name: string) => void
}

export function CareerCarousel({ activeId = 'all', onSelect }: CareerCarouselProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null)

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
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 ml-1">Carreiras</h3>
            
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
                    {CAREERS.map((career) => {
                        const isActive = activeId === career.id
                        return (
                            <button
                                key={career.id}
                                onClick={() => onSelect?.(career.id, career.name)}
                                className={`flex flex-col items-center justify-center min-w-[120px] h-36 rounded-3xl border transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 ${
                                    isActive 
                                        ? "bg-background border-primary shadow-lg ring-1 ring-primary/20 dark:ring-primary/40" 
                                        : "bg-muted/5 border-border/40 hover:border-primary/20 hover:bg-muted/10"
                                }`}
                            >
                                <div className={`p-3 rounded-2xl mb-2 transition-colors ${isActive ? "bg-primary/5" : "bg-muted/5"}`}>
                                    <career.icon className={`w-8 h-8 ${isActive ? "text-primary" : "text-muted-foreground/30"}`} />
                                </div>
                                <span className={`text-sm font-black tracking-tight ${isActive ? "text-foreground" : "text-muted-foreground/80"}`}>
                                    {career.name}
                                </span>
                                <span className="text-[8px] font-bold mt-1 text-muted-foreground/30 uppercase tracking-[0.15em]">
                                    {career.status}
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
