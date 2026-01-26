"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from "@/lib/onboarding-context";
import { EXAM_STATUSES, SOP_STATUSES } from "@/lib/types";
import { ClipboardCheck, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { profileAPI } from "@/lib/api";

export function ExamsStep() {
  const { formData, updateFormData, prevStep } = useOnboarding();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map formData to backend profile structure
      const profileData = {
        educationLevel: formData.educationLevel,
        major: formData.degree,
        gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
        targetDegree: formData.intendedDegree,
        preferredCountries: formData.preferredCountries || [],
        budgetRange: formData.budgetRange,
      };

      await profileAPI.updateProfile(profileData);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message || 'Failed to save profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <ClipboardCheck className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-2xl font-bold">Exams & Readiness</CardTitle>
        <CardDescription>
          Where are you in your preparation journey?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ieltsStatus">IELTS / TOEFL Status</Label>
            <Select
              value={formData.ieltsStatus || ""}
              onValueChange={(value) => updateFormData({ ieltsStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greStatus">GRE / GMAT Status</Label>
            <Select
              value={formData.greStatus || ""}
              onValueChange={(value) => updateFormData({ greStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sopStatus">Statement of Purpose (SOP) Status</Label>
            <Select
              value={formData.sopStatus || ""}
              onValueChange={(value) => updateFormData({ sopStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                {SOP_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary preview */}
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Almost there!</span>
            </div>
            <p className="text-xs text-muted-foreground">
              After completing this step, your AI Counsellor will be unlocked and ready to help you with personalized university recommendations.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting up your profile..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
