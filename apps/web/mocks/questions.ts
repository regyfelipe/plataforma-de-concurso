export const MOCK_QUESTIONS = [
  
  {
  id: "question-1",

  code: "QST-000002",

  type: "multiple_choice",

  discipline: "Língua Portuguesa",

  subject: "Sintaxe",

  topic: "Concordância Verbal",

  board: "FCC",

  institution: "TRT-15",

  career: "Analista Judiciário",

  educationLevel: "Ensino Superior",

  year: 2023,

  questionText:
    "Assinale a alternativa em que a concordância verbal está de acordo com a norma-padrão da Língua Portuguesa:",

  supportText: `
A concordância verbal estabelece a relação entre o verbo e o sujeito da oração. 
Na norma-padrão da Língua Portuguesa, o verbo deve concordar em número e pessoa com o núcleo do sujeito.

Existem, contudo, casos específicos frequentemente cobrados em concursos públicos, especialmente envolvendo:

• verbos impessoais;
• expressões partitivas;
• porcentagem;
• sujeito composto;
• coletivos;
• verbos auxiliares;
• locuções verbais;
• índice de indeterminação do sujeito;
• partícula apassivadora;
• verbo "haver" no sentido de existir;
• verbo "fazer" indicando tempo decorrido.

ATENÇÃO:

1. O verbo HAVER, quando utilizado com sentido de "existir", "ocorrer" ou indicando tempo decorrido, é impessoal e permanece obrigatoriamente na 3ª pessoa do singular.

Exemplos:
- Havia muitos candidatos na sala.
- Houve diversos recursos administrativos.
- Há muitos anos não o vejo.

2. O verbo FAZER, indicando tempo ou fenômeno da natureza, também é impessoal.

Exemplos:
- Faz dez anos que estudo para concursos.
- Fazia semanas que não chovia.

3. Quando o sujeito é indeterminado com o pronome "se", o verbo permanece no singular.

Exemplo:
- Precisa-se de servidores qualificados.

4. Quando o "se" funciona como partícula apassivadora, o verbo concorda com o sujeito paciente.

Exemplo:
- Vendem-se apartamentos.
- Alugam-se salas comerciais.

5. Expressões partitivas admitem dupla concordância.

Exemplos:
- A maioria dos alunos chegou.
- A maioria dos alunos chegaram.

6. Expressões com porcentagem exigem atenção ao núcleo do sujeito.

Exemplos:
- 20% da turma faltou.
- 20% dos candidatos faltaram.

7. Em concursos da FCC, FGV e CESPE, é comum a banca apresentar alternativas com:
- plural indevido em verbos impessoais;
- confusão entre índice de indeterminação do sujeito e partícula apassivadora;
- erro de concordância com porcentagem;
- falsa concordância atrativa.

Leia atentamente cada alternativa e identifique a única frase que respeita integralmente a norma-padrão da Língua Portuguesa.
  `,

  difficulty: "medio",

  isUnique: true,

  access: "free",

  visibility: "publica",

  status: "published",

  resolution: `
A questão exige conhecimento das regras de concordância verbal previstas na norma-padrão.

O principal ponto cobrado é o uso do verbo HAVER com sentido de EXISTIR.

Nessa situação, o verbo é impessoal e deve permanecer sempre na terceira pessoa do singular.

Assim:
- "Havia muitos candidatos" → correto.
- "Haviam muitos candidatos" → incorreto.

Além disso, a questão explora:
- verbo FAZER indicando tempo;
- partícula apassivadora;
- índice de indeterminação do sujeito.

A única alternativa plenamente correta é a letra B.
  `,

  alternatives: [
    {
      id: "alt-1",
      letter: "A",
      text: "Haviam diversos servidores aguardando o início da audiência.",
      isCorrect: false,
      percentage: 32,
      explanation:
        "Errada. O verbo HAVER, no sentido de existir, é impessoal e deve permanecer no singular.",
      reference:
        "Gramática normativa — verbos impessoais",
      tip:
        "Sempre que puder substituir HAVER por EXISTIR, o verbo ficará no singular."
    },
    {
      id: "alt-2",
      letter: "B",
      text: "Havia diversos servidores aguardando o início da audiência.",
      isCorrect: true,
      percentage: 58,
      explanation:
        "Correta. O verbo HAVER foi empregado com sentido de existir e, portanto, permanece corretamente na 3ª pessoa do singular.",
      reference:
        "Gramática normativa — verbos impessoais",
      tip:
        "Essa é uma das regras mais cobradas em concursos públicos."
    },
    {
      id: "alt-3",
      letter: "C",
      text: "Fazem cinco anos que o tribunal publicou o edital do concurso.",
      isCorrect: false,
      percentage: 6,
      explanation:
        "Errada. O verbo FAZER, indicando tempo decorrido, é impessoal e deve permanecer no singular.",
      reference:
        "Gramática normativa — verbos impessoais",
      tip:
        "Tempo decorrido → FAZ."
    },
    {
      id: "alt-4",
      letter: "D",
      text: "Precisa-se de servidores especializados para o setor administrativo.",
      isCorrect: false,
      percentage: 4,
      explanation:
        "Errada segundo o gabarito da questão simulada. Embora a construção esteja gramaticalmente correta, a banca exigiu identificação da alternativa relacionada especificamente ao emprego correto do verbo HAVER.",
      reference:
        "Índice de indeterminação do sujeito",
      tip:
        "O verbo fica no singular quando o sujeito é indeterminado com 'se'."
    }
  ],

  objectives: [
    "Identificar regras de concordância verbal",
    "Reconhecer verbos impessoais",
    "Diferenciar partícula apassivadora de índice de indeterminação do sujeito"
  ],

  references: [
    "BECHARA, Evanildo. Moderna Gramática Portuguesa.",
    "CUNHA, Celso; CINTRA, Lindley. Nova Gramática do Português Contemporâneo."
  ],

  videos: [
    {
      title: "Concordância Verbal para Concursos",
      url: "https://youtube.com/exemplo"
    }
  ],

  tags: [
    "Português",
    "Sintaxe",
    "Concordância Verbal",
    "FCC"
  ],

  keywords: [
    "concordância verbal",
    "verbo haver",
    "verbo fazer",
    "verbos impessoais"
  ],

  stats: {
    totalAnswers: 892,

    correctRate: 58,

    averageTimeSeconds: 168,

    mostSelectedWrongAlternative: "A"
  },

  userState: {
    isFavorite: true,

    isInNotebook: false,

    hasAnswered: true,

    selectedAlternative: "A",

    isCorrect: false
  },

  commentsCount: 18,

  reportsCount: 0,

  hasVideoLesson: true,

  createdAt: new Date().toISOString(),

  updatedAt: new Date().toISOString(),

  author: {
    id: "user-2",

    name: "Profa. Maria Helena"
  },

  reviewer: {
    id: "reviewer-2",

    name: "Prof. Ricardo Alves"
  },

  reviewedAt: new Date().toISOString()
}

]
