"use client"

import * as React from "react"
import Link from "next/link"
import { Book, Compass, Briefcase, Plus, Search, Layers, FileText, Filter, ChevronLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Input } from "@workspace/ui/components/input"
import { useLayout } from "@/contexts/layout-context"
import { cn } from "@workspace/ui/lib/utils"

type ConcursoCard = {
    id: string
    name: string
    title: string
    year: number | null
    status: string
    logoUrl: string | null
    notebooks: number
    questions: number
}

type NotebookCard = {
    id: string
    concursoId: string | null
    title: string
    professor: string
    avatarUrl: string | null
    discipline: string
    questions: number
}

interface CadernoClientPageProps {
    concursos: ConcursoCard[]
    notebooks: NotebookCard[]
}

export function CadernoClientPage({ concursos, notebooks }: CadernoClientPageProps) {
    const { contentLayout } = useLayout()
    const [search, setSearch] = React.useState("")
    const [selectedConcursoId, setSelectedConcursoId] = React.useState<string | null>(null)

    const filteredConcursos = React.useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) return concursos

        return concursos.filter((concurso) =>
            [concurso.name, concurso.title, concurso.year?.toString(), concurso.status]
                .filter(Boolean)
                .some((value) => value?.toLowerCase().includes(query))
        )
    }, [concursos, search])

    const selectedConcurso = concursos.find((concurso) => concurso.id === selectedConcursoId)
    const selectedNotebooks = selectedConcursoId
        ? notebooks.filter((notebook) => notebook.concursoId === selectedConcursoId)
        : []

    return (
        <div className={cn(
            "flex-1 flex flex-col p-8 pt-4 gap-6 animate-in fade-in duration-500 bg-background text-foreground",
            contentLayout === "centered" && "max-w-7xl mx-auto w-full"
        )}>
            {!selectedConcursoId && (
                <div className="flex items-center justify-between animate-in fade-in duration-300">
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
            )}

            <Tabs defaultValue="concurso" className="space-y-6">
                {!selectedConcursoId && (
                    <div className="flex items-center justify-between animate-in fade-in duration-300">
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
                                Carreira
                                <Badge className="ml-0.5 bg-muted/80 text-foreground border-none font-bold px-1.5 h-3.5 min-w-[14px] justify-center text-[8px]">
                                    {concursos.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative w-56">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar concursos"
                                className="pr-10 h-8 rounded-lg bg-muted/10 border-border/10 text-[11px] focus-visible:ring-0"
                            />
                        </div>
                    </div>
                )}

                <TabsContent value="concurso" className="mt-0 outline-none">
                    {!selectedConcursoId ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {filteredConcursos.map((concurso) => (
                                <button
                                    key={concurso.id}
                                    title={concurso.title}
                                    type="button"
                                    onClick={() => setSelectedConcursoId(concurso.id)}
                                    className={cn(
                                        "group flex flex-col items-center p-2 rounded-[16px] bg-muted/20 dark:bg-[#121214] border border-border/40 dark:border-white/5 hover:border-border dark:hover:border-white/10 transition-all cursor-pointer aspect-[4/5] justify-center text-center shadow-sm",
                                        selectedConcursoId === concurso.id && "border-primary/50 dark:border-primary/50"
                                    )}
                                >
                                    <div className="relative mb-2">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden relative border border-border/40 dark:border-white/10 shadow-lg">
                                            <img
                                                src={concurso.logoUrl || "/placeholder-brasao.png"}
                                                alt={concurso.title}
                                                className="w-full h-full object-cover brightness-100 dark:brightness-90 group-hover:brightness-110 transition-all"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-[6.5px] font-black py-0.5 text-white tracking-tighter uppercase">
                                                {concurso.status}
                                            </div>
                                        </div>

                                        <div className="absolute -top-1.5 -right-1.5 min-w-6 h-6 px-1 rounded-full bg-foreground text-background flex items-center justify-center text-[9px] font-black border-2 border-background shadow-md">
                                            {concurso.notebooks}
                                        </div>
                                    </div>

                                    <h4 className="text-[12px] font-black tracking-widest mb-1 text-foreground/90 dark:text-white/90 group-hover:text-primary transition-colors uppercase">
                                        {concurso.name}
                                    </h4>
                                    {concurso.year && (
                                        <p className="text-[9px] font-bold text-muted-foreground mb-2">
                                            {concurso.year}
                                        </p>
                                    )}

                                    <div className="space-y-1 w-full max-w-[100px]">
                                        <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-muted-foreground dark:text-white/50 bg-muted/50 dark:bg-white/5 py-1 rounded-full border border-border/40 dark:border-white/5">
                                            <Layers className="w-2.5 h-2.5 opacity-70" />
                                            {concurso.notebooks} cadernos
                                        </div>
                                        <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-muted-foreground dark:text-white/50 bg-muted/50 dark:bg-white/5 py-1 rounded-full border border-border/40 dark:border-white/5">
                                            <FileText className="w-2.5 h-2.5 opacity-70" />
                                            {concurso.questions} questões
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 px-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-muted/20 transition-all"
                                    onClick={() => setSelectedConcursoId(null)}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div>
                                    <h3 className="text-sm font-bold tracking-tight uppercase">{selectedConcurso?.name} {selectedConcurso?.year}</h3>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Professores e cadernos disponíveis</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-2">
                                {selectedNotebooks.map((notebook) => (
                                    <div
                                        key={notebook.id}
                                        className="group flex flex-col p-2 rounded-xl bg-muted/20 dark:bg-[#121214] border border-border/40 dark:border-white/5 hover:border-primary/40 transition-all shadow-sm"
                                    >
                                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-background/50 border border-border/10">
                                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                                <img
                                                    src={selectedConcurso?.logoUrl || "/placeholder-brasao.png"}
                                                    alt="Logo"
                                                    className="w-full h-full object-contain opacity-80"
                                                />
                                            </div>
                                            <div className="absolute top-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-black text-white">
                                                {notebook.questions} Q
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-red-600/80 py-0.5 text-center text-[7px] font-black text-white uppercase tracking-tighter">
                                                {selectedConcurso?.status || "PREVISTO"}
                                            </div>
                                        </div>

                                        <h4 className="text-[10px] font-black leading-tight uppercase line-clamp-1 mb-2 px-0.5">
                                            {notebook.discipline}
                                        </h4>

                                        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-border/5">
                                            <div className="flex items-center gap-1 min-w-0">
                                                <div className="w-4 h-4 rounded-full overflow-hidden border border-border/40 flex-shrink-0">
                                                    <img
                                                        src={notebook.avatarUrl || "/avatars/default.jpg"}
                                                        alt={notebook.professor}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-[8px] font-bold text-muted-foreground truncate uppercase">
                                                    {notebook.professor}
                                                </span>
                                            </div>
                                            <Link href={`/caderno/estudar/${notebook.id}`}>
                                                <Button 
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 px-2 text-[8px] font-black uppercase rounded-md border-border/40 hover:bg-primary hover:text-white transition-all"
                                                >
                                                    Estudar
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
