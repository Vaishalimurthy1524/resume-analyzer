import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  User,
  MessageSquare,
  Shield,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { AnalysisResult } from "../types";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "from-green-500/20 to-green-600/10 border-green-500/30";
  if (score >= 60) return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
  if (score >= 40) return "from-orange-500/20 to-orange-600/10 border-orange-500/30";
  return "from-red-500/20 to-red-600/10 border-red-500/30";
}

function getScoreRing(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function getPriorityColor(p: string): string {
  if (p === "high") return "bg-red-500/10 text-red-400 border-red-500/30";
  if (p === "medium") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  return "bg-blue-500/10 text-blue-400 border-blue-500/30";
}

const SECTION_ICONS: Record<string, typeof FileText> = {
  "Contact Information": User,
  "Professional Summary": MessageSquare,
  "Work Experience": Briefcase,
  Education: GraduationCap,
  Skills: Wrench,
};

function ScoreCircle({ score, size = 160 }: { score: number; size?: number }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/5"
        />
        <circle
          cx="64"
          cy="64"
          r="60"
          fill="none"
          stroke={getScoreRing(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-500">out of 100</span>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overall"])
  );

  useEffect(() => {
    const data = sessionStorage.getItem("analysisResult");
    if (!data) {
      navigate("/analyze");
      return;
    }
    setResult(JSON.parse(data));
  }, [navigate]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (!result) return null;

  const radarData = result.scores.map((s) => ({
    category: s.category.split(" ")[0],
    score: s.score,
    fullMark: 100,
  }));

  const barData = result.scores.map((s) => ({
    name: s.category.split(" ")[0],
    score: s.score,
  }));

  const exportReport = () => {
    const lines = [
      "ResumeAI Analysis Report",
      "=".repeat(50),
      "",
      `Overall Score: ${result.overallScore}/100`,
      "",
      "Category Scores:",
      ...result.scores.map(
        (s) => `  ${s.category}: ${s.score}/${s.maxScore} - ${s.feedback}`
      ),
      "",
      "Strengths:",
      ...result.strengths.map((s) => `  + ${s}`),
      "",
      "Areas for Improvement:",
      ...result.improvements.map((i) => `  - ${i}`),
      "",
      "ATS Compatibility:",
      `  Score: ${result.atsCompatibility.score}%`,
      `  Passes: ${result.atsCompatibility.passes.join(", ")}`,
      `  Issues: ${result.atsCompatibility.issues.join(", ")}`,
      "",
      "Recommendations:",
      ...result.recommendations.map(
        (r) => `  [${r.priority.toUpperCase()}] ${r.title}: ${r.description}`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-analysis-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/analyze")}
              className="mb-4 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Upload
            </button>
            <h1 className="text-3xl font-bold sm:text-4xl">Analysis Results</h1>
            <p className="mt-1 text-gray-400">
              Here&apos;s how your resume performs
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportReport}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <Link
              to="/analyze"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary-500"
            >
              <RotateCcw className="h-4 w-4" />
              Analyze Another
            </Link>
          </div>
        </div>

        {/* Overall Score */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <ScoreCircle score={result.overallScore} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">Overall Resume Score</h2>
              <p className="mt-2 text-gray-400">
                {result.overallScore >= 80
                  ? "Excellent! Your resume is well-optimized and ready for job applications."
                  : result.overallScore >= 60
                    ? "Good foundation with room for improvement. Address the suggestions below to boost your score."
                    : "Your resume needs significant improvements. Focus on the high-priority recommendations first."}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="text-gray-400">80-100: Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="text-gray-400">60-79: Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-400" />
                  <span className="text-gray-400">40-59: Fair</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="text-gray-400">0-39: Needs Work</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold">Skills Radar</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold">Category Breakdown</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#f3f4f6",
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={getScoreRing(entry.score)}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h3 className="px-6 pt-6 text-lg font-semibold">Detailed Scores</h3>
          <div className="mt-4 divide-y divide-white/5">
            {result.scores.map((score) => {
              const Icon = SECTION_ICONS[score.category] || FileText;
              return (
                <div key={score.category} className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{score.category}</h4>
                        <span className={`text-lg font-bold ${getScoreColor(score.score)}`}>
                          {score.score}/{score.maxScore}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${score.score}%`,
                            backgroundColor: getScoreRing(score.score),
                          }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-400">{score.feedback}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-green-300">Strengths</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-300">Areas to Improve</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {result.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ATS & Keywords */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ATS */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-semibold">ATS Compatibility</h3>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border text-lg font-bold ${getScoreBg(
                  result.atsCompatibility.score,
                )} ${getScoreColor(result.atsCompatibility.score)}`}
              >
                {result.atsCompatibility.score}%
              </div>
              <p className="text-sm text-gray-400">
                {result.atsCompatibility.score >= 80
                  ? "Your resume is well-structured for ATS systems."
                  : "Some adjustments needed to improve ATS compatibility."}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {result.atsCompatibility.passes.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {p}
                </div>
              ))}
              {result.atsCompatibility.issues.map((issue, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-red-300">
                  <XCircle className="h-4 w-4" />
                  {issue}
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent-400" />
              <h3 className="text-lg font-semibold">Keyword Analysis</h3>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-green-300">Found Keywords</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.keywordMatch.found.length > 0 ? (
                  result.keywordMatch.found.map((k, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300 border border-green-500/20"
                    >
                      {k}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No action keywords found</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-red-300">Missing Keywords</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.keywordMatch.missing.map((k, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300 border border-red-500/20"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Categories */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-lg font-semibold">Skill Categories</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.skillAnalysis.map((cat) => (
              <div
                key={cat.category}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{cat.category}</h4>
                  <span
                    className={`text-sm font-bold ${getScoreColor(
                      cat.matchScore,
                    )}`}
                  >
                    {cat.matchScore}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.matchScore}%`,
                      backgroundColor: getScoreRing(cat.matchScore),
                    }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cat.skills.length > 0 ? (
                    cat.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded bg-white/5 px-2 py-0.5 text-xs text-gray-300"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No skills found</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-lg font-semibold">
            <TrendingUp className="mr-2 inline h-5 w-5 text-primary-400" />
            Recommendations
          </h3>
          <div className="mt-4 space-y-3">
            {result.recommendations.map((rec, i) => (
              <ExpandableRecommendation key={i} rec={rec} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* Parsed Info */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <button
            onClick={() => toggleSection("parsed")}
            className="flex w-full items-center justify-between text-lg font-semibold"
          >
            <span>Parsed Resume Data</span>
            {expandedSections.has("parsed") ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
          {expandedSections.has("parsed") && (
            <div className="mt-4 space-y-4 text-sm text-gray-400">
              <div>
                <h4 className="font-medium text-white">Contact</h4>
                <p>
                  {result.parsedResume.contact.name || "N/A"} |{" "}
                  {result.parsedResume.contact.email || "N/A"} |{" "}
                  {result.parsedResume.contact.phone || "N/A"}
                </p>
              </div>
              {result.parsedResume.summary && (
                <div>
                  <h4 className="font-medium text-white">Summary</h4>
                  <p>{result.parsedResume.summary}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-white">Sections Found</h4>
                <div className="flex flex-wrap gap-2">
                  {result.parsedResume.sections.map((s, i) => (
                    <span key={i} className="rounded bg-white/5 px-2 py-1 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white">
                  Detected Skills ({result.parsedResume.skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.parsedResume.skills.map((s, i) => (
                    <span key={i} className="rounded bg-primary-500/10 px-2 py-1 text-xs text-primary-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-gradient-to-r from-primary-600/10 to-accent-600/10 p-8 text-center">
          <h3 className="text-2xl font-bold">Want to Improve Your Score?</h3>
          <p className="mt-2 text-gray-400">
            Make the recommended changes and re-analyze to track your progress.
          </p>
          <Link
            to="/analyze"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold transition-colors hover:bg-primary-500"
          >
            <RotateCcw className="h-5 w-5" />
            Re-analyze Resume
          </Link>
        </div>
      </div>
    </div>
  );
}

function ExpandableRecommendation({
  rec,
  defaultOpen,
}: {
  rec: AnalysisResult["recommendations"][0];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityColor(
            rec.priority,
          )}`}
        >
          {rec.priority}
        </span>
        <span className="flex-1 font-medium">{rec.title}</span>
        <span className="text-xs text-gray-500">{rec.category}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-white/5 px-4 py-3 text-sm text-gray-400">
          {rec.description}
        </div>
      )}
    </div>
  );
}
