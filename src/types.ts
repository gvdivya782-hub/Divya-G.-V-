export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type LocationStatus =
  | 'Permission Required'
  | 'Location Verified'
  | 'Location Unavailable'
  | 'Permission Denied';

export type VerificationCheckState =
  | 'Verified ✓'
  | 'Pending'
  | 'Needs confirmation ⚠️'
  | 'Not available';

export interface VerificationCheckItem {
  id: string;
  title: string;
  state: VerificationCheckState;
  evidence: string;
  isSimulated?: boolean;
  isLiveSensor?: boolean;
  actionRequired?: boolean;
}

export type RiskImpactLevel = 'Low' | 'Medium' | 'High';

export interface RiskFactorItem {
  id: string;
  factorName: string;
  currentStatus: string;
  impact: RiskImpactLevel;
  explanation: string;
  isSimulated?: boolean;
  isLiveSensor?: boolean;
  needsConfirmation?: boolean;
}

export interface RiskAssessmentResult {
  factors: RiskFactorItem[];
  overallPriority: 'LOW' | 'MEDIUM' | 'HIGH';
  whyThisPriority: string;
  recommendedAction: string;
  hasNeedsConfirmation: boolean;
}

export interface LiveLocationData {
  status: LocationStatus;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  lastUpdated: string | null;
  errorMessage: string | null;
  placeName?: string | null;
  comparisonNote?: string | null;
}

// ==========================================
// LIFEBRIDGE DOMAIN TYPES
// ==========================================
export interface StructuredCardsData {
  origin?: string;
  destination?: string;
  deadline?: string;
  weather?: string;
  traffic?: string;
  priority: PriorityLevel;
  passenger?: string;
  contextSubject?: string;
  customFields?: {
    label: string;
    value: string;
    icon?: string;
  }[];
}

export interface VerificationItem {
  id: string;
  service: string; // e.g. "Weather Sensor Network"
  status: 'verified' | 'caution' | 'pending';
  result: string; // e.g. "Severe downpour detected (32mm/hr) on Hosur Road / ORR"
  sourceLabel: string; // e.g. "Simulated OpenWeather / Doppler Radar Live Feed"
  isMock: boolean;
  metricBadge?: string;
}

export interface WhyRecommendationFactor {
  inputFactor: string; // e.g. "Hard Deadline: 5:30 PM Doctor Appt"
  verifiedEvidence: string; // e.g. "Verified 72 min transit time + 18 min rain buffer"
  impactOnPlan: string; // e.g. "Forces departure to 4:00 PM to guarantee on-time arrival"
}

export type FactorEvidenceStatus =
  | 'Verified from user input'
  | 'Live Sensor GPS'
  | 'Demo/Simulated'
  | 'Needs confirmation ⚠️'
  | 'Not available';

export type TimelineStageStatus =
  | 'Completed'
  | 'Pending'
  | 'Needs Confirmation'
  | 'Unavailable';

export interface TimelineStageItem {
  id: number;
  name: string;
  stageNumber: number;
  status: TimelineStageStatus;
  timestamp: string | null;
  summary: string;
  details?: string;
  isSimulated?: boolean;
  isLiveSensor?: boolean;
}

export interface ExplainableFactor {
  id: string;
  factorName: string;
  detectedInfo: string;
  status: FactorEvidenceStatus;
  decisionImpact: string;
  recommendationChange: string;
  sourceCategory: 'User input' | 'Device location' | 'Weather data' | 'Traffic data' | 'Other context';
}

export interface ActionPlanData {
  priorityBadge: string; // e.g. "HIGH PRIORITY"
  priorityLevel: PriorityLevel;
  recommendedExecution: string; // e.g. "Recommended departure: 4:00 PM"
  reasonSummary: string; // e.g. "Heavy rain + severe traffic + safety buffer."
  actionsList: string[]; // e.g. ["Leave by 4:00 PM", "Use the recommended route", "Allow extra time because of rain"]
  whyThisRecommendation: WhyRecommendationFactor[];
  tacticalDetails?: {
    primaryRoute?: string;
    durationEst?: string;
    distance?: string;
    safetyBufferMinutes?: number;
    avoidNotes?: string;
  };
  safetyNotice?: string;
}

