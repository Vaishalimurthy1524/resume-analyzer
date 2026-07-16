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
    "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "golang",
    "rust", "swift", "kotlin", "php", "scala", "r", "matlab", "sql", "dart", "bash", "shell",
  ],
  "Frontend Development": [
    "html", "html5", "css", "css3", "sass", "scss", "less", "tailwind", "tailwind css", "bootstrap",
    "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs", "vue.js", "svelte",
    "nextjs", "next.js", "nuxt", "nuxtjs", "remix", "gatsby",
    "responsive design", "responsive ui", "responsive ui design", "ui/ux", "wireframing", "prototyping",
  ],
  "Backend Development": [
    "node", "nodejs", "node.js", "express", "expressjs", "express.js", "django", "flask", "fastapi",
    "spring", "spring boot", "rails", "ruby on rails", "laravel", "asp.net", ".net",
    "graphql", "rest", "restful", "rest api", "restful api", "grpc", "websocket",
  ],
  "Cloud & DevOps": [
    "aws", "amazon web services", "azure", "microsoft azure", "gcp", "google cloud",
    "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins", "ci/cd",
    "github actions", "netlify", "vercel", "heroku", "digitalocean", "cloudflare",
    "nginx", "apache", "linux", "unix",
  ],
  "Databases": [
    "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "elasticsearch",
    "dynamodb", "firebase", "supabase", "sqlite", "mariadb", "cassandra", "neo4j",
    "oracle", "sql server", "mssql", "nosql",
  ],
  "AI & Data Science": [
    "machine learning", "ml", "deep learning", "dl", "nlp", "natural language processing",
    "computer vision", "tensorflow", "keras", "pytorch", "scikit-learn", "sklearn",
    "pandas", "numpy", "matplotlib", "seaborn", "plotly",
    "data analysis", "data visualization", "data science", "data engineering",
    "tableau", "power bi", "excel",
    "artificial intelligence", "ai", "genai", "generative ai", "llm", "openai",
  ],
  "Version Control & Tools": [
    "git", "github", "gitlab", "bitbucket", "svn",
    "jira", "confluence", "trello", "notion", "slack",
    "vs code", "visual studio code", "postman", "figma",
  ],
  "Testing": [
    "jest", "mocha", "chai", "cypress", "playwright", "selenium", "pytest", "junit",
    "tdd", "unit testing", "integration testing", "e2e testing",
  ],
  "Mobile Development": [
    "react native", "flutter", "dart", "android", "ios", "swiftui", "xamarin",
  ],
  "Design & Creative": [
    "figma", "sketch", "adobe xd", "photoshop", "illustrator", "canva",
    "ui/ux", "wireframing", "prototyping", "responsive design",
  ],
  "Methodologies": [
    "agile", "scrum", "kanban", "lean", "waterfall", "sdlc",
  ],
  "Soft Skills": [
    "communication", "leadership", "teamwork", "problem solving", "analytical",
    "critical thinking", "time management", "adaptability", "collaboration",
    "project management", "product management", "business analysis", "mentoring",
    "technical writing", "documentation",
  ],
};

const ACTION_VERBS = [
  "developed", "built", "created", "designed", "implemented", "integrated",
  "implemented", "architected", "engineered", "optimized", "refactored",
  "led", "managed", "mentored", "collaborated", "coordinated",
  "achieved", "improved", "increased", "reduced", "enhanced", "streamlined",
  "delivered", "launched", "deployed", "migrated", "automated",
  "analyzed", "researched", "evaluated", "identified", "resolved",
  "established", "initiated", "proposed", "presented", "documented",
  "tested", "debugged", "troubleshooted", "monitored", "maintained",
  "contributed", "participated", "supported", "assisted", "trained",
];

const IMPACT_KEYWORDS = [
  "performance", "efficiency", "productivity", "scalability", "reliability",
  "user experience", "user engagement", "conversion", "revenue", "cost",
  "time", "speed", "accuracy", "quality", "security",
];

