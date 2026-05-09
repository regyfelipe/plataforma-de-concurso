"use client"

import { Search } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

const CATEGORIES = ['Todas', 'Dicas', 'Mnemônicos', 'Resumos']

export function NoteFilters() {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                    placeholder="Buscar em seus resumos..." 
                    className="pl-10 h-11 bg-card dark:bg-muted/10 border-border/40 rounded-xl text-sm"
                />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((tag) => (
                    <Button 
                        key={tag}
                        variant="ghost" 
                        size="sm"
                        className={`px-4 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${tag === 'Todas' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"}`}
                    >
                        {tag}
                    </Button>
                ))}
            </div>
        </div>
    )
}
