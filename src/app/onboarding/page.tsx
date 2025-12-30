"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Leaf,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Clock,
    Target,
    BookOpen,
    Zap,
    Star
} from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
    {
        id: "welcome",
        title: "Welcome to SkillBloom",
        subtitle: "Let's plant your first learning seed 🌱",
    },
    {
        id: "skill",
        title: "What would you like to learn?",
        subtitle: "Choose a skill to grow in your garden",
    },
    {
        id: "goal",
        title: "What's your goal?",
        subtitle: "Understanding your 'why' helps us personalize your journey",
    },
    {
        id: "time",
        title: "How much time can you invest daily?",
        subtitle: "Even 5 minutes a day can lead to amazing growth",
    },
    {
        id: "ready",
        title: "Your garden is ready!",
        subtitle: "Let's start growing your skills",
    },
];

const skillCategories = [
    { emoji: "💻", name: "Programming", skills: ["Python", "JavaScript", "React", "Node.js"] },
    { emoji: "🎨", name: "Design", skills: ["UI/UX", "Figma", "Typography", "Color Theory"] },
    { emoji: "📊", name: "Data", skills: ["SQL", "Data Analysis", "Machine Learning", "Statistics"] },
    { emoji: "✍️", name: "Writing", skills: ["Content Writing", "Copywriting", "Technical Writing", "Storytelling"] },
    { emoji: "🗣️", name: "Communication", skills: ["Public Speaking", "Negotiation", "Leadership", "Presentation"] },
    { emoji: "🌐", name: "Languages", skills: ["Spanish", "French", "Japanese", "German"] },
];

