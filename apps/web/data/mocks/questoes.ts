export interface Question {
  id: string;
  code: string;
  subject: string;
  topic: string;
  board: string;
  year: number;
  result?: 'correct' | 'incorrect';
  timeSpent?: string;
  createdAt?: string;
  commentCount: number;
  hasTeacherComment: boolean;
  preview: string;
}

export const QUESTION_HISTORY: Partial<Question>[] = [
  {
    id: 'h1',
    code: 'Q-98231',
    subject: 'Direito Administrativo',
    topic: 'Atos Administrativos',
    board: 'FGV',
    year: 2024,
    result: 'correct',
    timeSpent: '00:52',
    createdAt: '2024-05-08T10:30:00Z',
  },
  {
    id: 'h2',
    code: 'Q-88122',
    subject: 'Direito Constitucional',
    topic: 'Direitos e Garantias Fundamentais',
    board: 'Cebraspe',
    year: 2023,
    result: 'incorrect',
    timeSpent: '02:15',
    createdAt: '2024-05-08T10:15:00Z',
  }
];

export const COMMENTED_QUESTIONS: Question[] = [
  {
    id: 'c1',
    code: 'Q-11223',
    subject: 'Direito Tributário',
    topic: 'Competência Tributária',
    board: 'FGV',
    year: 2024,
    commentCount: 24,
    hasTeacherComment: true,
    preview: 'Sobre a competência tributária da União para instituir impostos extraordinários em caso de guerra externa...',
  },
  {
    id: 'c2',
    code: 'Q-44556',
    subject: 'Direito Penal',
    topic: 'Teoria do Crime',
    board: 'Cebraspe',
    year: 2023,
    commentCount: 12,
    hasTeacherComment: true,
    preview: 'Acerca da imputabilidade penal e das causas de exclusão da ilicitude, julgue o item a seguir...',
  },
  {
    id: 'c3',
    code: 'Q-99887',
    subject: 'Português',
    topic: 'Sintaxe da Oração',
    board: 'Vunesp',
    year: 2024,
    commentCount: 45,
    hasTeacherComment: false,
    preview: 'Assinale a alternativa em que a regência verbal está em conformidade com a norma-padrão da língua...',
  }
];
