# 🏆 Concurso Master

Plataforma completa de preparação para concursos públicos, construída como um monorepo moderno com Next.js, Turborepo e shadcn/ui.

---

## 📋 Sobre o Projeto

O **Concurso Master** é uma plataforma SaaS voltada para candidatos que se preparam para concursos públicos. O sistema oferece banco de questões, estatísticas de desempenho, cadernos de estudo, simulados e rankings — tudo em um único ambiente com experiência visual altamente personalizável.

---

## 🗂️ Estrutura do Monorepo

```
concurso/
├── apps/
│   └── web/                    # Aplicação Next.js principal
│       ├── app/
│       │   ├── (admin)/        # Rotas do painel administrativo
│       │   ├── (aluno)/        # Rotas do painel do aluno
│       │   ├── (professor)/    # Rotas do painel do professor
│       │   ├── (auth)/         # Rotas de autenticação
│       │   ├── (public)/       # Rotas públicas
│       │   └── api/            # API Routes (Next.js)
│       ├── components/         # Componentes específicos do app
│       ├── contexts/           # Context API (layout, temas, etc.)
│       └── registry/           # Registro de temas e paletas de cores
│
└── packages/
    ├── ui/                     # Biblioteca de componentes compartilhados (shadcn/ui)
    ├── database/               # Prisma ORM + schema PostgreSQL
    ├── auth/                   # Configuração de autenticação
    ├── types/                  # Tipos TypeScript compartilhados
    ├── validators/             # Schemas de validação (Zod)
    ├── configs/                # Configurações compartilhadas
    ├── eslint-config/          # Configuração ESLint compartilhada
    └── typescript-config/      # tsconfig base compartilhado
```

---

## 🚀 Rotas da Aplicação

### 👨‍🎓 Área do Aluno `/`
| Rota | Descrição |
|------|-----------|
| `/dashboard` | Painel principal com resumo de desempenho |
| `/questoes/resolver` | Resolver questões do banco |
| `/questoes/favoritas` | Questões marcadas como favoritas |
| `/questoes/erradas` | Revisão de questões erradas |
| `/questoes/historico` | Histórico de questões respondidas |
| `/questoes/comentadas` | Questões com comentários |
| `/caderno/meus` | Cadernos de estudo pessoais |
| `/caderno/anotacoes` | Anotações do aluno |
| `/caderno/revisoes` | Revisões programadas |
| `/estatisticas/desempenho` | Desempenho geral |
| `/estatisticas/taxa-acerto` | Taxa de acerto por matéria |
| `/estatisticas/evolucao` | Evolução ao longo do tempo |
| `/estatisticas/tempo-estudo` | Tempo dedicado ao estudo |
| `/rankings/geral` | Ranking geral da plataforma |
| `/rankings/semanal` | Ranking semanal |
| `/rankings/por-concurso` | Ranking por concurso específico |
| `/suporte/novo` | Abrir ticket de suporte |
| `/suporte/meus` | Meus tickets de suporte |
| `/suporte/faq` | Perguntas frequentes |

### 🛠️ Área Administrativa `/admin`
| Rota | Descrição |
|------|-----------|
| `/admin/questoes` | Gestão completa do banco de questões |
| `/admin/reports` | Relatórios e revisão de reports |
| `/admin/disciplinas` | Gestão de disciplinas |
| `/admin/carreiras` | Gestão de carreiras/cargos |
| `/admin/bancas` | Bancas examinadoras |
| `/admin/concursos` | Gestão de concursos |
| `/admin/usuarios` | Gestão de usuários |
| `/admin/pagamentos` | Pagamentos e assinaturas |
| `/admin/auditoria` | Logs de auditoria |

### 👨‍🏫 Área do Professor `/professor`
| Rota | Descrição |
|------|-----------|
| `/professor/dashboard` | Painel do professor |
| `/professor/questoes` | Questões criadas pelo professor |
| `/professor/comentarios` | Comentários em questões |
| `/professor/revisao` | Revisão de questões pendentes |

