export interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  protocol: string;
  subject: string;
  category: string;
  status: 'open' | 'replied' | 'closed';
  createdAt: string;
  lastUpdate: string;
  messages: Message[];
}

export const MY_TICKETS: Ticket[] = [
  {
    id: '1',
    protocol: 'CH-2024-001',
    subject: 'Erro no carregamento do PDF de Direito Constitucional',
    category: 'Erro em Questão',
    status: 'replied',
    createdAt: '2024-05-01T10:00:00Z',
    lastUpdate: '2024-05-02T14:30:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Olá, estou tentando baixar o PDF da aula 04 de Direito Constitucional e o arquivo parece corrompido.',
        createdAt: '2024-05-01T10:00:00Z',
      },
      {
        id: 'm2',
        sender: 'support',
        text: 'Olá! Identificamos um erro no servidor de arquivos. Já fizemos o re-upload do arquivo. Poderia testar novamente?',
        createdAt: '2024-05-02T14:30:00Z',
      }
    ]
  },
  {
    id: '2',
    protocol: 'CH-2024-002',
    subject: 'Dúvida sobre a recorrência das revisões',
    category: 'Dúvida Técnica',
    status: 'open',
    createdAt: '2024-05-05T09:15:00Z',
    lastUpdate: '2024-05-05T09:15:00Z',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'Como eu configuro para as revisões aparecerem a cada 7 dias em vez de 15?',
        createdAt: '2024-05-05T09:15:00Z',
      }
    ]
  },
  {
    id: '3',
    protocol: 'CH-2024-003',
    subject: 'Sugestão: Adicionar modo noturno nos simulados',
    category: 'Sugestão de Melhoria',
    status: 'closed',
    createdAt: '2024-04-20T16:00:00Z',
    lastUpdate: '2024-04-25T11:00:00Z',
    messages: [
      {
        id: 'm4',
        sender: 'user',
        text: 'Os simulados brancos cansam muito a vista à noite. Seria ótimo um dark mode.',
        createdAt: '2024-04-20T16:00:00Z',
      },
      {
        id: 'm5',
        sender: 'support',
        text: 'Sugestão anotada e enviada para o time de produto! Obrigado pelo feedback.',
        createdAt: '2024-04-24T10:00:00Z',
      },
      {
        id: 'm6',
        sender: 'support',
        text: 'Esta funcionalidade foi implementada na versão 2.4 do app. Ticket finalizado.',
        createdAt: '2024-04-25T11:00:00Z',
      }
    ]
  }
];
