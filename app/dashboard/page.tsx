import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import UpgradeButton from "@/app/components/UpgradeButton";
import CareerCoachChat from "@/app/components/CareerCoachChat";
import GeneratePDFReport from "@/components/GeneratePDFReport";
import { calculateRiskFromProfile } from "@/lib/riskCalculator";
import { Settings } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { getRecommendedCourses } from "@/lib/courses";
import RecommendedCourses from "@/components/RecommendedCourses";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  if (!user.jobTitle) {
    redirect("/onboarding");
  }

  const isPremium = user.isPremium || false;

  // Calculate real risk score
  const riskResult = calculateRiskFromProfile({
    jobTitle: user.jobTitle,
    industry: user.industry,
    skills: user.skills || [],
    techUsage: user.techUsage,
    experienceYears: user.experienceYears,
    educationLevel: user.educationLevel,
    jobTasks: user.jobTasks,
  });

  // Get recommended courses
  const recommendedCourses = getRecommendedCourses(
    user.industry,
    user.skills,
    riskResult.score
  );

  return (
    <div
      className={`min-h-screen p-8 ${
        isPremium
          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1
              className={`text-4xl font-bold ${
                isPremium ? "text-gray-900" : "text-white"
              }`}
            >
              Welcome back, {user.name || "User"}!
            </h1>
            <div className="mt-3">
              {isPremium ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                  ⭐ Premium Member
                </span>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-slate-700 text-slate-300 border border-slate-600">
                  Free Plan
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className={`p-3 rounded-xl transition-all ${
                isPremium
                  ? "bg-white border-2 border-emerald-200 hover:border-emerald-400 text-gray-600"
                  : "bg-slate-800 border border-slate-700 hover:border-slate-500 text-gray-300"
              }`}
            >
              <Settings className="w-5 h-5" />
            </Link>
            <LogoutButton isPremium={isPremium} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Score Card */}
          <div
            className={`p-8 rounded-2xl shadow-xl ${
              isPremium
                ? "bg-white border-2 border-emerald-200"
                : "bg-slate-800 border border-slate-700"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                isPremium ? "text-gray-900" : "text-white"
              }`}
            >
              Your AI Risk Score
            </h2>
            <div className="flex items-center justify-center">
              <div
                className={`text-7xl font-bold ${
                  isPremium
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
                }`}
              >
                {user.jobTitle ? `${riskResult.score}%` : "--"}
              </div>
            </div>

            <p
              className={`text-center mt-6 text-lg ${
                isPremium ? "text-gray-600" : "text-slate-300"
              }`}
            >
              {user.jobTitle
                ? `${riskResult.level} risk of automation`
                : "Complete your profile to see your risk score"}
            </p>

            {/* PDF Report Button */}
            {user.jobTitle && (
              <div className="mt-6 flex justify-center">
                <GeneratePDFReport
                  user={{
                    name: user.name,
                    email: user.email,
                    jobTitle: user.jobTitle,
                    industry: user.industry,
                    experienceYears: user.experienceYears,
                    skills: user.skills,
                    educationLevel: user.educationLevel,
                    techUsage: user.techUsage,
                    jobTasks: user.jobTasks,
                  }}
                  riskScore={riskResult.score}
                  isPremium={isPremium}
                />
              </div>
            )}
          </div>

          {/* What-If Simulation Card */}
          <div
            className={`p-8 rounded-2xl shadow-xl ${
              isPremium
                ? "bg-white border-2 border-emerald-200"
                : "bg-slate-800 border border-slate-700"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🔮</span>
              <h2
                className={`text-2xl font-bold ${
                  isPremium ? "text-gray-900" : "text-white"
                }`}
              >
                What-If Simulation
              </h2>
            </div>
            <p
              className={`mb-6 ${
                isPremium ? "text-gray-600" : "text-slate-300"
              }`}
            >
              See how learning new skills affects your automation risk
            </p>
            <Link
              href="/simulation"
              className={`inline-block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                isPremium
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              }`}
            >
              Run Simulation
            </Link>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="mb-8">
          <RecommendedCourses
            courses={recommendedCourses}
            isPremium={isPremium}
          />
        </div>

        {/* AI Career Coach Section */}
        <div
          className={`rounded-2xl shadow-xl overflow-hidden ${
            isPremium
              ? "bg-white border-2 border-emerald-200"
              : "bg-slate-800 border border-slate-700"
          }`}
        >
          <div
            className={`p-6 ${
              isPremium
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <h2 className="text-2xl font-bold text-white">AI Career Coach</h2>
            </div>
          </div>

          <div className="p-6">
            {isPremium ? (
              <>
                <p
                  className={`mb-6 ${
                    isPremium ? "text-gray-600" : "text-slate-300"
                  }`}
                >
                  Get personalized career advice powered by AI
                </p>
                <CareerCoachChat />
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔒</div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isPremium ? "text-gray-900" : "text-white"
                  }`}
                >
                  Premium Feature
                </h3>
                <p
                  className={`mb-6 ${
                    isPremium ? "text-gray-600" : "text-slate-300"
                  }`}
                >
                  Unlock unlimited AI Career Coach conversations, personalized
                  career advice, PDF reports, and weekly email alerts
                </p>
                <div
                  className={`p-6 rounded-xl mb-6 ${
                    isPremium ? "bg-emerald-50" : "bg-slate-700/50"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-4 ${
                      isPremium ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Premium includes:
                  </h4>
                  <ul className="space-y-2 text-left max-w-xs mx-auto">
                    <li
                      className={`flex items-center gap-2 ${
                        isPremium ? "text-gray-700" : "text-slate-300"
                      }`}
                    >
                      <span className="text-emerald-500">✓</span> Unlimited AI
                      Career Coach
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        isPremium ? "text-gray-700" : "text-slate-300"
                      }`}
                    >
                      <span className="text-emerald-500">✓</span> PDF Risk
                      Reports
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        isPremium ? "text-gray-700" : "text-slate-300"
                      }`}
                    >
                      <span className="text-emerald-500">✓</span> Weekly Email
                      Alerts
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        isPremium ? "text-gray-700" : "text-slate-300"
                      }`}
                    >
                      <span className="text-emerald-500">✓</span> Priority
                      Support
                    </li>
                  </ul>
                </div>
                <UpgradeButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}