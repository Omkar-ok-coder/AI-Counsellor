"use client";

import React from "react"

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedBubbleBackground } from "@/components/animated-bubble-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBubbleBackground />

      {/* Header */}
      <header className="p-6 relative z-10">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
