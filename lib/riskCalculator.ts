// AI Risk Score Calculator
// Calculates a 0-100 risk score based on job profile

// Risk levels for each task (0-100, higher = more at risk of AI automation)
const taskRiskScores: Record<string, number> = {
  // HIGH RISK (70-95) - Easily automatable
  "Data entry": 95,
  "Translation": 90,
  "Bookkeeping": 88,
  "Report generation": 85,
  "Email management": 82,
  "Scheduling/Calendar management": 80,
  "Scheduling": 80,
  "Documentation/Paperwork": 78,
  "Transcription": 92,
  "Basic coding tasks": 75,
  "Invoice processing": 88,
  "Form filling": 90,
  "Proofreading": 82,
  
  // MEDIUM-HIGH RISK (55-70) - Partially automatable
  "Writing content/copy": 68,
  "Social media management": 65,
  "Customer support": 70,
  "Email support": 72,
  "Live chat support": 75,
  "Phone support": 55,
  "Ticket management": 70,
  "Data analysis": 62,
  "Research": 58,
  "Market research": 60,
  "Lead generation": 65,
  "SEO optimization": 60,
  "Financial analysis": 58,
  "Transaction processing": 72,
  "Inventory management": 65,
  "Order processing": 70,
  "Compliance checks": 55,
  "Grading/Assessment": 60,
  "Progress tracking": 62,
  "CRM management": 58,
  "Sales reporting": 65,
  "Performance reporting": 62,
  "GPS/Fleet tracking": 70,
  "Route planning & navigation": 75,
  "Fuel management": 68,
  
  // MEDIUM RISK (40-55) - Requires human oversight
  "Graphic design": 52,
  "Video editing": 48,
  "Audio editing": 45,
  "Project management": 42,
  "Project coordination": 45,
  "Coding/Programming": 50,
  "Code review": 45,
  "Testing/QA": 55,
  "Bug fixing": 52,
  "Ad creation": 55,
  "Email marketing": 58,
  "Campaign planning": 48,
  "Content creation": 52,
  "Script writing": 50,
  "Legal research": 55,
  "Document review": 58,
  "Contract drafting": 52,
  "Risk assessment": 50,
  "Investment research": 52,
  "Product troubleshooting": 55,
  "Refund processing": 60,
  "Returns handling": 58,
  "Price tagging": 65,
  "Listing management": 55,
  "Contract preparation": 55,
  
  // LOW-MEDIUM RISK (25-40) - Human-centric but AI-assisted
  "Team communication": 35,
  "Team coordination": 38,
  "Client meetings": 30,
  "Customer communication": 40,
  "Patient communication": 35,
  "Student communication": 32,
  "Stakeholder communication": 35,
  "Employee relations": 30,
  "Recruitment/Hiring": 42,
  "Employee onboarding": 40,
  "Training coordination": 38,
  "Negotiation": 28,
  "Sales assistance": 45,
  "Product demonstrations": 35,
  "Teaching/Instruction": 32,
  "Curriculum planning": 40,
  "Material preparation": 45,
  "Strategy development": 35,
  "Process improvement": 40,
  "Presentation creation": 48,
  "Brand management": 38,
  "Post-production": 45,
  "Photography/Staging": 42,
  "Interviewing": 30,
  "System design": 38,
  "API development": 45,
  "Database management": 48,
  "DevOps/Deployment": 42,
  "Equipment operation": 40,
  "Warehouse operations": 55,
  "Material handling": 52,
  
  // LOW RISK (10-25) - Requires physical presence or deep human skills
  "Problem solving": 25,
  "Patient care": 18,
  "Health assessments": 22,
  "Medication management": 35,
  "Equipment sterilization": 30,
  "Lab work/Testing": 40,
  "Court appearances": 15,
  "Parent meetings": 20,
  "Performance reviews": 28,
  "Open house coordination": 25,
  "Property showings": 22,
  "Cold calling/Outreach": 40,
  "Customer follow-ups": 42,
  "Answering customer inquiries": 55,
  "Handling complaints": 45,
  "Machine operation": 45,
  "Assembly line work": 55,
  "Quality control/Inspection": 48,
  "Equipment maintenance": 35,
  "Vehicle maintenance checks": 38,
  "Safety monitoring": 42,
  "Safety inspections": 40,
  "Process optimization": 38,
  "Auditing": 45,
  "Budget planning": 42,
  "Account management": 40,
  
  // VERY LOW RISK (0-15) - Physical/hands-on work
  "Driving/Operating vehicles": 25, // Will increase with self-driving
  "Loading/Unloading cargo": 35,
  "Delivery scheduling": 55,
  "Cash register/POS operation": 60,
  "Product stocking": 45,
  "Visual merchandising": 35,
  "Store opening/closing": 30,
};

// Industry base risk modifiers
const industryRiskModifiers: Record<string, number> = {
  "Marketing & Advertising": 15,
  "Software Development": 10,
  "Finance & Banking": 12,
  "Customer Service": 18,
  "Human Resources": 10,
  "Legal": 8,
  "Sales": 5,
  "Media & Entertainment": 12,
  "Consulting": 8,
  "Education": 5,
  "Healthcare": -5,
  "Real Estate": 0,
  "Retail": 8,
  "Manufacturing": 10,
  "Transportation & Logistics": 12,
  "Other": 5,
};

