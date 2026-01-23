import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWeeklyAlertEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    // Verify cron secret (protejează endpoint-ul)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Găsește toți userii premium cu alertEmail activat
    const premiumUsers = await prisma.user.findMany({
      where: {
        isPremium: true,
        alertEmail: true,
        jobTitle: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        industry: true,
        skills: true,
      },
    });

    console.log(`Sending weekly alerts to ${premiumUsers.length} users`);

    const results = [];

    for (const user of premiumUsers) {
      // Skip dacă nu are date complete
      if (!user.jobTitle || !user.industry) continue;

      const result = await sendWeeklyAlertEmail({
        userName: user.name || "there",
        email: user.email,
        jobTitle: user.jobTitle,
        industry: user.industry,
        riskScore: 65, // TODO: calculează real
        skills: user.skills || [],
      });

      results.push({
        email: user.email,
        success: result.success,
      });

      // Mică pauză între emails (rate limiting)
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Weekly alerts sent`,
      total: premiumUsers.length,
      successful,
      failed,
    });
  } catch (error: any) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: error.message || "Cron job failed" },
      { status: 500 }
    );
  }
}