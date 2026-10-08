export type ContentType =
  | 'YouTube Short'
  | 'YouTube Video'
  | 'Instagram Reel'
  | 'Facebook Reel'
  | 'Social Post'
  | 'Short / Reel'
  | 'YouTube Long Video'
  | 'Facebook Video'
  | 'Documentary';

export type Duration =
  | '24 sec'
  | '32 sec'
  | '40 sec'
  | '15 sec'
  | '30 sec'
  | '45 sec'
  | '60 sec'
  | '90 sec'
  | '2 min'
  | '5 min'
  | '10 min'
  | 'Custom';

export type VideoFormat = '9:16 Portrait' | '16:9 Horizontal' | '1:1 Square';

export type Language = 'Hindi' | 'Hinglish' | 'English' | 'Gujarati';

export type ContentStyle =
  | 'Informative'
  | 'Documentary'
  | 'Cinematic'
  | 'Technical'
  | 'Viral/Curiosity'
  | 'News Explainer'
  | 'Investigative'
  | 'Storytelling'
  | 'Suspense'
  | 'Emotional'
  | 'Breaking News'
  | 'Explainer';

export type V2NavigationTab =
  // COMMAND CENTER
  | 'Dashboard'
  | 'Create'
  | 'Projects'
  | 'Content Library'
  // INTELLIGENCE
  | 'Research'
  | 'Trend Intelligence'
  | 'Story Intelligence'
  | 'AI Recommendations'
  | 'Analytics'
  | 'Channel Analytics'
  | 'Content Analytics'
  // PRODUCTION
  | 'Script Studio'
  | 'Script'
  | 'Scene Studio'
  | 'Voice Studio'
  | 'Thumbnail Studio'
  | 'SEO Studio'
  | 'Short Production'
  // SYSTEM
  | 'AI Models'
  | 'AI Settings'
  | 'Connected Accounts'
  | 'Settings'
  | 'Account'
  | 'History'
  | 'Theme'
  // Legacy compatibility
  | 'YouTube'
  | 'Facebook'
  | 'Instagram'
  | 'Publishing Queue'
  | 'Scheduler';

export interface PublishingQueueItem {
  id: string;
  projectId: string;
  projectName: string;
  platform: 'YouTube' | 'YouTube Shorts' | 'Facebook' | 'Instagram';
  title: string;
  caption: string;
  scheduledTime?: string;
  status: 'QUEUED' | 'SCHEDULED' | 'PUBLISHED' | 'DRAFT';
  thumbnailUrl?: string;
  videoDuration?: string;
  tags: string[];
}

export type Mood =
  | 'Serious'
  | 'Suspense'
  | 'Dramatic'
  | 'Curious'
  | 'Urgent'
  | 'Emotional'
  | 'Neutral'
  | 'Cinematic'
  | 'Suspenseful'
  | 'Inspirational'
  | 'Mysterious'
  | 'Shocking';

export type Platform =
  | 'YouTube Shorts'
  | 'YouTube'
  | 'Instagram'
  | 'Facebook'
  | 'TikTok'
  | 'Snapchat'
  | 'X'
  | 'Pinterest'
  | 'LinkedIn';

export type OutputTab =
  | 'Overview'
  | 'Source Intelligence'
  | 'Story'
  | 'Story Angle'
  | 'Hooks'
  | 'Viral Hooks'
  | 'Narration'
  | 'Script'
  | 'Quality Check'
  | 'Scenes'
  | 'Video Prompts'
  | 'Video Generation'
  | 'Adobe Express'
  | 'Thumbnail'
  | 'AI Voice'
  | 'Trending Intel'
  | 'SEO'
  | 'YouTube Shorts'
  | 'YouTube'
  | 'Instagram'
  | 'Facebook'
  | 'TikTok'
  | 'Snapchat'
  | 'X'
  | 'Pinterest'
  | 'LinkedIn'
  | 'Keywords'
  | 'Retention'
  | 'Publish Ready'
  | 'Audio';

