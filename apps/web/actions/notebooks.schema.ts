import { z } from "zod";

export const notebookSchema = z.object({
  nome: z.string().min(3, "O nome do caderno deve ter pelo menos 3 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  disciplinaId: z.string().uuid("Disciplina inválida").optional().or(z.literal("")),
  concursoId: z.string().uuid("Concurso inválido").optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
});

export type NotebookInput = z.infer<typeof notebookSchema>;
