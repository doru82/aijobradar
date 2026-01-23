"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export function useOnboardingCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      // Skip if not authenticated or already on onboarding page
      if (status === "loading") return;
      if (!session) {
        setIsChecking(false);
        return;
      }
      if (pathname === "/onboarding") {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          
          // If user doesn't have a job title, they need onboarding
          if (!data.user?.jobTitle) {
            setNeedsOnboarding(true);
            router.push("/onboarding");
          }
        }
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    checkOnboarding();
  }, [session, status, router, pathname]);

  return { isChecking, needsOnboarding };
}