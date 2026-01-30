import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AnimatedGridBackground } from "@/components/animated-grid-background"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedGridBackground />
      <Header />
      <HeroSection />
    </div>
  )
}
