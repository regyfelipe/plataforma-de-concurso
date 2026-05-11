import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@workspace/auth";
import { prisma } from "@workspace/database";
import { headers } from "next/headers";
import { createQuestionService, listQuestionsService } from "./service";

async function requireAdmin() {
  const session = await getSession(await headers());

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { perfil: true },
  });

  if (user?.perfil !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export async function GET() {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const questions = await listQuestionsService();
    return NextResponse.json(questions);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await req.json();
    const newQuestion = await createQuestionService(body);
    
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Error", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
