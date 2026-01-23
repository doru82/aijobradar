"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Building2,
  Clock,
  ListTodo,
  Monitor,
  Wrench,
  GraduationCap,
  MapPin,
  Bell,
  Save,
  ArrowLeft,
  Loader2,
  Check,
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
  "Other",
];

const EXPERIENCE_LEVELS = [
  { value: 1, label: "0-2 years" },
  { value: 3, label: "3-5 years" },
  { value: 7, label: "6-10 years" },
  { value: 12, label: "10+ years" },
];

const TECH_USAGE = [
  { value: "minimal", label: "Minimal - Basic computer use" },
  { value: "moderate", label: "Moderate - Daily software tools" },
  { value: "heavy", label: "Heavy - Complex systems & automation" },
  { value: "expert", label: "Expert - Programming & AI tools" },
];

const EDUCATION_LEVELS = [
  "High School",
  "Some College",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Professional Certification",
  "Self-taught / Bootcamp",
];

const POPULAR_SKILLS = [
  "Microsoft Excel", "Data Analysis", "Project Management",
  "Python", "JavaScript", "SQL", "Communication",
  "Leadership", "Problem Solving", "Customer Service",
  "Sales", "Marketing", "Writing", "Design",
  "Accounting", "Research", "Negotiation", "Public Speaking",
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    jobTitle: "",
    industry: "",
    experienceYears: 3,
    jobTasks: "",
    techUsage: "moderate",
    skills: [] as string[],
    educationLevel: "",
    location: "",
    alertEmail: true,
    alertPush: false,
    customSkill: "",
  });

  // Fetch current profile
  useEffect(() => {
    async function fetchProfile() {
      if (status === "loading") return;
      if (!session) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          setFormData({
            jobTitle: user.jobTitle || "",
            industry: user.industry || "",
            experienceYears: user.experienceYears || 3,
            jobTasks: user.jobTasks || "",
            techUsage: user.techUsage || "moderate",
            skills: user.skills || [],
            educationLevel: user.educationLevel || "",
            location: user.location || "",
            alertEmail: user.alertEmail ?? true,
            alertPush: user.alertPush ?? false,
            customSkill: "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [session, status, router]);

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setError("");
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
    setSaved(false);
  };

  const addCustomSkill = () => {
    const skill = formData.customSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
        customSkill: "",
      }));
      setSaved(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          industry: formData.industry,
          experienceYears: formData.experienceYears,
          jobTasks: formData.jobTasks,
          techUsage: formData.techUsage,
          skills: formData.skills,
          educationLevel: formData.educationLevel,
          location: formData.location,
          alertEmail: formData.alertEmail,
          alertPush: formData.alertPush,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-400">
                Update your information to get better risk assessments
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Job Info Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              Job Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => updateForm("jobTitle", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateForm("industry", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Years of Experience
                </label>
                <select
                  value={formData.experienceYears}
                  onChange={(e) =>
                    updateForm("experienceYears", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <option key={exp.value} value={exp.value}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Daily Tasks
              </label>
              <textarea
                value={formData.jobTasks}
                onChange={(e) => updateForm("jobTasks", e.target.value)}
                rows={3}
                placeholder="Describe your typical daily tasks..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technology Usage
              </label>
              <select
                value={formData.techUsage}
                onChange={(e) => updateForm("techUsage", e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {TECH_USAGE.map((tech) => (
                  <option key={tech.value} value={tech.value}>
                    {tech.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-400" />
              Skills
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {POPULAR_SKILLS.map((skill) => (
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

            <div className="flex gap-2">
              <input
                type="text"
                value={formData.customSkill}
                onChange={(e) => updateForm("customSkill", e.target.value)}
                placeholder="Add custom skill"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCustomSkill())
                }
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

            {formData.skills.length > 0 && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-xs text-emerald-400 mb-2">
                  Selected ({formData.skills.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {formData.skills.map((skill) => (
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

          {/* Education Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              Education
            </h2>

            <select
              value={formData.educationLevel}
              onChange={(e) => updateForm("educationLevel", e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Select education level</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              Notifications
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Weekly email alerts</span>
                <button
                  type="button"
                  onClick={() => updateForm("alertEmail", !formData.alertEmail)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.alertEmail ? "bg-emerald-500" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.alertEmail ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            } disabled:opacity-50`}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}