"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { mockTasks, STAGES } from "@/lib/mock-data"; 
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  
  // State for Real Data
  const [user, setUser] = useState<any>(null);
  const [universities, setUniversities] = useState<any[]>([]); // Store University Data
  const [tasks, setTasks] = useState(mockTasks);
  const [loading, setLoading] = useState(true);

  // 1. AUTH & DATA FETCHING
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found. Redirecting...");
        router.push("/login");
        return;
      }

      try {
        // Fetch Profile AND Universities in parallel
        const [profileRes, unisRes] = await Promise.all([
          fetch("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/universities/recommendations", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (profileRes.status === 401 || unisRes.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData);
        }

        if (unisRes.ok) {
          const unisData = await unisRes.json();
          setUniversities(unisData);
        }

      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  // 2. DATA MAPPING
  // Calculate specific lists based on the fetched University Data
  const shortlistedList = universities.filter((u: any) => u.isShortlisted);
  const lockedList = universities.filter((u: any) => u.isLocked);

  const displayProfile = user ? {
    firstName: user.name?.split(" ")[0] || "Student",
    currentStage: user.journeyStage || 1,
    degree: user.preferences?.targetDegree || "Master's",
    major: user.profile?.major || "General Studies",
    educationLevel: user.profile?.educationLevel || "Bachelor's Degree",
    intake: user.preferences?.targetIntake || "Fall 2025",
    countries: user.preferences?.preferredCountries?.length > 0 
      ? user.preferences.preferredCountries 
      : ["United States", "Germany"],
    budget: user.preferences?.budgetRange || "$30k - $50k",
    ielts: user.readiness?.englishTestStatus || "Not Started",
    gre: user.readiness?.standardizedTestStatus || "Not Started",
    sop: user.readiness?.sopStatus || "Not Started",
    // Use the calculated lists from the university API
    shortlisted: shortlistedList,
    locked: lockedList,
  } : null;

  // 3. PROFILE STRENGTH CALC
  const getProfileStrength = () => {
    if (!user) return 0;
    let score = 0;
    if (user.profile?.gpa) score += 25;
    if (displayProfile?.ielts === "Completed") score += 25;
    if (displayProfile?.gre === "Completed") score += 25;
    if (displayProfile?.sop === "Completed") score += 25;
    return score || 15; // Default score
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  // 4. LOADING STATE
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="text-lg font-medium text-gray-500">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!displayProfile) return null;

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
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
          Welcome back, {displayProfile.firstName}
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
            <CardDescription>Current stage: {STAGES[displayProfile.currentStage - 1].name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {STAGES.map((stage, index) => (
                <div key={stage.id} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stage.id < displayProfile.currentStage
                        ? "bg-accent text-accent-foreground"
                        : stage.id === displayProfile.currentStage
                        ? "bg-accent/20 text-accent border-2 border-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stage.id < displayProfile.currentStage ? <CheckCircle className="h-4 w-4" /> : stage.id}
                  </div>
                  {index < STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        stage.id < displayProfile.currentStage ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{STAGES[displayProfile.currentStage - 1].description}</p>
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
                  <p className="text-sm font-medium">{displayProfile.degree} in {displayProfile.major}</p>
                  <p className="text-xs text-muted-foreground">{displayProfile.educationLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{displayProfile.intake}</p>
                  <p className="text-xs text-muted-foreground">Target Intake</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{displayProfile.countries.join(", ")}</p>
                  <p className="text-xs text-muted-foreground">Preferred Countries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{displayProfile.budget}</p>
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
                  <Badge variant="secondary" className={displayProfile.ielts === "Completed" ? "bg-accent/10 text-accent" : "bg-yellow-500/10 text-yellow-600"}>
                    {displayProfile.ielts}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">GRE/GMAT</span>
                  <Badge variant="secondary" className={displayProfile.gre === "Completed" ? "bg-accent/10 text-accent" : "bg-yellow-500/10 text-yellow-600"}>
                    {displayProfile.gre}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SOP</span>
                  <Badge variant="secondary" className={displayProfile.sop === "Completed" ? "bg-accent/10 text-accent" : "bg-yellow-500/10 text-yellow-600"}>
                    {displayProfile.sop}
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
                  <p className="text-2xl font-bold text-accent">{displayProfile.shortlisted.length}</p>
                  <p className="text-xs text-muted-foreground">Shortlisted</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-accent">{displayProfile.locked.length}</p>
                  <p className="text-xs text-muted-foreground">Locked</p>
                </div>
              </div>

              {displayProfile.locked.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Locked Universities</p>
                  {displayProfile.locked.slice(0, 2).map((uni: any) => (
                    <div key={uni._id || uni.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span className="truncate">{uni.name || "University Locked"}</span>
                    </div>
                  ))}
                  {displayProfile.locked.length > 2 && (
                    <p className="text-xs text-muted-foreground pl-6">
                      + {displayProfile.locked.length - 2} more
                    </p>
                  )}
                </div>
              )}

              {displayProfile.locked.length === 0 && (
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

      {/* Bottom section (To-Do and AI) */}
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
                      <p className={`text-sm font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}>
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