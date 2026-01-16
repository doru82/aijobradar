"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const industries = [
  "Marketing & Advertising",
  "Software Development",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Legal",
  "Customer Service",
  "Human Resources",
  "Sales",
  "Manufacturing",
  "Media & Entertainment",
  "Real Estate",
  "Consulting",
  "Retail",
  "Transportation & Logistics",
  "Other",
];

const tasksByIndustry: Record<string, string[]> = {
  "Transportation & Logistics": [
    "Driving/Operating vehicles",
    "Route planning & navigation",
    "Loading/Unloading cargo",
    "Vehicle maintenance checks",
    "Delivery scheduling",
    "Customer communication",
    "Documentation/Paperwork",
    "Fuel management",
    "Safety inspections",
    "GPS/Fleet tracking",
    "Warehouse operations",
    "Inventory management",
  ],
  "Manufacturing": [
    "Machine operation",
    "Quality control/Inspection",
    "Assembly line work",
    "Equipment maintenance",
    "Safety monitoring",
    "Inventory tracking",
    "Documentation/Reporting",
    "Material handling",
    "Process optimization",
    "Team coordination",
  ],
  "Healthcare": [
    "Patient care",
    "Medical documentation",
    "Appointment scheduling",
    "Medication management",
    "Lab work/Testing",
    "Patient communication",
    "Insurance processing",
    "Medical records management",
    "Equipment sterilization",
    "Health assessments",
  ],
  "Retail": [
    "Customer service",
    "Cash register/POS operation",
    "Inventory management",
    "Product stocking",
    "Visual merchandising",
    "Sales assistance",
    "Order processing",
    "Returns handling",
    "Store opening/closing",
    "Price tagging",
  ],
  "Customer Service": [
    "Answering customer inquiries",
    "Processing orders/requests",
    "Handling complaints",
    "Live chat support",
    "Phone support",
    "Email support",
    "Ticket management",
    "Product troubleshooting",
    "Refund processing",
    "Customer follow-ups",
  ],
  "Marketing & Advertising": [
    "Writing content/copy",
    "Social media management",
    "Campaign planning",
    "Data analysis",
    "Graphic design",
    "Video editing",
    "Email marketing",
    "SEO optimization",
    "Market research",
    "Brand management",
    "Ad creation",
    "Performance reporting",
  ],
  "Software Development": [
    "Coding/Programming",
    "Code review",
    "Testing/QA",
    "Documentation",
    "Bug fixing",
    "System design",
    "Database management",
    "API development",
    "DevOps/Deployment",
    "Technical support",
    "Project planning",
    "Team collaboration",
  ],
  "Finance & Banking": [
    "Financial analysis",
    "Data entry",
    "Report generation",
    "Account management",
    "Transaction processing",
    "Compliance checks",
    "Risk assessment",
    "Customer communication",
    "Bookkeeping",
    "Auditing",
    "Investment research",
    "Budget planning",
  ],
  "Education": [
    "Teaching/Instruction",
    "Curriculum planning",
    "Grading/Assessment",
    "Student communication",
    "Parent meetings",
    "Administrative tasks",
    "Research",
    "Material preparation",
    "Exam creation",
    "Progress tracking",
  ],
  "Legal": [
    "Document review",
    "Legal research",
    "Contract drafting",
    "Client communication",
    "Case preparation",
    "Filing/Documentation",
    "Court appearances",
    "Compliance review",
    "Negotiation",
    "Billing/Invoicing",
  ],
  "Human Resources": [
    "Recruitment/Hiring",
    "Employee onboarding",
    "Payroll processing",
    "Benefits administration",
    "Performance reviews",
    "Training coordination",
    "Policy documentation",
    "Employee relations",
    "Compliance management",
    "Data entry",
  ],
  "Sales": [
    "Lead generation",
    "Client meetings",
    "Proposal writing",
    "Negotiation",
    "CRM management",
    "Sales reporting",
    "Cold calling/Outreach",
    "Product demonstrations",
    "Contract processing",
    "Customer follow-ups",
  ],
  "Real Estate": [
    "Property showings",
    "Client communication",
    "Market research",
    "Listing management",
    "Contract preparation",
    "Negotiation",
    "Documentation/Paperwork",
    "Photography/Staging",
    "Lead generation",
    "Open house coordination",
  ],
  "Media & Entertainment": [
    "Content creation",
    "Video editing",
    "Audio editing",
    "Script writing",
    "Social media management",
    "Research",
    "Interviewing",
    "Project coordination",
    "Equipment operation",
    "Post-production",
  ],
  "Consulting": [
    "Client meetings",
    "Research & analysis",
    "Report writing",
    "Presentation creation",
    "Data analysis",
    "Strategy development",
    "Project management",
    "Stakeholder communication",
    "Process improvement",
    "Documentation",
  ],
  "Other": [
    "Writing content/copy",
    "Data entry",
    "Data analysis",
    "Customer support",
    "Email management",
    "Scheduling/Calendar management",
    "Research",
    "Report generation",
    "Documentation",
    "Team communication",
    "Problem solving",
    "Project coordination",
  ],
};