// Skills recommendations based on risk factors
const skillRecommendations: Record<string, string[]> = {
  "high_automation": [
    "AI prompt engineering",
    "AI tool management",
    "Data interpretation & storytelling",
    "Complex problem solving",
    "Human-AI collaboration",
  ],
  "content_creation": [
    "AI-assisted content strategy",
    "Brand voice development",
    "Multimedia content creation",
    "Audience analytics",
    "Creative direction",
  ],
  "data_work": [
    "Advanced data visualization",
    "Machine learning basics",
    "Business intelligence tools",
    "Statistical analysis",
    "Data-driven decision making",
  ],
  "customer_facing": [
    "Emotional intelligence",
    "Complex negotiation",
    "Relationship management",
    "Conflict resolution",
    "Consultative selling",
  ],
  "technical": [
    "AI/ML integration",
    "System architecture",
    "Cloud computing",
    "Cybersecurity basics",
    "API design",
  ],
  "physical_work": [
    "Robotics operation",
    "IoT systems management",
    "Safety compliance",
    "Quality assurance",
    "Process optimization",
  ],
  "management": [
    "AI-augmented leadership",
    "Change management",
    "Strategic planning",
    "Cross-functional collaboration",
    "Digital transformation",
  ],
};

export interface RiskCalculationResult {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  summary: string;
  factors: {
    taskRisk: number;
    industryModifier: number;
    experienceModifier: number;
  };
  recommendations: string[];
  topRiskyTasks: string[];
}

export function calculateRiskScore(
  jobTitle: string,
  industry: string,
  tasks: string[],
  yearsInRole: number
): RiskCalculationResult {
  // 1. Calculate average task risk
  let totalTaskRisk = 0;
  let taskCount = 0;
  const riskyTasks: { task: string; risk: number }[] = [];

  for (const task of tasks) {
    const risk = taskRiskScores[task] ?? 50; // Default to medium if unknown
    totalTaskRisk += risk;
    taskCount++;
    riskyTasks.push({ task, risk });
  }

  const avgTaskRisk = taskCount > 0 ? totalTaskRisk / taskCount : 50;

  // 2. Apply industry modifier
  const industryMod = industryRiskModifiers[industry] ?? 5;

  // 3. Calculate experience modifier (more experience = slightly lower risk)
  // Max reduction of 10 points for 10+ years
  const experienceMod = Math.min(yearsInRole, 10) * -1;

  // 4. Check job title for high-risk keywords
  const highRiskKeywords = ["assistant", "clerk", "entry", "junior", "data", "support", "operator"];
  const lowRiskKeywords = ["director", "manager", "lead", "senior", "chief", "head", "vp", "president"];
  
  let titleMod = 0;
  const lowerTitle = jobTitle.toLowerCase();
  
  if (highRiskKeywords.some(kw => lowerTitle.includes(kw))) {
    titleMod = 8;
  } else if (lowRiskKeywords.some(kw => lowerTitle.includes(kw))) {
    titleMod = -8;
  }

  // 5. Calculate final score
  let finalScore = avgTaskRisk + industryMod + experienceMod + titleMod;
  finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

  // 6. Determine risk level
  let level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  if (finalScore <= 25) level = "LOW";
  else if (finalScore <= 50) level = "MEDIUM";
  else if (finalScore <= 75) level = "HIGH";
  else level = "CRITICAL";

  // 7. Generate summary
  const summaries = {
    LOW: `Your role as ${jobTitle} has relatively low AI automation risk. Your tasks require human judgment, creativity, or physical presence that AI cannot easily replicate.`,
    MEDIUM: `Your role as ${jobTitle} has moderate AI automation risk. Some of your tasks may be augmented or partially automated by AI in the coming years.`,
    HIGH: `Your role as ${jobTitle} has high AI automation risk. Many of your daily tasks are already being automated by AI tools. Consider upskilling soon.`,
    CRITICAL: `Your role as ${jobTitle} has critical AI automation risk. Most of your tasks can be performed by current AI systems. Immediate action recommended.`,
  };

  // 8. Get top 3 riskiest tasks
  const topRiskyTasks = riskyTasks
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 3)
    .map(t => t.task);

  // 9. Generate skill recommendations
  const recommendations: string[] = [];
  
  // Based on task categories
  if (tasks.some(t => t.includes("Writing") || t.includes("content") || t.includes("Social media"))) {
    recommendations.push(...skillRecommendations.content_creation.slice(0, 2));
  }
  if (tasks.some(t => t.includes("Data") || t.includes("Report") || t.includes("Analysis"))) {
    recommendations.push(...skillRecommendations.data_work.slice(0, 2));
  }
  if (tasks.some(t => t.includes("Customer") || t.includes("Client") || t.includes("support"))) {
    recommendations.push(...skillRecommendations.customer_facing.slice(0, 2));
  }
  if (tasks.some(t => t.includes("Coding") || t.includes("Programming") || t.includes("API"))) {
    recommendations.push(...skillRecommendations.technical.slice(0, 2));
  }
  if (tasks.some(t => t.includes("Driving") || t.includes("Machine") || t.includes("Loading"))) {
    recommendations.push(...skillRecommendations.physical_work.slice(0, 2));
  }
  if (tasks.some(t => t.includes("management") || t.includes("coordination") || t.includes("Team"))) {
    recommendations.push(...skillRecommendations.management.slice(0, 2));
  }

  // Always add general high-automation skills if score is high
  if (finalScore > 60) {
    recommendations.unshift(...skillRecommendations.high_automation.slice(0, 2));
  }

  // Deduplicate and limit to 5
  const uniqueRecs = Array.from(new Set(recommendations)).slice(0, 5);

  // If no recommendations, add defaults
  if (uniqueRecs.length < 3) {
    uniqueRecs.push(
      "AI prompt engineering",
      "Digital literacy",
      "Adaptability & continuous learning"
    );
  }

  return {
    score: finalScore,
    level,
    summary: summaries[level],
    factors: {
      taskRisk: Math.round(avgTaskRisk),
      industryModifier: industryMod,
      experienceModifier: experienceMod + titleMod,
    },
    recommendations: uniqueRecs.slice(0, 5),
    topRiskyTasks,
  };
}
