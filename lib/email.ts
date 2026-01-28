import { Resend } from "resend";
import { getRecommendedCourses } from "@/lib/courses";

const resend = new Resend(process.env.RESEND_API_KEY);

interface WeeklyEmailData {
  userName: string;
  email: string;
  jobTitle: string;
  industry: string;
  riskScore: number;
  skills: string[];
}

export async function sendWeeklyAlertEmail(data: WeeklyEmailData) {
  const { userName, email, jobTitle, industry, riskScore, skills } = data;

  const riskLevel = riskScore < 30 ? "Low" : riskScore < 60 ? "Medium" : riskScore < 80 ? "High" : "Critical";
  const riskColor = riskScore < 30 ? "#22c55e" : riskScore < 60 ? "#eab308" : riskScore < 80 ? "#f97316" : "#ef4444";

  const skillRecommendation = getSkillRecommendation(industry, skills);
  const aiNews = getRelevantNews(industry);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #10b981; font-size: 28px; margin: 0;">🎯 AI Job Radar</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Your Weekly Career Intelligence Report</p>
        </div>

        <!-- Main Card -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; padding: 32px; border: 1px solid #475569;">
          
          <!-- Greeting -->
          <p style="color: #f1f5f9; font-size: 18px; margin: 0 0 24px 0;">
            Hi ${userName || "there"} 👋
          </p>

          <!-- Risk Score Section -->
          <div style="background-color: #0f172a; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
              Your Risk Score as ${jobTitle}
            </p>
            <div style="font-size: 48px; font-weight: bold; color: ${riskColor}; margin: 8px 0;">
              ${riskScore}%
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
              ${riskLevel} Risk Level
            </p>
          </div>

          <!-- AI News Section -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #f1f5f9; font-size: 16px; margin: 0 0 16px 0; display: flex; align-items: center;">
              📰 AI News in ${industry}
            </h2>
            <ul style="margin: 0; padding: 0; list-style: none;">
              ${aiNews.map(news => `
                <li style="background-color: #0f172a; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; color: #cbd5e1; font-size: 14px;">
                  ${news}
                </li>
              `).join("")}
            </ul>
          </div>

          <!-- Recommended Courses -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #f1f5f9; font-size: 16px; margin: 0 0 16px 0;">
              📚 Recommended Courses
            </h2>
            ${getRecommendedCourses(industry, skills, riskScore).map(course => `
              <a href="${course.affiliateUrl}" target="_blank" style="display: block; background-color: #0f172a; border-radius: 8px; padding: 16px; margin-bottom: 8px; text-decoration: none; border: 1px solid #334155;">
                <div style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                  ${course.title}
                </div>
                <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">
                  ${course.description.substring(0, 80)}...
                </div>
                <div style="display: inline-block; background-color: #10b981; color: white; font-size: 11px; padding: 4px 8px; border-radius: 4px;">
                  ${course.level} • ⭐ ${course.rating}
                </div>
              </a>
            `).join("")}
            <p style="color: #64748b; font-size: 11px; margin: 8px 0 0 0; text-align: center;">
              Affiliate links - we may earn a commission
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center;">
            <a href="https://aijobradar.io/dashboard" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              View Full Dashboard →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            You're receiving this because you have Premium alerts enabled.
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">
            <a href="https://aijobradar.io/dashboard" style="color: #10b981; text-decoration: none;">
              Manage preferences
            </a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "AI Job Radar <onboarding@resend.dev>",
      to: email,
      subject: `📊 Weekly Report: Your ${riskLevel} Risk Score Update`,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

function getSkillRecommendation(industry: string, currentSkills: string[]): string {
  const recommendations: Record<string, string[]> = {
    "Technology & Software": ["Learn prompt engineering to work alongside AI", "Focus on system design and architecture", "Develop leadership and team management skills"],
    "Finance & Banking": ["Master AI-powered financial analysis tools", "Learn data visualization and storytelling", "Develop risk assessment expertise"],
    "Healthcare & Medical": ["Understand AI diagnostics and their limitations", "Focus on patient communication and empathy", "Learn healthcare data privacy regulations"],
    "Marketing & Advertising": ["Master AI content generation tools", "Focus on brand strategy and creative direction", "Develop data-driven decision making"],
    default: ["Focus on skills that require human judgment", "Learn to collaborate with AI tools effectively", "Develop strong communication and leadership abilities"]
  };

  const industryRecs = recommendations[industry] || recommendations.default;
  const randomRec = industryRecs[Math.floor(Math.random() * industryRecs.length)];
  
  return randomRec;
}

function getRelevantNews(industry: string): string[] {
  const news: Record<string, string[]> = {
    "Technology & Software": [
      "AI coding assistants now handle 40% of routine programming tasks",
      "Companies increasing investment in AI-human collaboration tools",
      "Demand growing for AI ethics and governance roles"
    ],
    "Finance & Banking": [
      "AI-powered fraud detection adoption up 60% this quarter",
      "Robo-advisors managing $1.5T in assets globally",
      "Banks hiring for AI risk management positions"
    ],
    "Healthcare & Medical": [
      "AI diagnostics achieving 95% accuracy in early detection",
      "Telehealth platforms integrating AI triage systems",
      "Healthcare AI market projected to reach $45B by 2026"
    ],
    default: [
      "AI adoption accelerating across all industries",
      "Remote work driving demand for digital collaboration skills",
      "Companies prioritizing human-AI collaboration training"
    ]
  };

  return news[industry] || news.default;
}