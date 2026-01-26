"use client";

import React from "react"

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Animated background */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-teal-400/20 blur-3xl"
            />
            <motion.div
              animate={{
                y: [0, 40, 0],
                x: [0, -20, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-emerald-500/15 blur-3xl"
            />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
