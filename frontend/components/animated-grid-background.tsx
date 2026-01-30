"use client";

import { motion } from "framer-motion";

const GRID_CELL = 40;
const GOLD = "rgba(251, 191, 36, 0.35)";

export function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0a0a0b]">
      {/* Fine golden grid */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern
            id="gold-grid"
            width={GRID_CELL}
            height={GRID_CELL}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${GRID_CELL} 0 L 0 0 0 ${GRID_CELL}`}
              fill="none"
              stroke={GOLD}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gold-grid)" />
      </svg>

      {/* Shimmer sweep via CSS (backup / extra layer) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(251,191,36,0.15) 45%, rgba(251,191,36,0.25) 50%, rgba(251,191,36,0.15) 55%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer-sweep 12s ease-in-out infinite",
        }}
      />

      {/* Translucent geometric shapes */}
      <motion.div
        className="absolute left-[15%] top-[20%] h-48 w-48 border border-amber-500/40 bg-amber-500/10"
        style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 10, 0],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-[20%] top-[35%] h-64 w-64 border border-amber-400/30 bg-amber-400/10"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -8, 0],
          opacity: [0.55, 0.8, 0.55],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[25%] h-40 w-40 border border-amber-500/40 bg-amber-500/10"
        style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute right-[30%] bottom-[20%] h-56 w-56 border border-amber-400/30 bg-amber-400/10"
        style={{
          clipPath: "polygon(0% 20%, 40% 0%, 100% 40%, 80% 100%, 20% 80%)",
        }}
        animate={{
          scale: [1, 1.12, 1],
          rotate: [0, 12, 0],
          opacity: [0.55, 0.75, 0.55],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 border border-amber-500/20 bg-amber-500/10"
        style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
        animate={{
          scale: [1, 1.18, 1],
          rotate: [0, -15, 0],
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
}
