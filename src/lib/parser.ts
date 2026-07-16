import type { ContactInfo, Experience, Education, ParsedResume } from "../types";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
const GITHUB_REGEX = /github\.com\/[a-zA-Z0-9_-]+/i;
const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i;

const SECTION_HEADERS = [
  "contact",
  "summary",
  "objective",
  "profile",
  "about",
  "about me",
  "experience",
  "work experience",
  "employment",
  "internship experience",
  "internship",
  "education",
  "academic",
  "academic background",
  "skills",
  "technical skills",
  "tech stack",
  "competencies",
  "key skills",
  "certifications",
  "certification",
  "licenses",
  "licenses & certifications",
  "projects",
  "key projects",
  "personal projects",
  "awards",
  "honors",
  "achievements",
  "publications",
  "languages",
  "volunteer",
  "references",
  "extracurricular",
  "activities",
];

const COMMON_SKILLS = [
  // Programming Languages
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "golang", "rust", "swift",
  "kotlin", "php", "scala", "r", "matlab", "sql", "nosql", "dart", "elixir", "perl", "bash", "shell",
  "html", "html5", "css", "css3", "sass", "scss", "less", "tailwind", "tailwind css", "bootstrap",
  // Frontend Frameworks
  "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs", "vue.js", "svelte",
  "nextjs", "next.js", "nuxt", "nuxtjs", "remix", "gatsby",
  // Backend Frameworks
  "node", "nodejs", "node.js", "express", "expressjs", "express.js", "django", "flask", "fastapi",
  "spring", "spring boot", "rails", "ruby on rails", "laravel", "asp.net", ".net", "graphql", "rest",
  "restful", "rest api", "restful api", "grpc", "websocket",
  // Cloud & DevOps
  "aws", "amazon web services", "azure", "microsoft azure", "gcp", "google cloud",
  "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins", "ci/cd",
  "github actions", "netlify", "vercel", "heroku", "digitalocean", "cloudflare",
  "nginx", "apache", "linux", "unix",
  // Version Control & Tools
  "git", "github", "gitlab", "bitbucket", "svn",
  "jira", "confluence", "trello", "notion", "slack",
  "vs code", "visual studio code", "intellij", "eclipse", "vim",
  "postman", "figma",
  // Databases
  "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "elasticsearch",
  "dynamodb", "firebase", "supabase", "sqlite", "mariadb", "cassandra", "neo4j",
  "oracle", "sql server", "mssql",
  // AI & Data Science
  "machine learning", "ml", "deep learning", "dl", "nlp", "natural language processing",
  "computer vision", "tensorflow", "keras", "pytorch", "scikit-learn", "sklearn",
  "pandas", "numpy", "matplotlib", "seaborn", "plotly",
  "data analysis", "data visualization", "data science", "data engineering",
  "tableau", "power bi", "excel",
  "artificial intelligence", "ai", "genai", "generative ai", "llm", "openai", "chatgpt",
  // Testing
  "jest", "mocha", "chai", "cypress", "playwright", "selenium", "pytest", "junit",
  "tdd", "unit testing", "integration testing", "e2e testing",
  // Mobile
  "react native", "flutter", "dart", "android", "ios", "swiftui", "xamarin",
  // Design
  "figma", "sketch", "adobe xd", "photoshop", "illustrator", "canva", "ui/ux",
  "responsive design", "wireframing", "prototyping",
  // Methodologies
  "agile", "scrum", "kanban", "lean", "waterfall", "sdlc",
  // APIs & Integration
  "rest api", "graphql", "websocket", "oauth", "jwt", "jwt authentication",
  "api integration", "third-party api", "webhooks",
  // Soft Skills
  "communication", "leadership", "teamwork", "problem solving", "analytical",
  "critical thinking", "time management", "adaptability", "collaboration",
  "project management", "product management", "business analysis", "mentoring",
  // Office & Productivity
  "microsoft office", "excel", "powerpoint", "word", "google sheets", "google docs",
  "notion", "confluence",
  // SEO & Marketing
  "seo", "sem", "marketing", "social media", "content writing", "copywriting",
  "google analytics", "google ads", "facebook ads",
  // Misc
  "responsive ui", "responsive ui design", "pixel perfect", "cross-browser",
  "accessibility", "seo optimization", "performance optimization",
  "microservices", "monolith", "serverless", "event-driven",
  "open source", "documentation", "technical writing",
];

export function parseResumeText(text: string): ParsedResume {
  const normalized = normalizePDFText(text);
  const lines = normalized.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections = detectSections(lines);

  return {
    contact: extractContact(normalized),
    summary: extractSummary(lines, sections),
    experience: extractExperience(lines, sections),
    education: extractEducation(lines, sections),
    skills: extractSkills(normalized),
    sections: sections.map((s) => s.name),
    rawText: normalized,
  };
}

