"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface UserData {
  name: string | null;
  email: string;
  jobTitle: string | null;
  industry: string | null;
  experienceYears: number | null;
  skills: string[];
  educationLevel: string | null;
  techUsage: string | null;
  jobTasks: string | null;
}

interface GeneratePDFReportProps {
  user: UserData;
  riskScore: number;
  isPremium: boolean;
}

export default function GeneratePDFReport({ user, riskScore, isPremium }: GeneratePDFReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "Low", color: [34, 197, 94] };
    if (score < 60) return { level: "Medium", color: [234, 179, 8] };
    if (score < 80) return { level: "High", color: [249, 115, 22] };
    return { level: "Critical", color: [239, 68, 68] };
  };

  const generatePDF = async () => {
    if (!isPremium) return;
    
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const risk = getRiskLevel(riskScore);
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      // Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 45, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("AI Job Radar", 20, 25);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Career Risk Assessment Report", 20, 35);

      // Date
      doc.setFontSize(10);
      doc.text(`Generated: ${today}`, pageWidth - 60, 25);

      // User Info Section
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Profile Summary", 20, 60);

      doc.setDrawColor(229, 231, 235);
      doc.line(20, 65, pageWidth - 20, 65);

      // Profile table
      autoTable(doc, {
        startY: 70,
        head: [],
        body: [
          ["Name", user.name || "Not specified"],
          ["Email", user.email],
          ["Job Title", user.jobTitle || "Not specified"],
          ["Industry", user.industry || "Not specified"],
          ["Experience", user.experienceYears ? `${user.experienceYears} years` : "Not specified"],
          ["Education", user.educationLevel || "Not specified"],
          ["Tech Usage", user.techUsage || "Not specified"],
        ],
        theme: "plain",
        styles: { fontSize: 11, cellPadding: 5 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 50 },
          1: { cellWidth: 120 }
        },
        margin: { left: 20, right: 20 }
      });

      // Risk Score Section
      const riskY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("AI Automation Risk Assessment", 20, riskY);
      
      doc.setDrawColor(229, 231, 235);
      doc.line(20, riskY + 5, pageWidth - 20, riskY + 5);

      // Risk score box
      const boxY = riskY + 15;
      doc.setFillColor(risk.color[0], risk.color[1], risk.color[2]);
      doc.roundedRect(20, boxY, 60, 35, 3, 3, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(`${riskScore}%`, 35, boxY + 22);
      
      doc.setFontSize(10);
      doc.text(risk.level + " Risk", 35, boxY + 30);

      // Risk explanation
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const riskText = getRiskExplanation(riskScore, user.jobTitle || "your job");
      const splitText = doc.splitTextToSize(riskText, 100);
      doc.text(splitText, 90, boxY + 10);

      // Skills Section
      const skillsY = boxY + 50;
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Your Skills", 20, skillsY);
      
      doc.setDrawColor(229, 231, 235);
      doc.line(20, skillsY + 5, pageWidth - 20, skillsY + 5);

      if (user.skills && user.skills.length > 0) {
        autoTable(doc, {
          startY: skillsY + 10,
          head: [["Skill", "AI Resistance"]],
          body: user.skills.map(skill => [
            skill,
            getSkillResistance(skill)
          ]),
          theme: "striped",
          headStyles: { fillColor: [15, 23, 42] },
          styles: { fontSize: 10, cellPadding: 4 },
          margin: { left: 20, right: 20 }
        });
      } else {
        doc.setFontSize(11);
        doc.setTextColor(107, 114, 128);
        doc.text("No skills added yet", 20, skillsY + 15);
      }

      // Recommendations Section
      const recsY = (doc as any).lastAutoTable?.finalY + 20 || skillsY + 30;
      
      // Check if we need a new page
      if (recsY > 240) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("Recommendations", 20, 30);
        doc.setDrawColor(229, 231, 235);
        doc.line(20, 35, pageWidth - 20, 35);
        
        const recommendations = getRecommendations(riskScore, user.industry || "");
        autoTable(doc, {
          startY: 40,
          head: [["#", "Recommendation"]],
          body: recommendations.map((rec, i) => [(i + 1).toString(), rec]),
          theme: "striped",
          headStyles: { fillColor: [15, 23, 42] },
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: { 0: { cellWidth: 15 } },
          margin: { left: 20, right: 20 }
        });
      } else {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("Recommendations", 20, recsY);
        doc.setDrawColor(229, 231, 235);
        doc.line(20, recsY + 5, pageWidth - 20, recsY + 5);
        
        const recommendations = getRecommendations(riskScore, user.industry || "");
        autoTable(doc, {
          startY: recsY + 10,
          head: [["#", "Recommendation"]],
          body: recommendations.map((rec, i) => [(i + 1).toString(), rec]),
          theme: "striped",
          headStyles: { fillColor: [15, 23, 42] },
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: { 0: { cellWidth: 15 } },
          margin: { left: 20, right: 20 }
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `AI Job Radar - Confidential Report | Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save
      const fileName = `AIJobRadar_Report_${user.name?.replace(/\s+/g, "_") || "User"}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={!isPremium || isGenerating}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
        isPremium
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
          : "bg-slate-700 text-slate-400 cursor-not-allowed"
      }`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="w-5 h-5" />
          Download PDF Report
        </>
      )}
    </button>
  );
}

// Helper functions
function getRiskExplanation(score: number, jobTitle: string): string {
  if (score < 30) {
    return `Great news! ${jobTitle} has low automation risk. Your role requires skills that AI currently struggles to replicate.`;
  } else if (score < 60) {
    return `${jobTitle} has moderate automation risk. Some tasks may be automated, but core responsibilities remain human-centric.`;
  } else if (score < 80) {
    return `${jobTitle} faces significant automation risk. Consider developing skills in areas less susceptible to AI replacement.`;
  }
  return `${jobTitle} is at high risk of automation. Immediate action recommended to future-proof your career.`;
}

function getSkillResistance(skill: string): string {
  const highResistance = ["leadership", "negotiation", "creativity", "empathy", "strategic thinking", "public speaking", "management"];
  const mediumResistance = ["project management", "communication", "problem solving", "design", "writing", "research"];
  
  const lowerSkill = skill.toLowerCase();
  
  if (highResistance.some(s => lowerSkill.includes(s))) return "High";
  if (mediumResistance.some(s => lowerSkill.includes(s))) return "Medium";
  return "Variable";
}

function getRecommendations(score: number, industry: string): string[] {
  const base = [
    "Stay updated with AI developments in your industry",
    "Focus on developing uniquely human skills like creativity and emotional intelligence",
    "Build a strong professional network for future opportunities"
  ];

  if (score >= 60) {
    return [
      "Consider upskilling in AI-resistant areas immediately",
      "Explore adjacent roles that leverage your experience but have lower automation risk",
      "Learn to work alongside AI tools to increase your value",
      ...base
    ];
  }
  
  if (score >= 30) {
    return [
      "Identify which parts of your job are most automatable and diversify",
      "Develop expertise in areas that complement AI rather than compete with it",
      ...base
    ];
  }

  return [
    "Continue developing your current skill set",
    "Consider mentoring others to solidify your expertise",
    ...base
  ];
}