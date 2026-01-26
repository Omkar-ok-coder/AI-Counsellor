"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { mockUserProfile, mockTasks, mockUniversities, STAGES } from "@/lib/mock-data";
import {
  GraduationCap,
  Globe,
  Wallet,
  Calendar,
  BookOpen,
  FileText,
  ClipboardList,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const currentStage = mockUserProfile.currentStage;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const shortlistedUniversities = mockUniversities.filter((u) => u.isShortlisted);
  const lockedUniversities = mockUniversities.filter((u) => u.isLocked);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const getProfileStrength = () => {
    let score = 0;
    if (mockUserProfile.gpa) score += 25;
    if (mockUserProfile.ieltsStatus === "Completed") score += 25;
    if (mockUserProfile.greStatus === "Completed") score += 25;
    if (mockUserProfile.sopStatus === "Finalized") score += 25;
    return score;
  };

  const profileStrength = getProfileStrength();

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-balance">
          Welcome back, {mockUserProfile.fullName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your study abroad journey
        </p>
      </motion.div>

      {/* Stage Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Journey</CardTitle>
            <CardDescription>Current stage: {STAGES[currentStage - 1].name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {STAGES.map((stage, index) => (
                <div key={stage.id} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stage.id < currentStage
                        ? "bg-accent text-accent-foreground"
                        : stage.id === currentStage
                        ? "bg-accent/20 text-accent border-2 border-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stage.id < currentStage ? <CheckCircle className="h-4 w-4" /> : stage.id}
                  </div>
                  {index < STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        stage.id < currentStage ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{STAGES[currentStage - 1].description}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-card/80 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockUserProfile.intendedDegree} in {mockUserProfile.fieldOfStudy}</p>
                  <p className="text-xs text-muted-foreground">{mockUserProfile.educationLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockUserProfile.targetIntake}</p>
                  <p className="text-xs text-muted-foreground">Target Intake</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockUserProfile.preferredCountries.join(", ")}</p>
                  <p className="text-xs text-muted-foreground">Preferred Countries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockUserProfile.budgetRange}</p>
                  <p className="text-xs text-muted-foreground">Annual Budget</p>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Strength */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/80 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Profile Strength
              </CardTitle>
              <CardDescription>{profileStrength}% complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={profileStrength} className="h-2" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Academics</span>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">Strong</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">IELTS/TOEFL</span>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    {mockUserProfile.ieltsStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">GRE/GMAT</span>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                    {mockUserProfile.greStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SOP</span>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                    {mockUserProfile.sopStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Universities Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-border/50 bg-card/80 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Universities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-accent">{shortlistedUniversities.length}</p>
                  <p className="text-xs text-muted-foreground">Shortlisted</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-accent">{lockedUniversities.length}</p>
                  <p className="text-xs text-muted-foreground">Locked</p>
                </div>
              </div>

              {lockedUniversities.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Locked Universities</p>
                  {lockedUniversities.slice(0, 2).map((uni) => (
                    <div key={uni.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>{uni.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {lockedUniversities.length === 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-xs">Lock at least one university to proceed</p>
                </div>
              )}

              <Link href="/universities">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Universities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI To-Do List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-accent" />
                  AI To-Do List
                </CardTitle>
                <Badge variant="secondary">
                  {completedTasks}/{tasks.length}
                </Badge>
              </div>
              <CardDescription>Tasks generated based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      task.isCompleted
                        ? "bg-muted/50 border-border/50"
                        : "bg-card border-border hover:border-accent/50"
                    }`}
                  >
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          task.isCompleted ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {task.description}
                      </p>
                      {task.dueDate && !task.isCompleted && (
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        task.priority === "high"
                          ? "bg-red-500/10 text-red-600"
                          : task.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Counsellor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-border/50 bg-gradient-to-br from-accent/10 to-accent/5 h-full">
            <CardContent className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Counsellor</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Get personalized guidance, university recommendations, and answers to all your study abroad questions.
              </p>
              <Link href="/counsellor">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Start Conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
