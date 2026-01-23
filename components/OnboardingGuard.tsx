"use client";

import { useOnboardingCheck } from "@/lib/useOnboardingCheck";
import { Loader2 } from "lucide-react";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { isChecking, needsOnboarding } = useOnboardingCheck();

  // Show loading while checking onboarding status
  if (isChecking || needsOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">
            {needsOnboarding ? "Redirecting to setup..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}