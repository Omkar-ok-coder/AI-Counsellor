"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User,
  Sparkles,
  GraduationCap,
  Plus,
  CheckCircle,
  Clock,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockUserProfile, mockUniversities } from "@/lib/mock-data";
import { aiAPI } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: {
    type: string;
    label: string;
    data?: Record<string, unknown>;
  }[];
}

const suggestedQuestions = [
  "What are my chances at Stanford?",
  "Recommend universities for my profile",
  "What should I focus on to improve my profile?",
  "Help me understand the application timeline",
];

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: `Hello ${mockUserProfile.fullName.split(" ")[0]}! I'm your AI Counsellor. I've analyzed your profile and I'm ready to help you navigate your study abroad journey.

**Here's what I know about you:**
- You're pursuing a ${mockUserProfile.intendedDegree} in ${mockUserProfile.fieldOfStudy}
- Target intake: ${mockUserProfile.targetIntake}
- Preferred countries: ${mockUserProfile.preferredCountries.join(", ")}
- Budget: ${mockUserProfile.budgetRange}

Based on your profile, you have a **strong academic foundation** with a GPA of ${mockUserProfile.gpa}. Your IELTS is completed, which is great! However, I notice your GRE is still in preparation and your SOP is in draft stage.

**My recommendation:** Focus on completing your GRE exam and finalizing your SOP in the next few weeks. This will significantly strengthen your applications.

What would you like to explore today? I can help you with university recommendations, profile improvement, or application strategy.`,
  timestamp: new Date(),
};

