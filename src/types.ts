export interface JournalMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  messages: JournalMessage[];
  summary: string;
  themes: string[];
  careFlag: boolean;
  careDetails?: {
    flagged: boolean;
    reason?: string;
    detectedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  lastActive: string;
}

export interface CrisisResource {
  id: string;
  region: string;
  name: string;
  contact: string;
  description: string;
  type: 'phone' | 'text' | 'web';
  link?: string;
  hours: string;
}

export interface GeminiReflectResponse {
  reply: string;
  careFlag: boolean;
  crisisResources?: CrisisResource[];
}

export interface FinishReflectionResponse {
  entry: JournalEntry;
  summary: string;
  themes: string[];
  careFlag: boolean;
}
