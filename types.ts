
export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  EXPERT = 'Expert'
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SkillProfile {
  skills: string[];
  tools: string[];
  experience: ExperienceLevel;
  preferredClients: string[];
}

export interface Niche {
  id: string;
  name: string;
  description: string;
}

export interface NodeBlueprint {
  name: string;
  type: string;
  description: string;
}

export interface Blueprint {
  goal: string;
  inputs: string[];
  outputs: string[];
  trigger: string;
  steps: NodeBlueprint[];
  errorHandling: string;
}

export interface Idea {
  id: string;
  nicheId: string;
  title: string;
  problemStatement: string;
  outcome: string;
  monetizationModel: string;
  targetClient: string;
  icpDescriptions: string[];
  outreachAngles: string[];
  blueprint?: Blueprint;
  workflowJson?: string;
}

export interface Template {
  id: string;
  title: string;
  niche: string;
  description: string;
  tools: string[];
  workflowJson: string;
}

export enum PlaybookStatus {
  IDEA = 'Idea',
  DESIGNING = 'Designing',
  PITCHING = 'Pitching',
  LIVE = 'Live'
}

export interface PlaybookEntry {
  id: string;
  idea: Idea;
  status: PlaybookStatus;
  notes: string;
  createdAt: number;
}

export interface Session {
  id: string;
  profile: SkillProfile;
  selectedNiches: Niche[];
  generatedIdeas: Idea[];
  createdAt: number;
}
