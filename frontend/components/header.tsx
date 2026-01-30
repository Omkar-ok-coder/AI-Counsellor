import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-amber-500/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="[&_span]:text-white [&_.bg-primary]:bg-amber-500 [&_.text-primary-foreground]:text-black">
          <Logo />
        </div>
        <nav className="flex items-center gap-3">
          <Button
            variant="ghost"
            asChild
            className="text-zinc-400 hover:text-white hover:bg-amber-500/10"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-amber-500 text-black hover:bg-amber-400"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
