"use client";

import { motion } from "framer-motion";
import { Leaf, Sparkles } from "lucide-react";

interface LoadingScreenProps {
    message?: string;
    tip?: string;
}

export default function LoadingScreen({
    message = "Growing your lesson...",
    tip = "Did you know? Learning in short bursts improves retention by 80%!"
}: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-green-500/20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-6">
                {/* Animated logo */}
                <div className="relative mb-8">
                    <motion.div
                        className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Leaf className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Sparkles around */}
                    {[0, 1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                top: "50%",
                                left: "50%",
                            }}
                            animate={{
                                x: [0, Math.cos((i / 4) * Math.PI * 2) * 60],
                                y: [0, Math.sin((i / 4) * Math.PI * 2) * 60],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        >
                            <Sparkles className="w-5 h-5 text-green-400" />
                        </motion.div>
                    ))}
                </div>

                {/* Loading text */}
                <motion.h2
                    className="text-2xl font-bold mb-2"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {message}
                </motion.h2>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full bg-green-500"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>

                {/* Tip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-4 max-w-md mx-auto"
                >
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Did you know?</span>
                    </div>
                    <p className="text-sm text-foreground-secondary">{tip}</p>
                </motion.div>
            </div>
        </div>
    );
}
