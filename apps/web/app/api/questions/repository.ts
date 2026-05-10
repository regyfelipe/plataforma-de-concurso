import { prisma } from "@workspace/database";
import { QuestionInput } from "./schema";

async function generateQuestionCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `Q${Date.now().toString().slice(-9)}${suffix}`.slice(0, 20);
    const exists = await prisma.questao.findUnique({
      where: { code },
      select: { id: true },
    });

    if (!exists) return code;
  }

  throw new Error("Não foi possível gerar um código único para a questão.");
}

export async function createQuestion(data: QuestionInput) {
  const code = await generateQuestionCode();

  return prisma.questao.create({
    data: {
      ...data,
      code,
      textoApoio: data.textoApoio || null,
      resolucao: data.resolucao || null,
    },
  });
}

export async function getQuestions() {
  return prisma.questao.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      disciplina: true,
      assunto: true,
      topico: true,
      banca: true,
      concurso: true,
      dificuldade: true,
      alternativas: { orderBy: { letra: "asc" } },
    },
  });
}
