import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isPremium: true,
        jobTitle: true,
        industry: true,
        experienceYears: true,
        jobTasks: true,
        techUsage: true,
        skills: true,
        educationLevel: true,
        location: true,
        alertEmail: true,
        alertPush: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
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
      educationLevel,
      location,
      alertEmail,
      alertPush
    } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        jobTitle: jobTitle || undefined,
        industry: industry || undefined,
        experienceYears: experienceYears ?? undefined,
        jobTasks: jobTasks || undefined,
        techUsage: techUsage || undefined,
        skills: skills || undefined,
        educationLevel: educationLevel || undefined,
        location: location || undefined,
        alertEmail: alertEmail ?? undefined,
        alertPush: alertPush ?? undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        jobTitle: true,
        industry: true,
        experienceYears: true,
        skills: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });

  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}