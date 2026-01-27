export interface Course {
  id: string;
  title: string;
  description: string;
  affiliateUrl: string;
  category: string[];
  skills: string[];
  industries: string[];
  level: "beginner" | "intermediate" | "advanced";
  rating: number;
  students: string;
}

export const courses: Course[] = [
  {
    id: "python-100-days",
    title: "100 Days of Code - The Complete Python Pro Bootcamp",
    description: "Master Python by building 100 projects in 100 days. Learn data science, automation, web development, and more.",
    affiliateUrl: "https://trk.udemy.com/nXDz1o",
    category: ["programming", "data"],
    skills: ["Python", "Data Analysis", "Automation", "Web Development"],
    industries: ["Technology & Software", "Finance & Banking", "Consulting", "Other"],
    level: "beginner",
    rating: 4.7,
    students: "1.5M+",
  },
  {
    id: "machine-learning",
    title: "Machine Learning A-Z: AI, Python & R",
    description: "Learn to create Machine Learning algorithms in Python and R. Includes deep learning and AI fundamentals.",
    affiliateUrl: "https://trk.udemy.com/OeGJRz",
    category: ["ai", "data"],
    skills: ["Machine Learning", "Python", "Data Science", "AI"],
    industries: ["Technology & Software", "Finance & Banking", "Healthcare & Medical", "Consulting"],
    level: "intermediate",
    rating: 4.5,
    students: "900K+",
  },
  {
    id: "chatgpt-guide",
    title: "ChatGPT Complete Guide: Learn Generative AI & Prompt Engineering",
    description: "Master ChatGPT, prompt engineering, and AI tools. Boost productivity and future-proof your career.",
    affiliateUrl: "https://trk.udemy.com/2an3rg",
    category: ["ai", "productivity"],
    skills: ["AI Prompt Engineering", "ChatGPT", "Automation", "Productivity"],
    industries: ["Technology & Software", "Marketing & Advertising", "Education", "Consulting", "Other"],
    level: "beginner",
    rating: 4.6,
    students: "500K+",
  },
  {
    id: "excel-advanced",
    title: "Microsoft Excel - From Beginner to Advanced",
    description: "Master Excel with this comprehensive course. Learn formulas, pivot tables, macros, and data analysis.",
    affiliateUrl: "https://trk.udemy.com/RGJXya",
    category: ["productivity", "data"],
    skills: ["Microsoft Excel", "Data Analysis", "Reporting", "Automation"],
    industries: ["Finance & Banking", "Consulting", "Retail & E-commerce", "Manufacturing", "Other"],
    level: "beginner",
    rating: 4.7,
    students: "1.2M+",
  },
  {
    id: "sql-bootcamp",
    title: "The Complete SQL Bootcamp: Go from Zero to Hero",
    description: "Become an expert at SQL. Learn PostgreSQL, data analysis, and database management.",
    affiliateUrl: "https://trk.udemy.com/yqG5Rv",
    category: ["programming", "data"],
    skills: ["SQL", "Data Analysis", "Database Management", "PostgreSQL"],
    industries: ["Technology & Software", "Finance & Banking", "Retail & E-commerce", "Healthcare & Medical"],
    level: "beginner",
    rating: 4.7,
    students: "800K+",
  },
  {
    id: "digital-marketing",
    title: "The Complete Digital Marketing Course",
    description: "Master digital marketing: SEO, social media marketing, analytics, and more. 12 courses in 1.",
    affiliateUrl: "https://trk.udemy.com/mOxBgq",
    category: ["marketing"],
    skills: ["Digital Marketing", "SEO", "Social Media", "Analytics", "Content Marketing"],
    industries: ["Marketing & Advertising", "Retail & E-commerce", "Media & Entertainment", "Other"],
    level: "beginner",
    rating: 4.5,
    students: "700K+",
  },
];

// Get recommended courses based on user profile
export function getRecommendedCourses(
  industry?: string | null,
  skills?: string[] | null,
  riskScore?: number
): Course[] {
  let recommended = [...courses];

  // Prioritize AI/prompt engineering courses for high risk scores
  if (riskScore && riskScore > 50) {
    recommended.sort((a, b) => {
      const aIsAI = a.category.includes("ai") ? 1 : 0;
      const bIsAI = b.category.includes("ai") ? 1 : 0;
      return bIsAI - aIsAI;
    });
  }

  // Filter by industry if provided
  if (industry) {
    const industryMatches = recommended.filter((c) =>
      c.industries.some((i) => i.toLowerCase().includes(industry.toLowerCase()))
    );
    if (industryMatches.length > 0) {
      recommended = industryMatches;
    }
  }

  // Boost courses that don't overlap with existing skills
  if (skills && skills.length > 0) {
    recommended.sort((a, b) => {
      const aOverlap = a.skills.filter((s) =>
        skills.some((us) => us.toLowerCase().includes(s.toLowerCase()))
      ).length;
      const bOverlap = b.skills.filter((s) =>
        skills.some((us) => us.toLowerCase().includes(s.toLowerCase()))
      ).length;
      return aOverlap - bOverlap; // Less overlap = higher priority
    });
  }

  return recommended.slice(0, 3); // Return top 3
}

// Get all courses for a specific category
export function getCoursesByCategory(category: string): Course[] {
  return courses.filter((c) => c.category.includes(category));
}