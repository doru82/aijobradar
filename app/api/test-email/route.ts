import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWeeklyAlertEmail } from "@/lib/email";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.isPremium) {
      return NextResponse.json({ error: "Premium required" }, { status: 403 });
    }

    const result = await sendWeeklyAlertEmail({
      userName: user.name || "there",
      email: user.email,
      jobTitle: user.jobTitle || "Professional",
      industry: user.industry || "Technology & Software",
      riskScore: 65,
      skills: user.skills || [],
    });

    if (result.success) {
      return NextResponse.json({ message: "Test email sent!" });
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}