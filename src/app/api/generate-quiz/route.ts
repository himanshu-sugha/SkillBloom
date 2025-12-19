import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/mistral";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { skill, lessonContent, numQuestions = 3 } = body;

        if (!skill || !lessonContent) {
            return NextResponse.json(
                { error: "Skill and lesson content are required" },
                { status: 400 }
            );
        }

        const quiz = await generateQuiz(skill, lessonContent, numQuestions);

        return NextResponse.json({ quiz });
    } catch (error) {
        console.error("Error in generate-quiz API:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz" },
            { status: 500 }
        );
    }
}
