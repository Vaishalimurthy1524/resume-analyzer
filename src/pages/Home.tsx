import { Link } from "react-router-dom";
import {
  Sparkles,
  FileText,
  BarChart3,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "ATS Compatibility Check",
    description: "See how your resume performs against Applicant Tracking Systems used by top companies.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description: "Identify missing skills and get recommendations to strengthen your profile.",
  },
  {
    icon: Shield,
    title: "Formatting Review",
    description: "Ensure your resume follows industry best practices for formatting and structure.",
  },
  {
    icon: Zap,
    title: "Instant AI Feedback",
    description: "Get comprehensive analysis and actionable recommendations in seconds.",
  },
];

const steps = [
  { step: "01", title: "Upload Resume", description: "Drag & drop or select your PDF resume file" },
  { step: "02", title: "AI Analysis", description: "Our AI parses and evaluates every section" },
  { step: "03", title: "Get Results", description: "Review scores, strengths, and improvements" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    text: "ResumeAI helped me identify weak points I never noticed. Got 3x more interview calls after making the suggested changes.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Meta",
    text: "The ATS compatibility check was a game-changer. I had no idea my resume was being filtered out by automated systems.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Data Scientist at Amazon",
    text: "Clean interface, instant feedback, and truly actionable recommendations. This tool is a must for job seekers.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Analysis
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Optimize Your Resume
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                with AI Intelligence
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
              Get instant, professional feedback on your resume. Identify weaknesses,
              improve ATS compatibility, and land more interviews.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/analyze"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-3.5 text-lg font-semibold text-white shadow-xl shadow-primary-600/25 transition-all hover:shadow-2xl hover:shadow-primary-600/30"
              >
                <FileText className="h-5 w-5" />
                Analyze Your Resume
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-white/10 px-8 py-3.5 text-lg font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/5"
              >
                Learn More
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                No signup required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Instant results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything You Need</h2>
            <p className="mt-3 text-gray-400">
              Comprehensive analysis covering every aspect of your resume
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-primary-500/30 hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 transition-colors group-hover:bg-primary-500/20">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mt-3 text-gray-400">Three simple steps to optimize your resume</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-bold">
                  {s.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-gray-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What Users Say</h2>
            <p className="mt-3 text-gray-400">
              Trusted by thousands of job seekers worldwide
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-300">"{t.text}"</p>
                <div className="mt-6">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Boost Your Resume?
          </h2>
          <p className="mt-4 text-gray-400">
            Join thousands of job seekers who improved their resumes with ResumeAI
          </p>
          <Link
            to="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-3.5 text-lg font-semibold text-white shadow-xl shadow-primary-600/25 transition-all hover:shadow-2xl"
          >
            <FileText className="h-5 w-5" />
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} ResumeAI. Built with AI intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
