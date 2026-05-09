export const ADMIN_STATS = {
  totalUsers: 15420,
  usersGrowth: 12.5,
  monthlyRevenue: 85400,
  revenueGrowth: 8.2,
  openTickets: 14,
  reportedQuestions: 32,
  activeSubscriptions: 8900
};

export const RECENT_USERS = [
  { id: 'u1', name: 'Carlos Andrade', email: 'carlos@email.com', plan: 'Premium', status: 'active', date: '2024-05-08T11:20:00Z' },
  { id: 'u2', name: 'Ana Beatriz', email: 'ana.b@email.com', plan: 'Free', status: 'active', date: '2024-05-08T10:45:00Z' },
  { id: 'u3', name: 'Marcos Silva', email: 'marcos.s@email.com', plan: 'Elite', status: 'pending', date: '2024-05-08T09:30:00Z' },
  { id: 'u4', name: 'Julia Costa', email: 'julia.c@email.com', plan: 'Premium', status: 'active', date: '2024-05-08T08:15:00Z' },
];

export const USER_GROWTH_DATA = [
  { month: 'Jan', users: 12000 },
  { month: 'Fev', users: 12800 },
  { month: 'Mar', users: 13500 },
  { month: 'Abr', users: 14200 },
  { month: 'Mai', users: 15420 },
];

export const REVENUE_DISTRIBUTION = [
  { name: 'Plano Free', value: 4500, fill: 'hsl(var(--muted))' },
  { name: 'Plano Premium', value: 8200, fill: 'hsl(var(--primary))' },
  { name: 'Plano Elite', value: 2720, fill: 'hsl(var(--primary) / 0.6)' },
];

export const DISCIPLINAS_MOCK = [
  { id: 'd1', code: 'DIR-ADM', name: 'Direito Administrativo', description: 'Atos, licitações, contratos e agentes públicos.', status: 'active', questions: 1240 },
  { id: 'd2', code: 'DIR-CON', name: 'Direito Constitucional', description: 'Direitos fundamentais, organização do estado e poderes.', status: 'active', questions: 1850 },
  { id: 'd3', code: 'POR', name: 'Língua Portuguesa', description: 'Gramática, interpretação de texto e sintaxe.', status: 'active', questions: 2100 },
  { id: 'd4', code: 'RAC-LOG', name: 'Raciocínio Lógico', description: 'Proposições, diagramas e lógica de argumentação.', status: 'inactive', questions: 850 },
  { id: 'd5', code: 'DIR-PEN', name: 'Direito Penal', description: 'Código penal, crimes contra a administração e pessoa.', status: 'active', questions: 920 },
];

export const CARREIRAS_MOCK = [
  { id: 'c1', name: 'Policial', description: 'PF, PRF, Polícias Civis e Militares.', status: 'active', subcategories: 12 },
  { id: 'c2', name: 'Tribunais', description: 'Analista e Técnico de TRTs, TREs e TJ.', status: 'active', subcategories: 8 },
  { id: 'c3', name: 'Fiscal', description: 'Receita Federal, SEFAZ e ISS.', status: 'active', subcategories: 5 },
  { id: 'c4', name: 'Administrativa', description: 'Agente administrativo e cargos técnicos.', status: 'active', subcategories: 15 },
  { id: 'c5', name: 'Jurídica', description: 'Magistratura, Promotoria e Defensoria.', status: 'inactive', subcategories: 4 },
];

export const DIFICULDADE_MOCK = [
  { id: 'diff1', name: 'Muito Fácil', slug: 'muito_facil', status: 'active', usageCount: 450 },
  { id: 'diff2', name: 'Fácil', slug: 'facil', status: 'active', usageCount: 1250 },
  { id: 'diff3', name: 'Médio', slug: 'medio', status: 'active', usageCount: 2800 },
  { id: 'diff4', name: 'Difícil', slug: 'dificil', status: 'active', usageCount: 1850 },
  { id: 'diff5', name: 'Muito Difícil', slug: 'muito_dificil', status: 'active', usageCount: 620 },
];

export const EDUCACIONAL_MOCK = [
  { id: 'edu1', name: 'Ensino Médio', status: 'active', usageCount: 4200 },
  { id: 'edu2', name: 'Ensino Superior', status: 'active', usageCount: 8500 },
  { id: 'edu3', name: 'Pós-Graduação', status: 'active', usageCount: 1200 },
  { id: 'edu4', name: 'Mestrado / Doutorado', status: 'inactive', usageCount: 300 },
];

