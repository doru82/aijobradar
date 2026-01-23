"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Building2, 
  Clock, 
  ListTodo, 
  Monitor, 
  Wrench, 
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles
} from "lucide-react";

const INDUSTRIES = [
  "Technology & Software",
  "Finance & Banking",
  "Healthcare & Medical",
  "Education",
  "Retail & E-commerce",
  "Manufacturing",
  "Marketing & Advertising",
  "Legal",
  "Real Estate",
  "Transportation & Logistics",
  "Hospitality & Tourism",
  "Media & Entertainment",
  "Government & Public Sector",
  "Consulting",
  "Other"
];

const EXPERIENCE_LEVELS = [
  { value: 1, label: "0-2 years (Entry level)" },
  { value: 3, label: "3-5 years (Mid level)" },
  { value: 7, label: "6-10 years (Senior)" },
  { value: 12, label: "10+ years (Expert)" }
];

const TECH_USAGE = [
  { value: "minimal", label: "Minimal - Basic computer use" },
  { value: "moderate", label: "Moderate - Daily software tools" },
  { value: "heavy", label: "Heavy - Complex systems & automation" },
  { value: "expert", label: "Expert - Programming & AI tools" }
];

const EDUCATION_LEVELS = [
  "High School",
  "Some College",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Professional Certification",
  "Self-taught / Bootcamp"
];

const POPULAR_SKILLS = [
  "Microsoft Excel", "Data Analysis", "Project Management", 
  "Python", "JavaScript", "SQL", "Communication",
  "Leadership", "Problem Solving", "Customer Service",
  "Sales", "Marketing", "Writing", "Design",
  "Accounting", "Research", "Negotiation", "Public Speaking"
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    industry: "",
    experienceYears: 3,
    jobTasks: "",
    techUsage: "moderate",
    skills: [] as string[],
    educationLevel: "",
    customSkill: ""
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCustomSkill = () => {
    const skill = formData.customSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        customSkill: ""
      }));
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.jobTitle.trim()) {
          setError("Please enter your job title");
          return false;
        }
        if (!formData.industry) {
          setError("Please select your industry");
          return false;
        }
        return true;
      case 2:
        if (!formData.jobTasks.trim()) {
          setError("Please describe your daily tasks");
          return false;
        }
        return true;
      case 3:
        if (formData.skills.length === 0) {
          setError("Please select at least one skill");
          return false;
        }
        if (!formData.educationLevel) {
          setError("Please select your education level");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          industry: formData.industry,
          experienceYears: formData.experienceYears,
          jobTasks: formData.jobTasks,
          techUsage: formData.techUsage,
          skills: formData.skills,
          educationLevel: formData.educationLevel
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save profile");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Welcome, {session.user?.name?.split(" ")[0]}!
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Set Up Your Profile
          </h1>
          <p className="text-gray-400">
            Help us personalize your AI risk assessment in under 60 seconds
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Job Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">About Your Job</h2>
                  <p className="text-gray-400 text-sm">Tell us what you do</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4" />
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => updateForm("jobTitle", e.target.value)}
                  placeholder="e.g. Software Engineer, Marketing Manager, Accountant"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Building2 className="w-4 h-4" />
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateForm("industry", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4" />
                  Years of Experience
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {EXPERIENCE_LEVELS.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateForm("experienceYears", level.value)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        formData.experienceYears === level.value
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900/50 border border-slate-600 text-gray-300 hover:border-emerald-500/50"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Daily Work */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <ListTodo className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Your Daily Work</h2>
                  <p className="text-gray-400 text-sm">What does a typical day look like?</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <ListTodo className="w-4 h-4" />
                  What tasks do you do daily?
                </label>
                <textarea
                  value={formData.jobTasks}
                  onChange={(e) => updateForm("jobTasks", e.target.value)}
                  placeholder="e.g. Writing reports, analyzing data, customer meetings, coding, managing team members, creating presentations..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
                <p className="text-gray-500 text-xs mt-2">
                  This helps our AI understand which parts of your job might be affected by automation
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Monitor className="w-4 h-4" />
                  How much do you use technology?
                </label>
                <div className="space-y-2">
                  {TECH_USAGE.map(tech => (
                    <button
                      key={tech.value}
                      type="button"
                      onClick={() => updateForm("techUsage", tech.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                        formData.techUsage === tech.value
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900/50 border border-slate-600 text-gray-300 hover:border-emerald-500/50"
                      }`}
                    >
                      {tech.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Education */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Wrench className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Skills & Background</h2>
                  <p className="text-gray-400 text-sm">What makes you valuable?</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Wrench className="w-4 h-4" />
                  Your Top Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {POPULAR_SKILLS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.skills.includes(skill)
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900/50 border border-slate-600 text-gray-300 hover:border-emerald-500/50"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                
                {/* Custom skill input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customSkill}
                    onChange={(e) => updateForm("customSkill", e.target.value)}
                    placeholder="Add a custom skill"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm hover:bg-slate-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Selected skills */}
                {formData.skills.length > 0 && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-xs text-emerald-400 mb-2">Selected ({formData.skills.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.map(skill => (
                        <span 
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs cursor-pointer hover:bg-emerald-500/30"
                        >
                          {skill} ×
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <GraduationCap className="w-4 h-4" />
                  Education Level
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => updateForm("educationLevel", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select education level</option>
                  {EDUCATION_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Your data is secure and used only to personalize your experience
        </p>
      </div>
    </div>
  );
}
