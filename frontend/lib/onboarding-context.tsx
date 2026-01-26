"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile } from "./types";

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: Partial<UserProfile>;
  updateFormData: (data: Partial<UserProfile>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const TOTAL_STEPS = 4;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    preferredCountries: [],
  });

  const updateFormData = (data: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        nextStep,
        prevStep,
        isLastStep: currentStep === TOTAL_STEPS,
        isFirstStep: currentStep === 1,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
