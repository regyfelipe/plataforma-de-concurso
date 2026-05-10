"use client"

import { useState } from "react"
import { Check, Search, Plus } from "lucide-react"
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
    value?: string
    isMulti?: boolean
    disabled?: boolean
    emptyText?: string
}

export function FilterSelect({
    label,
    placeholder,
    options,
    onValueChange,
    value,
    isMulti = true,
    disabled = false,
    emptyText = "Nenhuma opção encontrada",
}: FilterSelectProps) {
    const [internalValues, setInternalValues] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const selectedValues = value !== undefined ? (value ? [value] : []) : internalValues

    const toggleValue = (value: string) => {
        const isSelected = selectedValues.includes(value)
        if (!isMulti) {
            const newValue = isSelected ? "" : value
            setInternalValues(isSelected ? [] : [value])
            onValueChange?.(newValue)
            return
        }
        const next = isSelected
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value]
        setInternalValues(next)
        if (!isSelected) onValueChange?.(value)
    }

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getDisplayValue = () => {
        if (selectedValues.length === 0) return placeholder
        if (!isMulti) {
            return options.find((o) => o.value === selectedValues[0])?.label ?? selectedValues[0] ?? placeholder
        }
        return `${selectedValues.length} selecionado(s)`
    }

    const hasSelection = selectedValues.length > 0
    const displayValue = getDisplayValue()

    return (
        <div className="space-y-1.5 w-full">
            {label && <Label className="text-xs text-muted-foreground">{label}</Label>}

            <Combobox>
                <ComboboxInput
                    value={hasSelection ? displayValue : ""}
                    placeholder={placeholder}
                    readOnly
                    showTrigger={true}
                    showClear={false}
                    disabled={disabled}
                />

                <ComboboxContent className="w-[var(--radix-combobox-trigger-width)]">
                    {/* Busca */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b">
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <input
                            placeholder="Busca rápida..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={disabled}
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
                            <div className="p-1">
                                {searchTerm.trim() ? (
                                    <div
                                        role="option"
                                        onClick={() => {
                                            toggleValue(searchTerm)
                                            setSearchTerm("")
                                        }}
                                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border border-dashed border-primary/30"
                                    >
                                        <Plus className="h-3.5 w-3.5 text-primary" />
                                        <span className="truncate flex-1">
                                            Usar "<span className="font-semibold">{searchTerm}</span>"
                                        </span>
                                    </div>
                                ) : (
                                    <ComboboxEmpty className="py-6 text-center text-sm text-muted-foreground">
                                        {emptyText}
                                    </ComboboxEmpty>
                                )}
                            </div>
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
                                    onClick={() => setInternalValues([])}
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
