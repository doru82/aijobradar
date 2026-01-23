import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      jobTitle,
      industry,
      experienceYears,
      jobTasks,
      techUsage,
      skills,
      educationLevel
    } = body;

    // Validate required fields
    if (!jobTitle || !industry || !educationLevel || !skills?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        jobTitle,
        industry,
        experienceYears: experienceYears || null,
        jobTasks: jobTasks || null,
        techUsage: techUsage || null,
        skills: skills || [],
        educationLevel
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        jobTitle: updatedUser.jobTitle,
        industry: updatedUser.industry
      }
    });

  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}