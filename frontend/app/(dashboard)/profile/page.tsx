"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockUserProfile } from "@/lib/mock-data";
import {
  EDUCATION_LEVELS,
  INTENDED_DEGREES,
  FIELDS_OF_STUDY,
  COUNTRIES,
  BUDGET_RANGES,
  FUNDING_PLANS,
  EXAM_STATUSES,
  SOP_STATUSES,
  INTAKE_YEARS,
  UserProfile,
} from "@/lib/types";
import {
  User,
  GraduationCap,
  Target,
  Wallet,
  ClipboardCheck,
  Save,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { profileAPI } from "@/lib/api";
import { useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [originalProfile, setOriginalProfile] = useState<UserProfile>(mockUserProfile);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.getProfile();
        // Map backend profile to frontend format
        const mappedProfile: UserProfile = {
          fullName: data.name || '',
          email: data.email || '',
          educationLevel: data.profile?.educationLevel || '',
          degree: data.profile?.major || '',
          graduationYear: data.profile?.graduationYear?.toString() || '',
          gpa: data.profile?.gpa?.toString() || '',
          intendedDegree: data.profile?.targetDegree || '',
          fieldOfStudy: data.profile?.major || '',
          targetIntake: '',
          preferredCountries: data.profile?.preferredCountries || [],
          budgetRange: data.profile?.budgetRange || '',
          fundingPlan: '',
          ieltsStatus: '',
          greStatus: '',
          sopStatus: '',
          onboardingComplete: true,
          currentStage: 1,
        };
        setProfile(mappedProfile);
        setOriginalProfile(mappedProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const toggleCountry = (country: string) => {
    const currentCountries = profile.preferredCountries || [];
    if (currentCountries.includes(country)) {
      updateProfile({
        preferredCountries: currentCountries.filter((c) => c !== country),
      });
    } else if (currentCountries.length < 5) {
      updateProfile({
        preferredCountries: [...currentCountries, country],
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map frontend profile to backend format
      const profileData = {
        educationLevel: profile.educationLevel,
        major: profile.degree,
        gpa: profile.gpa ? parseFloat(profile.gpa) : undefined,
        graduationYear: profile.graduationYear ? parseInt(profile.graduationYear) : undefined,
        targetDegree: profile.intendedDegree,
        preferredCountries: profile.preferredCountries || [],
        budgetRange: profile.budgetRange,
      };

      await profileAPI.updateProfile(profileData);
      setOriginalProfile(profile);
      setHasChanges(false);
      setShowSaveDialog(false);
    } catch (error: any) {
      alert(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setHasChanges(false);
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
            <User className="h-7 w-7 text-accent" />
            Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile information and preferences
          </p>
        </div>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setShowSaveDialog(true)}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </motion.div>
        )}
      </div>

      {/* Change warning */}
      {hasChanges && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <p className="font-medium text-sm">Profile changes detected</p>
              <p className="text-xs text-muted-foreground">
                Saving changes will recalculate your university recommendations and update your acceptance chances
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="readiness" className="flex items-center gap-1">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Readiness</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => updateProfile({ fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Background */}
        <TabsContent value="academic">
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Academic Background
              </CardTitle>
              <CardDescription>Your educational history and qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level</Label>
                  <Select
                    value={profile.educationLevel}
                    onValueChange={(value) => updateProfile({ educationLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    value={profile.degree}
                    onChange={(e) => updateProfile({ degree: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select
                    value={profile.graduationYear}
                    onValueChange={(value) => updateProfile({ graduationYear: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="gpa">GPA / Percentage</Label>
                  <Input
                    id="gpa"
                    value={profile.gpa}
                    onChange={(e) => updateProfile({ gpa: e.target.value })}
                    placeholder="e.g., 3.7 or 85%"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Goals */}
        <TabsContent value="goals">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Study Goals
                </CardTitle>
                <CardDescription>What you want to pursue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="intendedDegree">Intended Degree</Label>
                    <Select
                      value={profile.intendedDegree}
                      onValueChange={(value) => updateProfile({ intendedDegree: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Select
                      value={profile.fieldOfStudy}
                      onValueChange={(value) => updateProfile({ fieldOfStudy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetIntake">Target Intake</Label>
                  <Select
                    value={profile.targetIntake}
                    onValueChange={(value) => updateProfile({ targetIntake: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
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

                <Separator />

                <div className="space-y-3">
                  <Label>Preferred Countries (Select up to 5)</Label>
                  {profile.preferredCountries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.preferredCountries.map((country) => (
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {COUNTRIES.map((country) => {
                      const isSelected = profile.preferredCountries.includes(country);
                      const isDisabled = !isSelected && profile.preferredCountries.length >= 5;

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
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  Budget
                </CardTitle>
                <CardDescription>Your financial planning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Annual Budget Range</Label>
                  <Select
                    value={profile.budgetRange}
                    onValueChange={(value) => updateProfile({ budgetRange: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingPlan">Funding Plan</Label>
                  <Select
                    value={profile.fundingPlan}
                    onValueChange={(value) => updateProfile({ fundingPlan: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNDING_PLANS.map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exams & Readiness */}
        <TabsContent value="readiness">
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-accent" />
                Exams & Readiness
              </CardTitle>
              <CardDescription>Your preparation status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ieltsStatus">IELTS / TOEFL Status</Label>
                  <Select
                    value={profile.ieltsStatus}
                    onValueChange={(value) => updateProfile({ ieltsStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    value={profile.greStatus}
                    onValueChange={(value) => updateProfile({ greStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="sopStatus">SOP Status</Label>
                  <Select
                    value={profile.sopStatus}
                    onValueChange={(value) => updateProfile({ sopStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              {/* Status summary */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3">Readiness Summary</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">English Proficiency</span>
                    <Badge
                      variant="secondary"
                      className={
                        profile.ieltsStatus === "Completed"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }
                    >
                      {profile.ieltsStatus === "Completed" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {profile.ieltsStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Standardized Tests</span>
                    <Badge
                      variant="secondary"
                      className={
                        profile.greStatus === "Completed"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }
                    >
                      {profile.greStatus === "Completed" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {profile.greStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Statement of Purpose</span>
                    <Badge
                      variant="secondary"
                      className={
                        profile.sopStatus === "Finalized"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }
                    >
                      {profile.sopStatus === "Finalized" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {profile.sopStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Profile Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Updating your profile will trigger the following:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Recalculation of university recommendations</li>
                <li>Updated acceptance chances for shortlisted universities</li>
                <li>New AI-generated tasks based on your profile</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSave}
              disabled={isSaving}
              className="bg-accent hover:bg-accent/90"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