export function analyzeResume(parsed: ParsedResume): AnalysisResult {
  const scores = calculateScores(parsed);
  const overallScore = Math.round(
    scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / scores.length,
  );
  const skillAnalysis = analyzeSkills(parsed);
  const atsCompatibility = analyzeATS(parsed);
  const keywordMatch = analyzeKeywords(parsed);
  const formattingScore = calculateFormattingScore(parsed);
  const strengths = findStrengths(parsed);
  const improvements = findImprovements(parsed, atsCompatibility, keywordMatch);
  const recommendations = generateRecommendations(parsed, atsCompatibility, keywordMatch);

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
  if (parsed.contact.name) score += 20;
  if (parsed.contact.email) score += 25;
  if (parsed.contact.phone) score += 20;
  if (parsed.contact.location) score += 15;
  if (parsed.contact.linkedin) score += 10;
  if (parsed.contact.website) score += 10;
  return score;
}

function getContactFeedback(parsed: ParsedResume): string {
  const found = [];
  const missing = [];
  if (parsed.contact.name) found.push("name");
  else missing.push("name");
  if (parsed.contact.email) found.push("email");
  else missing.push("email");
  if (parsed.contact.phone) found.push("phone");
  else missing.push("phone number");
  if (parsed.contact.location) found.push("location");
  else missing.push("location");
  if (parsed.contact.linkedin) found.push("LinkedIn");
  else missing.push("LinkedIn profile");
  if (parsed.contact.website) found.push("GitHub/portfolio");
  else missing.push("GitHub or portfolio link");
  if (missing.length === 0) return "All contact details present — excellent coverage for recruiters.";
  return `Found: ${found.join(", ")}. Consider adding: ${missing.join(", ")}`;
}

function scoreSummary(parsed: ParsedResume): number {
  if (!parsed.summary) return 10;
  const words = parsed.summary.split(/\s+/).length;
  if (words < 15) return 30;
  if (words < 30) return 55;
  if (words > 150) return 65;
  if (words >= 50 && words <= 100) return 90;
  return 75;
}

function getSummaryFeedback(parsed: ParsedResume): string {
  if (!parsed.summary) return "No summary found. A 2-4 sentence professional summary helps recruiters quickly understand your value proposition.";
  const words = parsed.summary.split(/\s+/).length;
  if (words < 30) return "Your summary is brief. Aim for 50-100 words with key qualifications, certifications, and career goals.";
  if (words > 150) return "Your summary is quite long. Keep it concise — 50-100 words is ideal for recruiter scanning.";
  const hasKeywords = ACTION_VERBS.some((v) => parsed.summary.toLowerCase().includes(v));
  if (!hasKeywords) return "Good length. Strengthen it by including action verbs and specific achievements.";
  return "Strong professional summary with good keyword density.";
}

function scoreExperience(parsed: ParsedResume): number {
  if (parsed.experience.length === 0) return 5;
  let score = Math.min(parsed.experience.length * 18, 55);
  for (const exp of parsed.experience) {
    if (exp.description && exp.description.length > 50) score += 8;
    if (exp.description && exp.description.length > 100) score += 5;
    if (exp.company) score += 4;
    if (exp.duration) score += 4;
    const hasMetrics = exp.description && /\d+%|\$\d+|\d+ (?:users|team|members|months|years|projects|features)/i.test(exp.description);
    if (hasMetrics) score += 8;
    const hasActionVerbs = exp.description && ACTION_VERBS.some(
      (v) => exp.description!.toLowerCase().includes(v),
    );
    if (hasActionVerbs) score += 6;
  }
  return Math.min(score, 100);
}

function getExperienceFeedback(parsed: ParsedResume): string {
  if (parsed.experience.length === 0) return "No work experience found. Include internships, part-time work, or freelance projects.";
  const hasDetails = parsed.experience.some((e) => e.description && e.description.length > 50);
  const hasMetrics = parsed.experience.some(
    (e) => e.description && /\d+%|\$\d+|\d+ (?:users|team|members|months|years|projects)/i.test(e.description),
  );
  if (!hasDetails) return "Add detailed descriptions with specific technologies used and responsibilities.";
  if (!hasMetrics) return `${parsed.experience.length} position(s) found. Add quantifiable metrics (%, $, team size) to strengthen impact.`;
  return `${parsed.experience.length} position(s) found with measurable achievements. Strong work experience section.`;
}