function normalizePDFText(text: string): string {
  const lines = text.split("\n");
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      const hasDoubleSpaces = /\S  \S/.test(trimmed);
      if (hasDoubleSpaces && /^[A-Za-z0-9\s\-.,()@#+&/\\:;'"!%$*+=<>[\]{}|?]+$/.test(trimmed)) {
        return trimmed.replace(/\s{2,}/g, " ");
      }
      const spacedPattern = /^([A-Za-z0-9] ){3,}[A-Za-z0-9]/;
      if (spacedPattern.test(trimmed)) {
        return trimmed.replace(/([A-Za-z0-9]) /g, "$1").replace(/\s{2,}/g, " ");
      }
      return trimmed;
    })
    .join("\n");
}

interface Section {
  name: string;
  startLine: number;
  endLine: number;
}

function detectSections(lines: string[]): Section[] {
  const sections: Section[] = [];
  const sectionStarts: { name: string; index: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
      .toLowerCase()
      .replace(/[=:]+$/, "")
      .replace(/[^a-z\s/&-]/g, "")
      .trim();

    for (const header of SECTION_HEADERS) {
      if (
        line === header ||
        line === header + "s" ||
        line.startsWith(header + " ") ||
        line.startsWith(header + ":") ||
        line === header.replace(/ & /g, " and ")
      ) {
        sectionStarts.push({ name: header, index: i });
        break;
      }
    }
  }

  for (let i = 0; i < sectionStarts.length; i++) {
    sections.push({
      name: sectionStarts[i].name,
      startLine: sectionStarts[i].index,
      endLine: i < sectionStarts.length - 1 ? sectionStarts[i + 1].index - 1 : lines.length - 1,
    });
  }

  if (sections.length === 0) {
    sections.push({ name: "full", startLine: 0, endLine: lines.length - 1 });
  }

  return sections;
}

function extractContact(text: string): ContactInfo {
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(PHONE_REGEX);
  const linkedinMatch = text.match(LINKEDIN_REGEX);
  const githubMatch = text.match(GITHUB_REGEX);
  const urlMatch = text.match(URL_REGEX);

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const name = lines.length > 0 ? lines[0].replace(/\s{2,}/g, " ") : "";

  return {
    name,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    location: extractLocation(text),
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
    website: githubMatch ? githubMatch[0] : urlMatch ? urlMatch[0] : "",
  };
}

function extractLocation(text: string): string {
  const locationPatterns = [
    /(?:location|address|city|based in|located in)[:\s]*(.+?)(?:\n|$)/i,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\b/,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s*[-–—]\s*\d{5,6}/,
  ];
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function extractSummary(lines: string[], sections: Section[]): string {
  const summarySection = sections.find(
    (s) =>
      s.name === "summary" ||
      s.name === "objective" ||
      s.name === "profile" ||
      s.name === "about" ||
      s.name === "about me"
  );
  if (summarySection) {
    return lines
      .slice(summarySection.startLine + 1, summarySection.endLine + 1)
      .join(" ")
      .trim();
  }
  return "";
}

function extractExperience(lines: string[], sections: Section[]): Experience[] {
  const expSection = sections.find(
    (s) =>
      s.name === "experience" ||
      s.name === "work experience" ||
      s.name === "employment" ||
      s.name === "internship experience" ||
      s.name === "internship"
  );
  if (!expSection) return [];

  const expLines = lines.slice(expSection.startLine + 1, expSection.endLine + 1);
  const experiences: Experience[] = [];
  let current: Partial<Experience> = {};

  for (const line of expLines) {
    const datePattern =
      /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s*\d{4}\s*[-–—to]*\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present)\w*\s*\d{0,4}\b/i;
    const dateRangePattern = /\d{4}\s*[-–—]\s*(?:\d{4}|present)/i;
    const monthsPattern =
      /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s*[-–—]\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present)\w*\s*\d{0,4}\b/i;

    if (datePattern.test(line) || dateRangePattern.test(line) || monthsPattern.test(line)) {
      if (current.title) {
        experiences.push(current as Experience);
      }
      current = { duration: line.trim() };
    } else if (!current.title && line.length > 3) {
      current.title = line.trim();
    } else if (current.title && !current.company) {
      current.company = line.trim().replace(/^at\s+/i, "");
    } else {
      current.description = (current.description ? current.description + " " : "") + line.trim();
    }
  }
  if (current.title) experiences.push(current as Experience);
  return experiences;
}

function extractEducation(lines: string[], sections: Section[]): Education[] {
  const eduSection = sections.find(
    (s) => s.name === "education" || s.name === "academic" || s.name === "academic background"
  );
  if (!eduSection) return [];

  const eduLines = lines.slice(eduSection.startLine + 1, eduSection.endLine + 1);
  const educations: Education[] = [];
  let current: Partial<Education> = {};

  for (const line of eduLines) {
    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    if (yearMatch && !current.degree) {
      current.degree = line.trim();
      current.year = yearMatch[0];
    } else if (!current.degree) {
      current.degree = line.trim();
    } else if (!current.institution) {
      current.institution = line.trim();
    } else {
      current.details = (current.details ? current.details + " " : "") + line.trim();
    }
  }
  if (current.degree) educations.push(current as Education);
  return educations;
}

function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  for (const skill of COMMON_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lowerText)) {
      found.push(skill);
    }
  }
  return [...new Set(found)];
}
