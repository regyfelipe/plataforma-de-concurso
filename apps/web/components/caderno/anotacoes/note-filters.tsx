"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

const CATEGORIES = ["Todas", "Dicas", "Mnemônicos", "Resumos"]

export function NoteFilters() {
    const [active, setActive] = useState("Todas")

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar em seus resumos..." className="pl-9" />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat}
                        variant="ghost"
                        size="sm"
                        className={active === cat ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}
                        onClick={() => setActive(cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>
        </div>
    )
}
