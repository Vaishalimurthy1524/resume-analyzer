import type {
  ParsedResume,
  AnalysisResult,
  CategoryScore,
  SkillCategory,
  ATSReport,
  KeywordReport,
  Recommendation,
} from "../types";

const TECH_SKILLS_MAP: Record<string, string[]> = {
  "Programming Languages": [
    "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "swift",
    "kotlin", "php", "scala", "r", "matlab", "sql",
  ],
  "Web Development": [
    "html", "css", "sass", "scss", "react", "angular", "vue", "svelte", "nextjs", "nuxt",
    "node", "express", "graphql", "rest",
  ],
  "Cloud & DevOps": [
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins", "ci/cd", "git",
  ],
  "Databases": [
    "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "dynamodb", "firebase", "sql", "nosql",
  ],
  "AI & Data Science": [
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
    "data analysis", "data visualization", "tableau", "power bi",
  ],
  "Design & Creative": [
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
  ],
  "Soft Skills": [
    "communication", "leadership", "teamwork", "problem solving", "analytical",
    "project management", "product management", "business analysis",
  ],
};

export function analyzeResume(parsed: ParsedResume): AnalysisResult {
  const scores = calculateScores(parsed);
  const overallScore = Math.round(
    scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / scores.length
  );
  const skillAnalysis = analyzeSkills(parsed);
  const atsCompatibility = analyzeATS(parsed);
  const keywordMatch = analyzeKeywords(parsed);
  const formattingScore = calculateFormattingScore(parsed);
  const strengths = findStrengths(parsed, scores);
  const improvements = findImprovements(parsed, scores);
  const recommendations = generateRecommendations(parsed, scores, atsCompatibility, keywordMatch);

  return {
    overallScore,
    scores,
    parsedResume: parsed,
    strengths,
    improvements,
    skillAnalysis,
    atsCompatibility,
    keywordMatch,
    formattingScore,
    recommendations,
  };
}

function calculateScores(parsed: ParsedResume): CategoryScore[] {
  return [
    {
      category: "Contact Information",
      score: scoreContact(parsed),
      maxScore: 100,
      feedback: getContactFeedback(parsed),
    },
    {
      category: "Professional Summary",
      score: scoreSummary(parsed),
      maxScore: 100,
      feedback: getSummaryFeedback(parsed),
    },
    {
      category: "Work Experience",
      score: scoreExperience(parsed),
      maxScore: 100,
      feedback: getExperienceFeedback(parsed),
    },
    {
      category: "Education",
      score: scoreEducation(parsed),
      maxScore: 100,
      feedback: getEducationFeedback(parsed),
    },
    {
      category: "Skills",
      score: scoreSkills(parsed),
      maxScore: 100,
      feedback: getSkillsFeedback(parsed),
    },
  ];
}

function scoreContact(parsed: ParsedResume): number {
  let score = 0;
  if (parsed.contact.name) score += 25;
  if (parsed.contact.email) score += 25;
  if (parsed.contact.phone) score += 20;
  if (parsed.contact.location) score += 15;
  if (parsed.contact.linkedin) score += 15;
  return score;
}

function getContactFeedback(parsed: ParsedResume): string {
  const missing = [];
  if (!parsed.contact.email) missing.push("email");
  if (!parsed.contact.phone) missing.push("phone number");
  if (!parsed.contact.linkedin) missing.push("LinkedIn profile");
  if (!parsed.contact.location) missing.push("location");
  if (missing.length === 0) return "Excellent! All contact information is present.";
  return `Consider adding: ${missing.join(", ")}`;
}

function scoreSummary(parsed: ParsedResume): number {
  if (!parsed.summary) return 10;
  const words = parsed.summary.split(/\s+/).length;
  if (words < 10) return 30;
  if (words < 20) return 50;
  if (words > 100) return 70;
  return 85;
}

function getSummaryFeedback(parsed: ParsedResume): string {
  if (!parsed.summary) return "No summary found. Adding a professional summary helps recruiters quickly understand your value proposition.";
  const words = parsed.summary.split(/\s+/).length;
  if (words < 20) return "Your summary is brief. Aim for 2-4 sentences highlighting your key achievements and career goals.";
  if (words > 100) return "Your summary is quite long. Keep it concise — 50-100 words is ideal.";
  return "Good length. Make sure it highlights your unique value proposition.";
}