export type StoryAngleData = StoryAngle;
export type StoryAngleItem = StoryAngle;
export type StoryAnalysisData = ArticleAnalysis;
export type HooksData = HookEngineOutput;
export type WorkflowStageId =
  | 'source-intelligence'
  | 'story-angle'
  | 'viral-hooks'
  | 'script-studio'
  | 'script-doctor'
  | 'scene-blueprint'
  | 'thumbnail-engine'
  | 'seo-engine'
  | 'adobe-express'
  | 'complete-package'
  | 'scenes-visuals'
  | 'thumbnail-studio'
  | 'seo-publishing';

// ==========================================
// THEME & VISUAL CUSTOMIZER TYPES (PART A-C)
// ==========================================
export type ThemePreset =
  | 'GODSEYE DARK'
  | 'LIGHT'
  | 'AMOLED'
  | 'MIDNIGHT BLUE'
  | 'GRAPHITE'
  | 'CYBER'
  | 'CINEMATIC';

export interface ThemeSettings {
  preset: ThemePreset;
  accentColor: string;
  hue: number; // -180 to 180 (default 0)
  saturation: number; // 50 to 200 (default 100)
  brightness: number; // 70 to 130 (default 100)
  accentIntensity: number; // 50 to 150 (default 100)
}

export interface StudioConfig {
  title: string;
  sourceUrl: string;
  storyContent: string;
  contentType: ContentType;
  duration: Duration;
  customDurationSeconds?: number;
  videoFormat: VideoFormat;
  language: Language;
  contentStyle: ContentStyle;
  mood: Mood;
  selectedPlatforms: Platform[];
}

export interface ArticleAnalysis {
  mainTopic: string;
  importantFacts: string[];
  people: string[];
  locations: string[];
  dates: string[];
  numbers: string[];
  mainEvent: string;
  whyItMatters: string;
  curiosityPoints: string[];
  visualOpportunities: string[];
  claims?: string[];
  misinformationOrUncertainty?: string[];
  sourceSummary?: string;
  entities?: string[];
}

export interface ContentDirectorAnalysis {
  storyType: string;
  mainStory: string;
  mainEvent: string;
  importantFacts: string[];
  peopleOrgs: string[];
  location: string;
  timeline: string;
  whyThisStoryMatters: string;
  strongestReveal: string;
  curiosityOpportunity: string;
  emotionalDriver: string;
  visualPotential: string;
  audienceInterest: string;
  potentialAngles: string[];
  bestFormat: string;
  bestDuration: string;
  bestContentStyle: string;
  bestMood: string;
  bestStoryAngle: string;
  whyAngleWorks: string;
  factualIntegrity?: string;
  // Backward compatibility fields:
  mainStoryAngle?: string;
  strongestInformation?: string;
  curiosityGap?: string;
}

export interface StoryAngleOption {
  id: string;
  type: 'Curiosity' | 'Breaking development' | 'Human impact' | 'Explainer' | 'Investigation' | string;
  angle: string;
  shortExplanation: string;
  curiosityPotential: number;
  visualPotential: number;
  isRecommended?: boolean;
  emotionalDirection?: string;
  audienceRelevance?: string;
  recommendedFormat?: 'Short/Reel' | 'Long Video' | string;
}

export interface StoryAngle {
  mainAngle: string;
  whyInteresting: string;
  curiosityElement: string;
  emotionalElement: string;
  visualElement: string;
  bestStoryAngle?: string;
  bestAngleReason?: string;
  selectedAngleId?: string;
  selectedAngle?: string;
  angles?: StoryAngleOption[];
  contentDirector?: ContentDirectorAnalysis;
}

export type HookCategory =
  | 'Curiosity'
  | 'Shock'
  | 'Question'
  | 'Mystery'
  | 'Breaking'
  | 'Unexpected'
  | 'Emotional'
  | 'Contrarian'
  | 'Fact-driven'
  | 'Urgency'
  | 'Shock / Revelation'
  | 'Breaking-news style'
  | 'Storytelling'
  | 'Information gap'
  | 'Consequence'
  | 'High-stakes / consequence';

