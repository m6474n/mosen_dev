/**
 * Types for Mosen Portfolio Application
 */

export interface CaseStudyScreenshot {
  id: string;
  title: string;
  description: string;
  type: 'mobile' | 'desktop' | 'website';
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  tech: string[];
  summary: string;
  challenge: string;
  solution: string;
  results: {
    value: string;
    label: string;
  }[];
  contentMarkdown: string;
  image?: string;
  screenshots?: CaseStudyScreenshot[];
}

export interface Service {
  id: string;
  num: string;
  title: string;
  description: string;
  outcomes: string[];
  pricing?: string;
  iconName: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Product' | 'Script' | 'Template' | 'Utility';
  tags: string[];
  downloadCount: number;
  content: string; // Brief documentation / guide
  codeBlock?: string; // Copyable code/snippets
  fileUrl?: string;
  isPremium?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  contentHtml: string;
  coverImage?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  submittedAt: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export interface EstimatorFeature {
  id: string;
  label: string;
  cost: number;
  time: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  meta: string;
}

export interface MetricPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface BarPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

export interface ActivityGridDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  category?: string;
}