function scoreEducation(parsed: ParsedResume): number {
  if (parsed.education.length === 0) return 10;
  let score = Math.min(parsed.education.length * 30, 60);
  for (const edu of parsed.education) {
    if (edu.institution) score += 15;
    if (edu.year) score += 10;
    if (edu.degree && /bachelor|master|phd|b\.?s\.?|m\.?s\.?|bca|mca|btech|mtech|mba/i.test(edu.degree)) score += 15;
  }
  return Math.min(score, 100);
}

function getEducationFeedback(parsed: ParsedResume): string {
  if (parsed.education.length === 0) return "No education section found. Include your degree, institution, and graduation year.";
  return `${parsed.education.length} education entries found. Include GPA if above 3.5 and relevant coursework.`;
}

function scoreSkills(parsed: ParsedResume): number {
  if (parsed.skills.length === 0) return 10;
  let score = Math.min(parsed.skills.length * 3, 60);
  const categories = new Set<string>();
  for (const [cat, skills] of Object.entries(TECH_SKILLS_MAP)) {
    if (skills.some((s) => parsed.skills.some((ps) => ps.includes(s) || s.includes(ps)))) {
      categories.add(cat);
    }
  }
  score += categories.size * 8;
  return Math.min(score, 100);
}

function getSkillsFeedback(parsed: ParsedResume): string {
  if (parsed.skills.length === 0) return "No technical skills detected. List relevant skills to improve ATS keyword matching.";
  if (parsed.skills.length < 5) return `Found ${parsed.skills.length} skills. Add more to improve ATS match rates (aim for 10-15+).`;
  if (parsed.skills.length >= 15) return `Excellent — ${parsed.skills.length} skills detected. Great keyword density for ATS systems.`;
  return `Good skill set with ${parsed.skills.length} detected skills. Align them with target job descriptions.`;
}

function analyzeSkills(parsed: ParsedResume): SkillCategory[] {
  const lowerSkills = parsed.skills.map((s) => s.toLowerCase());
  const rawLower = parsed.rawText.toLowerCase();

  return Object.entries(TECH_SKILLS_MAP).map(([category, keywords]) => {
    const found = keywords.filter(
      (k) =>
        lowerSkills.some((s) => s.includes(k) || k.includes(s)) ||
        rawLower.includes(k),
    );
    return {
      category,
      skills: [...new Set(found)],
      matchScore: keywords.length > 0 ? Math.round((found.length / keywords.length) * 100) : 0,
    };
  });
}

function analyzeATS(parsed: ParsedResume): ATSReport {
  const issues: string[] = [];
  const passes: string[] = [];

  if (parsed.contact.email) passes.push("Email address found");
  else issues.push("Missing email address — critical for ATS");

  if (parsed.contact.phone) passes.push("Phone number found");
  else issues.push("Missing phone number");

  if (parsed.contact.name) passes.push("Name identified");
  else issues.push("Name not clearly identified");

  if (parsed.summary) passes.push("Professional summary present");
  else issues.push("No professional summary — adds keyword density");

  if (parsed.experience.length > 0) passes.push("Work experience section present");
  else issues.push("No work experience section found");

  if (parsed.skills.length >= 5) passes.push("Skills section with 5+ keywords");
  else if (parsed.skills.length > 0) passes.push("Skills section detected (add more for better ATS)");
  else issues.push("No skills section detected — critical for keyword matching");

  if (parsed.education.length > 0) passes.push("Education section present");
  else issues.push("No education section found");

  if (parsed.contact.linkedin) passes.push("LinkedIn profile included");
  else issues.push("Missing LinkedIn profile URL");

  if (parsed.contact.website || parsed.rawText.toLowerCase().includes("github")) {
    passes.push("GitHub/portfolio link present");
  }

  const wordCount = parsed.rawText.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 1200) passes.push("Good resume length (300-1200 words)");
  else if (wordCount < 300) issues.push("Resume is too short — aim for 400-800 words");
  else issues.push("Resume may be too long — aim for 1-2 pages");

  if (parsed.sections.length >= 4) passes.push(`${parsed.sections.length} sections detected — good structure`);
  else issues.push(`Only ${parsed.sections.length} section(s) found — add more structure`);

  const hasActionVerbs = ACTION_VERBS.some((v) => parsed.rawText.toLowerCase().includes(v));
  if (hasActionVerbs) passes.push("Action verbs detected in content");
  else issues.push("No action verbs found — use words like 'developed', 'built', 'implemented'");

  const hasMetrics = /\d+%|\$\d+|\d+ (?:users|team|members|months|years|projects|features)/i.test(parsed.rawText);
  if (hasMetrics) passes.push("Quantifiable metrics found");
  else issues.push("No quantifiable achievements — add numbers, percentages, and metrics");

  const score = Math.round((passes.length / (passes.length + issues.length)) * 100);
  return { score, issues, passes };
}