function scoreExperience(parsed: ParsedResume): number {
  if (parsed.experience.length === 0) return 5;
  let score = Math.min(parsed.experience.length * 20, 60);
  for (const exp of parsed.experience) {
    if (exp.description && exp.description.length > 50) score += 10;
    if (exp.company) score += 5;
  }
  return Math.min(score, 100);
}

function getExperienceFeedback(parsed: ParsedResume): string {
  if (parsed.experience.length === 0) return "No work experience found. Include your work history with job titles, companies, and descriptions.";
  const hasDetails = parsed.experience.some((e) => e.description && e.description.length > 50);
  if (!hasDetails) return "Add detailed descriptions with quantifiable achievements for each role.";
  return `${parsed.experience.length} positions found. Use metrics and action verbs to strengthen impact.`;
}

function scoreEducation(parsed: ParsedResume): number {
  if (parsed.education.length === 0) return 10;
  let score = Math.min(parsed.education.length * 35, 70);
  for (const edu of parsed.education) {
    if (edu.institution) score += 15;
    if (edu.year) score += 15;
  }
  return Math.min(score, 100);
}

function getEducationFeedback(parsed: ParsedResume): string {
  if (parsed.education.length === 0) return "No education section found. Add your educational background including degrees and institutions.";
  return `${parsed.education.length} education entries found. Include GPA if notable and relevant coursework.`;
}

function scoreSkills(parsed: ParsedResume): number {
  if (parsed.skills.length === 0) return 10;
  return Math.min(parsed.skills.length * 5, 100);
}

function getSkillsFeedback(parsed: ParsedResume): string {
  if (parsed.skills.length === 0) return "No technical skills detected. List relevant skills to improve keyword matching with ATS systems.";
  if (parsed.skills.length < 5) return `Found ${parsed.skills.length} skills. Adding more relevant skills will improve your ATS match rate.`;
  return `Strong skill set with ${parsed.skills.length} detected skills. Ensure they align with the target job description.`;
}

function analyzeSkills(parsed: ParsedResume): SkillCategory[] {
  const lowerSkills = parsed.skills.map((s) => s.toLowerCase());
  return Object.entries(TECH_SKILLS_MAP).map(([category, keywords]) => {
    const found = keywords.filter((k) =>
      lowerSkills.some((s) => s.includes(k) || k.includes(s))
    );
    return {
      category,
      skills: found,
      matchScore: keywords.length > 0 ? Math.round((found.length / keywords.length) * 100) : 0,
    };
  });
}

function analyzeATS(parsed: ParsedResume): ATSReport {
  const issues: string[] = [];
  const passes: string[] = [];

  if (parsed.contact.email) passes.push("Email address found");
  else issues.push("Missing email address");

  if (parsed.contact.phone) passes.push("Phone number found");
  else issues.push("Missing phone number");

  if (parsed.experience.length > 0) passes.push("Work experience section present");
  else issues.push("No work experience section found");

  if (parsed.skills.length > 0) passes.push("Skills section detected");
  else issues.push("No skills section detected for keyword matching");

  if (parsed.education.length > 0) passes.push("Education section present");
  else issues.push("No education section found");

  if (parsed.summary) passes.push("Professional summary present");
  else issues.push("No professional summary");

  const wordCount = parsed.rawText.split(/\s+/).length;
  if (wordCount > 300 && wordCount < 1500) passes.push("Good resume length");
  else issues.push("Resume length may be suboptimal (aim for 400-800 words)");

  const score = Math.round((passes.length / (passes.length + issues.length)) * 100);
  return { score, issues, passes };
}

