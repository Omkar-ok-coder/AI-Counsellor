"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBubbleBackground() {
    const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate random bubbles on client side to avoid hydration mismatch
        const generatedBubbles = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: Math.random() * 100, // percentage
            size: Math.random() * 100 + 50, // 50px to 150px
            duration: Math.random() * 20 + 10, // 10s to 30s
            delay: Math.random() * 5,
        }));
        setBubbles(generatedBubbles);
    }, []);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0a0a0b]">
            {/* Subtle Gradient Overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)"
                }}
            />

            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    className="absolute rounded-full bg-amber-500/5 mix-blend-screen"
                    style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        width: bubble.size,
                        height: bubble.size,
                        filter: "blur(8px)",
                    }}
                    animate={{
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: bubble.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: bubble.delay,
                    }}
                />
            ))}

            {/* Primary Glowing Orbs (Fixed positions for composition) */}
            <motion.div
                className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[100px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-amber-600/10 blur-[100px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
        </div>
    );
}
