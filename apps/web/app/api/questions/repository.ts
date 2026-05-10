import { prisma } from "@workspace/database";
import { QuestionInput } from "./schema";

export async function createQuestion(data: QuestionInput) {
  return prisma.question.create({
    data,
  });
}

export async function getQuestions() {
  return prisma.question.findMany();
}