function analyzeKeywords(parsed: ParsedResume): KeywordReport {
  const relevantKeywords = [
    "results", "achieved", "improved", "increased", "reduced", "managed", "led",
    "developed", "implemented", "designed", "created", "optimized", "delivered",
    "collaborated", "mentored", "launched", "built", "established", "streamlined",
  ];

  const text = parsed.rawText.toLowerCase();
  const found = relevantKeywords.filter((k) => text.includes(k));
  const missing = relevantKeywords.filter((k) => !text.includes(k));

  return {
    found,
    missing: missing.slice(0, 8),
    relevant: relevantKeywords,
  };
}

function calculateFormattingScore(parsed: ParsedResume): number {
  let score = 0;
  if (parsed.sections.length >= 3) score += 30;
  if (parsed.contact.name) score += 15;
  if (parsed.rawText.split("\n").length > 10) score += 20;
  if (parsed.rawText.length > 200) score += 15;
  if (parsed.skills.length > 0) score += 20;
  return Math.min(score, 100);
}

function findStrengths(parsed: ParsedResume, _scores: CategoryScore[]): string[] {
  const strengths: string[] = [];
  if (parsed.contact.email && parsed.contact.phone && parsed.contact.linkedin) {
    strengths.push("Complete contact information with LinkedIn");
  }
  if (parsed.summary && parsed.summary.split(/\s+/).length >= 20) {
    strengths.push("Well-written professional summary");
  }
  if (parsed.experience.length >= 3) {
    strengths.push("Strong work experience history");
  }
  if (parsed.skills.length >= 8) {
    strengths.push("Comprehensive technical skills section");
  }
  if (parsed.education.length > 0) {
    strengths.push("Education background included");
  }
  if (strengths.length === 0) {
    strengths.push("Resume follows a structured format");
  }
  return strengths;
}

function findImprovements(parsed: ParsedResume, _scores: CategoryScore[]): string[] {
  const improvements: string[] = [];
  if (!parsed.summary) {
    improvements.push("Add a professional summary to grab recruiter attention");
  }
  if (parsed.experience.length === 0) {
    improvements.push("Include work experience with detailed descriptions");
  }
  if (parsed.skills.length < 5) {
    improvements.push("Add more technical and soft skills for better ATS matching");
  }
  if (!parsed.contact.linkedin) {
    improvements.push("Add your LinkedIn profile URL");
  }
  if (parsed.experience.some((e) => !e.description || e.description.length < 30)) {
    improvements.push("Expand job descriptions with quantifiable achievements");
  }
  if (improvements.length === 0) {
    improvements.push("Consider tailoring your resume for specific job applications");
  }
  return improvements;
}

function generateRecommendations(
  parsed: ParsedResume,
  _scores: CategoryScore[],
  _ats: ATSReport,
  keywords: KeywordReport
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (!parsed.summary) {
    recs.push({
      priority: "high",
      title: "Add Professional Summary",
      description: "Write a 2-4 sentence summary highlighting your key qualifications and career objectives.",
      category: "Content",
    });
  }

  if (keywords.missing.length > 3) {
    recs.push({
      priority: "high",
      title: "Use More Action Verbs",
      description: `Consider incorporating keywords like: ${keywords.missing.slice(0, 5).join(", ")}`,
      category: "Keywords",
    });
  }

  if (parsed.skills.length < 8) {
    recs.push({
      priority: "high",
      title: "Expand Skills Section",
      description: "Add more relevant technical and soft skills to improve ATS compatibility.",
      category: "Skills",
    });
  }

  if (!parsed.contact.linkedin) {
    recs.push({
      priority: "medium",
      title: "Add LinkedIn Profile",
      description: "Include your LinkedIn URL to make it easier for recruiters to find and contact you.",
      category: "Contact",
    });
  }

  if (parsed.experience.length > 0) {
    const hasMetrics = parsed.experience.some(
      (e) => e.description && /\d+%|\$\d+|\d+ years?|\d+ team/i.test(e.description)
    );
    if (!hasMetrics) {
      recs.push({
        priority: "high",
        title: "Add Quantifiable Achievements",
        description: "Include specific metrics, percentages, and numbers to demonstrate impact.",
        category: "Impact",
      });
    }
  }

  recs.push({
    priority: "low",
    title: "Tailor for Job Descriptions",
    description: "Customize your resume keywords and experiences for each specific job application.",
    category: "Strategy",
  });

  return recs;
}