export const BANCAS_MOCK = [
  { id: 'b1', name: 'Cebraspe (CESPE)', sigla: 'CESPE', description: 'Famosa pelo método de uma errada anula uma certa.', status: 'active', questions: 15400 },
  { id: 'b2', name: 'Fundação Carlos Chagas', sigla: 'FCC', description: 'Conhecida pela literalidade da lei.', status: 'active', questions: 8200 },
  { id: 'b3', name: 'Fundação Getúlio Vargas', sigla: 'FGV', description: 'Especialista em casos práticos e português complexo.', status: 'active', questions: 9500 },
  { id: 'b4', name: 'VUNESP', sigla: 'VUNESP', description: 'Banca tradicional de concursos de SP.', status: 'active', questions: 5400 },
  { id: 'b5', name: 'Instituto AOCP', sigla: 'AOCP', description: 'Banca em crescimento no cenário nacional.', status: 'inactive', questions: 2100 },
];

export const CONCURSOS_MOCK = [
  { id: 'conc1', name: 'Polícia Rodoviária Federal 2024', banca: 'CESPE', ano: 2024, carreira: 'Policial', escolaridade: 'Superior', status: 'aberto' },
  { id: 'conc2', name: 'Polícia Federal - Agente 2024', banca: 'CESPE', ano: 2024, carreira: 'Policial', escolaridade: 'Superior', status: 'previsto' },
  { id: 'conc3', name: 'Receita Federal - Auditor', banca: 'FGV', ano: 2023, carreira: 'Fiscal', escolaridade: 'Superior', status: 'encerrado' },
  { id: 'conc4', name: 'Tribunal de Justiça SP - Escrevente', banca: 'VUNESP', ano: 2024, carreira: 'Tribunais', escolaridade: 'Médio', status: 'aberto' },
];

export const TIPOS_QUESTAO_MOCK = [
  { id: 't1', name: 'Múltipla Escolha (A, B, C, D, E)', description: 'Padrão com 5 alternativas e apenas uma correta.', status: 'active' },
  { id: 't2', name: 'Certo ou Errado', description: 'Padrão Cebraspe onde uma errada pode anular uma certa.', status: 'active' },
  { id: 't3', name: 'Múltipla Escolha (4 Alternativas)', description: 'Padrão comum em bancas menores e alguns concursos municipais.', status: 'active' },
];

export const ASSUNTOS_MOCK = [
  // Disciplina: Direito Administrativo
  { id: 'as1', disciplina: 'Direito Administrativo', name: 'Atos Administrativos', level: 'assunto', parentId: null },
  { id: 'as2', disciplina: 'Direito Administrativo', name: 'Elementos do Ato', level: 'topico', parentId: 'as1' },
  { id: 'as3', disciplina: 'Direito Administrativo', name: 'Competência', level: 'subtopico', parentId: 'as2' },
  { id: 'as4', disciplina: 'Direito Administrativo', name: 'Finalidade', level: 'subtopico', parentId: 'as2' },
  
  // Disciplina: Língua Portuguesa
  { id: 'as5', disciplina: 'Língua Portuguesa', name: 'Sintaxe', level: 'assunto', parentId: null },
  { id: 'as6', disciplina: 'Língua Portuguesa', name: 'Sintaxe da Oração', level: 'topico', parentId: 'as5' },
  { id: 'as7', disciplina: 'Língua Portuguesa', name: 'Sujeito e Predicado', level: 'subtopico', parentId: 'as6' },
];

export const CADERNOS_MOCK = [
  { id: 'cad1', name: 'Simulado PRF 2024 - Oficial', disciplina: 'Múltiplas', professor: 'Admin', status: 'published', questions: 120 },
  { id: 'cad2', name: 'Direito Administrativo do Zero', disciplina: 'Direito Administrativo', professor: 'Prof. Silva', status: 'published', questions: 50 },
  { id: 'cad3', name: 'Português: Interpretação de Textos', disciplina: 'Língua Portuguesa', professor: 'Prof. Ana', status: 'draft', questions: 30 },
];

