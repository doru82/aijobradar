"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const AVAILABLE_SKILLS = [
  { id: "python", name: "Python Programming", impact: -8 },
  { id: "machine-learning", name: "Machine Learning", impact: -12 },
  { id: "data-analysis", name: "Data Analysis", impact: -10 },
  { id: "cloud-computing", name: "Cloud Computing (AWS/Azure)", impact: -9 },
  { id: "ui-ux", name: "UI/UX Design", impact: -7 },
  { id: "project-management", name: "Project Management", impact: -6 },
  { id: "digital-marketing", name: "Digital Marketing", impact: -8 },
  { id: "cybersecurity", name: "Cybersecurity", impact: -11 },
  { id: "blockchain", name: "Blockchain Development", impact: -10 },
  { id: "ai-prompt", name: "AI Prompt Engineering", impact: -9 },
];

export default function SimulationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user's real risk score
  useEffect(() => {
    async function fetchRiskScore() {
      if (status === "loading") return;
      if (!session) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/risk-score");
        if (response.ok) {
          const data = await response.json();
          setCurrentRisk(data.score);
        } else {
          setCurrentRisk(50); // Default fallback
        }
      } catch (error) {
        console.error("Error fetching risk score:", error);
        setCurrentRisk(50);
      } finally {
        setLoading(false);
      }
    }

    fetchRiskScore();
  }, [session, status, router]);

  const calculateNewRisk = () => {
    if (currentRisk === null) return 50;
    const totalImpact = selectedSkills.reduce((sum, skillId) => {
      const skill = AVAILABLE_SKILLS.find((s) => s.id === skillId);
      return sum + (skill?.impact || 0);
    }, 0);
    return Math.max(10, Math.min(95, currentRisk + totalImpact));
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
    setShowResults(false);
  };

  const runSimulation = () => {
    setShowResults(true);
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 30) return "Low risk";
    if (risk < 50) return "Medium-Low risk";
    if (risk < 70) return "Medium risk";
    if (risk < 85) return "High risk";
    return "Critical risk";
  };

  if (loading || currentRisk === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const newRisk = calculateNewRisk();
  const riskReduction = currentRisk - newRisk;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔮 What-If Simulation
          </h1>
          <p className="text-gray-600 text-lg">
            See how learning new skills can reduce your automation risk
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Current & New Risk */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Risk */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-200">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                CURRENT RISK
              </h3>
              <div className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                currentRisk < 30 ? "from-green-500 to-emerald-500" :
                currentRisk < 60 ? "from-yellow-500 to-orange-500" :
                "from-orange-500 to-red-500"
              }`}>
                {currentRisk}%
              </div>
              <p className="text-gray-600 mt-2">{getRiskLabel(currentRisk)}</p>
            </div>

            {/* Simulated Risk */}
            {showResults && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-200 animate-fadeIn">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  SIMULATED RISK
                </h3>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  {newRisk}%
                </div>
                <p className="text-gray-600 mt-2">{getRiskLabel(newRisk)}</p>

                {riskReduction > 0 && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                    <p className="text-emerald-700 font-semibold">
                      ↓ {riskReduction}% reduction
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Run Button */}
            {selectedSkills.length > 0 && (
              <button
                onClick={runSimulation}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
              >
                Calculate New Risk
              </button>
            )}
          </div>

          {/* Right: Skill Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select Skills to Learn
              </h2>
              <p className="text-gray-600 mb-6">
                Choose skills you want to acquire and see their impact on your
                automation risk
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_SKILLS.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedSkills.includes(skill.id)
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold mb-1 ${
                            selectedSkills.includes(skill.id)
                              ? "text-emerald-700"
                              : "text-gray-900"
                          }`}
                        >
                          {skill.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            selectedSkills.includes(skill.id)
                              ? "text-emerald-600"
                              : "text-gray-500"
                          }`}
                        >
                          Impact: {skill.impact}% risk
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedSkills.includes(skill.id)
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedSkills.includes(skill.id) && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedSkills.length === 0 && (
                <div className="mt-6 text-center text-gray-500 italic">
                  Select at least one skill to run the simulation
                </div>
              )}

              {selectedSkills.length > 0 && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                  <p className="text-emerald-700 font-semibold">
                    {selectedSkills.length} skill
                    {selectedSkills.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}