export interface HookItem {
  id: string;
  category: HookCategory;
  text: string;
  curiosityScore: number;
  hookStrengthScore: number;
  retentionScore: number;
  clarityScore: number;
  totalScore: number;
  isBestHook?: boolean;
}

export interface HookEngineOutput {
  curiosity: string;
  shock: string;
  question: string;
  story: string;
  informationGap: string;
  bestHook: string;
  reason: string;
  hookList?: HookItem[];
  totalScore?: number;
  selectedHookId?: string;
  selectedHook?: string;
}

export interface ScriptSection {
  phase: string;
  name: string;
  narration: string;
  narrationText?: string;
  cue?: string;
  categoryType?: 'FACT' | 'SOURCE INFORMATION' | 'AI INTERPRETATION';
}

export interface VoiceOverDirection {
  voiceStyle: string;
  speed: string;
  energy: string;
  emotion: string;
  pauses: string;
  emphasis: string[];
  narrationStyle: string;
}

export interface ContentQualityMetric {
  score: number;
  status: 'passed' | 'optimized';
  note: string;
}

export interface ContentQualityCheck {
  overallScore: number;
  hookStrength: ContentQualityMetric;
  curiosity: ContentQualityMetric;
  clarity: ContentQualityMetric;
  pacing: ContentQualityMetric;
  informationDensity?: ContentQualityMetric;
  storyFlow?: ContentQualityMetric;
  endingStrength: ContentQualityMetric;
  visualPotential?: ContentQualityMetric;
  factualSafety?: ContentQualityMetric;
  repetition?: ContentQualityMetric;
  weakSentences?: ContentQualityMetric;
  boringSections?: ContentQualityMetric;
  unsupportedClaims?: ContentQualityMetric;
  missingContext?: ContentQualityMetric;
  unnecessarySentences?: ContentQualityMetric;
  poorTransitions?: ContentQualityMetric;
  unclearInformation?: ContentQualityMetric;
  retentionPotential?: ContentQualityMetric;
  factualUncertainty?: ContentQualityMetric;
  problems?: string[];
  suggestedImprovements?: string[];
  autoImprovementsApplied: string[];
  factualIntegrityVerified: boolean;
  disclaimer?: string;
}

export interface AutoImproveResult {
  originalScript: string;
  improvedScript: string;
  improvedPolishedScript: string;
  improvedSections: ScriptSection[];
  whatWasImproved: string[];
  updatedQualityCheck: ContentQualityCheck;
}

export interface HighRetentionScript {
  title: string;
  language: string;
  style: string;
  mood: string;
  duration: string;
  text: string;
  fullScript?: string;
  polishedScript?: string;
  sections: ScriptSection[];
  selectedAngle?: string;
  selectedHook?: string;
  structureType?: string;
  format?: 'Short/Reel' | 'Long Video' | string;
  wordCount?: number;
  estimatedDuration?: string;
  hook?: string;
  body?: string;
  payoff?: string;
  ending?: string;
}

export interface AudioDirection {
  atmosphere: string;
  sfx: string;
  musicMood: string;
}

export interface SceneItem {
  sceneNumber: number;
  title?: string;
  startTime: string;
  endTime: string;
  duration: string;
  time?: string;
  role?: 'HOOK' | 'MAIN' | 'MAIN DETAIL' | 'REVEAL / IMPORTANT DETAIL' | 'ENDING' | string;
  voiceOver: string;
  narration?: string;
  visual: string;
  visualObjective?: string;
  subject?: string;
  action?: string;
  environment?: string;
  timeEra?: string;
  camera: string;
  lens?: string;
  movement?: string;
  composition?: string;
  lighting?: string;
  mood: string;
  style?: string;
  motion?: string;
  continuity?: string;
  continuityNote?: string;
  textGraphics?: string;
  audioAmbience?: string;
  onScreenText: string;
  textPlacement?: string;
  textAnimation?: string;
  transition: string;
  sound: string;
  audio?: AudioDirection;
  negativePrompt?: string;
  videoPrompt: string;
  finalVideoPrompt?: string;
  editorialSafetyNote?: string;
  formatTag?: string;
  // GOD'S EYE V3.0 Flow & Sync additions:
  googleFlowPrompt?: string;
  visualAction?: string;
  audioVisualSync?: string;
  speakingPace?: string;
  wordCount?: number;
  estimatedSpeakingTime?: string;
  syncNotes?: string;
  validationStatus?: 'GREEN' | 'RED' | 'YELLOW';
  validationMessage?: string;
}

