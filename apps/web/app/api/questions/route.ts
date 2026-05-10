import { NextRequest, NextResponse } from "next/server";
import { createQuestionService, listQuestionsService } from "./service";

export async function GET() {
  try {
    const questions = await listQuestionsService();
    return NextResponse.json(questions);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
