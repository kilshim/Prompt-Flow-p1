
export enum TechniqueType {
  ZERO_SHOT = 'ZERO_SHOT',
  COT = 'COT',
  FEW_SHOT = 'FEW_SHOT',
  ROLE = 'ROLE',
  EMOTION = 'EMOTION',
  STEP_BACK = 'STEP_BACK'
}

export type GeminiModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface TechniqueInfo {
  type: TechniqueType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  effect: string;
  detail?: {
    concept: string;
    example: string;
  };
}

export interface PromptInputs {
  // Common Fields
  productName: string;
  category: string;
  targetAudience: string;
  keyFeatures: string;
  task: string;
  
  // Specific Fields
  steps?: string; // CoT
  examples?: string; // Few-shot
  role?: string; // Role
  perspective?: string; // Role
  emotion?: string; // Emotion
  attitude?: string; // Emotion
  goal?: string; // Step-back
  criteria?: string; // Step-back
}

export interface PresetTemplate {
  id: string;
  name: string;
  task: string;
  icon: string;
}