export interface ScriptVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  duration: Duration;
  title: string;
  fullHindiScript: string;
  scenes: SceneItem[];
  retentionScore: number;
  hookScore: number;
  storyScore?: number;
  pacingScore?: number;
  visualSyncScore?: number;
  continuityScore?: number;
  notes?: string;
  shortProductionPackage?: ShortProductionPackage;
}

// GOD'S EYE V3.0: Script Quality Engine Evaluation (0-100 scores)
export interface ScriptQualityEvaluation {
  hookScore: number;         // 0–100
  storyScore: number;        // 0–100
  retentionScore: number;    // 0–100
  voiceoverScore: number;    // 0–100
  visualSyncScore: number;   // 0–100
  endingScore: number;       // 0–100
  overallScore: number;      // 0–100
  aiRecommendations: string[];
  durationAccuracyCheck: boolean;
  hindiVoiceOverCheck: boolean;
  syncIntegrityCheck: boolean;
  hookCheck: boolean;
  mainStoryCheck: boolean;
  endingCheck: boolean;
  flowPromptsCheck: boolean;
  continuityCheck: boolean;
}

// GOD'S EYE V3.0: Complete Short Video Production Package
export interface ShortProductionPackage {
  title: string;
  targetDuration: string; // "24 SEC" | "32 SEC" | "40 SEC"
  clipCount: number;      // 3 | 4 | 5
  voiceLanguage: string;  // "Hindi"
  fullHindiScript: string;
  estimatedWpm: number;
  totalWords: number;
  scenes: Array<{
    sceneNumber: number;
    timecode: string;       // "00:00 — 00:08"
    durationSec: number;    // 8
    role: string;           // "HOOK" | "MAIN" | "MAIN DETAIL" | "REVEAL" | "ENDING"
    voiceOver: string;      // Natural spoken Hindi
    googleFlowPrompt: string; // 8-sec optimized Google Flow prompt
    visualAction: string;
    syncExplanation: string;
  }>;
  continuityInstructions: string;
  audioVoiceDirection: string;
  finalTitle: string;
  shortDescription: string;
  suggestedHashtags: string[];
  thumbnailConcept: {
    headline: string;
    visualDescription: string;
    imagePrompt: string;
  };
  qualityAudit: ScriptQualityEvaluation;
  finalChecks: {
    duration: boolean;
    hindiVoiceOver: boolean;
    audioVisualSync: boolean;
    hook: boolean;
    mainStory: boolean;
    ending: boolean;
    flowPrompts: boolean;
    continuity: boolean;
  };
}

export interface MasterVideoStyle {
  cinematicStyle: string;
  colorLighting: string;
  cameraLanguage: string;
  realismLevel: string;
  pacing: string;
  visualContinuity: string;
  documentaryApproach: string;
  aspectRatio: string;
  mood: string;
  visualAesthetic?: string;
  colorPalette?: string;
  lighting?: string;
  cameraMovement?: string;
  atmosphere?: string;
  negativePrompt?: string;
}

export interface AdobeExpressScene {
  sceneNumber: number;
  duration: string;
  visual: string;
  voiceOver: string;
  onScreenText: string;
  textPosition: string;
  captionSubtitle: string;
  transition: string;
  musicDirection?: string;
  soundEffect?: string;
  audioDirection: string;
  editingInstruction: string;
  clip?: string;
  time?: string;
  voiceOverLine?: string;
  subtitleText?: string;
  musicCue?: string;
  sfxCue?: string;
  cutInstruction?: string;
}

export interface FinalEditingChecklist {
  aspectRatio: string;
  resolutionRecommendation: string;
  captionCheck: string;
  audioCheck: string;
  textSafeArea: string;
  thumbnailCheck: string;
  brandingCheck: string;
  factCheckReminder: string;
}

