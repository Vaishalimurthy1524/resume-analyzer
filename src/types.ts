export interface ResumeData {
  text: string;
  fileName: string;
}

export interface ParsedResume {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  sections: string[];
  rawText: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
  matchScore: number;
}

export interface AnalysisResult {
  overallScore: number;
  scores: CategoryScore[];
  parsedResume: ParsedResume;
  strengths: string[];
  improvements: string[];
  skillAnalysis: SkillCategory[];
  atsCompatibility: ATSReport;
  keywordMatch: KeywordReport;
  formattingScore: number;
  recommendations: Recommendation[];
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface ATSReport {
  score: number;
  issues: string[];
  passes: string[];
}

export interface KeywordReport {
  found: string[];
  missing: string[];
  relevant: string[];
}

export interface Recommendation {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  category: string;
}