function analyzeKeywords(parsed: ParsedResume): KeywordReport {
  const text = parsed.rawText.toLowerCase();

  const techKeywords = [
    "javascript", "react", "node", "python", "html", "css", "mongodb", "mysql",
    "express", "git", "api", "rest", "json", "database", "frontend", "backend",
    "full stack", "full-stack", "mern", "mean", "responsive",
  ];

  const impactKeywords = [
    "achieved", "improved", "increased", "reduced", "delivered", "optimized",
    "streamlined", "automated", "launched", "built", "developed", "implemented",
    "designed", "created", "established", "collaborated", "led", "managed",
    "results", "impact", "success", "performance", "efficiency",
  ];

  const certKeywords = [
    "certified", "certification", "certificate", "aws certified", "microsoft certified",
    "google certified", "infosys", "oracle certified", "cisco",
  ];

  const found: string[] = [];
  const missing: string[] = [];

  for (const kw of [...techKeywords, ...impactKeywords, ...certKeywords]) {
    if (text.includes(kw)) found.push(kw);
    else missing.push(kw);
  }

  return {
    found,
    missing: missing.slice(0, 12),
    relevant: [...techKeywords, ...impactKeywords, ...certKeywords],
  };
}

function calculateFormattingScore(parsed: ParsedResume): number {
  let score = 0;
  if (parsed.sections.length >= 3) score += 25;
  else if (parsed.sections.length >= 1) score += 10;
  if (parsed.contact.name) score += 15;
  if (parsed.contact.email) score += 10;
  if (parsed.rawText.split("\n").length > 10) score += 15;
  if (parsed.rawText.length > 300) score += 15;
  if (parsed.skills.length > 0) score += 10;
  if (parsed.summary) score += 10;
  return Math.min(score, 100);
}

function findStrengths(parsed: ParsedResume): string[] {
  const strengths: string[] = [];
  if (parsed.contact.email && parsed.contact.phone && parsed.contact.linkedin) {
    strengths.push("Complete contact information with LinkedIn and GitHub");
  } else if (parsed.contact.email && parsed.contact.phone) {
    strengths.push("Core contact details present (email and phone)");
  }
  if (parsed.summary && parsed.summary.split(/\s+/).length >= 30) {
    strengths.push("Well-written professional summary with good keyword density");
  }
  if (parsed.experience.length >= 1) {
    strengths.push(`${parsed.experience.length} work experience position(s) documented`);
  }
  if (parsed.skills.length >= 10) {
    strengths.push(`Strong technical skills section with ${parsed.skills.length} skills detected`);
  } else if (parsed.skills.length >= 5) {
    strengths.push(`${parsed.skills.length} technical skills identified`);
  }
  if (parsed.education.length > 0) {
    strengths.push("Education background included");
  }
  const hasCerts = parsed.rawText.toLowerCase().includes("certif");
  if (hasCerts) {
    strengths.push("Certifications listed — demonstrates continuous learning");
  }
  if (parsed.sections.length >= 5) {
    strengths.push("Well-structured resume with clear section organization");
  }
  if (strengths.length === 0) {
    strengths.push("Resume follows a readable format");
  }
  return strengths;
}

