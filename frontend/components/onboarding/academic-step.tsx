"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from "@/lib/onboarding-context";
import { EDUCATION_LEVELS } from "@/lib/types";
import { GraduationCap } from "lucide-react";

export function AcademicStep() {
  const { formData, updateFormData, nextStep } = useOnboarding();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString());

  return (
    <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <GraduationCap className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-2xl font-bold">Academic Background</CardTitle>
        <CardDescription>
          Tell us about your educational journey so far
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="educationLevel">Current Education Level</Label>
            <Select
              value={formData.educationLevel || ""}
              onValueChange={(value) => updateFormData({ educationLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                {EDUCATION_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Degree / Major</Label>
            <Input
              id="degree"
              placeholder="e.g., Computer Science, Business Administration"
              value={formData.degree || ""}
              onChange={(e) => updateFormData({ degree: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Select
                value={formData.graduationYear || ""}
                onValueChange={(value) => updateFormData({ graduationYear: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {graduationYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA / Percentage (Optional)</Label>
              <Input
                id="gpa"
                placeholder="e.g., 3.5 or 85%"
                value={formData.gpa || ""}
                onChange={(e) => updateFormData({ gpa: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
