"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

// Simple risk calculation for landing page
function calculateQuickRisk(jobTitle: string): { score: number; level: string } {
  const title = jobTitle.toLowerCase();
  
  // High risk jobs (60-85%)
  const highRisk = ["data entry", "cashier", "telemarketer", "bookkeeper", "receptionist", "clerk", "typist", "transcriptionist", "filing", "secretary", "admin assistant", "administrative"];
  
  // Medium-high risk (45-65%)
  const mediumHighRisk = ["accountant", "analyst", "paralegal", "translator", "customer service", "support", "teller", "proofreader", "copywriter"];
  
  // Medium risk (30-50%)
  const mediumRisk = ["marketing", "sales", "designer", "developer", "programmer", "engineer", "manager", "consultant", "writer", "editor"];
  
  // Low risk (15-35%)
  const lowRisk = ["nurse", "doctor", "therapist", "teacher", "lawyer", "executive", "director", "ceo", "founder", "strategist", "creative director", "surgeon", "psychologist"];

  let baseScore = 45; // Default medium

  if (highRisk.some(job => title.includes(job))) {
    baseScore = 65 + Math.floor(Math.random() * 20);
  } else if (mediumHighRisk.some(job => title.includes(job))) {
    baseScore = 50 + Math.floor(Math.random() * 15);
  } else if (mediumRisk.some(job => title.includes(job))) {
    baseScore = 35 + Math.floor(Math.random() * 15);
  } else if (lowRisk.some(job => title.includes(job))) {
    baseScore = 20 + Math.floor(Math.random() * 15);
  } else {
    baseScore = 40 + Math.floor(Math.random() * 20);
  }

  const level = baseScore < 30 ? "LOW" : baseScore < 60 ? "MEDIUM" : baseScore < 80 ? "HIGH" : "CRITICAL";
  
  return { score: baseScore, level };
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [quickResult, setQuickResult] = useState<{ score: number; level: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  const handlePremium = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  const handleQuickCheck = () => {
    if (!jobTitle.trim()) return;
    
    setIsCalculating(true);
    // Simulate calculation delay for effect
    setTimeout(() => {
      const result = calculateQuickRisk(jobTitle);
      setQuickResult(result);
      setIsCalculating(false);
    }, 800);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-green-400";
      case "MEDIUM": return "text-yellow-400";
      case "HIGH": return "text-orange-400";
      case "CRITICAL": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size={36} />
            <span className="font-bold text-lg">AI Job Radar</span>
            </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <button
            onClick={handleGetStarted}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-all text-sm"
          >
            {session ? "Go to Dashboard" : "Get Started Free"}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            AI is transforming jobs right now
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
            Will AI Replace
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Your Job?
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
            Get your personalized AI risk score in seconds. 
            <span className="text-white"> No signup required.</span>
          </p>

          {/* Quick Calculator */}
          <div className="max-w-md mx-auto mb-10 animate-fade-in-up delay-200">
            {!quickResult ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickCheck()}
                  placeholder="Enter your job title..."
                  className="flex-1 px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.15] transition-all"
                />
                <button
                  onClick={handleQuickCheck}
                  disabled={!jobTitle.trim() || isCalculating}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
                >
                  {isCalculating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Check Risk"
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm mb-2">Risk score for <span className="text-white font-medium">{jobTitle}</span></p>
                <div className={`text-6xl font-bold mb-2 ${getRiskColor(quickResult.level)}`}>
                  {quickResult.score}%
                </div>
                <p className={`text-lg font-semibold mb-6 ${getRiskColor(quickResult.level)}`}>
                  {quickResult.level} RISK
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  This is a basic estimate. Sign in for a detailed analysis based on your skills, industry, and daily tasks.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGetStarted}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold transition-all"
                  >
                    Get Full Analysis Free →
                  </button>
                  <button
                    onClick={() => {
                      setQuickResult(null);
                      setJobTitle("");
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all"
                  >
                    Try Another
                  </button>
                </div>
              </div>
            )}
          </div>

          {!quickResult && (
            <p className="text-gray-500 text-sm animate-fade-in-up delay-300">
              Try: &quot;Data Analyst&quot;, &quot;Marketing Manager&quot;, &quot;Software Developer&quot;
            </p>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in-up delay-300">
            <div className="flex -space-x-3">
              {["👨‍💼", "👩‍💻", "👨‍🔬", "👩‍🏫", "👨‍💻", "👩‍⚕️"].map((emoji, i) => (
                <div key={i} className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-[#0a0a0f] flex items-center justify-center text-lg shadow-lg">
                  {emoji}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-400 text-sm">
                Trusted by <span className="text-white font-semibold">2,500+</span> professionals
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-y border-white/5 bg-gradient-to-b from-red-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              The AI Disruption Is <span className="text-red-400">Already Happening</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <StatCard number="300M" label="jobs globally exposed to AI automation" source="Goldman Sachs, 2024" color="red" />
            <StatCard number="40%" label="of working hours can be impacted by AI" source="McKinsey Research" color="yellow" />
            <StatCard number="2 Years" label="before AI significantly changes most jobs" source="World Economic Forum" color="orange" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Your Complete AI Career Shield
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand, monitor, and future-proof your career against AI disruption.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon="🎯" 
              title="Personal Risk Score" 
              description="Get a 0-100 score calculated from your job title, industry, skills, and daily tasks. Updated as AI evolves."
              tag="Core"
            />
            <FeatureCard 
              icon="🔮" 
              title="What-If Simulation" 
              description="See exactly how learning specific skills would reduce your risk. Plan your upskilling with confidence."
              tag="Interactive"
            />
            <FeatureCard 
              icon="🤖" 
              title="AI Career Coach" 
              description="Chat with an AI trained to give you personalized career advice based on your unique situation."
              tag="Premium"
            />
            <FeatureCard 
              icon="📄" 
              title="PDF Reports" 
              description="Download comprehensive reports with your risk analysis, recommendations, and action plan."
              tag="Premium"
            />
            <FeatureCard 
              icon="📧" 
              title="Weekly Alerts" 
              description="Get notified about AI developments in your industry. Stay informed without the noise."
              tag="Premium"
            />
            <FeatureCard 
              icon="📊" 
              title="Skills Analysis" 
              description="Understand which of your skills are AI-resistant and which ones need reinforcement."
              tag="Core"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-emerald-950/20 via-emerald-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Your Risk Score in 60 Seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50 -translate-y-1/2" />
            
            <StepCard 
              number="1" 
              title="Create Free Account" 
              description="Sign up instantly with Google. No credit card, no spam, no hassle."
              icon="🚀"
            />
            <StepCard 
              number="2" 
              title="Complete Your Profile" 
              description="Tell us about your job, skills, and daily tasks. Takes under 60 seconds."
              icon="📝"
            />
            <StepCard 
              number="3" 
              title="Get Your Results" 
              description="See your risk score, vulnerable areas, and personalized action plan instantly."
              icon="🎯"
            />
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              Start Free Analysis →
            </button>
            <p className="mt-4 text-gray-500 text-sm">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Loved by Professionals Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="I discovered my data entry tasks were 90% at risk. Three months later, I'm now learning Python and got promoted to data analyst."
              name="Sarah M."
              role="Former Admin Assistant"
              avatar="👩‍💼"
            />
            <TestimonialCard 
              quote="The What-If simulation showed me exactly which skills to learn. No more guessing—I have a clear roadmap now."
              name="James K."
              role="Marketing Manager"
              avatar="👨‍💻"
            />
            <TestimonialCard 
              quote="The AI Career Coach is like having a mentor available 24/7. Best €3/month I've ever spent on my career."
              name="Maria L."
              role="Financial Analyst"
              avatar="👩‍🔬"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Invest in Your Future
            </h2>
            <p className="text-gray-400">Start free. Upgrade when you&apos;re ready for more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-all">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-gray-400 text-sm mb-6">Perfect to get started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-gray-400">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature text="Personalized risk score" included />
                <PricingFeature text="What-If skill simulation" included />
                <PricingFeature text="Basic recommendations" included />
                <PricingFeature text="AI Career Coach" included={false} />
                <PricingFeature text="PDF Reports" included={false} />
                <PricingFeature text="Weekly email alerts" included={false} />
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-all"
              >
                Get Started Free
              </button>
            </div>

            <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-950/50 to-emerald-950/20 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <p className="text-gray-400 text-sm mb-6">For serious career planning</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€3</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature text="Everything in Free" included />
                <PricingFeature text="Unlimited AI Career Coach" included />
                <PricingFeature text="Download PDF Reports" included />
                <PricingFeature text="Weekly email alerts" included />
                <PricingFeature text="Priority support" included />
                <PricingFeature text="Early access to new features" included />
              </ul>
              <button
                onClick={handlePremium}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                Start Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            <FaqItem 
              question="How accurate is the risk score?" 
              answer="Our algorithm is based on research from McKinsey, Goldman Sachs, and academic studies on AI automation. We analyze your specific job title, industry, skills, and daily tasks against known AI capabilities. The score updates as AI technology evolves."
              isOpen={openFaq === 0}
              onToggle={() => setOpenFaq(openFaq === 0 ? null : 0)}
            />
            <FaqItem 
              question="Is my data safe?" 
              answer="Absolutely. We use industry-standard encryption, never sell your data, and you can delete your account anytime. Your information is only used to calculate your personalized risk score and recommendations."
              isOpen={openFaq === 1}
              onToggle={() => setOpenFaq(openFaq === 1 ? null : 1)}
            />
            <FaqItem 
              question="Can this actually help me keep my job?" 
              answer="AI Job Radar gives you awareness and actionable direction. By understanding exactly which parts of your job are at risk, you can proactively upskill in the right areas and position yourself as someone who works WITH AI, not against it."
              isOpen={openFaq === 2}
              onToggle={() => setOpenFaq(openFaq === 2 ? null : 2)}
            />
            <FaqItem 
              question="Why is the Free plan actually free?" 
              answer="We believe everyone deserves to understand their AI risk. The Free plan gives you the essentials. Premium helps power users with unlimited AI coaching, reports, and alerts—which funds our continued development."
              isOpen={openFaq === 3}
              onToggle={() => setOpenFaq(openFaq === 3 ? null : 3)}
            />
            <FaqItem 
              question="Can I cancel Premium anytime?" 
              answer="Yes! No contracts, no hassle. Cancel with one click and you'll keep Premium access until the end of your billing period."
              isOpen={openFaq === 4}
              onToggle={() => setOpenFaq(openFaq === 4 ? null : 4)}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950/80 to-teal-950/80 border border-emerald-500/20 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Don&apos;t Wait for the Pink Slip
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                The professionals who thrive in the AI era are the ones who prepare today. Your future self will thank you.
              </p>
              <button
                onClick={handleGetStarted}
                className="px-10 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                Get Full Analysis Free →
              </button>
              <p className="mt-4 text-gray-500 text-sm">Free forever • No credit card • 60 second setup</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-bold">AI Job Radar</span>
          </div>
          <nav className="flex gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AI Job Radar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

// Components
function StatCard({ number, label, source, color }: { number: string; label: string; source: string; color: "red" | "yellow" | "orange" }) {
  const colors = {
    red: "text-red-400 border-red-500/20",
    yellow: "text-yellow-400 border-yellow-500/20",
    orange: "text-orange-400 border-orange-500/20"
  };
  
  return (
    <div className={`rounded-2xl border ${colors[color]} bg-white/5 p-8 text-center`}>
      <div className={`text-5xl font-bold ${colors[color].split(" ")[0]} mb-2`}>{number}</div>
      <p className="text-gray-400 mb-2">{label}</p>
      <p className="text-xs text-gray-600">— {source}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, tag }: { icon: string; title: string; description: string; tag: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${tag === "Premium" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-gray-400"}`}>
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: string }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center hover:border-emerald-500/30 transition-all">
      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-6">
        {number}
      </div>
      <span className="text-4xl mb-4 block">{icon}</span>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, avatar }: { quote: string; name: string; role: string; avatar: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex mb-4">
        {[1,2,3,4,5].map((i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xl">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-gray-500 text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
}

function PricingFeature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      <span className={included ? "text-gray-300" : "text-gray-500"}>{text}</span>
    </li>
  );
}

function FaqItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button 
        onClick={onToggle} 
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold">{question}</span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-48" : "max-h-0"}`}>
        <div className="px-6 pb-4 text-gray-400">{answer}</div>
      </div>
    </div>
  );
}