const timeOptions = [
    { value: 5, label: "5 min", icon: Zap, description: "Quick daily sprints" },
    { value: 15, label: "15 min", icon: Clock, description: "Focused sessions" },
    { value: 30, label: "30 min", icon: BookOpen, description: "Deep learning" },
    { value: 60, label: "60+ min", icon: Star, description: "Intensive growth" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        skill: "",
        customSkill: "",
        goal: "",
        timePerDay: 15,
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        // Extract skill from goal text if user mentioned a specific skill
        const goalLower = formData.goal.toLowerCase();
        const allSkills = skillCategories.flatMap(cat => cat.skills);

        // Common skill aliases
        const skillAliases: { [key: string]: string } = {
            "js": "JavaScript",
            "javascript": "JavaScript",
            "python": "Python",
            "react": "React",
            "node": "Node.js",
            "nodejs": "Node.js",
            "sql": "SQL",
            "typescript": "TypeScript",
            "ts": "TypeScript",
            "figma": "Figma",
            "ui": "UI/UX",
            "ux": "UI/UX",
            "ml": "Machine Learning",
            "ai": "Machine Learning",
            "spanish": "Spanish",
            "french": "French",
            "german": "German",
            "japanese": "Japanese",
            "public speaking": "Public Speaking",
            "presentation": "Presentation",
            "leadership": "Leadership",
        };

        let detectedSkill = formData.skill || formData.customSkill;

        // Check for skill mentions in goal
        for (const [alias, skillName] of Object.entries(skillAliases)) {
            if (goalLower.includes(alias)) {
                detectedSkill = skillName;
                break;
            }
        }

        // Also check direct skill name mentions
        for (const skillName of allSkills) {
            if (goalLower.includes(skillName.toLowerCase())) {
                detectedSkill = skillName;
                break;
            }
        }

        // Update formData with detected skill
        const finalFormData = {
            ...formData,
            skill: detectedSkill,
            customSkill: formData.customSkill || (detectedSkill !== formData.skill ? detectedSkill : "")
        };

        // Store preferences in localStorage
        localStorage.setItem("skillbloom_preferences", JSON.stringify(finalFormData));
        router.push("/garden");
    };

    const canProceed = () => {
        switch (steps[currentStep].id) {
            case "skill":
                return formData.skill || formData.customSkill;
            case "goal":
                return formData.goal.length > 10;
            case "time":
                return formData.timePerDay > 0;
            default:
                return true;
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${index <= currentStep
                                    ? "bg-green-500 text-white"
                                    : "bg-surface text-foreground-muted"
                                    }`}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card p-8"
                    >
                        {/* Step Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                            >
                                <Leaf className="w-8 h-8 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h1>
                            <p className="text-foreground-secondary">{steps[currentStep].subtitle}</p>
                        </div>

                        {/* Step-specific Content */}
                        {steps[currentStep].id === "welcome" && (
                            <div className="text-center space-y-6">
                                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                    {[
                                        { icon: Target, label: "Personalized" },
                                        { icon: Zap, label: "Micro-lessons" },
                                        { icon: Sparkles, label: "AI-Powered" },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 rounded-xl bg-surface"
                                        >
                                            <item.icon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                                            <p className="text-sm text-foreground-secondary">{item.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {steps[currentStep].id === "skill" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {skillCategories.map((category, index) => (
                                        <motion.button
                                            key={category.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setFormData({ ...formData, skill: category.skills[0] })}
                                            className={`p-4 rounded-xl border transition-all text-left ${category.skills.includes(formData.skill)
                                                ? "bg-green-500/20 border-green-500"
                                                : "bg-surface border-border hover:border-green-500/50"
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">{category.emoji}</div>
                                            <div className="font-medium">{category.name}</div>
                                            <div className="text-xs text-foreground-muted mt-1">
                                                {category.skills.slice(0, 2).join(", ")}...
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Or type your own skill..."
                                        value={formData.customSkill}
                                        onChange={(e) => setFormData({ ...formData, customSkill: e.target.value, skill: "" })}
                                        className="w-full p-4 rounded-xl bg-surface border border-border focus:border-green-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {steps[currentStep].id === "goal" && (
                            <div className="space-y-4">
                                <textarea
                                    placeholder="e.g., I want to build my own web applications, switch to a tech career, or automate my daily tasks..."
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    rows={4}
                                    className="w-full p-4 rounded-xl bg-surface border border-border focus:border-green-500 focus:outline-none transition-colors resize-none"
                                />
                                <p className="text-sm text-foreground-muted">
                                    💡 Be specific! The more we understand your goal, the better we can personalize your journey.
                                </p>
                            </div>
                        )}

                        {steps[currentStep].id === "time" && (
                            <div className="grid grid-cols-2 gap-4">
                                {timeOptions.map((option, index) => (
                                    <motion.button
                                        key={option.value}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setFormData({ ...formData, timePerDay: option.value })}
                                        className={`p-6 rounded-xl border transition-all ${formData.timePerDay === option.value
                                            ? "bg-green-500/20 border-green-500"
                                            : "bg-surface border-border hover:border-green-500/50"
                                            }`}
                                    >
                                        <option.icon className={`w-8 h-8 mb-3 ${formData.timePerDay === option.value ? "text-green-400" : "text-foreground-muted"
                                            }`} />
                                        <div className="text-2xl font-bold mb-1">{option.label}</div>
                                        <div className="text-sm text-foreground-muted">{option.description}</div>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {steps[currentStep].id === "ready" && (
                            <div className="text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                                >
                                    <Sparkles className="w-16 h-16 text-white" />
                                </motion.div>
                                <div className="space-y-2">
                                    <p className="text-xl">
                                        You&apos;ll be learning <span className="text-green-400 font-bold">{formData.skill || formData.customSkill}</span>
                                    </p>
                                    <p className="text-foreground-secondary">
                                        {formData.timePerDay} minutes daily • Personalized for your goals
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {currentStep > 0 ? (
                                <button onClick={handleBack} className="btn-secondary flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            ) : (
                                <div />
                            )}

                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className={`btn-primary flex items-center gap-2 ${!canProceed() ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    <span>Next</span> <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button onClick={handleComplete} className="btn-primary flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> <span>Start Growing!</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
