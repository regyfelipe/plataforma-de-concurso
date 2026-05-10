"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"

const TABS = [
    { label: "Desempenho",     href: "/estatisticas/desempenho"   },
    { label: "Evolução",       href: "/estatisticas/evolucao"     },
    { label: "Taxa de Acerto", href: "/estatisticas/taxa-acerto"  },
    { label: "Tempo de Estudo",href: "/estatisticas/tempo-estudo" },
]

export default function EstatisticasLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router   = useRouter()

    const activeTab = TABS.find((t) => pathname.includes(t.href))?.href ?? "/estatisticas/desempenho"

    return (
        <div className="flex-1 flex flex-col p-8 pt-6 gap-6">

            {/* Tab bar — mesmo estilo da toolbar de questões */}
            <div className="flex items-center gap-2 py-1 border-b overflow-x-auto">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.href
                    return (
                        <Button
                            key={tab.href}
                            variant="ghost"
                            size="sm"
                            className={`flex gap-2 ${
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            }`}
                            onClick={() => router.push(tab.href)}
                        >
                            {tab.label}
                        </Button>
                    )
                })}
            </div>

            {/* Conteúdo da página ativa */}
            {children}
        </div>
    )
}

