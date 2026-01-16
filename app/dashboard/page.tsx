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

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

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
      case "LOW": return "text-green-400";
      case "MEDIUM": return "text-yellow-400";
      case "HIGH": return "text-orange-400";
      case "CRITICAL": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-500/20 border-green-500/50";
      case "MEDIUM": return "bg-yellow-500/20 border-yellow-500/50";
      case "HIGH": return "bg-orange-500/20 border-orange-500/50";
      case "CRITICAL": return "bg-red-500/20 border-red-500/50";
      default: return "bg-gray-500/20 border-gray-500/50";
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
              ? "Here's your AI career risk analysis."
              : "Complete your profile to see your AI risk analysis."}
          </p>
        </div>

        {riskScore ? (
          <>
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
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskBgColor(riskScore.level)} ${getRiskColor(riskScore.level)}`}>
                    {riskScore.level} RISK
                  </span>
                </div>
                <div className="flex-1 max-w-md">
                  <p className="text-gray-300">{riskScore.summary}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {riskScore.factors.taskRisk}%
                </div>
                <div className="text-gray-400">Task Automation Risk</div>
                <div className="text-xs text-gray-500 mt-2">Based on your daily tasks</div>
              </div>
              <div className="glass rounded-xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {riskScore.factors.industryModifier > 0 ? "+" : ""}{riskScore.factors.industryModifier}
                </div>
                <div className="text-gray-400">Industry Modifier</div>
                <div className="text-xs text-gray-500 mt-2">Your industry&apos;s AI exposure</div>
              </div>
              <div className="glass rounded-xl p-6">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {riskScore.factors.experienceModifier}
                </div>
                <div className="text-gray-400">Experience Modifier</div>
                <div className="text-xs text-gray-500 mt-2">Based on your seniority</div>
              </div>
            </div>

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
              Last calculated: {new Date(riskScore.createdAt).toLocaleDateString("en-US", {
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
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}