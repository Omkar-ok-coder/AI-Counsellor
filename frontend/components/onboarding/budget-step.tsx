"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOnboarding } from "@/lib/onboarding-context";
import { BUDGET_RANGES, FUNDING_PLANS } from "@/lib/types";
import { Wallet } from "lucide-react";

export function BudgetStep() {
  const { formData, updateFormData, nextStep, prevStep } = useOnboarding();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Wallet className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-2xl font-bold">Budget Planning</CardTitle>
        <CardDescription>
          Help us understand your financial situation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Annual Budget Range</Label>
            <RadioGroup
              value={formData.budgetRange || ""}
              onValueChange={(value) => updateFormData({ budgetRange: value })}
              className="space-y-2"
            >
              {BUDGET_RANGES.map((range) => (
                <label
                  key={range}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.budgetRange === range
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  <RadioGroupItem value={range} id={range} />
                  <span className="text-sm font-medium">{range}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Funding Plan</Label>
            <RadioGroup
              value={formData.fundingPlan || ""}
              onValueChange={(value) => updateFormData({ fundingPlan: value })}
              className="space-y-2"
            >
              {FUNDING_PLANS.map((plan) => (
                <label
                  key={plan}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.fundingPlan === plan
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  <RadioGroupItem value={plan} id={plan} />
                  <span className="text-sm font-medium">{plan}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1 bg-transparent"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
