"use client";

import { motion } from "framer-motion";
import {
    Leaf,
    ArrowLeft,
    Heart,
    Sparkles,
    Brain,
    Trophy,
    Users,
    Zap,
    Github,
    Linkedin,
    Mail
} from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Brain,
        title: "AI-Powered Learning",
        description: "Mistral AI creates personalized lessons tailored to your goals and learning style.",
    },
    {
        icon: Sparkles,
        title: "Growth Garden",
        description: "Watch your skills bloom as beautiful 3D plants in your personal learning garden.",
    },
    {
        icon: Zap,
        title: "Micro-Learning",
        description: "5-minute daily sessions that fit your busy life and maximize retention.",
    },
    {
        icon: Trophy,
        title: "Gamification",
        description: "XP, streaks, and achievements keep you motivated on your learning journey.",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back Home
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold">SkillBloom</span>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                    >
                        <Leaf className="w-12 h-12 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        About <span className="text-gradient">SkillBloom</span>
                    </h1>
                    <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
                        An AI-powered micro-learning platform that grows with you.
                        Built for the CodeSpring Hackathon 2024.
                    </p>
                </motion.div>

                {/* Mission */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 mb-12"
                >
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-pink-500" />
                        Our Mission
                    </h2>
                    <p className="text-foreground-secondary leading-relaxed">
                        We believe learning should feel like nurturing a garden, not climbing a mountain.
                        SkillBloom transforms the overwhelming task of skill development into a delightful
                        daily ritual. Through AI-personalized micro-lessons and beautiful visualizations,
                        we make it easy to plant knowledge seeds and watch them bloom into expertise.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">What Makes Us Different</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="glass-card p-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-foreground-secondary">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-8 mb-12"
                >
                    <h2 className="text-2xl font-bold mb-6">Built With</h2>
                    <div className="flex flex-wrap gap-3">
                        {["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Mistral AI", "Lucide Icons"].map((tech) => (
                            <span key={tech} className="px-4 py-2 rounded-full bg-surface text-sm font-medium">
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Hackathon */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-8 text-center"
                >
                    <div className="text-5xl mb-4">🏆</div>
                    <h2 className="text-2xl font-bold mb-2">CodeSpring Hackathon 2024</h2>
                    <p className="text-foreground-secondary mb-6">
                        This project was built as part of the CodeSpring Hackathon,
                        celebrating innovation and the spirit of growth.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/garden" className="btn-primary">
                            Start Growing
                        </Link>
                        <Link href="/" className="btn-secondary">
                            Learn More
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
