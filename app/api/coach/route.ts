import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check if user is Premium when Stripe is implemented
    // For now, allow all users to test

    const { message } = await request.json();

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        riskScores: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const latestScore = user.riskScores[0];

    // Build context for AI
    const context = `You are an AI Career Coach helping ${user.name || "a professional"}.

Their profile:
- Job: ${user.jobTitle || "Not specified"}
- Industry: ${user.industry || "Not specified"}
- Experience: ${user.yearsInRole || "Not specified"} years
- Company: ${user.company || "Not specified"}
${
  latestScore
    ? `- AI Risk Score: ${latestScore.score}/100 (${latestScore.level} risk)
- Main concerns: ${latestScore.summary}`
    : "- No risk assessment yet"
}

Provide personalized, actionable career advice. Be empathetic but practical. Focus on concrete steps they can take. Keep responses concise (under 200 words) but helpful.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: context,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Coach error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
