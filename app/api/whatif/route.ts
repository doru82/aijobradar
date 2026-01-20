import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRiskScore } from "@/lib/riskCalculator";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { learningSkills } = await request.json();

    if (!Array.isArray(learningSkills) || learningSkills.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one skill" },
        { status: 400 }
      );
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.jobTitle || !user.industry || !user.dailyTasks) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      );
    }

    // Calculate current score
    const currentScore = calculateRiskScore(
      user.jobTitle,
      user.industry,
      user.dailyTasks as string[],
      user.yearsInRole || 0
    );

    // Simulate: reduce task risk based on skills learned
    const skillImpact: Record<string, number> = {
      "AI & Machine Learning": 15,
      "Data Analysis & Visualization": 12,
      "Python Programming": 10,
      "Cloud Computing (AWS/Azure/GCP)": 8,
      "Prompt Engineering": 10,
      "Automation & Scripting": 12,
      "Strategic Thinking": 8,
      "Leadership & People Management": 10,
      "Creative Problem Solving": 8,
      "Emotional Intelligence": 6,
      "Digital Marketing & SEO": 8,
      "Cybersecurity Basics": 7,
      "Product Management": 9,
      "UI/UX Design": 8,
      "Business Analytics": 10,
    };

    let totalReduction = 0;
    const impactBreakdown: { skill: string; reduction: number }[] = [];

    learningSkills.forEach((skill: string) => {
      const reduction = skillImpact[skill] || 5;
      totalReduction += reduction;
      impactBreakdown.push({ skill, reduction });
    });

    // Cap maximum reduction at 30 points
    totalReduction = Math.min(totalReduction, 30);

    const newScore = Math.max(0, currentScore.score - totalReduction);

    // Determine new risk level
    let newLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    if (newScore < 30) newLevel = "LOW";
    else if (newScore < 50) newLevel = "MEDIUM";
    else if (newScore < 70) newLevel = "HIGH";
    else newLevel = "CRITICAL";

    return NextResponse.json({
      currentScore: currentScore.score,
      newScore,
      reduction: totalReduction,
      currentLevel: currentScore.level,
      newLevel,
      impactBreakdown,
      message:
        totalReduction > 0
          ? `Learning these skills could reduce your risk by ${totalReduction} points!`
          : "Start learning to reduce your AI automation risk.",
    });
  } catch (error) {
    console.error("What-if simulation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate simulation" },
      { status: 500 }
    );
  }
}
