// User Profile Types
export interface UserProfile {
  // Personal Info
  fullName: string;
  email: string;

  // Academic Background
  educationLevel: string;
  degree: string;
  graduationYear: string;
  gpa: string;

  // Study Goal
  intendedDegree: string;
  fieldOfStudy: string;
  targetIntake: string;
  preferredCountries: string[];

  // Budget
  budgetRange: string;
  fundingPlan: string;

  // Exams & Readiness
  ieltsStatus: string;
  greStatus: string;
  sopStatus: string;

  // Meta
  onboardingComplete: boolean;
  currentStage: number;
}

export interface University {
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

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
  dueDate?: string;
  priority: "high" | "medium" | "low";
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: AIAction[];
}

export interface AIAction {
  type: "shortlist" | "lock" | "add_task" | "update_profile";
  label: string;
  data: Record<string, unknown>;
}

// Onboarding step configuration
export const ONBOARDING_STEPS = [
  { id: 1, title: "Academic Background", description: "Tell us about your education" },
  { id: 2, title: "Study Goal", description: "What do you want to pursue?" },
  { id: 3, title: "Budget", description: "Plan your finances" },
  { id: 4, title: "Exams & Readiness", description: "Your preparation status" },
] as const;

export const EDUCATION_LEVELS = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other",
];

export const INTENDED_DEGREES = [
  "Bachelor's",
  "Master's",
  "MBA",
  "PhD",
];

export const FIELDS_OF_STUDY = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Data Science",
  "Medicine",
  "Law",
  "Arts & Design",
  "Social Sciences",
  "Natural Sciences",
  "Other",
];

export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Ireland",
  "Singapore",
  "New Zealand",
  "France",
];

export const BUDGET_RANGES = [
  "Under $15,000/year",
  "$15,000 - $30,000/year",
  "$30,000 - $50,000/year",
  "$50,000 - $70,000/year",
  "Above $70,000/year",
];

export const FUNDING_PLANS = [
  "Self-funded",
  "Scholarship-dependent",
  "Loan-dependent",
  "Partial scholarship + Self-funded",
  "Employer-sponsored",
];

export const EXAM_STATUSES = [
  "Not started",
  "Preparing",
  "Scheduled",
  "Completed",
  "Not required",
];

export const SOP_STATUSES = [
  "Not started",
  "Draft in progress",
  "Ready for review",
  "Finalized",
];

export const INTAKE_YEARS = [
  "Fall 2025",
  "Spring 2026",
  "Fall 2026",
  "Spring 2027",
  "Fall 2027",
];
