"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  GraduationCap,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock,
  Star,
  Plus,
  Minus,
  Calendar,
  Award,
  Info,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number;
  category: "dream" | "target" | "safe";
  tuitionFee: string;
  costLevel: "low" | "medium" | "high";
  acceptanceChance: "low" | "medium" | "high";
  whyItFits: string[];
  risks: string[];
  programs: string[];
  deadline: string;
  isLocked: boolean;
  isShortlisted: boolean;
}

export default function UniversitiesPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showLockWarning, setShowLockWarning] = useState(false);
  const [universityToUnlock, setUniversityToUnlock] = useState<University | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. FETCH DATA
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem("token");

        // Safety: Only redirect if NO token exists
        if (!token) {
          console.log("No token found, redirecting to login.");
          router.push("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/universities/recommendations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response Status:", res.status);

        if (res.status === 401) {
          console.log("Token expired or invalid. Logging out.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server Error ${res.status}: ${errorText}`);
        }

        const data = await res.json();

        // Map Data
        const mappedUniversities: University[] = data.map((uni: any) => ({
          id: uni._id,
          name: uni.name,
          country: uni.country,
          city: uni.location,
          ranking: uni.ranking || 0,
          category: (uni.tag?.toLowerCase() || "target") as "dream" | "target" | "safe",
          tuitionFee: uni.tuition ? `$${uni.tuition.toLocaleString()}/year` : "N/A",
          costLevel: uni.tuition < 20000 ? "low" : uni.tuition < 50000 ? "medium" : "high",
          acceptanceChance: (uni.acceptanceRate?.toLowerCase() || "medium") as "low" | "medium" | "high",
          whyItFits: [`Ranked #${uni.ranking}`, `Located in ${uni.country}`],
          risks: ["Competitive admission", "Tuition costs"],
          programs: uni.programs || [],
          deadline: "Varies",
          isLocked: !!uni.isLocked,
          isShortlisted: !!uni.isShortlisted,
        }));

        setUniversities(mappedUniversities);
      } catch (error: any) {
        console.error("Failed to fetch universities:", error);
        setErrorMsg(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [router]);

  // Helper functions
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "dream": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "target": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "safe": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAcceptanceColor = (chance: string) => {
    switch (chance) {
      case "high": return "text-emerald-400";
      case "medium": return "text-amber-400";
      case "low": return "text-rose-400";
      default: return "text-muted-foreground";
    }
  };

  const getCostColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-400";
      case "medium": return "text-amber-400";
      case "high": return "text-rose-400";
      default: return "text-muted-foreground";
    }
  };

  // Filter Logic
  const shortlistedUniversities = universities.filter((u) => u.isShortlisted);
  const lockedUniversities = universities.filter((u) => u.isLocked);
  const dreamUniversities = universities.filter((u) => u.category === "dream");
  const targetUniversities = universities.filter((u) => u.category === "target");
  const safeUniversities = universities.filter((u) => u.category === "safe");

  const getFilteredUniversities = () => {
    switch (activeTab) {
      case "shortlisted": return shortlistedUniversities;
      case "dream": return dreamUniversities;
      case "target": return targetUniversities;
      case "safe": return safeUniversities;
      default: return universities;
    }
  };

  // Actions
  const toggleShortlist = async (universityId: string) => {
    // Determine the new status (adding or removing)
    const university = universities.find(u => u.id === universityId);
    const newStatus = university?.isShortlisted ? "removed" : "shortlisted";

    // Optimistic Update
    setUniversities((prev) =>
      prev.map((u) =>
        u.id === universityId ? { ...u, isShortlisted: !u.isShortlisted } : u
      )
    );

    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/universities/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        // ✅ FIX: Send the correct status ('shortlisted' or 'removed')
        body: JSON.stringify({ universityId, status: newStatus }),
      });
    } catch (error) { console.error(error); }
  };

  const toggleLock = async (university: University) => {
    if (university.isLocked) {
      setUniversityToUnlock(university);
      setShowLockWarning(true);
    } else {
      // Optimistic Update
      setUniversities((prev) =>
        prev.map((u) =>
          u.id === university.id ? { ...u, isLocked: true, isShortlisted: true } : u
        )
      );

      try {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/api/universities/lock", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          // ✅ FIX: Send status: 'locked' so the backend saves it
          body: JSON.stringify({ universityId: university.id, status: "locked" }),
        });
      } catch (error) { console.error(error); }
    }
  };

  const confirmUnlock = async () => {
    if (universityToUnlock) {
      // Optimistic Update
      setUniversities((prev) =>
        prev.map((u) =>
          u.id === universityToUnlock.id ? { ...u, isLocked: false } : u
        )
      );

      try {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/api/universities/lock", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          // ✅ FIX: Send status: 'shortlisted' to revert to shortlisted state
          body: JSON.stringify({ universityId: universityToUnlock.id, status: "shortlisted" }),
        });
      } catch (error) { console.error(error); }
    }
    setShowLockWarning(false);
    setUniversityToUnlock(null);
  };

  const UniversityCard = ({ university }: { university: University }) => (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      <Card
        className={`border-white/10 bg-black/40 backdrop-blur-md hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer active:scale-[0.99] group ${university.isLocked ? "ring-2 ring-rose-500 shadow-rose-500/20" : ""
          }`}
        onClick={() => setSelectedUniversity(university)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`text-xs ${getCategoryColor(university.category)}`}>{university.category}</Badge>
                {university.isLocked && <Badge variant="secondary" className="bg-accent/10 text-accent text-xs"><Lock className="h-3 w-3 mr-1" />Locked</Badge>}
              </div>
              <CardTitle className="text-lg leading-tight">{university.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{university.city}, {university.country}</CardDescription>
            </div>
            <div className="flex items-center gap-1 shrink-0"><Award className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">#{university.ranking}</span></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground text-xs mb-1">Tuition</p><p className={`font-medium ${getCostColor(university.costLevel)}`}>{university.tuitionFee}</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">Acceptance Chance</p><p className={`font-medium capitalize ${getAcceptanceColor(university.acceptanceChance)}`}>{university.acceptanceChance}</p></div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />Deadline: {university.deadline}</div>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className={`flex-1 bg-transparent hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/50 ${university.isShortlisted ? "text-emerald-400 border-emerald-500/50" : ""}`} onClick={() => toggleShortlist(university.id)}>
              {university.isShortlisted ? <><Minus className="h-4 w-4 mr-1" />Remove</> : <><Plus className="h-4 w-4 mr-1" />Shortlist</>}
            </Button>
            <Button variant={university.isLocked ? "secondary" : "default"} size="sm" className={`flex-1 ${!university.isLocked ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"}`} onClick={() => toggleLock(university)}>
              {university.isLocked ? <><Unlock className="h-4 w-4 mr-1" />Unlock</> : <><Lock className="h-4 w-4 mr-1" />Lock</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div >
  );

  // ERROR DISPLAY
  if (errorMsg) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <div className="border border-red-200 bg-red-50 p-6 rounded-lg max-w-lg text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-red-600 font-mono text-sm bg-red-100 p-2 rounded mb-4">{errorMsg}</p>
          <p className="text-gray-600 text-sm mb-4">Note: If this is 404, it means no recommendations were found for your new profile yet.</p>
          <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
        </div>
      </div>
    );
  }

  // LOADING
  if (isLoading) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading universities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2 text-amber-500">
            <GraduationCap className="h-7 w-7 text-amber-500" />
            Universities
          </h1>
          <p className="text-muted-foreground mt-1">Discover and shortlist universities that match your profile</p>
        </div>
        <div className="flex items-center gap-2"><Badge variant="secondary" className="text-sm">{shortlistedUniversities.length} Shortlisted</Badge><Badge variant="secondary" className="bg-accent/10 text-accent text-sm">{lockedUniversities.length} Locked</Badge></div>
      </div>

      {lockedUniversities.length === 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div><p className="font-medium text-sm">Lock at least one university to proceed</p><p className="text-xs text-muted-foreground">Locking a university enables application guidance and creates a focused strategy</p></div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-black/40 backdrop-blur-md border border-white/10">
          <TabsTrigger value="all">All ({universities.length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({shortlistedUniversities.length})</TabsTrigger>
          <TabsTrigger value="dream">Dream ({dreamUniversities.length})</TabsTrigger>
          <TabsTrigger value="target">Target ({targetUniversities.length})</TabsTrigger>
          <TabsTrigger value="safe">Safe ({safeUniversities.length})</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {getFilteredUniversities().map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </AnimatePresence>
          </div>
          {getFilteredUniversities().length === 0 && (
            <div className="text-center py-12"><GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No universities found in this category</p></div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedUniversity} onOpenChange={() => setSelectedUniversity(null)}>
        {selectedUniversity && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(selectedUniversity.category)}>{selectedUniversity.category}</Badge>
                {selectedUniversity.isLocked && <Badge variant="secondary" className="bg-accent/10 text-accent"><Lock className="h-3 w-3 mr-1" />Locked</Badge>}
              </div>
              <DialogTitle className="text-xl">{selectedUniversity.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedUniversity.city}, {selectedUniversity.country} | Ranking: #{selectedUniversity.ranking}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Details Content here */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50"><DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className={`font-medium ${getCostColor(selectedUniversity.costLevel)}`}>{selectedUniversity.tuitionFee}</p><p className="text-xs text-muted-foreground">Tuition/year</p></div>
                <div className="text-center p-3 rounded-lg bg-muted/50"><TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className={`font-medium capitalize ${getAcceptanceColor(selectedUniversity.acceptanceChance)}`}>{selectedUniversity.acceptanceChance}</p><p className="text-xs text-muted-foreground">Acceptance Chance</p></div>
                <div className="text-center p-3 rounded-lg bg-muted/50"><Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="font-medium">{selectedUniversity.deadline}</p><p className="text-xs text-muted-foreground">Deadline</p></div>
              </div>
              <div><h4 className="font-medium mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-accent" />Available Programs</h4><div className="flex flex-wrap gap-2">{selectedUniversity.programs.map((program) => (<Badge key={program} variant="secondary">{program}</Badge>))}</div></div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => { toggleShortlist(selectedUniversity.id); setSelectedUniversity({ ...selectedUniversity, isShortlisted: !selectedUniversity.isShortlisted }); }}>
                {selectedUniversity.isShortlisted ? <><Minus className="h-4 w-4 mr-1" />Remove from Shortlist</> : <><Plus className="h-4 w-4 mr-1" />Add to Shortlist</>}
              </Button>
              <Button className={!selectedUniversity.isLocked ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""} onClick={() => { toggleLock(selectedUniversity); if (!selectedUniversity.isLocked) { setSelectedUniversity({ ...selectedUniversity, isLocked: true, isShortlisted: true }); } }}>
                {selectedUniversity.isLocked ? <><Unlock className="h-4 w-4 mr-1" />Unlock University</> : <><Lock className="h-4 w-4 mr-1" />Lock University</>}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      <AlertDialog open={showLockWarning} onOpenChange={setShowLockWarning}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Unlock University?</AlertDialogTitle><AlertDialogDescription>Unlocking {universityToUnlock?.name} will remove it from your committed list.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmUnlock}>Yes, Unlock</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}