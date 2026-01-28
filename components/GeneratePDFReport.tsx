"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getRecommendedCourses } from "@/lib/courses";

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

      // Recommended Courses Section
      const coursesY = (doc as any).lastAutoTable?.finalY + 20 || recsY + 60;
      
      // Check if we need a new page for courses
      if (coursesY > 220) {
        doc.addPage();
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("Recommended Courses", 20, 30);
        doc.setDrawColor(229, 231, 235);
        doc.line(20, 35, pageWidth - 20, 35);

        const courses = getRecommendedCourses(user.industry, user.skills, riskScore);
        autoTable(doc, {
          startY: 40,
          head: [["Course", "Level", "Why It Helps"]],
          body: courses.map(course => [
            course.title,
            course.level.charAt(0).toUpperCase() + course.level.slice(1),
            course.skills.slice(0, 2).join(", ")
          ]),
          theme: "striped",
          headStyles: { fillColor: [16, 185, 129] },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: { 
            0: { cellWidth: 80 },
            1: { cellWidth: 25 },
            2: { cellWidth: 65 }
          },
          margin: { left: 20, right: 20 }
        });

        // Course links note
        const linksY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text("Visit aijobradar.io/dashboard for direct links to these courses", 20, linksY);
      } else {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("Recommended Courses", 20, coursesY);
        doc.setDrawColor(229, 231, 235);
        doc.line(20, coursesY + 5, pageWidth - 20, coursesY + 5);

        const courses = getRecommendedCourses(user.industry, user.skills, riskScore);
        autoTable(doc, {
          startY: coursesY + 10,
          head: [["Course", "Level", "Why It Helps"]],
          body: courses.map(course => [
            course.title,
            course.level.charAt(0).toUpperCase() + course.level.slice(1),
            course.skills.slice(0, 2).join(", ")
          ]),
          theme: "striped",
          headStyles: { fillColor: [16, 185, 129] },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: { 
            0: { cellWidth: 80 },
            1: { cellWidth: 25 },
            2: { cellWidth: 65 }
          },
          margin: { left: 20, right: 20 }
        });

        // Course links note
        const linksY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text("Visit aijobradar.io/dashboard for direct links to these courses", 20, linksY);
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