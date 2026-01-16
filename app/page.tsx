"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Connect to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-semibold">AI Job Radar</span>
          </div>
          {session ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-all"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow delay-500" />

        {/* Logo */}
        <div className="opacity-0 animate-scale-in">
          <Logo size={150} />
        </div>

        {/* Title */}
        <h1 className="mt-8 text-5xl md:text-7xl font-bold text-center opacity-0 animate-fade-in-up delay-200">
          <span className="text-gradient">AI Job Radar</span>
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-xl md:text-2xl text-gray-400 text-center max-w-2xl opacity-0 animate-fade-in-up delay-300">
          Know <span className="text-white font-semibold">before</span> it&apos;s too late.
          <br />
          Monitor AI threats to your career in real-time.
        </p>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-0 animate-fade-in-up delay-400">
          <StatCard value="80%" label="of workers anxious about AI" color="text-red-400" />
          <StatCard value="12%" label="actively preparing" color="text-yellow-400" />
          <StatCard value="NOW" label="time to act" color="text-green-400" />
        </div>

        {/* Email Capture */}
        <div className="mt-12 w-full max-w-md opacity-0 animate-fade-in-up delay-500">
          {submitted ? (
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-semibold text-green-400">You&apos;re on the list!</h3>
              <p className="text-gray-400 mt-2">We&apos;ll notify you when we launch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-xl p-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Get early access
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-800 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                >
                  {isSubmitting ? "..." : "Join"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce-slow opacity-0 animate-fade-in delay-700">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Three simple steps to protect your career from AI disruption
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Tell us your job"
              description="Enter your role, industry, and daily tasks. We'll create a personalized risk profile."
              icon="📝"
            />
            <StepCard
              number="2"
              title="We monitor AI news"
              description="Our system tracks AI developments, product launches, and automation trends 24/7."
              icon="📡"
            />
            <StepCard
              number="3"
              title="Get actionable alerts"
              description="Receive personalized warnings and specific upskilling recommendations before it's too late."
              icon="🚨"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-green-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-gray-400 text-center mb-16">
            Start free. Upgrade when you need more.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <PricingCard
              tier="Free"
              price="€0"
              period="/forever"
              features={[
                "Weekly risk alerts",
                "Basic risk score (0-100)",
                "Top 3 skills to learn",
                "Email notifications",
              ]}
              cta="Get Started"
              highlighted={false}
            />
            <PricingCard
              tier="Premium"
              price="€7"
              period="/month"
              features={[
                "Daily risk alerts",
                "AI-powered deep analysis",
                "LinkedIn integration",
                "PDF reports",
                "Priority support",
                "Custom alert rules",
              ]}
              cta="Coming Soon"
              highlighted={true}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-semibold">AI Job Radar</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AI Job Radar. Protecting careers from automation.
          </p>
        </div>
      </footer>
    </main>
  );
}

// Component: Stat Card
function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-6 text-center min-w-[140px] glass-hover hover:scale-105 transition-all duration-300">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

// Component: Step Card
function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="glass rounded-xl p-8 glass-hover group hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{icon}</span>
        <span className="text-5xl font-bold text-green-500/20 group-hover:text-green-500/40 transition-colors">
          {number}
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

// Component: Pricing Card
function PricingCard({
  tier,
  price,
  period,
  features,
  cta,
  highlighted,
}: {
  tier: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-8 ${
        highlighted
          ? "bg-gradient-to-b from-green-900/50 to-green-950/50 border-2 border-green-500/50 scale-105"
          : "glass"
      } glass-hover transition-all duration-300 hover:scale-105`}
    >
      {highlighted && (
        <div className="text-green-400 text-sm font-semibold mb-2">RECOMMENDED</div>
      )}
      <h3 className="text-2xl font-bold">{tier}</h3>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-400">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${highlighted ? "text-green-400" : "text-gray-400"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
          highlighted
            ? "bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25"
            : "bg-white/10 hover:bg-white/20"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
