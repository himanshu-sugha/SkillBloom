"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Leaf,
    Plus,
    Play,
    Sparkles,
    Flame,
    Trophy,
    BookOpen,
    ArrowRight,
    Clock,
    Star,
    TrendingUp,
    Sun,
    Cloud,
    Droplets,
    Maximize2
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import for 3D garden to avoid SSR issues
const Garden3D = dynamic(() => import("@/components/Garden3D"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] rounded-2xl bg-surface flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                <Leaf className="w-12 h-12 text-green-500" />
            </motion.div>
        </div>
    ),
});

interface Skill {
    id: string;
    name: string;
    progress: number;
    level: "seed" | "sprout" | "growing" | "blooming" | "flourishing";
    lessonsCompleted: number;
    streak: number;
    lastPracticed?: string;
}

const levelConfig = {
    seed: { color: "from-amber-600 to-yellow-500", emoji: "🌱", label: "Seed" },
    sprout: { color: "from-lime-500 to-green-500", emoji: "🌿", label: "Sprout" },
    growing: { color: "from-green-500 to-emerald-500", emoji: "🪴", label: "Growing" },
    blooming: { color: "from-emerald-500 to-teal-500", emoji: "🌸", label: "Blooming" },
    flourishing: { color: "from-pink-500 to-purple-500", emoji: "🌺", label: "Flourishing" },
};

const getLevel = (progress: number): Skill["level"] => {
    if (progress < 20) return "seed";
    if (progress < 40) return "sprout";
    if (progress < 60) return "growing";
    if (progress < 80) return "blooming";
    return "flourishing";
};

