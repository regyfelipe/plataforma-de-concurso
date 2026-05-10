"use client"

import { useState } from "react"
import { Check, Search } from "lucide-react"
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxEmpty,
} from "@workspace/ui/components/combobox"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

interface FilterSelectProps {
    label: string
    placeholder: string
    options: { label: string; value: string }[]
    onValueChange?: (value: string) => void
    isMulti?: boolean
}

export function FilterSelect({ label, placeholder, options, onValueChange, isMulti = true }: FilterSelectProps) {
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const toggleValue = (value: string) => {
        if (!isMulti) {
            setSelectedValues([value])
            onValueChange?.(value)
            return
        }
        const isSelected = selectedValues.includes(value)
        const next = isSelected
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value]
        setSelectedValues(next)
        if (!isSelected) onValueChange?.(value)
    }

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getDisplayValue = () => {
        if (selectedValues.length === 0) return placeholder
        if (!isMulti) {
            return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder
        }
        return `${selectedValues.length} selecionado(s)`
    }

    return (
        <div className="space-y-1.5 w-full">
            {label && <Label className="text-xs text-muted-foreground">{label}</Label>}

            <Combobox>
                <ComboboxInput
                    placeholder={getDisplayValue()}
                    showTrigger={true}
                    showClear={selectedValues.length > 0}
                />

                <ComboboxContent className="w-[var(--radix-combobox-trigger-width)]">
                    {/* Busca */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b">
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <input
                            placeholder="Busca rápida..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Lista */}
                    <ComboboxList className="max-h-[180px] overflow-y-auto p-1">
                        {filteredOptions.map((opt) => {
                            const isChecked = selectedValues.includes(opt.value)
                            return (
                                <div
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isChecked}
                                    onClick={() => toggleValue(opt.value)}
                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                        isChecked
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "border-input bg-background"
                                    }`}>
                                        {isChecked && <Check className="h-3 w-3" />}
                                    </div>
                                    <span className={`truncate ${isChecked ? "font-medium" : "text-muted-foreground"}`}>
                                        {opt.label}
                                    </span>
                                </div>
                            )
                        })}

                        {filteredOptions.length === 0 && (
                            <ComboboxEmpty className="py-6 text-center text-sm text-muted-foreground">
                                Nenhuma opção encontrada
                            </ComboboxEmpty>
                        )}
                    </ComboboxList>

                    {/* Footer de seleção múltipla */}
                    {isMulti && selectedValues.length > 0 && (
                        <>
                            <Separator />
                            <div className="flex items-center justify-between px-3 py-2">
                                <span className="text-xs text-muted-foreground">
                                    {selectedValues.length} selecionado(s)
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-destructive hover:text-destructive"
                                    onClick={() => setSelectedValues([])}
                                >
                                    Limpar
                                </Button>
                            </div>
                        </>
                    )}
                </ComboboxContent>
            </Combobox>
        </div>
    )
}
