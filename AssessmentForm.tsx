export interface AssessmentResult {
  probability: number;
  tier: 'high' | 'moderate' | 'low';
  recommendation: string;
  warnings: string[];
  disclaimer: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export type Language = 'en' | 'zh';

export interface FormData {
  passType: string;
  nationality: string;
  age: string;
  salary: string;
  sector: string;
  education: string;
  universityTier: string;
  district: string;
  yearsInSG: string;
  familyTies: string;
}