// Universal tasks that apply to most jobs
const universalTasks = [
  "Email management",
  "Documentation/Paperwork",
  "Team communication",
  "Scheduling",
  "Problem solving",
];

export default function ProfileSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    industry: "",
    yearsInRole: "",
    tasks: [] as string[],
    customTask: "",
  });

  const toggleTask = (task: string) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.includes(task)
        ? prev.tasks.filter((t) => t !== task)
        : [...prev.tasks, task],
    }));
  };

  const addCustomTask = () => {
    if (formData.customTask.trim() && !formData.tasks.includes(formData.customTask.trim())) {
      setFormData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, prev.customTask.trim()],
        customTask: "",
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Save profile
      const profileResponse = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          company: formData.company,
          industry: formData.industry,
          yearsInRole: parseInt(formData.yearsInRole) || 0,
          jobTasks: formData.tasks,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to save profile");
      }

      // 2. Calculate risk score
      const riskResponse = await fetch("/api/risk", {
        method: "POST",
      });

      if (!riskResponse.ok) {
        console.error("Failed to calculate risk score");
      }

      // 3. Redirect to dashboard
      router.push("/dashboard?setup=complete");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Background effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={60} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Set Up Your Profile</h1>
          <p className="text-gray-400">
            Tell us about your job so we can monitor AI threats specific to you.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? "w-8 bg-green-500" : s < step ? "w-8 bg-green-500/50" : "w-8 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="glass rounded-xl p-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Marketing Manager, Software Developer"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company (optional)
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Google, Freelance"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                >
                  <option value="" className="bg-gray-900">Select your industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-gray-900">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Years in this role *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsInRole}
                  onChange={(e) => setFormData({ ...formData, yearsInRole: e.target.value })}
                  placeholder="e.g. 3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.jobTitle || !formData.industry || !formData.yearsInRole}
              className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Daily Tasks */}
        {step === 2 && (
          <div className="glass rounded-xl p-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-2">Your Daily Tasks</h2>
            <p className="text-gray-400 text-sm mb-6">
              Select all tasks that you regularly perform as a <span className="text-green-400">{formData.jobTitle}</span>. This helps us assess AI automation risk.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[...(tasksByIndustry[formData.industry] || tasksByIndustry["Other"]), ...universalTasks]
                .filter((task, index, self) => self.indexOf(task) === index) // Remove duplicates
                .map((task) => (
                <button
                  key={task}
                  onClick={() => toggleTask(task)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    formData.tasks.includes(task)
                      ? "bg-green-600/30 border-green-500 text-green-300"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                  }`}
                >
                  {formData.tasks.includes(task) ? "✓ " : ""}{task}
                </button>
              ))}
            </div>

            {/* Custom task input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={formData.customTask}
                onChange={(e) => setFormData({ ...formData, customTask: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addCustomTask()}
                placeholder="Add a custom task..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500 text-sm"
              />
              <button
                onClick={addCustomTask}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
              >
                Add
              </button>
            </div>

            {/* Selected count */}
            <p className="text-sm text-gray-400 mb-4">
              {formData.tasks.length} task{formData.tasks.length !== 1 ? "s" : ""} selected
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={formData.tasks.length === 0}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="glass rounded-xl p-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Review Your Profile</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-gray-400">Job Title</span>
                <span className="font-medium">{formData.jobTitle}</span>
              </div>
              {formData.company && (
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Company</span>
                  <span className="font-medium">{formData.company}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-gray-400">Industry</span>
                <span className="font-medium">{formData.industry}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-gray-400">Experience</span>
                <span className="font-medium">{formData.yearsInRole} years</span>
              </div>
              <div className="py-3">
                <span className="text-gray-400 block mb-2">Daily Tasks ({formData.tasks.length})</span>
                <div className="flex flex-wrap gap-2">
                  {formData.tasks.map((task) => (
                    <span
                      key={task}
                      className="px-2 py-1 bg-green-600/20 text-green-400 text-sm rounded"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-800 rounded-lg font-semibold transition-all"
              >
                {isSubmitting ? "Saving..." : "Complete Setup ✓"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