export interface LifeBridgeProcessedResult {
  intent: string; // e.g. "urgent travel planning"
  summary: string; // Human-digestible synopsis
  importantFacts: string[];
  actions_required: string[];
  structured: StructuredCardsData;
  verifications: VerificationItem[];
  act: ActionPlanData;
  rawInput: string;
  hasImage?: boolean;
}

// ==========================================
// CIVIC / INTENT BRIDGE EXTENDED TYPES
// ==========================================
export type SocietalDomain =
  | 'housing_tenancy'
  | 'healthcare_billing'
  | 'civic_environment'
  | 'disability_benefits'
  | 'small_business_licensing'
  | 'housing'
  | 'healthcare'
  | 'environmental'
  | 'social_services'
  | 'consumer_rights'
  | 'labor_rights'
  | 'general';

export interface HumanIntentInput {
  rawIntent: string;
  domain: SocietalDomain;
  jurisdiction?: string;
  urgencyLevel?: 'low' | 'moderate' | 'high' | 'emergency';
  additionalContext?: string;
}

export interface OntologyMapping {
  humanConcept: string;
  systemTerm: string;
  systemOntology: string;
  statutoryBasis?: string;
  strategicSignificance: string;
}

export interface ActionStep {
  stepNumber: number;
  phase: 'immediate' | 'procedural' | 'adjudication' | 'followup';
  title: string;
  targetEntity: string;
  actionRequired: string;
  evidenceNeeded: string[];
  estimatedTimeline: string;
  failureRisk: string;
  riskMitigation: string;
}

export interface GeneratedArtifact {
  id: string;
  title: string;
  artifactType: 'formal_notice' | 'demand_letter' | 'administrative_petition' | 'evidence_declaration';
  recipientRole: string;
  documentContent: string;
  filingInstructions: string;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  reason: string;
  impactOnCase: string;
}

export interface BridgeCompilationResult {
  intentAnalysis: {
    coreObjective: string;
    underlyingGrievance: string;
    powerImbalanceIdentified: string;
    recommendedPosture: string;
  };
  ontologyTranslations: OntologyMapping[];
  actionPathways: ActionStep[];
  generatedArtifacts: GeneratedArtifact[];
  clarifyingQuestions: ClarifyingQuestion[];
  overallRiskAssessment: {
    systemResistanceLevel: 'low' | 'medium' | 'high' | 'extreme';
    recommendedNextStep: string;
  };
}

export interface SimulationResult {
  simulatedEntity: string;
  entityRole: string;
  initialReaction: string;
  counterarguments: string[];
  approvalLikelihood: number;
  weakPointsInArgument: string[];
  recommendedImprovements: string[];
}

export interface DecodedDocumentResult {
  documentSummary: string;
  coreDemandsOrThreats: string[];
  hiddenTrapdoors: string[];
  plainEnglishTranslation: string;
  proceduralFlaws: string[];
  recommendedImmediateResponse: string;
  suggestedRebuttalLetter: string;
}

// ==========================================
// EVIDENCE & TRUST CENTER TYPES
// ==========================================
export type EvidenceCategory =
  | 'VERIFIED DEVICE DATA'
  | 'SIMULATED DEMO DATA'
  | 'USER-PROVIDED DATA'
  | 'UNAVAILABLE DATA';

export type EvidenceStatus =
  | 'VERIFIED'
  | 'SIMULATED'
  | 'USER-PROVIDED'
  | 'PERMISSION REQUIRED'
  | 'PERMISSION DENIED'
  | 'UNAVAILABLE'
  | 'NEEDS CONFIRMATION';

export type OverallTrustStatus = 'VERIFIED' | 'PARTIAL' | 'NEEDS CONFIRMATION';

export interface EvidenceItem {
  id: string;
  name: string;
  category: EvidenceCategory;
  source: string;
  status: EvidenceStatus;
  lastUpdated?: string;
  detail: string;
  auditNote?: string;
  isSimulated?: boolean;
  isDevice?: boolean;
}

// ==========================================
// MULTILINGUAL TYPES
// ==========================================
export type SupportedLanguageCode =
  | 'en'
  | 'hi'
  | 'mr'
  | 'te'
  | 'ta'
  | 'kn'
  | 'bn'
  | 'gu'
  | 'fr'
  | 'es';

export interface LanguageConfig {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
  placeholder: string;
  samplePrompt: string;
  sampleSummary: string;
}