export interface AdobeExpressPackage {
  projectTitle: string;
  aspectRatio: string;
  targetDuration: string;
  overview: string;
  scenes: AdobeExpressScene[];
  timeline?: any[];
  checklist?: FinalEditingChecklist;
}

export interface RetentionAnalysisData {
  hookStrength: number;
  curiosity: number;
  storyFlow: number;
  emotionalImpact: number;
  visualPotential: number;
  shareabilityPotential: number;
  aiEstimateDisclaimer?: string;
  improvements: string[];
  top3RetentionImprovements?: string[];
}

// ==========================================
// PART 1: THUMBNAIL ENGINE DATA STRUCTURES
// ==========================================
export interface ThumbnailTextOptions {
  option1: string;
  option2: string;
  option3: string;
}

export interface ThumbnailConcept {
  concept: string;
  subject: string;
  background: string;
  visualStory: string;
  emotion: string;
  curiosityElement: string;
  curiosityTrigger?: string;
  emotionalImpact?: string;
  composition: string;
  lighting?: string;
  camera?: string;
  headline: string; // Suggested Thumbnail Text (separated from prompt)
  textOptions?: ThumbnailTextOptions;
  selectedText?: string;
  textPlacement?: string;
  negativeInstructions?: string;
  format?: string;
  aspectRatio?: '9:16' | '16:9' | '1:1';
  resolution?: string;
  imagePrompt: string; // Photorealistic AI image generation prompt
}

export interface BestThumbnail {
  conceptName: string;
  headlineText: string;
  imagePrompt: string;
  selectionRationale: string;
  mobileReadability: string;
  focalSubject: string;
  textOptions?: ThumbnailTextOptions;
}

export interface PlatformThumbnail {
  concept: string;
  headline: string;
  imagePrompt: string;
  composition: string;
}

export interface ThumbnailStudioVariant {
  id: string;
  name: string;
  type: 'composition' | 'camera' | 'lighting' | 'background' | 'focal';
  concept: ThumbnailConcept;
  imageUrl?: string;
  timestamp: string;
  model?: string;
}

export interface ThumbnailStudioRecord {
  activeConcept: ThumbnailConcept;
  textOptions: ThumbnailTextOptions;
  selectedText: string;
  imagePrompt: string;
  generatedImageUrl?: string;
  generatedAt?: string;
  modelUsed?: string;
  videoFormat: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  resolution: string;
  variants?: ThumbnailStudioVariant[];
  history?: Array<{
    imageUrl?: string;
    prompt: string;
    timestamp: string;
    model?: string;
  }>;
}

export interface ThumbnailPackage {
  concepts: ThumbnailConcept[];
  variants?: ThumbnailConcept[];
  bestThumbnail?: BestThumbnail;
  youtube: PlatformThumbnail;
  facebook: PlatformThumbnail;
  studioRecord?: ThumbnailStudioRecord;
  generatedImage?: {
    imageUrl: string;
    model: string;
    timestamp: number;
    prompt: string;
    aspectRatio: string;
  };
}

// ==========================================
// WORKFLOW STATE PIPELINE (BATCH 2)
// ==========================================
export type WorkflowStage =
  | 'source'
  | 'sourceIntel'
  | 'storyAngle'
  | 'hooks'
  | 'script'
  | 'scriptDoctor'
  | 'scenes'
  | 'thumbnails'
  | 'seo'
  | 'publishReady';

export interface WorkflowStageMeta {
  id: WorkflowStage;
  label: string;
  shortLabel: string;
  stepNumber: number;
  description: string;
}

// ==========================================
// PART 2: MULTI-PLATFORM SEO DATA STRUCTURES
// ==========================================
export interface YouTubeShortsTitles {
  highCtr: string;
  curiosity: string;
  searchOptimized: string;
  informative: string;
  dramatic: string;
}

export interface YouTubeShortsSeo {
  titles: YouTubeShortsTitles;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  searchPhrases: string[];
  hashtags: string[];
  cta: string;
}

