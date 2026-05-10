import { z } from "zod";

export const questionSchema = z.object({
  disciplinaId: z.string().uuid().optional().nullable(),
  assuntoId: z.string().uuid().optional().nullable(),
  topicoId: z.string().uuid().optional().nullable(),
  subtopicoId: z.string().uuid().optional().nullable(),
  bancaId: z.string().uuid().optional().nullable(),
  concursoId: z.string().uuid().optional().nullable(),
  carreiraId: z.string().uuid().optional().nullable(),
  nivelId: z.string().uuid().optional().nullable(),
  dificuldadeId: z.string().uuid().optional().nullable(),
  tipoId: z.string().uuid().optional().nullable(),
  ano: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  enunciado: z.string().trim().min(1),
  textoApoio: z.string().trim().optional().nullable(),
  resolucao: z.string().trim().optional().nullable(),
  isInedita: z.boolean().default(false),
  visibilidade: z.enum(["publica", "privada", "restrita"]).default("publica"),
  status: z.enum(["draft", "published", "archived", "reported"]).default("draft"),
});

export type QuestionInput = z.infer<typeof questionSchema>;
