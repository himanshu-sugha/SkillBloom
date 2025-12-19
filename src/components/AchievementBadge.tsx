"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Zap, Flame } from "lucide-react";

interface AchievementBadgeProps {
    type: "streak" | "lesson" | "quiz" | "milestone";
    value: number | string;
    label: string;
    size?: "sm" | "md" | "lg";
}

export default function AchievementBadge({ type, value, label, size = "md" }: AchievementBadgeProps) {
    const config = {
        streak: { icon: Flame, color: "from-orange-500 to-red-500", bg: "bg-orange-500/10" },
        lesson: { icon: Star, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" },
        quiz: { icon: Zap, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10" },
        milestone: { icon: Trophy, color: "from-green-500 to-emerald-500", bg: "bg-green-500/10" },
    };

    const sizeConfig = {
        sm: { wrapper: "p-2", icon: "w-4 h-4", text: "text-lg", label: "text-xs" },
        md: { wrapper: "p-4", icon: "w-6 h-6", text: "text-2xl", label: "text-sm" },
        lg: { wrapper: "p-6", icon: "w-8 h-8", text: "text-4xl", label: "text-base" },
    };

    const { icon: Icon, color, bg } = config[type];
    const sizes = sizeConfig[size];

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            className={`relative rounded-2xl ${bg} border border-white/10 ${sizes.wrapper}`}
        >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-20 blur-xl`} />

            <div className="relative text-center">
                <div className={`inline-flex items-center justify-center mb-2 p-2 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon className={`${sizes.icon} text-white`} />
                </div>
                <div className={`font-bold ${sizes.text} bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    {value}
                </div>
                <div className={`text-foreground-muted ${sizes.label}`}>{label}</div>
            </div>

            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
        </motion.div>
    );
}
