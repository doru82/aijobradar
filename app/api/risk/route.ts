import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRiskScore } from "@/lib/riskCalculator";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with their profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        jobTitle: true,
        industry: true,
        jobTasks: true,
        yearsInRole: true,
      },
    });

    if (!user || !user.jobTitle || !user.industry) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      );
    }

    // Calculate risk score
    const result = calculateRiskScore(
      user.jobTitle,
      user.industry,
      user.jobTasks,
      user.yearsInRole || 0
    );

    // Save to database
    const riskScore = await prisma.riskScore.create({
      data: {
        userId: user.id,
        score: result.score,
        level: result.level,
        factors: result.factors,
        summary: result.summary,
        skills: result.recommendations,
      },
    });

    return NextResponse.json({
      success: true,
      riskScore: {
        ...result,
        id: riskScore.id,
        createdAt: riskScore.createdAt,
      },
    });
  } catch (error) {
    console.error("Risk calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate risk score" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's latest risk score
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const latestRiskScore = await prisma.riskScore.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!latestRiskScore) {
      return NextResponse.json({ riskScore: null });
    }

    return NextResponse.json({
      riskScore: {
        id: latestRiskScore.id,
        score: latestRiskScore.score,
        level: latestRiskScore.level,
        summary: latestRiskScore.summary,
        factors: latestRiskScore.factors,
        recommendations: latestRiskScore.skills,
        createdAt: latestRiskScore.createdAt,
      },
    });
  } catch (error) {
    console.error("Risk fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch risk score" },
      { status: 500 }
    );
  }
}
