import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY || "",
});

export interface LessonContent {
    title: string;
    introduction: string;
    concepts: {
        name: string;
        explanation: string;
        example?: string;
    }[];
    exercise: {
        question: string;
        hint: string;
    };
    summary: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export async function generateLesson(
    skill: string,
    level: "beginner" | "intermediate" | "advanced",
    previousTopics: string[] = []
): Promise<LessonContent> {
    const previousContext = previousTopics.length > 0
        ? `The learner has already covered: ${previousTopics.join(", ")}. Build on this knowledge.`
        : "This is the learner's first lesson on this topic.";

    const prompt = `You are an expert teacher creating a micro-lesson (5 minutes) about "${skill}" for a ${level} learner.

${previousContext}

Create an engaging, bite-sized lesson in this exact JSON format:
{
  "title": "A catchy lesson title",
  "introduction": "A brief, motivating introduction (2-3 sentences)",
  "concepts": [
    {
      "name": "Concept name",
      "explanation": "Clear explanation in simple terms",
      "example": "Practical example"
    }
  ],
  "exercise": {
    "question": "A practical exercise or reflection question",
    "hint": "A helpful hint"
  },
  "summary": "Key takeaway in 1-2 sentences"
}

Keep it concise, practical, and encouraging. Include 2-3 concepts maximum. Return ONLY valid JSON.`;

    try {
        const response = await client.chat.complete({
            model: "mistral-small-latest",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            maxTokens: 1000,
        });

        const content = response.choices?.[0]?.message?.content;
        if (typeof content === "string") {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as LessonContent;
            }
        }
        throw new Error("Invalid response format");
    } catch (error) {
        console.error("Error generating lesson:", error);
        return getDefaultLesson(skill);
    }
}

export async function generateQuiz(
    skill: string,
    lessonContent: string,
    numQuestions: number = 3
): Promise<QuizQuestion[]> {
    const prompt = `Based on this lesson about "${skill}":

${lessonContent}

Create ${numQuestions} quiz questions to test understanding. Return as JSON array:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct"
  }
]

Make questions progressively harder. Return ONLY valid JSON array.`;

    try {
        const response = await client.chat.complete({
            model: "mistral-small-latest",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            maxTokens: 800,
        });

        const content = response.choices?.[0]?.message?.content;
        if (typeof content === "string") {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as QuizQuestion[];
            }
        }
        throw new Error("Invalid response format");
    } catch (error) {
        console.error("Error generating quiz:", error);
        return getDefaultQuiz();
    }
}

export async function generateLearningPath(
    skill: string,
    goal: string,
    timePerDay: number
): Promise<string[]> {
    const prompt = `Create a learning path for someone wanting to learn "${skill}" with this goal: "${goal}". They can spend ${timePerDay} minutes per day.

Return a JSON array of 10-15 lesson topics in logical order, from basics to advanced:
["Topic 1", "Topic 2", "Topic 3", ...]

Make each topic specific and actionable. Return ONLY the JSON array.`;

    try {
        const response = await client.chat.complete({
            model: "mistral-small-latest",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
            maxTokens: 500,
        });

        const content = response.choices?.[0]?.message?.content;
        if (typeof content === "string") {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as string[];
            }
        }
        throw new Error("Invalid response format");
    } catch (error) {
        console.error("Error generating learning path:", error);
        return getDefaultLearningPath(skill);
    }
}

// Fallback content
function getDefaultLesson(skill: string): LessonContent {
    return {
        title: `Introduction to ${skill}`,
        introduction: `Welcome to your first lesson on ${skill}! Let's explore the fundamentals together.`,
        concepts: [
            {
                name: "Core Concept",
                explanation: `The foundation of ${skill} starts with understanding its basic principles.`,
                example: "Think of it like learning to ride a bike - you start with balance.",
            },
        ],
        exercise: {
            question: `What aspect of ${skill} interests you the most?`,
            hint: "There's no wrong answer - this helps personalize your journey!",
        },
        summary: `You've taken your first step in learning ${skill}. Every expert was once a beginner!`,
    };
}

function getDefaultQuiz(): QuizQuestion[] {
    return [
        {
            question: "What's the most important factor in learning a new skill?",
            options: ["Talent", "Consistent practice", "Expensive tools", "Age"],
            correctIndex: 1,
            explanation: "Research shows consistent practice is the key to mastering any skill.",
        },
    ];
}

function getDefaultLearningPath(skill: string): string[] {
    return [
        `Introduction to ${skill}`,
        `${skill} fundamentals`,
        `Basic ${skill} techniques`,
        `Intermediate ${skill} concepts`,
        `Advanced ${skill} strategies`,
    ];
}
