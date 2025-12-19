"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Star, Zap, Award, X } from "lucide-react";
import { useState, useEffect } from "react";

export type ToastType = "success" | "xp" | "achievement" | "streak";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    value?: number | string;
}

let addToastFn: ((toast: Omit<Toast, "id">) => void) | null = null;

export function showToast(toast: Omit<Toast, "id">) {
    if (addToastFn) {
        addToastFn(toast);
    }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        addToastFn = (toast) => {
            const id = Math.random().toString(36).slice(2);
            setToasts((prev) => [...prev, { ...toast, id }]);

            // Auto remove after 4 seconds
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 4000);
        };

        return () => {
            addToastFn = null;
        };
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const config = {
        success: { icon: CheckCircle2, color: "from-green-500 to-emerald-500", bg: "bg-green-500/20" },
        xp: { icon: Zap, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/20" },
        achievement: { icon: Award, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/20" },
        streak: { icon: Star, color: "from-orange-500 to-red-500", bg: "bg-orange-500/20" },
    };

    return (
        <>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((toast) => {
                        const { icon: Icon, color, bg } = config[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                                className={`relative overflow-hidden rounded-xl ${bg} border border-white/10 backdrop-blur-xl p-4 min-w-[280px] shadow-2xl`}
                            >
                                {/* Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10`} />

                                <div className="relative flex items-start gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{toast.title}</span>
                                            {toast.value && (
                                                <span className={`text-sm font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                                                    +{toast.value}
                                                </span>
                                            )}
                                        </div>
                                        {toast.message && (
                                            <p className="text-sm text-foreground-secondary mt-1">{toast.message}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => removeToast(toast.id)}
                                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-foreground-muted" />
                                    </button>
                                </div>

                                {/* Progress bar */}
                                <motion.div
                                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color}`}
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 4, ease: "linear" }}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </>
    );
}
