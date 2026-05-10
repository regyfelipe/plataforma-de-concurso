"use client"

import * as React from "react"
import { Book, Compass, Briefcase, Plus, Search, Layers, FileText, Filter } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Input } from "@workspace/ui/components/input"
import { useLayout } from "@/contexts/layout-context"
import { cn } from "@workspace/ui/lib/utils"

const CONCURSO_MOCK = [
    { id: "pcba", name: "PCBA", notebooks: 5, questions: 25 },
    { id: "pcdf", name: "PCDF", notebooks: 1, questions: 19 },
    { id: "pces", name: "PCES", notebooks: 6, questions: 59 },
    { id: "pcma", name: "PCMA", notebooks: 1, questions: 10 },
    { id: "pcpi", name: "PCPI", notebooks: 20, questions: 352 },
    { id: "pcrs", name: "PCRS", notebooks: 15, questions: 289 },
    { id: "pcto", name: "PCOTO", notebooks: 1, questions: 15 },
    { id: "pf", name: "PF", notebooks: 10, questions: 318 },
]

export default function CadernoPage() {
    const { contentLayout } = useLayout()

    return (
        <div className={cn(
            "flex-1 flex flex-col p-8 pt-4 gap-6 animate-in fade-in duration-500 bg-background text-foreground",
            contentLayout === "centered" && "max-w-7xl mx-auto w-full"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Caderno de Estudos</h1>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Organize e estude questões com cadernos personalizados.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 px-3 rounded-lg gap-1.5 text-[10px] font-bold border-border/40 bg-muted/5">
                        <Plus className="w-3 h-3" />
                        CRIAR CADERNO
                    </Button>
                    <Button variant="outline" className="h-8 px-3 rounded-lg text-[10px] font-bold border-border/40 bg-muted/5">
                        <Filter className="w-3 h-3 mr-1.5" />
                        PROFESSORES
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="concurso" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent h-auto p-0 gap-2 justify-start">
                        <TabsTrigger
                            value="meus"
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold transition-all rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-muted/30 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground"
                        >
                            <Book className="h-3.5 w-3.5" />
                            Meus Cadernos
                        </TabsTrigger>
                        <TabsTrigger
                            value="professores"
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold transition-all rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-muted/30 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground"
                        >
                            <Compass className="h-3.5 w-3.5" />
                            Professores
                        </TabsTrigger>
                        <TabsTrigger
                            value="concurso"
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold transition-all rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-muted/30 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground"
                        >
                            <Briefcase className="h-3.5 w-3.5" />
                            concurso
                            <Badge className="ml-0.5 bg-muted/80 text-foreground border-none font-bold px-1.5 h-3.5 min-w-[14px] justify-center text-[8px]">31</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-56">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30" />
                        <Input
                            placeholder="Buscar professores"
                            className="pr-10 h-8 rounded-lg bg-muted/10 border-border/10 text-[11px] focus-visible:ring-0"
                        />
                    </div>
                </div>

                <TabsContent value="concurso" className="mt-0 outline-none">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CONCURSO_MOCK.map((carreira) => (
                            <div
                                key={carreira.id}
                                className="group flex flex-col items-center p-5 rounded-[20px] bg-muted/20 dark:bg-[#121214] border border-border/40 dark:border-white/5 hover:border-border dark:hover:border-white/10 transition-all cursor-pointer aspect-[4/5.5] justify-center text-center shadow-sm"
                            >
                                {/* Badge/Icon Area */}
                                <div className="relative mb-4">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden relative border border-border/40 dark:border-white/10 shadow-lg">
                                        <img 
                                            src="/placeholder-brasao.png" 
                                            alt={carreira.name}
                                            className="w-full h-full object-cover brightness-100 dark:brightness-90 group-hover:brightness-110 transition-all"
                                        />
                                        {/* Overlay "PÓS-EDITAL" style */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-[6.5px] font-black py-0.5 text-white tracking-tighter uppercase">
                                            Pós-Edital
                                        </div>
                                    </div>
                                    
                                    {/* Number Indicator */}
                                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[9px] font-black border-2 border-background shadow-md">
                                        {carreira.notebooks}
                                    </div>
                                </div>

                                {/* Title */}
                                <h4 className="text-[12px] font-black tracking-widest mb-4 text-foreground/90 dark:text-white/90 group-hover:text-primary transition-colors uppercase">
                                    {carreira.name}
                                </h4>

                                {/* Stats Capsulas */}
                                <div className="space-y-1 w-full max-w-[100px]">
                                    <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-muted-foreground dark:text-white/50 bg-muted/50 dark:bg-white/5 py-1 rounded-full border border-border/40 dark:border-white/5">
                                        <Layers className="w-2.5 h-2.5 opacity-70" />
                                        {carreira.notebooks} cadernos
                                    </div>
                                    <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-muted-foreground dark:text-white/50 bg-muted/50 dark:bg-white/5 py-1 rounded-full border border-border/40 dark:border-white/5">
                                        <FileText className="w-2.5 h-2.5 opacity-70" />
                                        {carreira.questions} questões
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}