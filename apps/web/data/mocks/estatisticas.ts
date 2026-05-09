export const PERFORMANCE_STATS = {
    overall: {
        precision: 82,
        totalQuestions: 2450,
        studyTime: "124h",
        activeDays: 45
    },
    byDiscipline: [
        { 
            name: "Direito Constitucional", 
            precision: 88, 
            solved: 450, 
            trend: "up",
            topics: [
                { name: "Direitos Fundamentais", precision: 92 },
                { name: "Organização do Estado", precision: 85 },
                { name: "Poder Judiciário", precision: 87 }
            ]
        },
        { 
            name: "Direito Administrativo", 
            precision: 72, 
            solved: 380, 
            trend: "down",
            topics: [
                { name: "Atos Administrativos", precision: 62 },
                { name: "Licitações (Lei 14.133)", precision: 75 },
                { name: "Agentes Públicos", precision: 79 }
            ]
        },
        { 
            name: "Língua Portuguesa", 
            precision: 85, 
            solved: 600, 
            trend: "up",
            topics: [
                { name: "Interpretação de Texto", precision: 88 },
                { name: "Sintaxe da Oração", precision: 82 },
                { name: "Pontuação", precision: 85 }
            ]
        },
    ],
    evolution: [
        { week: "Sem. 1", value: 65, goal: 80, avg: 70 },
        { week: "Sem. 2", value: 68, goal: 80, avg: 70 },
        { week: "Sem. 3", value: 75, goal: 80, avg: 72 },
        { week: "Sem. 4", value: 72, goal: 80, avg: 72 },
        { week: "Sem. 5", value: 80, goal: 80, avg: 73 },
        { week: "Sem. 6", value: 82, goal: 80, avg: 74 },
    ],
    skills: [
        { subject: 'Administrativo', A: 70, fullMark: 100 },
        { subject: 'Constitucional', A: 85, fullMark: 100 },
        { subject: 'Português', A: 82, fullMark: 100 },
        { subject: 'Lógica', A: 65, fullMark: 100 },
        { subject: 'Informática', A: 75, fullMark: 100 },
    ],
    mastery: {
        mastered: 450,
        learning: 1200,
        new: 800
    },
    byDifficulty: [
        { level: "Fácil", accuracy: 95, color: "#10b981" },
        { level: "Média", accuracy: 78, color: "#3b82f6" },
        { level: "Difícil", accuracy: 42, color: "#f59e0b" },
    ],
    byBoard: [
        { board: "Cebraspe", accuracy: 84 },
        { board: "FGV", accuracy: 65 },
        { board: "FCC", accuracy: 88 },
    ],
    timeStats: {
        totalLiquidHours: 124,
        dailyAverage: "4.2h",
        weeklyDistribution: [
            { day: "Seg", hours: 4.5 },
            { day: "Ter", hours: 5.2 },
            { day: "Qua", hours: 3.8 },
            { day: "Qui", hours: 6.0 },
            { day: "Sex", hours: 4.0 },
            { day: "Sab", hours: 2.5 },
            { day: "Dom", hours: 1.2 },
        ],
        timePerQuestionBySubject: [
            { subject: "Português", time: 95 }, // em segundos
            { subject: "Constitucional", time: 72 },
            { subject: "Lógica", time: 145 },
            { subject: "Administrativo", time: 88 },
        ]
    },
    insights: [
        { type: "warning", message: "Sua performance em 'Atos Administrativos' caiu 15% esta semana." },
        { type: "success", message: "Você atingiu sua meta de 50 questões diárias por 5 dias seguidos!" },
        { type: "info", message: "Mantenha o ritmo em 'Português', você está no top 5% do ranking." }
    ]
}