function findImprovements(
  parsed: ParsedResume,
  ats: ATSReport,
  _keywords: KeywordReport,
): string[] {
  const improvements: string[] = [];
  if (!parsed.summary) {
    improvements.push("Add a professional summary (3-4 sentences) highlighting your key qualifications");
  }
  if (parsed.experience.length === 0) {
    improvements.push("Include work experience — add internships, freelance work, or relevant projects");
  }
  if (parsed.skills.length < 10) {
    improvements.push(`Expand skills section (currently ${parsed.skills.length}) — aim for 10-15+ relevant skills`);
  }
  if (!parsed.contact.linkedin) {
    improvements.push("Add LinkedIn profile URL to increase professional visibility");
  }
  if (!parsed.contact.website && !parsed.rawText.toLowerCase().includes("github")) {
    improvements.push("Add GitHub profile or portfolio link to showcase your work");
  }
  if (parsed.experience.length > 0) {
    const hasMetrics = parsed.experience.some(
      (e) => e.description && /\d+%|\$\d+|\d+ (?:users|team|members)/i.test(e.description),
    );
    if (!hasMetrics) {
      improvements.push("Add quantifiable achievements — use numbers, percentages, and metrics in experience descriptions");
    }
  }
  const hasActionVerbs = ACTION_VERBS.some((v) => parsed.rawText.toLowerCase().includes(v));
  if (!hasActionVerbs) {
    improvements.push("Use strong action verbs at the start of bullet points (developed, built, implemented, optimized)");
  }
  if (ats.issues.length > 3) {
    improvements.push(`ATS compatibility has ${ats.issues.length} issues — review the ATS report for specific fixes`);
  }
  if (improvements.length === 0) {
    improvements.push("Tailor your resume keywords for each specific job application");
  }
  return improvements;
}

function generateRecommendations(
  parsed: ParsedResume,
  _ats: ATSReport,
  keywords: KeywordReport,
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (!parsed.summary) {
    recs.push({
      priority: "high",
      title: "Add Professional Summary",
      description:
        "Write 3-4 sentences: mention your role/title, years of experience, key certifications, and what you bring. Include relevant keywords from the job description.",
      category: "Content",
    });
  }

  if (parsed.experience.length > 0) {
    const hasMetrics = parsed.experience.some(
      (e) => e.description && /\d+%|\$\d+|\d+ (?:users|team|members|months|years|projects)/i.test(e.description),
    );
    if (!hasMetrics) {
      recs.push({
        priority: "high",
        title: "Add Quantifiable Achievements",
        description:
          "For each role, include 1-2 metrics: 'Improved load time by 40%', 'Led a team of 5', 'Reduced costs by $10K'. Numbers make your impact concrete.",
        category: "Impact",
      });
    }
  }

  if (parsed.skills.length < 10) {
    recs.push({
      priority: "high",
      title: "Expand Technical Skills",
      description:
        `Currently ${parsed.skills.length} skills detected. Add relevant technologies, frameworks, databases, and tools. Target 10-15+ skills for optimal ATS keyword matching.`,
      category: "Skills",
    });
  }

  if (keywords.missing.length > 5) {
    const topMissing = keywords.missing
      .filter((k: string) => IMPACT_KEYWORDS.includes(k) || ACTION_VERBS.includes(k))
      .slice(0, 5);
    if (topMissing.length > 0) {
      recs.push({
        priority: "high",
        title: "Use More Action Verbs & Impact Words",
        description: `Incorporate these keywords: ${topMissing.join(", ")}. Start bullet points with strong verbs and describe measurable outcomes.`,
        category: "Keywords",
      });
    }
  }

  if (!parsed.contact.linkedin) {
    recs.push({
      priority: "medium",
      title: "Add LinkedIn Profile",
      description:
        "Include your LinkedIn URL in the contact section. 87% of recruiters use LinkedIn to verify candidates.",
      category: "Contact",
    });
  }

  if (!parsed.contact.website && !parsed.rawText.toLowerCase().includes("github")) {
    recs.push({
      priority: "medium",
      title: "Add GitHub/Portfolio Link",
      description:
        "Include your GitHub profile URL to showcase code samples and projects. Essential for technical roles.",
      category: "Contact",
    });
  }

  if (parsed.education.length > 0) {
    const hasGpa = /\b[3-4]\.\d{1,2}\b/.test(parsed.rawText);
    if (!hasGpa) {
      recs.push({
        priority: "low",
        title: "Include GPA if Notable",
        description:
          "If your GPA is 3.5+ or you have relevant coursework/honors, add them to strengthen your education section.",
        category: "Education",
      });
    }
  }

  recs.push({
    priority: "low",
    title: "Tailor for Each Job Application",
    description:
      "Customize your resume keywords, skills order, and experience descriptions to match each specific job posting. ATS systems score relevance to the job description.",
    category: "Strategy",
  });

  return recs;
}
