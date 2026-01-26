"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from "@/lib/onboarding-context";
import { INTENDED_DEGREES, FIELDS_OF_STUDY, COUNTRIES, INTAKE_YEARS } from "@/lib/types";
import { Target, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StudyGoalStep() {
  const { formData, updateFormData, nextStep, prevStep } = useOnboarding();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const toggleCountry = (country: string) => {
    const currentCountries = formData.preferredCountries || [];
    if (currentCountries.includes(country)) {
      updateFormData({
        preferredCountries: currentCountries.filter((c) => c !== country),
      });
    } else if (currentCountries.length < 5) {
      updateFormData({
        preferredCountries: [...currentCountries, country],
      });
    }
  };

  return (
    <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Target className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-2xl font-bold">Study Goal</CardTitle>
        <CardDescription>
          What do you want to pursue and where?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intendedDegree">Intended Degree</Label>
              <Select
                value={formData.intendedDegree || ""}
                onValueChange={(value) => updateFormData({ intendedDegree: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {INTENDED_DEGREES.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetIntake">Target Intake</Label>
              <Select
                value={formData.targetIntake || ""}
                onValueChange={(value) => updateFormData({ targetIntake: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select intake" />
                </SelectTrigger>
                <SelectContent>
                  {INTAKE_YEARS.map((intake) => (
                    <SelectItem key={intake} value={intake}>
                      {intake}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldOfStudy">Field of Study</Label>
            <Select
              value={formData.fieldOfStudy || ""}
              onValueChange={(value) => updateFormData({ fieldOfStudy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your field" />
              </SelectTrigger>
              <SelectContent>
                {FIELDS_OF_STUDY.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Preferred Countries (Select up to 5)</Label>
            
            {/* Selected countries */}
            {formData.preferredCountries && formData.preferredCountries.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.preferredCountries.map((country) => (
                  <Badge
                    key={country}
                    variant="secondary"
                    className="bg-accent/10 text-accent hover:bg-accent/20 cursor-pointer"
                    onClick={() => toggleCountry(country)}
                  >
                    {country}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Country selection grid */}
            <div className="grid grid-cols-2 gap-2">
              {COUNTRIES.map((country) => {
                const isSelected = formData.preferredCountries?.includes(country);
                const isDisabled = !isSelected && (formData.preferredCountries?.length || 0) >= 5;
                
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => toggleCountry(country)}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      isSelected
                        ? "border-accent bg-accent/10 text-accent"
                        : isDisabled
                        ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed"
                        : "border-border hover:border-accent/50 hover:bg-accent/5"
                    }`}
                  >
                    {country}
                  </button>
                );
              })}
            </div>
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