---

## 📦 Pacotes Internos

### `@workspace/ui`
Biblioteca de componentes visuais baseada em **shadcn/ui** e **Tailwind CSS v4**. Inclui +55 componentes prontos para uso:

`Accordion`, `Alert`, `AlertDialog`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Calendar`, `Card`, `Carousel`, `Chart`, `Checkbox`, `Collapsible`, `Combobox`, `Command`, `Dialog`, `Drawer`, `DropdownMenu`, `Field`, `HoverCard`, `Input`, `InputOTP`, `Label`, `Menubar`, `NavigationMenu`, `Pagination`, `Popover`, `Progress`, `RadioGroup`, `Resizable`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Slider`, `Sonner`, `Switch`, `Table`, `Tabs`, `Textarea`, `Toggle`, `Tooltip`, ...

#### Sistema de Temas
O projeto suporta dois tipos de personalização:

- **Paletas (type: palette)**: Alteram apenas a cor principal — Padrão, Neutro, Pedra, Âmbar, Azul, Ciano, Esmeralda, Verde, Índigo, Fúcsia, Rosa
- **Experiências V3 (type: experience)**: Alteram completamente cores, superfícies e fundos — Azul V3, Verde V3, Neutro V3, Laranja V3, Vermelho V3, Rosa V3, Violeta V3, Amarelo V3

#### Variantes de Layout
Configuráveis em tempo real pelo usuário via painel lateral:
- **Variante da Sidebar**: `sidebar` | `floating` | `inset`
- **Modo de Recolhimento**: `offcanvas` | `icon`
- **Layout do Conteúdo**: `full` | `centered`
- **Posição da Sidebar**: `left` | `right`
- **Navbar**: fixa (`sticky`) ou rolável

### `@workspace/database`
ORM com **Prisma** conectado ao **PostgreSQL**. Schema em `packages/database/prisma/schema.prisma`.

### `@workspace/auth`
Módulo de autenticação compartilhado com configuração de sessão.

### `@workspace/types`
Tipos TypeScript compartilhados entre todos os pacotes e apps.

### `@workspace/validators`
Schemas de validação construídos com **Zod**.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Monorepo | Turborepo |
| Gerenciador de Pacotes | npm Workspaces |
| Linguagem | TypeScript 5.9 |
| Estilização | Tailwind CSS v4 |
| Componentes | shadcn/ui (Base UI) |
| ORM | Prisma |
| Banco de Dados | PostgreSQL |
| Fontes | Geist, Noto Sans, Quicksand, Inter, Outfit, Roboto, Lexend |
| Ícones | Tabler Icons, Lucide React |

---

## ⚡ Comandos

### Desenvolvimento
```bash
# Iniciar todos os apps em modo desenvolvimento
npm run dev

# Iniciar apenas o app web
npm run dev --filter=web
```

### Build
```bash
npm run build
```

### Qualidade de Código
```bash
npm run lint
npm run typecheck
npm run format
```

### Adicionar Componentes UI
```bash
# Na raiz do projeto
npx shadcn@latest add <componente> -c apps/web
```

Os componentes serão instalados em `packages/ui/src/components/`.

---

## 🎨 Usando Componentes

Importe sempre de `@workspace/ui`:

```tsx
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Sidebar, SidebarContent } from "@workspace/ui/components/sidebar"
```

---

## 🔧 Requisitos

- **Node.js** >= 20
- **npm** >= 11
- **PostgreSQL** (para o banco de dados)

---

## 📁 Configuração de Ambiente

Crie um arquivo `.env` em `apps/web/` com as variáveis necessárias:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/concurso"
```

---

## 🧱 Arquitetura de Contextos

O app usa **React Context API** para gerenciamento de estado global de UI:

- **`LayoutContext`** — Controla variante da sidebar, layout do conteúdo, comportamento da navbar, paleta de cores, família de fontes, tamanho de fonte e border-radius. Persiste as preferências do usuário no `localStorage`.

---

> Projeto privado. Todos os direitos reservados.
