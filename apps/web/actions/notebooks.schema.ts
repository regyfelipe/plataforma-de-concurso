import { z } from "zod";

export const notebookSchema = z.object({
  nome: z.string().min(3, "O nome do caderno deve ter pelo menos 3 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  carreiraId: z.string().uuid("Carreira inválida").optional().or(z.literal("")),
  disciplinaId: z.string().uuid("Disciplina inválida").optional().or(z.literal("")),
  concursoId: z.string().uuid("Concurso inválido").optional().or(z.literal("")),
  dificuldadeId: z.string().uuid("Dificuldade inválida").optional().or(z.literal("")),
  anoReferencia: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  isPublic: z.boolean().default(true),
});

export type NotebookInput = z.infer<typeof notebookSchema>;