export default function CounsellorPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<Message> => {
    try {
      // Call backend AI API
      const data = await aiAPI.chat(userMessage);
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        actions: [],
      };
    } catch (error) {
      // Fallback to mock response if API fails
      const lowerMessage = userMessage.toLowerCase();
      
      let response = "";
      let actions: Message["actions"] = [];

    if (lowerMessage.includes("stanford") || lowerMessage.includes("chances")) {
      const stanford = mockUniversities.find(u => u.name.includes("Stanford"));
      response = `Let me analyze your chances at Stanford based on your profile:

**Stanford University Analysis:**

**Strengths:**
- Your GPA of ${mockUserProfile.gpa} is competitive
- Strong academic background in ${mockUserProfile.degree}
- Your field choice (${mockUserProfile.fieldOfStudy}) aligns well with Stanford's strengths

**Areas of Concern:**
- Stanford's acceptance rate is around 4-5% for graduate programs
- You'll be competing with candidates who have published research
- Your GRE score will be crucial (ensure 325+)

**My Assessment:** Stanford is a "Dream" school for your profile. Your chances are approximately **15-20%** if you complete a strong GRE and have a compelling SOP.

**Recommendation:** Apply to Stanford, but ensure you have "Target" and "Safe" schools in your list too.

Would you like me to suggest some target schools that match your profile?`;
      
      actions = [
        { type: "shortlist", label: "Add Stanford to shortlist", data: { universityId: stanford?.id } },
        { type: "add_task", label: "Add GRE prep task", data: { title: "Score 325+ on GRE" } },
      ];
    } else if (lowerMessage.includes("recommend") || lowerMessage.includes("universities")) {
      const dream = mockUniversities.filter(u => u.category === "dream");
      const target = mockUniversities.filter(u => u.category === "target");
      const safe = mockUniversities.filter(u => u.category === "safe");

      response = `Based on your profile, here are my university recommendations categorized by acceptance likelihood:

**Dream Schools (Low Acceptance Chance):**
${dream.map(u => `- ${u.name} - ${u.country}`).join("\n")}

**Target Schools (Medium Acceptance Chance):**
${target.map(u => `- ${u.name} - ${u.country}`).join("\n")}

**Safe Schools (High Acceptance Chance):**
${safe.map(u => `- ${u.name} - ${u.country}`).join("\n")}

**My Strategy Recommendation:**
Apply to 1-2 Dream schools, 3-4 Target schools, and 2 Safe schools. This gives you the best balance of ambition and security.

Would you like me to explain why each university fits your profile, or help you shortlist specific ones?`;

      actions = [
        { type: "navigate", label: "View all universities", data: { path: "/universities" } },
      ];
    } else if (lowerMessage.includes("improve") || lowerMessage.includes("profile") || lowerMessage.includes("focus")) {
      response = `Let me analyze your profile and suggest areas for improvement:

**Current Profile Strength: 50%**

**What's Working Well:**
- Strong GPA (${mockUserProfile.gpa})
- IELTS completed
- Clear goal: ${mockUserProfile.intendedDegree} in ${mockUserProfile.fieldOfStudy}

**Areas to Improve (Priority Order):**

1. **GRE Exam (High Priority)**
   - Current status: ${mockUserProfile.greStatus}
   - Target: Score 320+ for competitive programs
   - Timeline: Complete within next 6-8 weeks

2. **Statement of Purpose (High Priority)**
   - Current status: ${mockUserProfile.sopStatus}
   - Action: Finalize your SOP with a clear narrative
   - Tip: Focus on your unique story and specific reasons for each university

3. **Research Experience (Medium Priority)**
   - If you have any projects or research, highlight them
   - Consider reaching out to professors for research opportunities

4. **Recommendation Letters (Medium Priority)**
   - Secure 3 strong academic/professional recommendations
   - Give recommenders at least 4-6 weeks notice

Should I create a detailed action plan with deadlines for these improvements?`;

      actions = [
        { type: "add_task", label: "Create action plan", data: { title: "Complete profile improvement plan" } },
      ];
    } else if (lowerMessage.includes("timeline") || lowerMessage.includes("deadline")) {
      response = `Here's your application timeline for ${mockUserProfile.targetIntake}:

**Immediate (Next 2 weeks):**
- Register for GRE exam
- Begin SOP outline
- Research university-specific requirements

**1-2 Months Before Deadline:**
- Complete GRE exam
- Finalize SOP first draft
- Request recommendation letters
- Start gathering transcripts and documents

**1 Month Before Deadline:**
- Finalize all application essays
- Submit recommendation letter requests through portals
- Complete university-specific supplementary materials

**2 Weeks Before Deadline:**
- Final review of all applications
- Complete online application forms
- Prepare for potential interviews

**Key Deadlines to Note:**
${mockUniversities.filter(u => u.isShortlisted).map(u => `- ${u.name}: ${u.deadline}`).join("\n")}

Would you like me to add these milestones to your task list?`;

      actions = [
        { type: "add_task", label: "Add timeline tasks", data: { title: "Application timeline tasks" } },
      ];
    } else {
      response = `That's a great question! Let me help you with that.

Based on my analysis of your profile and goals, here are some thoughts:

Your current focus should be on:
1. Completing your GRE preparation
2. Finalizing your Statement of Purpose
3. Building a balanced university shortlist

Is there something specific about your study abroad journey you'd like to explore? I can help with:
- University recommendations and analysis
- Profile improvement strategies
- Application timeline planning
- Document preparation guidance

Feel free to ask me anything!`;
    }

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        actions,
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage = await generateResponse(input);
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleAction = (action: Message["actions"][0]) => {
    // Handle different action types - in real app, these would trigger actual changes
    console.log("Action triggered:", action);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-accent" />
            AI Counsellor
          </h1>
          <p className="text-muted-foreground text-sm">
            Your personal study abroad advisor
          </p>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Chat container */}
      <Card className="flex-1 flex flex-col border-border/50 bg-card/80 overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={
                        message.role === "assistant"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted"
                      }
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-accent text-accent-foreground rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert">
                        {message.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <p key={i} className="font-bold mt-2 mb-1">
                                {line.replace(/\*\*/g, "")}
                              </p>
                            );
                          }
                          if (line.startsWith("- ")) {
                            return (
                              <p key={i} className="ml-2">
                                {line}
                              </p>
                            );
                          }
                          return line ? <p key={i}>{line}</p> : <br key={i} />;
                        })}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(action)}
                            className="text-xs"
                          >
                            {action.type === "shortlist" && (
                              <Plus className="h-3 w-3 mr-1" />
                            )}
                            {action.type === "add_task" && (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {action.type === "navigate" && (
                              <GraduationCap className="h-3 w-3 mr-1" />
                            )}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-4 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your study abroad journey..."
              className="min-h-[44px] max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0 bg-accent hover:bg-accent/90"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </Card>
    </div>
  );
}
