import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRiskFromProfile } from "@/lib/riskCalculator";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const riskResult = calculateRiskFromProfile({
      jobTitle: user.jobTitle,
      industry: user.industry,
      skills: user.skills || [],
      techUsage: user.techUsage,
      experienceYears: user.experienceYears,
      educationLevel: user.educationLevel,
      jobTasks: user.jobTasks,
    });

    return NextResponse.json({
      score: riskResult.score,
      level: riskResult.level,
      summary: riskResult.summary,
      recommendations: riskResult.recommendations,
    });
  } catch (error: any) {
    console.error("Risk score error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate risk" },
      { status: 500 }
    );
  }
}