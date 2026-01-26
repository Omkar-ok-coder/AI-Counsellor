"use client";

import { useOnboarding } from "@/lib/onboarding-context";
import { ONBOARDING_STEPS } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { AcademicStep } from "@/components/onboarding/academic-step";
import { StudyGoalStep } from "@/components/onboarding/study-goal-step";
import { BudgetStep } from "@/components/onboarding/budget-step";
import { ExamsStep } from "@/components/onboarding/exams-step";
import { Progress } from "@/components/ui/progress";

export default function OnboardingPage() {
  const { currentStep } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AcademicStep />;
      case 2:
        return <StudyGoalStep />;
      case 3:
        return <BudgetStep />;
      case 4:
        return <ExamsStep />;
      default:
        return <AcademicStep />;
    }
  };

  const progressValue = (currentStep / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {ONBOARDING_STEPS.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {ONBOARDING_STEPS[currentStep - 1].title}
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {ONBOARDING_STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id <= currentStep ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep
                    ? "bg-accent text-accent-foreground"
                    : step.id === currentStep
                    ? "bg-accent/20 text-accent border-2 border-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
