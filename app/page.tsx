"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0a0a14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-semibold">AI Job Radar</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <button
            onClick={handleGetStarted}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-all"
          >
            {session ? "Dashboard" : "Get Started Free"}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow delay-500" />

        <div className="mb-6 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium opacity-0 animate-fade-in">
          🚀 Free to use • No credit card required
        </div>

        <div className="opacity-0 animate-scale-in">
          <Logo size={120} />
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold text-center opacity-0 animate-fade-in-up delay-200">
          <span className="text-gradient">Is AI Coming</span>
          <br />
          <span className="text-white">For Your Job?</span>
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-gray-400 text-center max-w-2xl opacity-0 animate-fade-in-up delay-300">
          Get your personalized AI risk score in 60 seconds.
          <br />
          <span className="text-white">Know the threats. Learn the skills. Stay ahead.</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up delay-400">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            Check My Risk Score →
          </button>
          <a
            href="#how-it-works"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-lg transition-all duration-300 text-center"
          >
            See How It Works
          </a>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 opacity-0 animate-fade-in-up delay-500">
          <div className="flex -space-x-2">
            {["👨‍💼", "👩‍💻", "👨‍🔬", "👩‍🏫", "👨‍💻"].map((emoji, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#0a0a14] flex items-center justify-center text-lg">
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Join <span className="text-white font-semibold">2,500+</span> professionals monitoring their AI risk
          </p>
        </div>

        <div className="absolute bottom-8 animate-bounce-slow opacity-0 animate-fade-in delay-700">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-red-950/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The AI Revolution Is <span className="text-red-400">Already Here</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              While you&apos;re reading this, AI is learning to do parts of your job. The question isn&apos;t if it will affect you—it&apos;s when.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-8 text-center border border-red-500/20">
              <div className="text-5xl font-bold text-red-400 mb-2">300M</div>
              <p className="text-gray-400">jobs exposed to AI automation globally</p>
              <p className="text-xs text-gray-600 mt-2">— Goldman Sachs, 2024</p>
            </div>
            <div className="glass rounded-xl p-8 text-center border border-yellow-500/20">
              <div className="text-5xl font-bold text-yellow-400 mb-2">40%</div>
              <p className="text-gray-400">of working hours can be impacted by AI</p>
              <p className="text-xs text-gray-600 mt-2">— McKinsey Research</p>
            </div>
            <div className="glass rounded-xl p-8 text-center border border-orange-500/20">
              <div className="text-5xl font-bold text-orange-400 mb-2">85%</div>
              <p className="text-gray-400">of workers worry about AI taking their jobs</p>
              <p className="text-xs text-gray-600 mt-2">— PwC Global Survey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Personal <span className="text-gradient">AI Career Shield</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stop guessing. Start knowing. Our AI analyzes your specific role and gives you actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon="🎯" title="Personalized Risk Score" description="Get a 0-100 score based on your exact job title, industry, and daily tasks. Not generic—tailored to YOU." />
            <FeatureCard icon="📊" title="Task-Level Analysis" description="See which of your daily tasks are most at risk. Know exactly where to focus your upskilling efforts." />
            <FeatureCard icon="🎓" title="Smart Course Recommendations" description="Get curated courses matched to the skills you need. No more guessing what to learn next." />
            <FeatureCard icon="📡" title="Real-Time Monitoring" description="We track AI developments 24/7. Get alerts when new AI tools threaten your specific role." />
            <FeatureCard icon="📈" title="Industry Insights" description="See how your industry compares. Understand the bigger picture of AI adoption in your field." />
            <FeatureCard icon="🛡️" title="Future-Proof Roadmap" description="Get a personalized action plan to stay relevant. Turn threats into opportunities." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-transparent via-green-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Your Risk Score in <span className="text-gradient">60 Seconds</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three simple steps to understand your AI career risk
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="1" title="Sign Up Free" description="Create your account with Google. No credit card required, no spam—ever." icon="🚀" />
            <StepCard number="2" title="Tell Us About Your Job" description="Enter your job title, industry, and select your daily tasks from our list." icon="📝" />
            <StepCard number="3" title="Get Your Results" description="Instantly see your risk score, vulnerable tasks, and personalized recommendations." icon="🎯" />
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
            >
              Start Free Analysis →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users <span className="text-gradient">Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard quote="I had no idea my data entry tasks were 95% at risk. Now I'm learning Python and my boss already noticed." name="Sarah M." role="Administrative Assistant" avatar="👩‍💼" />
            <TestimonialCard quote="The course recommendations were spot-on. I went from worried to confident in my career path." name="James K." role="Marketing Manager" avatar="👨‍💻" />
            <TestimonialCard quote="Finally, a tool that gives specific advice instead of generic 'learn AI' nonsense. Highly recommend." name="Maria L." role="Financial Analyst" avatar="👩‍🔬" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-transparent via-green-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, <span className="text-gradient">Transparent</span> Pricing
            </h2>
            <p className="text-gray-400">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <PricingCard
              tier="Free"
              price="€0"
              period="/forever"
              features={["Personalized risk score", "Task-level analysis", "Top 5 skill recommendations", "Course recommendations", "Weekly email digest"]}
              cta="Get Started Free"
              highlighted={false}
              onCta={handleGetStarted}
            />
            <PricingCard
              tier="Premium"
              price="€7"
              period="/month"
              features={["Everything in Free, plus:", "Daily AI threat alerts", "Deep analysis with AI insights", "PDF career reports", "Industry comparison", "Priority support"]}
              cta="Coming Soon"
              highlighted={true}
              onCta={() => {}}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            <FaqItem question="How accurate is the risk score?" answer="Our risk score is based on extensive research from McKinsey, Goldman Sachs, and academic studies on AI automation. We analyze your specific tasks against known AI capabilities." isOpen={openFaq === 0} onToggle={() => setOpenFaq(openFaq === 0 ? null : 0)} />
            <FaqItem question="Is my data safe?" answer="Absolutely. We use industry-standard encryption and never sell your data. Your job information is only used to calculate your personal risk score." isOpen={openFaq === 1} onToggle={() => setOpenFaq(openFaq === 1 ? null : 1)} />
            <FaqItem question="Will this actually help me keep my job?" answer="AI Job Radar gives you awareness and direction. By understanding which tasks are at risk, you can proactively upskill and position yourself as someone who works WITH AI." isOpen={openFaq === 2} onToggle={() => setOpenFaq(openFaq === 2 ? null : 2)} />
            <FaqItem question="Why is it free?" answer="We believe everyone deserves to understand their AI risk. Premium features help power users, and course partnerships support our platform." isOpen={openFaq === 3} onToggle={() => setOpenFaq(openFaq === 3 ? null : 3)} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Don&apos;t Wait Until It&apos;s <span className="text-red-400">Too Late</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            The best time to prepare was yesterday. The second best time is now.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-10 py-5 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            Check My Risk Score Free →
          </button>
          <p className="mt-4 text-gray-500 text-sm">Free forever • No credit card • 60 second setup</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-semibold">AI Job Radar</span>
          </div>
          <nav className="flex gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AI Job Radar</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="glass rounded-xl p-6 hover:border-green-500/30 transition-all duration-300 group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: string }) {
  return (
    <div className="glass rounded-xl p-8 group hover:scale-105 transition-all duration-300 relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-8xl font-bold text-green-500/10 group-hover:text-green-500/20 transition-colors">{number}</div>
      <div className="relative">
        <span className="text-4xl mb-4 block">{icon}</span>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, name, role, avatar }: { quote: string; name: string; role: string; avatar: string }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="text-4xl mb-4 text-green-500/50">&quot;</div>
      <p className="text-gray-300 mb-6">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl">{avatar}</div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-gray-500 text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ tier, price, period, features, cta, highlighted, onCta }: { tier: string; price: string; period: string; features: string[]; cta: string; highlighted: boolean; onCta: () => void }) {
  return (
    <div className={`rounded-xl p-8 ${highlighted ? "bg-gradient-to-b from-green-900/50 to-green-950/50 border-2 border-green-500/50 scale-105" : "glass"} transition-all duration-300 hover:scale-105`}>
      {highlighted && <div className="text-green-400 text-sm font-semibold mb-2">MOST POPULAR</div>}
      <h3 className="text-2xl font-bold">{tier}</h3>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-400">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <svg className={`w-5 h-5 flex-shrink-0 ${highlighted ? "text-green-400" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button onClick={onCta} disabled={cta === "Coming Soon"} className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${highlighted ? "bg-green-600 hover:bg-green-500" : "bg-white/10 hover:bg-white/20"} disabled:opacity-50 disabled:cursor-not-allowed`}>
        {cta}
      </button>
    </div>
  );
}

function FaqItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors">
        <span className="font-semibold">{question}</span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-6 pb-4 text-gray-400">{answer}</div>}
    </div>
  );
}
