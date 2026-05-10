import { z } from "zod";

export const questionSchema = z.object({
  title: z.string().min(5),
  content: z.string(),
  subjectId: z.string().uuid(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type QuestionInput = z.infer<typeof questionSchema>;