export interface ChapterSuggestion {
  time: string;
  title: string;
}

export interface YouTubeLongSeo {
  titles: string[];
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  searchPhrases: string[];
  chapters: ChapterSuggestion[];
  hashtags: string[];
  cta: string;
}

export interface InstagramReelsSeo {
  caption: string;
  firstLineHook: string;
  searchKeywords: string[];
  hashtags: string[];
  cta: string;
}

export interface FacebookReelsSeo {
  caption: string;
  searchKeywords: string[];
  hashtags: string[];
  cta: string;
}

export interface FacebookVideoSeo {
  title: string;
  description: string;
  keywords: string[];
  hashtags: string[];
  cta: string;
}

export interface TikTokSeo {
  caption: string;
  searchKeywords: string[];
  hashtags: string[];
  cta: string;
}

export interface SnapchatSeo {
  caption: string;
  topicKeywords: string[];
  hashtags: string[];
  cta: string;
}

export interface XSeo {
  postText: string;
  searchKeywords: string[];
  hashtags: string[];
  cta: string;
}

export interface PinterestSeo {
  pinTitle: string;
  pinDescription: string;
  searchKeywords: string[];
  longTailKeywords: string[];
  hashtags: string[];
}

export interface LinkedInSeo {
  postText: string;
  keywords: string[];
  hashtags: string[];
  cta: string;
}

export interface MultiPlatformSeoPackage {
  youtubeShorts: YouTubeShortsSeo;
  youtubeLong: YouTubeLongSeo;
  instagram: InstagramReelsSeo;
  facebookReels: FacebookReelsSeo;
  facebookVideo: FacebookVideoSeo;
  tiktok: TikTokSeo;
  snapchat: SnapchatSeo;
  x: XSeo;
  pinterest: PinterestSeo;
  linkedin: LinkedInSeo;
}

// ==========================================
// PART 3: KEYWORD ENGINE DATA STRUCTURE
// ==========================================
export interface KeywordsPackage {
  primary: string[];
  secondary: string[];
  longTail: string[];
  questions: string[];
  relatedSearches: string[];
  topicKeywords: string[];
}

export type TitleCategory =
  | 'High CTR'
  | 'Curiosity'
  | 'Search Optimized'
  | 'Informative'
  | 'Dramatic'
  | 'Question'
  | 'News Explainer';

export interface TitleOption {
  id: string;
  title: string;
  category: TitleCategory;
  ctrPotential: number;
  searchRelevance: number;
  curiosity: number;
  clarity: number;
  totalScore: number;
  isRecommended?: boolean;
}

export interface TitleEngineOutput {
  options: TitleOption[];
  recommendedTitle: string;
  explanation: string;
}

export interface TrendingIntelligenceData {
  topic: string;
  trendPotential: number; // 1-10
  searchPotential: number; // 1-10
  audienceInterest: number; // 1-10
  saturationRisk: 'Low' | 'Medium' | 'High';
  disclaimer: string; // "Trend data unavailable — AI topic potential estimate."
  insights: string[];
}

export type RegenerateComponentType =
  | 'storyAngle'
  | 'hook'
  | 'script'
  | 'scriptDoctor'
  | 'scenes'
  | 'scene'
  | 'videoPrompts'
  | 'thumbnail'
  | 'seo';

// Master Godseye AI Generation Result
export interface GodseyeAiResult {
  analysis: ArticleAnalysis;
  storyAngle: StoryAngle;
  contentDirector?: ContentDirectorAnalysis;
  hooks: HookEngineOutput;
  script: HighRetentionScript;
  polishedScript?: string;
  voiceOverDirection?: VoiceOverDirection;
  qualityCheck?: ContentQualityCheck;
  scenes: SceneItem[];
  masterVideoStyle?: MasterVideoStyle;
  adobeExpressPlan?: AdobeExpressPackage;
  retention: RetentionAnalysisData;
  thumbnails: ThumbnailPackage;
  seo: MultiPlatformSeoPackage;
  titleEngine?: TitleEngineOutput;
  trendIntelligence?: TrendingIntelligenceData;
  keywords: KeywordsPackage;
  disclaimer: string;
  thumbnailStudioRecord?: ThumbnailStudioRecord;
  // GOD'S EYE V3.0 additions:
  shortProductionPackage?: ShortProductionPackage;
  scriptQualityAudit?: ScriptQualityEvaluation;
  scriptVersions?: ScriptVersion[];
  // Step 7 extensions:
  ttsAudio?: TTSAudioData;
  videoSettings?: VideoSettingsConfig;
  sceneStatuses?: Record<number, SceneStatusType>;
}

