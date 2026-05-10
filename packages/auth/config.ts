import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@workspace/database";
import { sendEmail } from "@workspace/email";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  user: {
    modelName: "Usuario",
    fields: {
      name: "nome",
      image: "avatarUrl",
      emailVerified: "emailVerificado",
      createdAt: "criadoEm",
      updatedAt: "atualizadoEm",
    },
  },

  session: {
    modelName: "Sessao",
    fields: {
      userId: "usuarioId",
      token: "refreshToken",
      expiresAt: "expiraEm",
      userAgent: "dispositivo",
      createdAt: "criadoEm",
      updatedAt: "criadoEm",
    },
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  emailVerification: {
    sendOnSignUp: false,
  },

  databaseHooks: {
    user: {
      create: {
        before: async () => ({
          data: {
            emailVerified: true,
            status: "ativo",
          },
        }),
        after: async (user) => {
          sendEmail({
            to: user.email,
            subject: "Bem-vindo ao Concurso Master",
            html: `<p>Olá ${user.name}, seu cadastro foi realizado com sucesso.</p><p>Bons estudos!</p>`,
          }).catch((error) => {
            console.error("Erro ao enviar e-mail de boas-vindas:", error);
          });
        },
      },
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
