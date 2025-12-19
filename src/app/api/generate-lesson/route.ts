import { NextRequest, NextResponse } from "next/server";
import { generateLesson } from "@/lib/mistral";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { skill, level = "beginner", previousTopics = [] } = body;

        if (!skill) {
            return NextResponse.json(
                { error: "Skill is required" },
                { status: 400 }
            );
        }

        const lesson = await generateLesson(skill, level, previousTopics);

        return NextResponse.json({ lesson });
    } catch (error) {
        console.error("Error in generate-lesson API:", error);
        return NextResponse.json(
            { error: "Failed to generate lesson" },
            { status: 500 }
        );
    }
}
