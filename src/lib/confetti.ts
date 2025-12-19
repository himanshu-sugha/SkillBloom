"use client";

import confetti from "canvas-confetti";

// Celebration confetti burst
export const celebrateSuccess = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ["#22C55E", "#10B981", "#059669"],
    });
    fire(0.2, {
        spread: 60,
        colors: ["#A855F7", "#9333EA", "#7C3AED"],
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ["#F59E0B", "#EAB308", "#FBBF24"],
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        colors: ["#22C55E", "#A855F7", "#F59E0B"],
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
        colors: ["#FF69B4", "#FF1493", "#DB2777"],
    });
};

// Bloom effect (petals falling)
export const bloomEffect = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ["#FF69B4", "#FFB6C1", "#22C55E", "#10B981"];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
            zIndex: 9999,
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
            zIndex: 9999,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
};

// Sparkle effect for achievements
export const sparkleEffect = () => {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ["#FFD700", "#FFA500", "#FFE66D"],
        zIndex: 9999,
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ["star"],
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ["circle"],
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
};

// Rain of stars
export const starRain = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval: number = window.setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ["#22C55E", "#A855F7", "#F59E0B", "#FF69B4"],
        });
    }, 250);
};