export default function GardenPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [preferences, setPreferences] = useState<{ skill?: string; goal?: string; timePerDay?: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy">("sunny");
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [newSkillName, setNewSkillName] = useState("");
    const [dailyGoals, setDailyGoals] = useState<{ id: string; title: string; done: boolean; xp: number; action: string }[]>([]);

    useEffect(() => {
        // Load from localStorage
        const stored = localStorage.getItem("skillbloom_preferences");
        const storedSkills = localStorage.getItem("skillbloom_skills");

        if (stored) {
            const prefs = JSON.parse(stored);
            setPreferences(prefs);

            if (storedSkills) {
                setSkills(JSON.parse(storedSkills));
            } else if (prefs.skill || prefs.customSkill) {
                // Create initial skill
                const initialSkill: Skill = {
                    id: "1",
                    name: prefs.skill || prefs.customSkill,
                    progress: 0,
                    level: "seed",
                    lessonsCompleted: 0,
                    streak: 0,
                };
                setSkills([initialSkill]);
                localStorage.setItem("skillbloom_skills", JSON.stringify([initialSkill]));
            }
        }
        setLoading(false);

        // Randomize weather based on streak
        const weatherOptions: ("sunny" | "cloudy" | "rainy")[] = ["sunny", "cloudy", "sunny"];
        setWeather(weatherOptions[Math.floor(Math.random() * weatherOptions.length)]);

        // Load daily goals from localStorage or create new ones
        const today = new Date().toDateString();
        const storedGoals = localStorage.getItem("skillbloom_daily_goals");
        const storedGoalsDate = localStorage.getItem("skillbloom_daily_goals_date");

        if (storedGoals && storedGoalsDate === today) {
            setDailyGoals(JSON.parse(storedGoals));
        }
        // Goals will be set after skills are loaded
    }, []);

    const getStreak = () => {
        return skills.reduce((max, s) => Math.max(max, s.streak), 0);
    };

    const getTotalProgress = () => {
        if (skills.length === 0) return 0;
        return Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length);
    };

    const addNewSkill = () => {
        if (!newSkillName.trim()) return;

        const newSkill: Skill = {
            id: Date.now().toString(),
            name: newSkillName.trim(),
            progress: 0,
            level: "seed",
            lessonsCompleted: 0,
            streak: 0,
        };

        const updatedSkills = [...skills, newSkill];
        setSkills(updatedSkills);
        localStorage.setItem("skillbloom_skills", JSON.stringify(updatedSkills));
        setNewSkillName("");
        setShowAddSkill(false);
    };

    // Initialize daily goals when skills change
    useEffect(() => {
        const today = new Date().toDateString();
        const storedGoalsDate = localStorage.getItem("skillbloom_daily_goals_date");
        const storedGoals = localStorage.getItem("skillbloom_daily_goals");

        // Only create new goals if it's a new day or goals don't exist
        if (storedGoalsDate !== today || !storedGoals) {
            const skillName = skills[0]?.name || 'a skill';
            const newGoals = skills.length > 0 ? [
                { id: "lesson", title: `Complete a ${skillName} lesson`, done: false, xp: 50, action: `/learn?skill=${encodeURIComponent(skillName)}` },
                { id: "quiz", title: `Take a quiz on ${skillName}`, done: false, xp: 30, action: `/learn?skill=${encodeURIComponent(skillName)}` },
                { id: "streak", title: "Practice for your daily streak", done: false, xp: 20, action: "/learn" },
            ] : [
                { id: "first", title: "Start your first lesson", done: false, xp: 50, action: "/learn" },
                { id: "profile", title: "Add a skill to your garden", done: false, xp: 30, action: "#add-skill" },
                { id: "explore", title: "Explore available skills", done: false, xp: 20, action: "/onboarding" },
            ];

            setDailyGoals(newGoals);
            localStorage.setItem("skillbloom_daily_goals", JSON.stringify(newGoals));
            localStorage.setItem("skillbloom_daily_goals_date", today);
        }
    }, [skills]);

    const completeGoal = (goalId: string) => {
        const updatedGoals = dailyGoals.map(g =>
            g.id === goalId ? { ...g, done: true } : g
        );
        setDailyGoals(updatedGoals);
        localStorage.setItem("skillbloom_daily_goals", JSON.stringify(updatedGoals));
    };

    const handleGoalClick = (goal: { id: string; action: string; done: boolean }) => {
        if (goal.done) return;

        if (goal.action === "#add-skill") {
            setShowAddSkill(true);
        } else {
            window.location.href = goal.action;
        }
    };

    const WeatherIcon = weather === "sunny" ? Sun : weather === "cloudy" ? Cloud : Droplets;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Leaf className="w-12 h-12 text-green-500" />
                </motion.div>
            </div>
        );
    }

    if (!preferences) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="glass-card p-8 text-center max-w-md">
                    <Leaf className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h1 className="text-2xl font-bold mb-4">Your Garden Awaits</h1>
                    <p className="text-foreground-secondary mb-6">
                        Let&apos;s set up your learning garden first!
                    </p>
                    <Link href="/onboarding" className="btn-primary inline-block">
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Get Started
                        </span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold">SkillBloom</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {/* Weather */}
                        <div className="flex items-center gap-2 text-foreground-secondary">
                            <WeatherIcon className="w-5 h-5 text-amber-400" />
                            <span className="text-sm capitalize">{weather}</span>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium text-orange-400">{getStreak()} day streak</span>
                        </div>

                        {/* Learn Button */}
                        <Link href="/learn" className="btn-primary">
                            <span className="flex items-center gap-2">
                                <Play className="w-4 h-4" /> Start Learning
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome to your <span className="text-gradient">Garden</span> 🌿
                    </h1>
                    <p className="text-foreground-secondary text-lg">
                        Your skills are growing beautifully. Keep nurturing them!
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { icon: Leaf, label: "Skills Growing", value: skills.length, color: "text-green-400" },
                        { icon: BookOpen, label: "Lessons Done", value: skills.reduce((sum, s) => sum + s.lessonsCompleted, 0), color: "text-blue-400" },
                        { icon: Flame, label: "Day Streak", value: getStreak(), color: "text-orange-400" },
                        { icon: TrendingUp, label: "Avg Progress", value: `${getTotalProgress()}%`, color: "text-purple-400" },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-5"
                        >
                            <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-foreground-muted">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* 3D Garden Visualization */}
                {skills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-green-400" />
                                Your 3D Garden
                            </h2>
                            <div className="text-sm text-foreground-muted flex items-center gap-2">
                                <Maximize2 className="w-4 h-4" />
                                Drag to rotate • Scroll to zoom
                            </div>
                        </div>
                        <Garden3D skills={skills} />
                    </motion.div>
                )}

                {/* Garden Grid */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Your Skill Plants</h2>
                        <button
                            onClick={() => setShowAddSkill(true)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Skill
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {skills.map((skill, index) => {
                                const config = levelConfig[skill.level];
                                return (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="skill-card cursor-pointer"
                                    >
                                        {/* Plant Visualization */}
                                        <div className="relative h-40 mb-4 flex items-end justify-center">
                                            <motion.div
                                                animate={{ y: [-2, 2, -2] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="text-6xl"
                                            >
                                                {config.emoji}
                                            </motion.div>

                                            {/* Growth particles */}
                                            {skill.level !== "seed" && (
                                                <>
                                                    <motion.div
                                                        animate={{ y: [-20, -40], opacity: [1, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute bottom-20 left-1/4 text-green-400"
                                                    >
                                                        ✨
                                                    </motion.div>
                                                    <motion.div
                                                        animate={{ y: [-20, -40], opacity: [1, 0] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                                        className="absolute bottom-24 right-1/4 text-purple-400"
                                                    >
                                                        ✨
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>

                                        {/* Skill Info */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-xl font-bold mb-1">{skill.name}</h3>
                                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gradient-to-r ${config.color} text-white`}>
                                                {config.label}
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-foreground-muted">Progress</span>
                                                <span className="font-medium">{skill.progress}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <motion.div
                                                    className="progress-fill"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between text-sm text-foreground-muted">
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                {skill.lessonsCompleted} lessons
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Flame className="w-4 h-4 text-orange-400" />
                                                {skill.streak} day streak
                                            </div>
                                        </div>

                                        {/* Practice Button */}
                                        <Link
                                            href={`/learn?skill=${encodeURIComponent(skill.name)}`}
                                            className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4" /> Practice Now
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Add New Skill Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setShowAddSkill(true)}
                            className="skill-card border-dashed border-2 border-border flex flex-col items-center justify-center min-h-[350px] cursor-pointer hover:border-green-500/50 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-foreground-muted" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Plant a New Skill</h3>
                            <p className="text-sm text-foreground-muted text-center">
                                Add another skill to your garden
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Daily Goals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Today&apos;s Goals</h2>
                            <p className="text-foreground-secondary">Complete these to keep your streak!</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-foreground-muted" />
                            <span className="text-foreground-secondary">{preferences.timePerDay} min daily goal</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {dailyGoals.map((goal) => (
                            <div
                                key={goal.id}
                                onClick={() => handleGoalClick(goal)}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${goal.done
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-surface hover:bg-surface/80 border border-transparent hover:border-green-500/30"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!goal.done) completeGoal(goal.id);
                                        }}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${goal.done
                                            ? "bg-green-500 border-green-500"
                                            : "border-foreground-muted hover:border-green-500"
                                            }`}
                                    >
                                        {goal.done && <Star className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={goal.done ? "line-through text-foreground-muted" : ""}>
                                        {goal.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-amber-400">
                                        <Trophy className="w-4 h-4" />
                                        <span className="font-medium">{goal.xp} XP</span>
                                    </div>
                                    {!goal.done && (
                                        <ArrowRight className="w-4 h-4 text-foreground-muted" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/learn"
                        className="mt-6 w-full btn-primary flex items-center justify-center gap-2"
                    >
                        <Play className="w-5 h-5" /> Start Today&apos;s Session
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>

            {/* Add Skill Modal */}
            <AnimatePresence>
                {showAddSkill && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddSkill(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="glass-card p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                        <Leaf className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Plant a New Skill</h2>
                                    <p className="text-foreground-secondary">
                                        What new skill do you want to grow?
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={newSkillName}
                                        onChange={(e) => setNewSkillName(e.target.value)}
                                        placeholder="e.g., Python, Photography, Spanish..."
                                        className="w-full p-4 rounded-xl bg-surface border border-border focus:border-green-500 focus:outline-none transition-colors"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && addNewSkill()}
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowAddSkill(false)}
                                            className="flex-1 btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={addNewSkill}
                                            disabled={!newSkillName.trim()}
                                            className={`flex-1 btn-primary flex items-center justify-center gap-2 ${!newSkillName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Plant Skill
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}