// ==========================================
// STEP 7: VIDEO GENERATION HUB & TTS ENGINE
// ==========================================
export type VideoWorkflowType =
  | 'Google Flow / Veo'
  | 'Other AI Video Tool'
  | 'Adobe Express'
  | 'Manual Production';

export type SceneStatusType = 'NOT READY' | 'READY' | 'COPIED' | 'COMPLETED';

export type VideoQualityOption = 'Standard' | 'High' | 'Cinematic';

export type CameraStyleOption =
  | 'Auto'
  | 'Cinematic'
  | 'Documentary'
  | 'Handheld'
  | 'Technical'
  | 'Dramatic';

export type MotionLevelOption = 'Low' | 'Medium' | 'High';

export type VisualConsistencyOption = 'Standard' | 'High';

export interface VideoSettingsConfig {
  videoQuality: VideoQualityOption;
  cameraStyle: CameraStyleOption;
  motionLevel: MotionLevelOption;
  visualConsistency: VisualConsistencyOption;
}

export interface VideoProvider {
  name: string;
  isConfigured: boolean;
  generateClip?: (prompt: string, options: any) => Promise<{ clipUrl: string }>;
}

// TTS Engine Types
export type TTSVoice = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede';

export type TTSSpeakingStyle =
  | 'News Presenter'
  | 'Documentary'
  | 'Cinematic'
  | 'Suspense'
  | 'Dramatic'
  | 'Informative'
  | 'Technical'
  | 'Emotional'
  | 'Storytelling';

export type TTSLanguage =
  | 'Hindi'
  | 'English'
  | 'Hinglish'
  | 'Gujarati'
  | 'Marathi'
  | 'Bengali'
  | 'Tamil'
  | 'Telugu'
  | 'Punjabi';

export interface TTSConfig {
  language: TTSLanguage;
  voice: TTSVoice;
  speed: number;
  speakingStyle: TTSSpeakingStyle;
  pitch: string;
  energy: string;
  customDirection?: string;
}

export interface SceneTiming {
  sceneNumber: number;
  startTime: string;
  endTime: string;
  duration: string;
  voiceOver: string;
}

export interface TTSAudioData {
  audioUrl?: string;
  durationSeconds?: number;
  base64Data?: string;
  mimeType?: string;
  status: 'IDLE' | 'GENERATING' | 'READY' | 'FAILED';
  error?: string;
  voiceUsed?: string;
  languageUsed?: string;
  sceneTimings?: SceneTiming[];
  generatedAt?: string;
}


// ==========================================
// STEP 6: PROJECT HISTORY DATA STRUCTURES
// ==========================================
export type ProjectStatus = 'DRAFT' | 'GENERATED' | 'READY';

export interface GodseyeProject {
  id: string;
  userId?: string;
  name: string;
  status: ProjectStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  article: {
    title: string;
    content: string;
    url: string;
  };
  settings: {
    contentType: ContentType;
    duration: Duration;
    customDurationSeconds?: number;
    videoFormat: VideoFormat;
    language: Language;
    contentStyle: ContentStyle;
    mood: Mood;
    platforms: Platform[];
  };
  content: GodseyeAiResult | null;
  result?: any;
  scriptVersions?: ScriptVersion[];
}

export interface ProjectFilterOptions {
  searchQuery: string;
  statusFilter: 'ALL' | ProjectStatus;
  contentTypeFilter?: ContentType | 'ALL';
  sortBy: 'recent' | 'oldest' | 'name';
}
