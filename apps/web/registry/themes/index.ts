export type Theme = {
  name: string
  id: string
  label: string
  activeColor: string
  type: 'palette' | 'experience'
}

export const themes: Theme[] = [
  { name: "Padrão", id: "default", label: "Padrão", activeColor: "#000000", type: 'palette' },
  { name: "Neutral", id: "neutral", label: "Neutro", activeColor: "#737373", type: 'palette' },
  { name: "Stone", id: "stone", label: "Pedra", activeColor: "#78716c", type: 'palette' },
  { name: "Ambar", id: "ambar", label: "Âmbar", activeColor: "#f59e0b", type: 'palette' },
  { name: "Blue", id: "blue", label: "Azul", activeColor: "#3b82f6", type: 'palette' },
  { name: "Cyan", id: "cyan", label: "Ciano", activeColor: "#06b6d4", type: 'palette' },
  { name: "Emerald", id: "emerald", label: "Esmeralda", activeColor: "#10b981", type: 'palette' },
  { name: "Green", id: "green", label: "Verde", activeColor: "#22c55e", type: 'palette' },
  { name: "Indigo", id: "indigo", label: "Índigo", activeColor: "#6366f1", type: 'palette' },
  { name: "Fuchsia", id: "fuchsia", label: "Fúcsia", activeColor: "#d946ef", type: 'palette' },
  { name: "Pink", id: "pink", label: "Rosa", activeColor: "#ec4899", type: 'palette' },
  
  // Temas V3 (Experiências Completas)
  { name: "Blue V3", id: "v3-blue", label: "Azul V3", activeColor: "oklch(0.623 0.214 259.815)", type: 'experience' },
  { name: "Green V3", id: "v3-green", label: "Verde V3", activeColor: "oklch(0.723 0.219 149.579)", type: 'experience' },
  { name: "Neutral V3", id: "v3-neutral", label: "Neutro V3", activeColor: "oklch(0.21 0.006 285.885)", type: 'experience' },
  { name: "Orange V3", id: "v3-orange", label: "Laranja V3", activeColor: "oklch(0.705 0.213 47.604)", type: 'experience' },
  { name: "Red V3", id: "v3-red", label: "Vermelho V3", activeColor: "oklch(0.637 0.237 25.331)", type: 'experience' },
  { name: "Rose V3", id: "v3-rose", label: "Rosa V3", activeColor: "oklch(0.645 0.246 16.439)", type: 'experience' },
  { name: "Violet V3", id: "v3-violet", label: "Violeta V3", activeColor: "oklch(0.606 0.25 292.717)", type: 'experience' },
  { name: "Yellow V3", id: "v3-yellow", label: "Amarelo V3", activeColor: "oklch(0.795 0.184 86.047)", type: 'experience' },
]
