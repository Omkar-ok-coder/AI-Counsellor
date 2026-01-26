"use client";

import React from "react"

import { Logo } from "@/components/logo";
import { OnboardingProvider } from "@/lib/onboarding-context";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="p-6 border-b border-border/50">
          <Link href="/">
            <Logo />
          </Link>
        </header>

        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 -left-20 h-[400px] w-[400px] rounded-full bg-teal-400/15 blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-1/4 -right-20 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-3xl"
          />
        </div>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          {children}
        </main>
      </div>
    </OnboardingProvider>
  );
}
