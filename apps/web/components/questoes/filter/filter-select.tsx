"use client"

import { useState } from "react"
import { Check, Search, Sparkles } from "lucide-react"
import { 
  Combobox, 
  ComboboxInput, 
  ComboboxContent, 
  ComboboxList, 
  ComboboxItem,
  ComboboxEmpty
} from "@workspace/ui/components/combobox"

interface FilterSelectProps {
    label: string
    placeholder: string
    options: { label: string, value: string }[]
    onValueChange?: (value: string) => void
    isMulti?: boolean
}

export function FilterSelect({ label, placeholder, options, onValueChange, isMulti = true }: FilterSelectProps) {
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const toggleValue = (value: string) => {
        if (!isMulti) {
            setSelectedValues([value])
            if (onValueChange) onValueChange(value)
            return
        }

        const isSelected = selectedValues.includes(value)
        const newValues = isSelected 
            ? selectedValues.filter(v => v !== value) 
            : [...selectedValues, value]
        
        setSelectedValues(newValues)
        if (onValueChange && !isSelected) {
            onValueChange(value)
        }
    }

    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getDisplayValue = () => {
        if (selectedValues.length === 0) return placeholder
        if (!isMulti) {
            const selectedOpt = options.find(opt => opt.value === selectedValues[0])
            return selectedOpt ? selectedOpt.label : placeholder
        }
        return `${selectedValues.length} selecionados`
    }

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 ml-0.5 block h-3">
                    {label}
                </label>
            )}
            
            <Combobox>
                <div className="relative group">
                    <ComboboxInput 
                        placeholder={getDisplayValue()}
                        className="w-full bg-muted/10 border border-border/40 hover:border-primary/20 rounded-xl h-10 text-[11px] font-medium focus-within:ring-1 focus-within:ring-primary/10 transition-all [&_input]:h-full [&_input]:px-4 [&_input]:placeholder:text-foreground/70"
                        showTrigger={true}
                        showClear={selectedValues.length > 0}
                    />
                </div>
                
                {/* Ajustado: w-[var(--radix-combobox-trigger-width)] garante que o menu tenha a mesma largura do botão */}
                <ComboboxContent className="rounded-xl border-border/50 shadow-2xl bg-background/95 backdrop-blur-xl w-[var(--radix-combobox-trigger-width)]">
                    <div className="px-3 py-2 border-b border-border/10 bg-muted/5">
                        <div className="relative">
                            <input 
                                placeholder="Busca rápida"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent text-[11px] font-medium outline-none placeholder:text-muted-foreground/40 h-8"
                            />
                            <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                        </div>
                    </div>

                    

                    <ComboboxList className="h-[150px] overflow-y-auto no-scrollbar p-1">
                        {filteredOptions.map((opt) => {
                            const isChecked = selectedValues.includes(opt.value)
                            return (
                                <div 
                                    key={opt.value}
                                    onClick={() => toggleValue(opt.value)}
                                    className="flex items-center gap-3 px-3 py-2 text-[11px] font-medium rounded-lg hover:bg-primary/5 cursor-pointer transition-colors group h-[34px]"
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                                        isChecked 
                                            ? "bg-primary border-primary text-white" 
                                            : "border-border/60 bg-background group-hover:border-primary/40"
                                    }`}>
                                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className={`truncate ${isChecked ? "text-primary font-bold" : "text-foreground/70"}`}>
                                        {opt.label}
                                    </span>
                                </div>
                            )
                        })}
                        
                        {filteredOptions.length === 0 && (
                            <ComboboxEmpty className="py-8 text-center w-full">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                    Nenhuma sugestão
                                </div>
                            </ComboboxEmpty>
                        )}
                    </ComboboxList>

                    {isMulti && selectedValues.length > 0 && (
                        <div className="p-2 border-t border-border/10 flex justify-between items-center bg-muted/5">
                            <span className="text-[9px] font-bold text-muted-foreground/60 ml-2">
                                {selectedValues.length} marcados
                            </span>
                            <button 
                                type="button"
                                onClick={() => setSelectedValues([])}
                                className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 px-2 py-1"
                            >
                                Limpar
                            </button>
                        </div>
                    )}
                </ComboboxContent>
            </Combobox>
        </div>
    )
}
