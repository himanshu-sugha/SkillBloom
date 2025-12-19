"use client";

import { motion } from "framer-motion";

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export function AnimatedCounter({ value, suffix = "", prefix = "", className = "" }: AnimatedCounterProps) {
    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={className}
        >
            {prefix}{value}{suffix}
        </motion.span>
    );
}

interface FloatingElementProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FloatingElement({ children, delay = 0, duration = 3, className = "" }: FloatingElementProps) {
    return (
        <motion.div
            animate={{
                y: [-5, 5, -5],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface PulseProps {
    children: React.ReactNode;
    className?: string;
}

export function Pulse({ children, className = "" }: PulseProps) {
    return (
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface GlowProps {
    children: React.ReactNode;
    color?: string;
    className?: string;
}

export function Glow({ children, color = "green", className = "" }: GlowProps) {
    const colors: Record<string, string> = {
        green: "0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)",
        purple: "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)",
        amber: "0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3)",
        pink: "0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)",
    };

    return (
        <motion.div
            animate={{
                boxShadow: [
                    colors[color] || colors.green,
                    colors[color]?.replace("0.5", "0.7").replace("0.3", "0.5") || colors.green,
                    colors[color] || colors.green,
                ],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface TypewriterProps {
    text: string;
    speed?: number;
    className?: string;
}

export function Typewriter({ text, speed = 50, className = "" }: TypewriterProps) {
    return (
        <motion.span className={className}>
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * (speed / 1000) }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
}

interface ShimmerProps {
    children: React.ReactNode;
    className?: string;
}

export function Shimmer({ children, className = "" }: ShimmerProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {children}
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["0%", "200%"] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                }}
            />
        </div>
    );
}

interface ProgressCircleProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function ProgressCircle({ progress, size = 60, strokeWidth = 4, className = "" }: ProgressCircleProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="rotate-[-90deg]">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-surface"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22C55E" />
                        <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {progress}%
            </div>
        </div>
    );
}
