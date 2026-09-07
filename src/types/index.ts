export type JobStatus =
  | 'uploaded'
  | 'converting'
  | 'analyzing'
  | 'planning'
  | 'writing'
  | 'reviewing'
  | 'rendering'
  | 'completed'
  | 'failed';

export type Priority = 'high' | 'medium' | 'low';

export type FileType = 'pdf' | 'docx' | 'pptx' | 'other';

export interface SourceDocument {
  id: string;
  projectId: string;
  fileName: string;
  fileSize: string;
  fileType: FileType;
  priority: Priority;
  uploadedAt: string;
  summary: string;
  relevanceScore: number; // 0 to 100
  markdownContent: string;
  detectedItems: {
    objectives: string[];
    activities: string[];
    exercises: string[];
    experiments: string[];
    imagesAndTables: string[];
  };
}

export interface LessonSection {
  id: string;
  title: string;
  type:
    | 'objectives'
    | 'equipment'
    | 'activity_warmup'
    | 'activity_knowledge'
    | 'activity_practice'
    | 'activity_application'
    | 'assessment'
    | 'rubric'
    | 'notes';
  content: string; // Markdown content
  isLocked: boolean;
  durationMinutes?: number;
  order: number;
}

export interface Lesson {
  id: string;
  projectId: string;
  title: string;
  subject: string;
  grade: string;
  periods: number;
  sections: LessonSection[];
  rawMarkdown: string;
  updatedAt: string;
  templateId: string;
  typstSource: string;
}

export interface JobLog {
  id: string;
  timestamp: string;
  stage: JobStatus;
  message: string;
  details?: string;
  type: 'info' | 'success' | 'agent' | 'warning';
}

export interface JobAgentMetadata {
  modelUsed: string;
  tokensProcessed: number;
  reasoningSteps: number;
  confidenceScore: number;
  activeAgents: string[];
}

export interface Job {
  id: string;
  projectId: string;
  status: JobStatus;
  progressPercentage: number;
  currentStepIndex: number;
  totalSteps: number;
  currentStageName: string;
  logs: JobLog[];
  agentMetadata: JobAgentMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  version: string;
  description: string;
  badge: string;
  author: string;
  previewColor: string;
  typstTemplate: string;
  isActive: boolean;
  features: string[];
  suitableFor: string;
}

export type ReviewSeverity = 'success' | 'warning' | 'error';
export type ReviewCategory = 'objectives' | 'duration' | 'activities' | 'alignment' | 'pedagogy';

export interface ReviewIssue {
  id: string;
  projectId: string;
  severity: ReviewSeverity;
  category: ReviewCategory;
  title: string;
  description: string;
  suggestedFix: string;
  sectionId?: string;
  sectionTitle?: string;
  isResolved: boolean;
}

export interface Project {
  id: string;
  title: string;
  subject: string;
  grade: string;
  periods: number;
  learningOutcomes: string;
  additionalNotes: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  sourceCount: number;
  templateId: string;
  progressPercentage: number;
  currentStageName?: string;
  schoolName?: string;
  teacherName?: string;
}

export interface AnalysisSummary {
  totalSources: number;
  totalTokensEstimated: number;
  overallSummary: string;
  detectedObjectives: string[];
  detectedTeachingActivities: string[];
  exercises: string[];
  experiments: string[];
  imagesAndTables: string[];
  pedagogicalInsights: string[];
}
