"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Leaf,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    BookOpen,
    CheckCircle2,
    Circle,
    Lightbulb,
    Trophy,
    Play,
    RotateCcw,
    Zap,
    Star,
    PartyPopper
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { celebrateSuccess, bloomEffect } from "@/lib/confetti";

interface LessonContent {
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

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

function LearnContent() {
    const searchParams = useSearchParams();
    const skillParam = searchParams.get("skill");

    const [skill, setSkill] = useState(skillParam || "");
    const [lesson, setLesson] = useState<LessonContent | null>(null);
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [stage, setStage] = useState<"select" | "lesson" | "quiz" | "complete">("select");
    const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [exerciseAnswer, setExerciseAnswer] = useState("");

    useEffect(() => {
        // Load preference if no skill param
        if (!skillParam) {
            const stored = localStorage.getItem("skillbloom_preferences");
            if (stored) {
                const prefs = JSON.parse(stored);
                setSkill(prefs.skill || prefs.customSkill || "");
            }
        }
    }, [skillParam]);

    const generateLesson = async () => {
        if (!skill.trim()) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/generate-lesson", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skill, level: "beginner" }),
            });

            if (!response.ok) throw new Error("Failed to generate lesson");

            const data = await response.json();
            setLesson(data.lesson);
            setStage("lesson");
        } catch (err) {
            setError("Failed to generate lesson. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateQuizFromLesson = async () => {
        if (!lesson) return;

        setLoading(true);

        try {
            const lessonContent = `${lesson.title}. ${lesson.introduction}. Concepts: ${lesson.concepts.map(c => c.name + ": " + c.explanation).join(". ")}`;

            const response = await fetch("/api/generate-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skill, lessonContent, numQuestions: 3 }),
            });

            if (!response.ok) throw new Error("Failed to generate quiz");

            const data = await response.json();
            setQuiz(data.quiz);
            setStage("quiz");
        } catch (err) {
            console.error(err);
            // Fallback quiz
            setQuiz([
                {
                    question: `What was the main topic of today's lesson about ${skill}?`,
                    options: [lesson?.title || skill, "Something else", "I don't remember", "None of above"],
                    correctIndex: 0,
                    explanation: "Great job paying attention to the lesson!",
                },
            ]);
            setStage("quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleQuizAnswer = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        setShowExplanation(true);

        if (index === quiz[currentQuizIndex].correctIndex) {
            setCorrectAnswers(correctAnswers + 1);
        }
    };

    const nextQuizQuestion = () => {
        if (currentQuizIndex < quiz.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            completeLesson();
        }
    };

    const completeLesson = () => {
        // Update skill progress in localStorage
        const storedSkills = localStorage.getItem("skillbloom_skills");
        if (storedSkills) {
            const skills = JSON.parse(storedSkills);
            const updatedSkills = skills.map((s: { name: string; progress: number; lessonsCompleted: number; streak: number; level: string }) => {
                if (s.name.toLowerCase() === skill.toLowerCase()) {
                    const newProgress = Math.min(100, s.progress + 10);
                    return {
                        ...s,
                        progress: newProgress,
                        lessonsCompleted: s.lessonsCompleted + 1,
                        streak: s.streak + 1,
                        level: getLevel(newProgress),
                    };
                }
                return s;
            });
            localStorage.setItem("skillbloom_skills", JSON.stringify(updatedSkills));
        }

        setStage("complete");

        // Trigger celebration!
        setTimeout(() => {
            celebrateSuccess();
        }, 300);
        setTimeout(() => {
            bloomEffect();
        }, 1000);
    };

    const getLevel = (progress: number) => {
        if (progress < 20) return "seed";
        if (progress < 40) return "sprout";
        if (progress < 60) return "growing";
        if (progress < 80) return "blooming";
        return "flourishing";
    };

    const resetLesson = () => {
        setStage("select");
        setLesson(null);
        setQuiz([]);
        setCurrentConceptIndex(0);
        setCurrentQuizIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setCorrectAnswers(0);
        setExerciseAnswer("");
    };

    return (
        <main className="min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/garden" className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Garden
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold">SkillBloom</span>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {/* Stage: Select Skill */}
                    {stage === "select" && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-8"
                        >
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                                >
                                    <BookOpen className="w-10 h-10 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-bold mb-2">Ready to Learn?</h1>
                                <p className="text-foreground-secondary">
                                    Our AI will create a personalized micro-lesson just for you
                                </p>
                            </div>

                            <div className="space-y-4 max-w-md mx-auto">
                                <div>
                                    <label className="block text-sm font-medium mb-2">What would you like to learn?</label>
                                    <input
                                        type="text"
                                        value={skill}
                                        onChange={(e) => {
                                            const newSkill = e.target.value;
                                            setSkill(newSkill);

                                            // Update localStorage to keep garden page in sync
                                            const stored = localStorage.getItem("skillbloom_preferences");
                                            if (stored) {
                                                const prefs = JSON.parse(stored);
                                                prefs.skill = newSkill;
                                                prefs.customSkill = ""; // Clear custom if manually editing
                                                localStorage.setItem("skillbloom_preferences", JSON.stringify(prefs));
                                            }

                                            // Also update the skills array if it exists
                                            const storedSkills = localStorage.getItem("skillbloom_skills");
                                            if (storedSkills) {
                                                const skillsArray = JSON.parse(storedSkills);
                                                if (skillsArray.length > 0) {
                                                    skillsArray[0].name = newSkill; // Update the first skill
                                                    localStorage.setItem("skillbloom_skills", JSON.stringify(skillsArray));
                                                }
                                            }
                                        }}
                                        placeholder="e.g., Python, Public Speaking, Photography..."
                                        className="w-full p-4 rounded-xl bg-surface border border-border focus:border-green-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm">{error}</p>
                                )}

                                <button
                                    onClick={generateLesson}
                                    disabled={!skill.trim() || loading}
                                    className={`w-full btn-primary flex items-center justify-center gap-2 ${!skill.trim() || loading ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="w-5 h-5" />
                                            </motion.div>
                                            Generating your lesson...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            <span>Generate Lesson</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Stage: Lesson */}
                    {stage === "lesson" && lesson && (
                        <motion.div
                            key="lesson"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-foreground-secondary">Lesson Progress</span>
                                    <span className="font-medium">{currentConceptIndex + 1}/{lesson.concepts.length + 2}</span>
                                </div>
                                <div className="progress-bar">
                                    <motion.div
                                        className="progress-fill"
                                        animate={{ width: `${((currentConceptIndex + 1) / (lesson.concepts.length + 2)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="glass-card p-8">
                                {/* Introduction */}
                                {currentConceptIndex === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="flex items-center gap-2 text-green-400 mb-4">
                                            <Sparkles className="w-5 h-5" />
                                            <span className="text-sm font-medium">Today&apos;s Lesson</span>
                                        </div>
                                        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
                                        <p className="text-lg text-foreground-secondary leading-relaxed">
                                            {lesson.introduction}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Concepts */}
                                {currentConceptIndex > 0 && currentConceptIndex <= lesson.concepts.length && (
                                    <motion.div
                                        key={currentConceptIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center gap-2 text-purple-400 mb-4">
                                            <Lightbulb className="w-5 h-5" />
                                            <span className="text-sm font-medium">Concept {currentConceptIndex}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4">
                                            {lesson.concepts[currentConceptIndex - 1].name}
                                        </h2>
                                        <p className="text-lg text-foreground-secondary leading-relaxed mb-6">
                                            {lesson.concepts[currentConceptIndex - 1].explanation}
                                        </p>
                                        {lesson.concepts[currentConceptIndex - 1].example && (
                                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                                <div className="flex items-center gap-2 text-green-400 mb-2">
                                                    <Zap className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Example</span>
                                                </div>
                                                <p className="text-foreground-secondary">
                                                    {lesson.concepts[currentConceptIndex - 1].example}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Exercise */}
                                {currentConceptIndex === lesson.concepts.length + 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center gap-2 text-amber-400 mb-4">
                                            <Star className="w-5 h-5" />
                                            <span className="text-sm font-medium">Practice Exercise</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4">{lesson.exercise.question}</h2>
                                        <textarea
                                            value={exerciseAnswer}
                                            onChange={(e) => setExerciseAnswer(e.target.value)}
                                            placeholder="Type your answer here..."
                                            rows={4}
                                            className="w-full p-4 rounded-xl bg-surface border border-border focus:border-green-500 focus:outline-none transition-colors resize-none mb-4"
                                        />
                                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <div className="flex items-center gap-2 text-amber-400 mb-2">
                                                <Lightbulb className="w-4 h-4" />
                                                <span className="text-sm font-medium">Hint</span>
                                            </div>
                                            <p className="text-foreground-secondary">{lesson.exercise.hint}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between mt-8">
                                    {currentConceptIndex > 0 ? (
                                        <button
                                            onClick={() => setCurrentConceptIndex(currentConceptIndex - 1)}
                                            className="btn-secondary flex items-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Previous
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    {currentConceptIndex < lesson.concepts.length + 1 ? (
                                        <button
                                            onClick={() => setCurrentConceptIndex(currentConceptIndex + 1)}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <span>Next</span> <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={generateQuizFromLesson}
                                            disabled={loading}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                                        <Sparkles className="w-4 h-4" />
                                                    </motion.div>
                                                    Loading Quiz...
                                                </>
                                            ) : (
                                                <>
                                                    <span>Take Quiz</span> <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stage: Quiz */}
                    {stage === "quiz" && quiz.length > 0 && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-foreground-secondary">Quiz Progress</span>
                                    <span className="font-medium">{currentQuizIndex + 1}/{quiz.length}</span>
                                </div>
                                <div className="progress-bar">
                                    <motion.div
                                        className="progress-fill"
                                        animate={{ width: `${((currentQuizIndex + 1) / quiz.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="glass-card p-8">
                                <motion.div
                                    key={currentQuizIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <h2 className="text-2xl font-bold mb-6">
                                        {quiz[currentQuizIndex].question}
                                    </h2>

                                    <div className="space-y-3">
                                        {quiz[currentQuizIndex].options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuizAnswer(index)}
                                                disabled={selectedAnswer !== null}
                                                className={`w-full p-4 rounded-xl border text-left transition-all ${selectedAnswer === null
                                                    ? "bg-surface border-border hover:border-green-500/50"
                                                    : index === quiz[currentQuizIndex].correctIndex
                                                        ? "bg-green-500/20 border-green-500"
                                                        : selectedAnswer === index
                                                            ? "bg-red-500/20 border-red-500"
                                                            : "bg-surface border-border opacity-50"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === null
                                                        ? "border-foreground-muted"
                                                        : index === quiz[currentQuizIndex].correctIndex
                                                            ? "bg-green-500 border-green-500"
                                                            : selectedAnswer === index
                                                                ? "bg-red-500 border-red-500"
                                                                : "border-foreground-muted"
                                                        }`}>
                                                        {selectedAnswer !== null && index === quiz[currentQuizIndex].correctIndex && (
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                    <span>{option}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {showExplanation && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                                        >
                                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                                <Lightbulb className="w-4 h-4" />
                                                <span className="text-sm font-medium">Explanation</span>
                                            </div>
                                            <p className="text-foreground-secondary">
                                                {quiz[currentQuizIndex].explanation}
                                            </p>
                                        </motion.div>
                                    )}

                                    {showExplanation && (
                                        <button
                                            onClick={nextQuizQuestion}
                                            className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
                                        >
                                            {currentQuizIndex < quiz.length - 1 ? (
                                                <>Next Question <ArrowRight className="w-4 h-4" /></>
                                            ) : (
                                                <>Complete Lesson <Trophy className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stage: Complete */}
                    {stage === "complete" && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-12 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative"
                            >
                                <Trophy className="w-12 h-12 text-white" />
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4 border-green-400"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl font-bold mb-2"
                            >
                                Lesson Complete! <PartyPopper className="inline w-8 h-8" />
                            </motion.h1>
                            <p className="text-foreground-secondary mb-8">
                                You&apos;ve earned XP and your {skill} plant is growing!
                            </p>

                            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                                <div className="p-4 rounded-xl bg-surface">
                                    <div className="text-2xl font-bold text-green-400">+50</div>
                                    <div className="text-sm text-foreground-muted">XP Earned</div>
                                </div>
                                <div className="p-4 rounded-xl bg-surface">
                                    <div className="text-2xl font-bold text-purple-400">{correctAnswers}/{quiz.length}</div>
                                    <div className="text-sm text-foreground-muted">Quiz Score</div>
                                </div>
                                <div className="p-4 rounded-xl bg-surface">
                                    <div className="text-2xl font-bold text-amber-400">+10%</div>
                                    <div className="text-sm text-foreground-muted">Growth</div>
                                </div>
                            </div>

                            {lesson && (
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-8 text-left max-w-md mx-auto">
                                    <div className="flex items-center gap-2 text-green-400 mb-2">
                                        <Star className="w-4 h-4" />
                                        <span className="text-sm font-medium">Key Takeaway</span>
                                    </div>
                                    <p className="text-foreground-secondary">{lesson.summary}</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={resetLesson} className="btn-secondary flex items-center justify-center gap-2">
                                    <RotateCcw className="w-4 h-4" /> Learn More
                                </button>
                                <Link href="/garden" className="btn-primary flex items-center justify-center gap-2">
                                    <Leaf className="w-4 h-4" /> Back to Garden
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}

export default function LearnPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Leaf className="w-12 h-12 text-green-500" />
                </motion.div>
            </div>
        }>
            <LearnContent />
        </Suspense>
    );
}
