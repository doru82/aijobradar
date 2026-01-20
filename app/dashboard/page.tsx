"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Logo from "@/components/Logo";

interface RiskScore {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  summary: string;
  factors: {
    taskRisk: number;
    industryModifier: number;
    experienceModifier: number;
  };
  recommendations: string[];
  createdAt: string;
}

interface SimulationResult {
  currentScore: number;
  newScore: number;
  reduction: number;
  currentLevel: string;
  newLevel: string;
  impactBreakdown: { skill: string; reduction: number }[];
  message: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const AVAILABLE_SKILLS = [
  "AI & Machine Learning",
  "Data Analysis & Visualization",
  "Python Programming",
  "Cloud Computing (AWS/Azure/GCP)",
  "Prompt Engineering",
  "Automation & Scripting",
  "Strategic Thinking",
  "Leadership & People Management",
  "Creative Problem Solving",
  "Emotional Intelligence",
  "Digital Marketing & SEO",
  "Cybersecurity Basics",
  "Product Management",
  "UI/UX Design",
  "Business Analytics",
];

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // What-If Simulation state
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulatingWhatIf, setSimulatingWhatIf] = useState(false);

  // AI Coach state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("setup") === "complete") {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchRiskScore() {
      try {
        const response = await fetch("/api/risk");
        const data = await response.json();
        setRiskScore(data.riskScore);
      } catch (error) {
        console.error("Failed to fetch risk score:", error);
      }
      setLoading(false);
    }

    if (session) {
      fetchRiskScore();
    }
  }, [session]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const runSimulation = async () => {
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill to simulate");
      return;
    }

    setSimulatingWhatIf(true);
    try {
      const response = await fetch("/api/whatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learningSkills: selectedSkills }),
      });

      if (response.ok) {
        const result = await response.json();
        setSimulationResult(result);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to run simulation");
      }
    } catch (error) {
      console.error("Simulation error:", error);
      alert("Failed to run simulation");
    } finally {
      setSimulatingWhatIf(false);
    }
  };

  const sendChatMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: currentMessage,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setSendingMessage(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to get response from AI Coach");
      }
    } catch (error) {
      console.error("Chat error:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-green-400";
      case "MEDIUM":
        return "text-yellow-400";
      case "HIGH":
        return "text-orange-400";
      case "CRITICAL":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "bg-green-500/20 border-green-500/50";
      case "MEDIUM":
        return "bg-yellow-500/20 border-yellow-500/50";
      case "HIGH":
        return "bg-orange-500/20 border-orange-500/50";
      case "CRITICAL":
        return "bg-red-500/20 border-red-500/50";
      default:
        return "bg-gray-500/20 border-gray-500/50";
    }
  };

  return (
    <main className="min-h-screen">
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="glass rounded-2xl p-8 text-center animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400">Profile Complete!</h2>
            <p className="text-gray-400 mt-2">Your risk score has been calculated.</p>
          </div>
        </div>
      )}

      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="font-semibold text-lg">AI Job Radar</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-300">{session.user?.name}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {session.user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-400">
            {riskScore
              ? "Here's your AI career risk analysis and tools to reduce it."
              : "Complete your profile to see your AI risk analysis."}
          </p>
        </div>

        {riskScore ? (
          <>
            {/* Risk Score Display */}
            <div className={`rounded-2xl p-8 mb-8 border ${getRiskBgColor(riskScore.level)}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Your AI Risk Score</p>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-6xl font-bold ${getRiskColor(riskScore.level)}`}>
                      {riskScore.score}
                    </span>
                    <span className="text-2xl text-gray-500">/100</span>
                  </div>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskBgColor(
                      riskScore.level
                    )} ${getRiskColor(riskScore.level)}`}
                  >
                    {riskScore.level} RISK
                  </span>
                </div>
                <div className="flex-1 max-w-md">
                  <p className="text-gray-300">{riskScore.summary}</p>
                </div>
              </div>
            </div>

            {/* What-If Simulation */}
            <div className="glass rounded-xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-2">🔮 What-If Simulation</h2>
              <p className="text-gray-400 mb-6">
                See how learning new skills could reduce your AI automation risk.
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Select skills you want to learn:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        selectedSkills.includes(skill)
                          ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                          : "bg-white/5 border-2 border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={selectedSkills.length === 0 || simulatingWhatIf}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
              >
                {simulatingWhatIf ? "Calculating..." : "Run Simulation"}
              </button>

              {simulationResult && (
                <div className="mt-6 p-6 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Current Score</p>
                      <p className="text-3xl font-bold text-orange-400">
                        {simulationResult.currentScore}
                      </p>
                    </div>
                    <div className="text-4xl">→</div>
                    <div>
                      <p className="text-sm text-gray-400">Projected Score</p>
                      <p className="text-3xl font-bold text-green-400">
                        {simulationResult.newScore}
                      </p>
                    </div>
                  </div>
                  <p className="text-green-400 font-semibold mb-4">{simulationResult.message}</p>
                  <div className="space-y-2">
                    {simulationResult.impactBreakdown.map((item) => (
                      <div key={item.skill} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.skill}</span>
                        <span className="text-green-400">-{item.reduction} points</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Career Coach */}
            <div className="glass rounded-xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-2">🤖 AI Career Coach</h2>
              <p className="text-gray-400 mb-6">
                Get personalized career advice based on your profile and risk assessment.
              </p>

              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">👋 Hi! I'm your AI Career Coach.</p>
                    <p className="text-sm">Ask me anything about your career, upskilling, or AI automation.</p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-500/20 border border-blue-500/50 ml-12"
                          : "bg-green-500/20 border border-green-500/50 mr-12"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {msg.role === "user" ? "You" : "AI Coach"}
                      </p>
                      <p className="text-gray-200">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Ask about your career..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 transition-all"
                  disabled={sendingMessage}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!currentMessage.trim() || sendingMessage}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
                >
                  {sendingMessage ? "..." : "Send"}
                </button>
              </div>
            </div>

            {/* Skills Recommendations */}
            <div className="glass rounded-xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">🎯 Recommended Skills to Learn</h2>
              <p className="text-gray-400 mb-6">
                These skills will help you stay relevant and reduce your AI automation risk.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {riskScore.recommendations.map((skill, index) => (
                  <div
                    key={skill}
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Last calculated:{" "}
              {new Date(riskScore.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="text-center mt-4">
              <button
                onClick={() => router.push("/profile/setup")}
                className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                Update Profile & Recalculate
              </button>
            </div>
          </>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Tell us about your job to get personalized AI threat monitoring and risk analysis.
            </p>
            <button
              onClick={() => router.push("/profile/setup")}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Set Up My Profile →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
