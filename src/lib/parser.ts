import type { ContactInfo, Experience, Education, ParsedResume } from "../types";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i;

const SECTION_HEADERS = [
  "contact",
  "summary",
  "objective",
  "profile",
  "about",
  "experience",
  "work experience",
  "employment",
  "education",
  "academic",
  "skills",
  "technical skills",
  "competencies",
  "certifications",
  "licenses",
  "projects",
  "awards",
  "honors",
  "publications",
  "languages",
  "volunteer",
  "references",
];

const COMMON_SKILLS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "swift",
  "kotlin", "php", "scala", "r", "matlab", "sql", "nosql", "html", "css", "sass", "scss",
  "react", "angular", "vue", "svelte", "nextjs", "nuxt", "node", "express", "django", "flask",
  "spring", "rails", "laravel", "asp.net", "fastapi", "graphql", "rest", "grpc",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins", "ci/cd",
  "git", "github", "gitlab", "bitbucket", "jira", "confluence",
  "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "dynamodb", "firebase",
  "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
  "figma", "sketch", "adobe xd", "photoshop", "illustrator",
  "agile", "scrum", "kanban", "lean",
  "communication", "leadership", "teamwork", "problem solving", "analytical",
  "microsoft office", "excel", "powerpoint", "word",
  "data analysis", "data visualization", "tableau", "power bi",
  "project management", "product management", "business analysis",
  "seo", "marketing", "social media", "content writing",
];

export function parseResumeText(text: string): ParsedResume {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections = detectSections(lines);

  return {
    contact: extractContact(text),
    summary: extractSummary(lines, sections),
    experience: extractExperience(lines, sections),
    education: extractEducation(lines, sections),
    skills: extractSkills(text),
    sections: sections.map((s) => s.name),
    rawText: text,
  };
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
    const line = lines[i].toLowerCase().replace(/[=:]+$/, "").replace(/[^a-z\s/&-]/g, "").trim();
    for (const header of SECTION_HEADERS) {
      if (line === header || line === header + "s" || line.startsWith(header)) {
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
  const urlMatch = text.match(URL_REGEX);

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const name = lines.length > 0 ? lines[0] : "";

  return {
    name,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    location: extractLocation(text),
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
    website: urlMatch ? urlMatch[0] : "",
  };
}

function extractLocation(text: string): string {
  const locationPatterns = [
    /(?:location|address|city|based in|located in)[:\s]*(.+?)(?:\n|$)/i,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\b/,
  ];
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function extractSummary(lines: string[], sections: Section[]): string {
  const summarySection = sections.find(
    (s) => s.name === "summary" || s.name === "objective" || s.name === "profile" || s.name === "about"
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
    (s) => s.name === "experience" || s.name === "work experience" || s.name === "employment"
  );
  if (!expSection) return [];

  const expLines = lines.slice(expSection.startLine + 1, expSection.endLine + 1);
  const experiences: Experience[] = [];
  let current: Partial<Experience> = {};

  for (const line of expLines) {
    const datePattern = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s*\d{4}\s*[-–—to]*\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present)\w*\s*\d{0,4}\b/i;
    const dateRangePattern = /\d{4}\s*[-–—]\s*(?:\d{4}|present)/i;

    if (datePattern.test(line) || dateRangePattern.test(line)) {
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
    (s) => s.name === "education" || s.name === "academic"
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
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(lowerText)) {
      found.push(skill);
    }
  }
  return [...new Set(found)];
}
