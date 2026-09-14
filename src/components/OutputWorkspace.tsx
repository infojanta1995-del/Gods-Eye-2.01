import React, { useState } from 'react';
import {
  Copy,
  RotateCcw,
  Sparkles,
  FileText,
  Clapperboard,
  Image as ImageIcon,
  KeyRound,
  TrendingUp,
  Layers,
  Video,
  Share2,
  Tv,
  CheckCircle2,
  Info,
  Camera,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Compass,
  Volume2,
  Type,
  Tag,
  Send,
} from 'lucide-react';
import {
  OutputTab,
  StudioConfig,
  GodseyeAiResult,
  RegenerateComponentType,
  VideoFormat,
  WorkflowStageId,
  WorkflowStage,
  V2NavigationTab,
  StoryAngleOption,
  StoryAngleItem,
  HookItem,
  HighRetentionScript,
  ContentQualityCheck,
} from '../types';
import { QualityCheckSection } from './output/QualityCheckSection';
import { formatSingleScenePackage, formatAllScenesPackage, buildStandalonePrompt } from '../utils/formatSpecs';
import { ThumbnailSection } from './output/ThumbnailSection';
import { SeoPlatformSection } from './output/SeoPlatformSection';
import { KeywordsSection } from './output/KeywordsSection';
import { VideoPromptsSection } from './output/VideoPromptsSection';
import { AdobeExpressSection } from './output/AdobeExpressSection';
import { VideoGenerationHub } from './VideoGenerationHub';
import { AiVoiceGenerator } from './AiVoiceGenerator';
import { ContentDirectorSection } from './output/ContentDirectorSection';
import { ViralHooksSection } from './output/ViralHooksSection';
import { TrendingIntelligenceSection } from './output/TrendingIntelligenceSection';
import { TitleEngineSection } from './output/TitleEngineSection';
import { WorkflowStepper } from './output/WorkflowStepper';
import { SourceIntelligenceSection } from './output/SourceIntelligenceSection';
import { StoryAngleSection } from './output/StoryAngleSection';
import { ScriptSection } from './output/ScriptSection';
import { PublishReadySection } from './output/PublishReadySection';

interface OutputWorkspaceProps {
  config: StudioConfig;
  hasStoryContent: boolean;
  isInitialized: boolean;
  aiResult: GodseyeAiResult | null;
  isLoading: boolean;
  projectName?: string;
  onRegenerate: () => void;
  onRegenerateComponent?: (
    component: RegenerateComponentType,
    options?: { sceneNumber?: number; customPrompt?: string }
  ) => void;
  onUpdateVideoFormat?: (format: VideoFormat) => void;
  onUpdateAiResult?: (updated: GodseyeAiResult) => void;
  onNavigateTab?: (tab: V2NavigationTab) => void;
}

const PRIMARY_TABS: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
  { id: 'Source Intelligence', label: '1. Intel', icon: <Info className="w-4 h-4 text-cyan-400" /> },
  { id: 'Story Angle', label: '2. Angle', icon: <Compass className="w-4 h-4 text-cyan-400" /> },
  { id: 'Viral Hooks', label: '3. Hooks', icon: <Flame className="w-4 h-4 text-rose-400" /> },
  { id: 'Script', label: '4. Script', icon: <FileText className="w-4 h-4 text-blue-400" /> },
  { id: 'Quality Check', label: '5. Doctor', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
  { id: 'Scenes', label: '6. Scenes', icon: <Clapperboard className="w-4 h-4 text-purple-400" /> },
  { id: 'Thumbnail', label: '7. Thumbnail', icon: <ImageIcon className="w-4 h-4 text-amber-400" /> },
  { id: 'SEO', label: '8. SEO', icon: <Tag className="w-4 h-4 text-emerald-400" /> },
  { id: 'Publish Ready', label: '9. Publish', icon: <Send className="w-4 h-4 text-emerald-400" /> },
  { id: 'Overview', label: 'Package', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
];

const STAGE_TO_TAB_MAP: Record<WorkflowStageId, OutputTab> = {
  'source-intelligence': 'Source Intelligence',
  'story-angle': 'Story Angle',
  'viral-hooks': 'Viral Hooks',
  'script-studio': 'Script',
  'script-doctor': 'Quality Check',
  'scene-blueprint': 'Scenes',
  'scenes-visuals': 'Scenes',
  'thumbnail-engine': 'Thumbnail',
  'thumbnail-studio': 'Thumbnail',
  'seo-engine': 'SEO',
  'seo-publishing': 'SEO',
  'adobe-express': 'Adobe Express',
  'complete-package': 'Overview',
};

const TAB_TO_STAGE_MAP: Record<string, WorkflowStageId> = {
  'Source Intelligence': 'source-intelligence',
  'Story Angle': 'story-angle',
  'Story': 'story-angle',
  'Viral Hooks': 'viral-hooks',
  'Hooks': 'viral-hooks',
  'Script': 'script-studio',
  'Quality Check': 'script-doctor',
  'Scenes': 'scene-blueprint',
  'Video Prompts': 'scene-blueprint',
  'Thumbnail': 'thumbnail-engine',
  'SEO': 'seo-engine',
  'YouTube Shorts': 'seo-engine',
  'YouTube': 'seo-engine',
  'Instagram': 'seo-engine',
  'Facebook': 'seo-engine',
  'TikTok': 'seo-engine',
  'Adobe Express': 'adobe-express',
  'Overview': 'complete-package',
};

const MORE_TABS: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
  { id: 'Video Generation', label: 'Video Generation', icon: <Video className="w-3.5 h-3.5 text-cyan-400" /> },
  { id: 'Adobe Express', label: 'Adobe Express', icon: <Sparkles className="w-3.5 h-3.5 text-red-400" /> },
  { id: 'Quality Check', label: 'Quality Check', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'Keywords', label: 'Keywords', icon: <KeyRound className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'Retention', label: 'Retention', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> },
  { id: 'YouTube Shorts', label: 'YouTube Shorts', icon: <Tv className="w-3.5 h-3.5 text-rose-400" /> },
  { id: 'YouTube', label: 'YouTube Long', icon: <Tv className="w-3.5 h-3.5 text-red-500" /> },
  { id: 'Instagram', label: 'Instagram', icon: <Share2 className="w-3.5 h-3.5 text-pink-400" /> },
  { id: 'Facebook', label: 'Facebook', icon: <Share2 className="w-3.5 h-3.5 text-blue-400" /> },
  { id: 'TikTok', label: 'TikTok', icon: <Share2 className="w-3.5 h-3.5 text-cyan-300" /> },
  { id: 'LinkedIn', label: 'LinkedIn', icon: <Share2 className="w-3.5 h-3.5 text-blue-600" /> },
];

const mapTabToWorkflowStage = (tab: OutputTab): WorkflowStage => {
  switch (tab) {
    case 'Source Intelligence':
      return 'sourceIntel';
    case 'Story':
    case 'Story Angle':
      return 'storyAngle';
    case 'Hooks':
    case 'Viral Hooks':
      return 'hooks';
    case 'Script':
    case 'Narration':
    case 'AI Voice':
      return 'script';
    case 'Quality Check':
      return 'scriptDoctor';
    case 'Scenes':
    case 'Video Prompts':
    case 'Video Generation':
    case 'Adobe Express':
      return 'scenes';
    case 'Thumbnail':
      return 'thumbnails';
    case 'SEO':
    case 'YouTube Shorts':
    case 'YouTube':
    case 'Instagram':
    case 'Facebook':
    case 'TikTok':
    case 'Snapchat':
    case 'X':
    case 'Pinterest':
    case 'LinkedIn':
    case 'Keywords':
    case 'Trending Intel':
    case 'Retention':
      return 'seo';
    case 'Publish Ready':
    case 'Overview':
      return 'publishReady';
    default:
      return 'sourceIntel';
  }
};

export const OutputWorkspace: React.FC<OutputWorkspaceProps> = ({
  config,
  hasStoryContent,
  isInitialized,
  aiResult,
  isLoading,
  projectName,
  onRegenerate,
  onRegenerateComponent,
  onUpdateVideoFormat,
  onUpdateAiResult,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<OutputTab>('Overview');
  const [showMoreTools, setShowMoreTools] = useState<boolean>(false);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  const handleWorkflowStageSelect = (stage: WorkflowStage) => {
    switch (stage) {
      case 'source': {
        const sourceInput =
          document.getElementById('source-article-input') ||
          document.getElementById('article-section') ||
          document.getElementById('article-input-box');
        if (sourceInput) {
          sourceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          sourceInput.focus();
        }
        break;
      }
      case 'sourceIntel':
        setActiveTab('Source Intelligence');
        break;
      case 'storyAngle':
        setActiveTab('Story Angle');
        break;
      case 'hooks':
        setActiveTab('Viral Hooks');
        break;
      case 'script':
        setActiveTab('Script');
        break;
      case 'scriptDoctor':
        setActiveTab('Quality Check');
        break;
      case 'scenes':
        setActiveTab('Scenes');
        break;
      case 'thumbnails':
        setActiveTab('Thumbnail');
        break;
      case 'seo':
        setActiveTab('SEO');
        break;
      case 'publishReady':
        setActiveTab('Publish Ready');
        break;
    }
  };

  const showToast = (message: string) => {
    setCopyNotification(message);
    setTimeout(() => {
      setCopyNotification(null);
    }, 2800);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast(`Copied ${label} to clipboard!`);
  };

  // Copy single scene package
  const handleCopySingleScene = (scene: (typeof aiResult)['scenes'][0]) => {
    const text = formatSingleScenePackage(
      scene,
      config.videoFormat,
      config.mood,
      aiResult?.masterVideoStyle
    );
    navigator.clipboard.writeText(text).catch(() => {});
    showToast(`Copied Scene ${scene.sceneNumber} Package!`);
  };

  // Copy all scenes package
  const handleCopyFullScenePackage = () => {
    if (!aiResult?.scenes?.length) {
      showToast('No scenes generated yet');
      return;
    }
    const text = formatAllScenesPackage(
      aiResult.scenes,
      config.videoFormat,
      config.mood,
      aiResult.script?.duration || config.duration,
      aiResult.masterVideoStyle
    );
    navigator.clipboard.writeText(text).catch(() => {});
    showToast('Copied Full Scene Package (All Scenes)!');
  };

  // Copy current active tab
  const handleCopyCurrentTab = () => {
    let content = '';

    if (aiResult) {
      switch (activeTab) {
        case 'Source Intelligence':
          content = `GODSEYE AI - SOURCE INTELLIGENCE EXTRACTION
Topic: ${aiResult.analysis?.mainTopic}
Main Event: ${aiResult.analysis?.mainEvent}
Why It Matters: ${aiResult.analysis?.whyItMatters}

Extracted Facts & Numbers:
${aiResult.analysis?.importantFacts?.map((f) => `• ${f}`).join('\n')}

Key People & Entities:
${aiResult.analysis?.peopleEntities?.map((p) => `• ${p}`).join('\n')}

Key Locations:
${aiResult.analysis?.locations?.map((l) => `• ${l}`).join('\n')}

Chronological Timeline:
${aiResult.analysis?.timeline || 'Documented chronology'}

Visual Opportunities:
${aiResult.analysis?.visualOpportunities?.map((v) => `• ${v}`).join('\n')}`;
          break;

        case 'Story Angle':
        case 'Story':
          content = `GODSEYE AI - STORY ANGLE ENGINE
Selected Angle: ${aiResult.storyAngle?.bestStoryAngle || aiResult.storyAngle?.mainAngle}
Strategic Rationale: ${aiResult.storyAngle?.bestAngleReason || aiResult.storyAngle?.whyInteresting}

Curiosity Gap: ${aiResult.storyAngle?.curiosityElement}
Emotional Anchor: ${aiResult.storyAngle?.emotionalElement}
Visual Element: ${aiResult.storyAngle?.visualElement}

All 5 Strategic Formulations:
${aiResult.storyAngle?.angles?.map((a, i) => `${i + 1}. [${a.type}] "${a.angle}" (Curiosity: ${a.curiosityPotential}/10, Visual: ${a.visualPotential}/10)\n   ${a.shortExplanation}`).join('\n\n')}`;
          break;

        case 'Viral Hooks':
        case 'Hooks':
          content = `GODSEYE AI - VIRAL HOOK MATRIX
Selected Hook: "${aiResult.hooks?.selectedHook || aiResult.hooks?.bestHook}"
Formula / Reason: ${aiResult.hooks?.reason}

10 Category Matrix:
${aiResult.hooks?.hookList?.map((h, i) => `${i + 1}. [${h.category}] "${h.text}"\n   Score: ${h.totalScore}/10 (Curiosity: ${h.curiosityScore}, Strength: ${h.hookStrengthScore}, Retention: ${h.retentionScore}, Clarity: ${h.clarityScore})`).join('\n\n')}`;
          break;

        case 'Overview':
          content = `GODSEYE AI - OVERVIEW & STORY ANALYSIS
Topic: ${aiResult.analysis.mainTopic}
Main Angle: ${aiResult.storyAngle.mainAngle}
Why Interesting: ${aiResult.storyAngle.whyInteresting}
Curiosity Element: ${aiResult.storyAngle.curiosityElement}
Emotional Element: ${aiResult.storyAngle.emotionalElement}
Visual Element: ${aiResult.storyAngle.visualElement}

Main Event: ${aiResult.analysis.mainEvent}
Why It Matters: ${aiResult.analysis.whyItMatters}

Facts:
${aiResult.analysis.importantFacts.map((f) => `• ${f}`).join('\n')}`;
          break;

        case 'Quality Check':
          if (aiResult.qualityCheck) {
            content = `GODSEYE AI - CONTENT QUALITY CHECK AUDIT
Overall Quality Score: ${aiResult.qualityCheck.overallScore}/10
Factual Integrity: ${aiResult.qualityCheck.factualIntegrityVerified ? 'VERIFIED (100% Truthful)' : 'Pending'}

Hook Strength: ${aiResult.qualityCheck.hookStrength.score}/10 [${aiResult.qualityCheck.hookStrength.status}] - ${aiResult.qualityCheck.hookStrength.note}
Curiosity Gap: ${aiResult.qualityCheck.curiosity.score}/10 [${aiResult.qualityCheck.curiosity.status}] - ${aiResult.qualityCheck.curiosity.note}
Clarity: ${aiResult.qualityCheck.clarity.score}/10 [${aiResult.qualityCheck.clarity.status}] - ${aiResult.qualityCheck.clarity.note}
Pacing: ${aiResult.qualityCheck.pacing.score}/10 [${aiResult.qualityCheck.pacing.status}] - ${aiResult.qualityCheck.pacing.note}
Repetition: ${aiResult.qualityCheck.repetition.score}/10 [${aiResult.qualityCheck.repetition.status}] - ${aiResult.qualityCheck.repetition.note}
Weak Sentences: ${aiResult.qualityCheck.weakSentences.score}/10 [${aiResult.qualityCheck.weakSentences.status}] - ${aiResult.qualityCheck.weakSentences.note}
Boring Sections: ${aiResult.qualityCheck.boringSections.score}/10 [${aiResult.qualityCheck.boringSections.status}] - ${aiResult.qualityCheck.boringSections.note}
Unsupported Claims: ${aiResult.qualityCheck.unsupportedClaims.score}/10 [${aiResult.qualityCheck.unsupportedClaims.status}] - ${aiResult.qualityCheck.unsupportedClaims.note}
Missing Context: ${aiResult.qualityCheck.missingContext.score}/10 [${aiResult.qualityCheck.missingContext.status}] - ${aiResult.qualityCheck.missingContext.note}
Ending Strength: ${aiResult.qualityCheck.endingStrength.score}/10 [${aiResult.qualityCheck.endingStrength.status}] - ${aiResult.qualityCheck.endingStrength.note}

Auto-Improvements Applied:
${aiResult.qualityCheck.autoImprovementsApplied.map((imp) => `• ${imp}`).join('\n')}`;
          } else {
            content = 'No Quality Check data available.';
          }
          break;

        case 'Script':
          content = `GODSEYE AI - HIGH RETENTION SCRIPT
Title: ${aiResult.script.title}
Duration: ${aiResult.script.duration} | Language: ${aiResult.script.language}
Style: ${aiResult.script.style} | Mood: ${aiResult.script.mood}

Best Hook:
"${aiResult.hooks.bestHook}"
(Why: ${aiResult.hooks.reason})

Full Script:
${aiResult.script.text}

Timed Breakdown:
${aiResult.script.sections.map((s) => `[${s.phase}] ${s.name}: ${s.narration}`).join('\n\n')}`;
          break;

        case 'Video Generation':
          content = `GODSEYE AI - VIDEO GENERATION HUB
==================================================
Master Style: ${aiResult.masterVideoStyle?.visualAesthetic || 'Cinematic Documentary'}
Color: ${aiResult.masterVideoStyle?.colorPalette}
Lighting: ${aiResult.masterVideoStyle?.lighting}

SCENE PROMPTS:
${aiResult.scenes.map((s) => `SCENE ${s.sceneNumber} (${s.startTime || '00:00'} - ${s.endTime || '00:05'} | ${s.duration || '5s'}):\n${buildStandalonePrompt(s, config.videoFormat, config.mood, aiResult.masterVideoStyle)}`).join('\n\n')}`;
          break;

        case 'Scenes':
          content = `GODSEYE AI - SCENE STORYBOARD
${aiResult.scenes
  .map(
    (s) => `SCENE ${s.sceneNumber} (${s.startTime} - ${s.endTime} | ${s.duration})
VOICE: ${s.voiceOver}
VISUAL: ${s.visual}
ON-SCREEN TEXT: ${s.onScreenText}
CAMERA: ${s.camera}
TRANSITION: ${s.transition}
SOUND: ${s.sound}`
  )
  .join('\n\n---\n\n')}`;
          break;

        case 'Video Prompts':
          content = formatAllScenesPackage(
            aiResult.scenes,
            config.videoFormat,
            config.mood,
            aiResult.script?.duration || config.duration,
            aiResult.masterVideoStyle
          );
          break;

        case 'Adobe Express':
          if (aiResult.adobeExpressPlan) {
            content = `GODSEYE AI - ADOBE EXPRESS VIDEO ASSEMBLY PLAN
Project Title: ${aiResult.adobeExpressPlan.projectTitle}
Aspect Ratio: ${aiResult.adobeExpressPlan.aspectRatio}
Target Duration: ${aiResult.adobeExpressPlan.targetDuration}
Overview: ${aiResult.adobeExpressPlan.overview}

TIMELINE SCENE SEQUENCE:
${aiResult.adobeExpressPlan.scenes
  .map(
    (s) => `Scene ${s.sceneNumber} (${s.duration}):
• Visual Clip Guidance: ${s.visual}
• Voice-Over Line: "${s.voiceOver}"
• Headline Text: "${s.onScreenText}"
• Auto-Caption Subtitle: "${s.captionSubtitle}"
• Transition: ${s.transition}
• Audio Mix: ${s.audioDirection}`
  )
  .join('\n\n')}`;
          } else {
            content = 'No Adobe Express plan generated yet.';
          }
          break;

        case 'Thumbnail':
          content = `GODSEYE AI - THUMBNAIL CONCEPTS
${aiResult.thumbnails?.concepts
  ?.map(
    (c, i) => `CONCEPT ${i + 1}: ${c.concept}
Suggested Text: "${c.headline}"
Subject: ${c.subject}
Background: ${c.background}
Emotion: ${c.emotion}
Curiosity: ${c.curiosityElement}
Composition: ${c.composition}
Image Prompt:
${c.imagePrompt}`
  )
  .join('\n\n---\n\n')}

PRIMARY YOUTUBE THUMBNAIL:
Concept: ${aiResult.thumbnails?.youtube?.concept}
Text: "${aiResult.thumbnails?.youtube?.headline}"
Prompt: ${aiResult.thumbnails?.youtube?.imagePrompt}

FACEBOOK THUMBNAIL:
Concept: ${aiResult.thumbnails?.facebook?.concept}
Text: "${aiResult.thumbnails?.facebook?.headline}"
Prompt: ${aiResult.thumbnails?.facebook?.imagePrompt}`;
          break;

        case 'YouTube Shorts':
          content = `GODSEYE AI - YOUTUBE SHORTS SEO
Titles:
1. High CTR: ${aiResult.seo?.youtubeShorts?.titles?.highCtr}
2. Curiosity: ${aiResult.seo?.youtubeShorts?.titles?.curiosity}
3. Search Optimized: ${aiResult.seo?.youtubeShorts?.titles?.searchOptimized}
4. Informative: ${aiResult.seo?.youtubeShorts?.titles?.informative}
5. Dramatic: ${aiResult.seo?.youtubeShorts?.titles?.dramatic}

Description:
${aiResult.seo?.youtubeShorts?.description}

Primary Keyword: ${aiResult.seo?.youtubeShorts?.primaryKeyword}
Hashtags: ${aiResult.seo?.youtubeShorts?.hashtags?.join(' ')}
CTA: ${aiResult.seo?.youtubeShorts?.cta}`;
          break;

        case 'YouTube':
          content = `GODSEYE AI - YOUTUBE LONG VIDEO SEO
Titles:
${aiResult.seo?.youtubeLong?.titles?.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Description:
${aiResult.seo?.youtubeLong?.description}

Chapters:
${aiResult.seo?.youtubeLong?.chapters?.map((c) => `${c.time} - ${c.title}`).join('\n')}

Hashtags: ${aiResult.seo?.youtubeLong?.hashtags?.join(' ')}
CTA: ${aiResult.seo?.youtubeLong?.cta}`;
          break;

        case 'Instagram':
          content = `GODSEYE AI - INSTAGRAM REELS SEO
Hook: ${aiResult.seo?.instagram?.firstLineHook}

Caption:
${aiResult.seo?.instagram?.caption}

CTA: ${aiResult.seo?.instagram?.cta}
Hashtags: ${aiResult.seo?.instagram?.hashtags?.join(' ')}`;
          break;

        case 'Facebook':
          content = `GODSEYE AI - FACEBOOK REELS & VIDEO SEO
REELS CAPTION:
${aiResult.seo?.facebookReels?.caption}
Reels CTA: ${aiResult.seo?.facebookReels?.cta}
Reels Tags: ${aiResult.seo?.facebookReels?.hashtags?.join(' ')}

VIDEO POST:
Title: ${aiResult.seo?.facebookVideo?.title}
${aiResult.seo?.facebookVideo?.description}
Video CTA: ${aiResult.seo?.facebookVideo?.cta}
Video Tags: ${aiResult.seo?.facebookVideo?.hashtags?.join(' ')}`;
          break;

        case 'TikTok':
          content = `GODSEYE AI - TIKTOK SEO
Caption:
${aiResult.seo?.tiktok?.caption}

Search Keywords: ${aiResult.seo?.tiktok?.searchKeywords?.join(', ')}
CTA: ${aiResult.seo?.tiktok?.cta}
Tags: ${aiResult.seo?.tiktok?.hashtags?.join(' ')}`;
          break;

        case 'Snapchat':
          content = `GODSEYE AI - SNAPCHAT SEO
Caption: "${aiResult.seo?.snapchat?.caption}"
CTA: ${aiResult.seo?.snapchat?.cta}
Tags: ${aiResult.seo?.snapchat?.hashtags?.join(' ')}`;
          break;

        case 'X':
          content = `GODSEYE AI - X (TWITTER) POST
${aiResult.seo?.x?.postText}

CTA: ${aiResult.seo?.x?.cta}
Tags: ${aiResult.seo?.x?.hashtags?.join(' ')}`;
          break;

        case 'Pinterest':
          content = `GODSEYE AI - PINTEREST PIN SEO
Pin Title: ${aiResult.seo?.pinterest?.pinTitle}

Pin Description:
${aiResult.seo?.pinterest?.pinDescription}

Tags: ${aiResult.seo?.pinterest?.hashtags?.join(' ')}`;
          break;

        case 'LinkedIn':
          content = `GODSEYE AI - LINKEDIN PROFESSIONAL POST
${aiResult.seo?.linkedin?.postText}

CTA: ${aiResult.seo?.linkedin?.cta}
Tags: ${aiResult.seo?.linkedin?.hashtags?.join(' ')}`;
          break;

        case 'Keywords':
          content = `GODSEYE AI - SEARCH-FOCUSED KEYWORDS
Primary: ${aiResult.keywords?.primary?.join(', ')}
Secondary: ${aiResult.keywords?.secondary?.join(', ')}
Long-Tail: ${aiResult.keywords?.longTail?.join(', ')}
Questions: ${aiResult.keywords?.questions?.join(', ')}
Related: ${aiResult.keywords?.relatedSearches?.join(', ')}
Topic: ${aiResult.keywords?.topicKeywords?.join(', ')}`;
          break;

        case 'Retention':
          content = `GODSEYE AI - RETENTION ANALYSIS
Hook Strength: ${aiResult.retention.hookStrength}/10
Curiosity: ${aiResult.retention.curiosity}/10
Story Flow: ${aiResult.retention.storyFlow}/10
Emotional Impact: ${aiResult.retention.emotionalImpact}/10
Visual Potential: ${aiResult.retention.visualPotential}/10

Improvements:
${aiResult.retention.improvements.map((imp, idx) => `${idx + 1}. ${imp}`).join('\n')}`;
          break;
      }
    } else {
      content = `GODSEYE AI - ${activeTab} Structure
Target: ${config.contentType} | ${config.videoFormat} | ${config.language} | ${config.duration}`;
    }

    navigator.clipboard.writeText(content).catch(() => {});
    showToast(`Copied ${activeTab} to clipboard!`);
  };

  // Copy all SEO packages
  const handleCopyAllSeo = () => {
    if (!aiResult || !aiResult.seo) {
      showToast('Generate content first to copy SEO package');
      return;
    }

    const s = aiResult.seo;
    const kw = aiResult.keywords;

    const fullSeo = `==================================================
GODSEYE AI - MULTI-PLATFORM SEO PACKAGE
==================================================

1. YOUTUBE SHORTS SEO:
Titles:
• High CTR: ${s.youtubeShorts?.titles?.highCtr}
• Curiosity: ${s.youtubeShorts?.titles?.curiosity}
• Search: ${s.youtubeShorts?.titles?.searchOptimized}
• Informative: ${s.youtubeShorts?.titles?.informative}
• Dramatic: ${s.youtubeShorts?.titles?.dramatic}
Description: ${s.youtubeShorts?.description}
Tags: ${s.youtubeShorts?.hashtags?.join(' ')}
CTA: ${s.youtubeShorts?.cta}

2. YOUTUBE LONG VIDEO SEO:
Titles:
${s.youtubeLong?.titles?.map((t, i) => `${i + 1}. ${t}`).join('\n')}
Description: ${s.youtubeLong?.description}
Chapters:
${s.youtubeLong?.chapters?.map((c) => `${c.time} - ${c.title}`).join('\n')}
Tags: ${s.youtubeLong?.hashtags?.join(' ')}
CTA: ${s.youtubeLong?.cta}

3. INSTAGRAM REELS:
Hook: ${s.instagram?.firstLineHook}
Caption:
${s.instagram?.caption}
Tags: ${s.instagram?.hashtags?.join(' ')}
CTA: ${s.instagram?.cta}

4. FACEBOOK (REELS & VIDEO):
Reels:
${s.facebookReels?.caption}
Tags: ${s.facebookReels?.hashtags?.join(' ')}
Video:
Title: ${s.facebookVideo?.title}
${s.facebookVideo?.description}
Tags: ${s.facebookVideo?.hashtags?.join(' ')}

5. TIKTOK:
Caption: ${s.tiktok?.caption}
Search Terms: ${s.tiktok?.searchKeywords?.join(', ')}
Tags: ${s.tiktok?.hashtags?.join(' ')}
CTA: ${s.tiktok?.cta}

6. SNAPCHAT:
Caption: ${s.snapchat?.caption}
Tags: ${s.snapchat?.hashtags?.join(' ')}
CTA: ${s.snapchat?.cta}

7. X (TWITTER):
Post: ${s.x?.postText}
Tags: ${s.x?.hashtags?.join(' ')}
CTA: ${s.x?.cta}

8. PINTEREST:
Title: ${s.pinterest?.pinTitle}
Description: ${s.pinterest?.pinDescription}
Tags: ${s.pinterest?.hashtags?.join(' ')}

9. LINKEDIN:
Post:
${s.linkedin?.postText}
CTA: ${s.linkedin?.cta}
Tags: ${s.linkedin?.hashtags?.join(' ')}

10. SEARCH-FOCUSED KEYWORDS:
Primary: ${kw?.primary?.join(', ')}
Secondary: ${kw?.secondary?.join(', ')}
Long-Tail: ${kw?.longTail?.join(', ')}
Questions: ${kw?.questions?.join(', ')}
Related: ${kw?.relatedSearches?.join(', ')}
Topic: ${kw?.topicKeywords?.join(', ')}
`;

    navigator.clipboard.writeText(fullSeo).catch(() => {});
    showToast('Copied ALL Multi-Platform SEO to clipboard!');
  };

  // Copy all thumbnail concepts
  const handleCopyAllThumbnails = () => {
    if (!aiResult || !aiResult.thumbnails) {
      showToast('Generate content first to copy thumbnail package');
      return;
    }

    const t = aiResult.thumbnails;
    const fullThumbnails = `==================================================
GODSEYE AI - THUMBNAIL ENGINE CONCEPTS
==================================================

${t.concepts
  ?.map(
    (c, i) => `--- CONCEPT ${i + 1}: ${c.concept} ---
SUGGESTED TEXT (2-4 WORDS): "${c.headline}"
MAIN SUBJECT: ${c.subject}
BACKGROUND: ${c.background}
VISUAL STORY: ${c.visualStory}
EMOTION: ${c.emotion}
CURIOSITY ELEMENT: ${c.curiosityElement}
COMPOSITION: ${c.composition}

AI IMAGE PROMPT:
${c.imagePrompt}`
  )
  .join('\n\n')}

==================================================
RECOMMENDED YOUTUBE THUMBNAIL:
==================================================
Concept: ${t.youtube?.concept}
Text Overlay: "${t.youtube?.headline}"
Composition: ${t.youtube?.composition}
Image Prompt:
${t.youtube?.imagePrompt}

==================================================
RECOMMENDED FACEBOOK THUMBNAIL:
==================================================
Concept: ${t.facebook?.concept}
Text Overlay: "${t.facebook?.headline}"
Composition: ${t.facebook?.composition}
Image Prompt:
${t.facebook?.imagePrompt}
`;

    navigator.clipboard.writeText(fullThumbnails).catch(() => {});
    showToast('Copied ALL Thumbnail Concepts & Prompts!');
  };

  // Copy entire production package
  const handleCopyAll = () => {
    let fullPackage = '';

    if (aiResult) {
      fullPackage = `==================================================
GODSEYE AI - FULL PRODUCTION PACKAGE
==================================================

TOPIC: ${aiResult.analysis.mainTopic}
MAIN ANGLE: ${aiResult.storyAngle.mainAngle}
FORMAT: ${config.contentType} (${config.videoFormat})
LANGUAGE: ${config.language} | DURATION: ${config.duration}
STYLE: ${config.contentStyle} | MOOD: ${config.mood}

--------------------------------------------------
STEP 1: ARTICLE ANALYSIS
--------------------------------------------------
Main Event: ${aiResult.analysis.mainEvent}
Why It Matters: ${aiResult.analysis.whyItMatters}
Important Facts:
${aiResult.analysis.importantFacts.map((f) => `• ${f}`).join('\n')}

--------------------------------------------------
STEP 2: STORY ANGLE
--------------------------------------------------
Angle: ${aiResult.storyAngle.mainAngle}
Why Interesting: ${aiResult.storyAngle.whyInteresting}
Curiosity: ${aiResult.storyAngle.curiosityElement}
Emotional: ${aiResult.storyAngle.emotionalElement}
Visual: ${aiResult.storyAngle.visualElement}

--------------------------------------------------
STEP 3: HOOK ENGINE
--------------------------------------------------
1. Curiosity: "${aiResult.hooks.curiosity}"
2. Shock: "${aiResult.hooks.shock}"
3. Question: "${aiResult.hooks.question}"
4. Story: "${aiResult.hooks.story}"
5. Information Gap: "${aiResult.hooks.informationGap}"

BEST HOOK:
"${aiResult.hooks.bestHook}"
(Why: ${aiResult.hooks.reason})

--------------------------------------------------
STEP 4 & 5: HIGH RETENTION SCRIPT & TIMING
--------------------------------------------------
${aiResult.script.sections.map((s) => `[${s.phase}] ${s.name}\n${s.narration}`).join('\n\n')}

FULL SCRIPT TEXT:
${aiResult.script.text}

--------------------------------------------------
STEP 6, 7 & 8: SCENES & AI VIDEO PROMPTS
--------------------------------------------------
${aiResult.scenes
  .map(
    (s) => `SCENE ${s.sceneNumber} (${s.startTime} - ${s.endTime} | ${s.duration})
VOICE: ${s.voiceOver}
VISUAL: ${s.visual}
ON-SCREEN TEXT: ${s.onScreenText}
CAMERA: ${s.camera} | TRANSITION: ${s.transition}
SOUND: ${s.sound}
VIDEO PROMPT:
${s.videoPrompt}`
  )
  .join('\n\n')}

--------------------------------------------------
THUMBNAIL ENGINE CONCEPTS:
--------------------------------------------------
${aiResult.thumbnails?.concepts
  ?.map(
    (c, i) => `Concept ${i + 1}: ${c.concept}
Text: "${c.headline}"
Prompt: ${c.imagePrompt}`
  )
  .join('\n\n')}

--------------------------------------------------
MULTI-PLATFORM SEO & KEYWORDS:
--------------------------------------------------
YouTube Shorts Titles:
1. ${aiResult.seo?.youtubeShorts?.titles?.highCtr}
2. ${aiResult.seo?.youtubeShorts?.titles?.curiosity}

YouTube Long Titles:
${aiResult.seo?.youtubeLong?.titles?.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join('\n')}

Instagram Reel Hook:
"${aiResult.seo?.instagram?.firstLineHook}"

Primary Search Keywords:
${aiResult.keywords?.primary?.join(', ')}

--------------------------------------------------
STEP 10: RETENTION ANALYSIS
--------------------------------------------------
Hook Strength: ${aiResult.retention.hookStrength}/10
Curiosity: ${aiResult.retention.curiosity}/10
Story Flow: ${aiResult.retention.storyFlow}/10
Emotional Impact: ${aiResult.retention.emotionalImpact}/10
Visual Potential: ${aiResult.retention.visualPotential}/10

Improvements:
${aiResult.retention.improvements.map((imp, idx) => `${idx + 1}. ${imp}`).join('\n')}

DISCLAIMER:
${aiResult.disclaimer}
`;
    } else {
      fullPackage = `GODSEYE AI - Studio Project Configuration
Title: ${config.title || 'Untitled Story'}
Content Type: ${config.contentType} (${config.videoFormat})
Language: ${config.language} | Duration: ${config.duration}
Platforms: ${config.selectedPlatforms.join(', ')}`;
    }

    navigator.clipboard.writeText(fullPackage).catch(() => {});
    showToast('Copied FULL GODSEYE Production Package!');
  };

  const handleCopyAllVideoPrompts = () => {
    if (!aiResult || !aiResult.scenes || aiResult.scenes.length === 0) {
      showToast('Generate content first to copy video prompts');
      return;
    }
    const formatted = formatAllScenesPackage(
      aiResult.scenes,
      config.videoFormat,
      config.mood,
      aiResult.script?.duration || config.duration,
      aiResult.masterVideoStyle
    );

    navigator.clipboard.writeText(formatted).catch(() => {});
    showToast('Copied ALL Video Generator Prompts!');
  };

  const handleCopyAdobeExpressPlan = () => {
    if (!aiResult || !aiResult.adobeExpressPlan) {
      showToast('Generate content first to copy Adobe Express plan');
      return;
    }
    const p = aiResult.adobeExpressPlan;
    const formatted = `==================================================
GODSEYE AI - ADOBE EXPRESS VIDEO ASSEMBLY PLAN
==================================================
PROJECT TITLE: ${p.projectTitle}
ASPECT RATIO: ${p.aspectRatio}
TARGET DURATION: ${p.targetDuration}
OVERVIEW: ${p.overview}

TIMELINE SCENE ASSEMBLY SEQUENCE:
${p.scenes
  .map(
    (s) => `--------------------------------------------------
SCENE ${s.sceneNumber} (${s.duration})
• Visual Asset / Clip: ${s.visual}
• Voice-Over Line: "${s.voiceOver}"
• On-Screen Headline: "${s.onScreenText}"
• Auto-Caption Subtitle: "${s.captionSubtitle}"
• Transition: ${s.transition}
• Audio Mix Direction: ${s.audioDirection}
`
  )
  .join('\n')}
==================================================`;

    navigator.clipboard.writeText(formatted).catch(() => {});
    showToast('Copied Adobe Express Assembly Plan!');
  };

  return (
    <section
      id="output-area"
      className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-4 sm:p-6 lg:p-7 shadow-2xl shadow-black/50 relative overflow-hidden"
    >
      {/* Top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/30 via-blue-500/70 to-purple-500/30" />

      {/* Header bar: Title & All Action Buttons */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-heading">
              10. OUTPUT WORKSPACE
            </h2>
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                aiResult
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
              }`}
            >
              {aiResult ? 'AI Content Generated' : 'Workspace Ready'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {aiResult
              ? 'Complete multi-platform video scripts, Google Flow/Veo prompts, Adobe Express plan, 3 thumbnails & platform SEO.'
              : 'Production studio workspace tabs prepared for real AI-generated results.'}
          </p>
        </div>

        {/* Action Buttons: COPY TAB, COPY ALL PROMPTS, COPY ADOBE PLAN, COPY ALL SEO, COPY ALL THUMBNAILS, COPY ALL CONTENT, REGENERATE */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-copy-tab"
            onClick={handleCopyCurrentTab}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 transition-all cursor-pointer active:scale-95"
            title="Copy current tab layout"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>COPY TAB</span>
          </button>

          <button
            type="button"
            id="btn-copy-all-prompts-header"
            onClick={handleCopyAllVideoPrompts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/70 hover:bg-pink-900/60 border border-pink-800/70 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Copy all Google Flow & Veo prompts"
          >
            <Video className="w-3.5 h-3.5 text-pink-400" />
            <span>COPY ALL VIDEO PROMPTS</span>
          </button>

          <button
            type="button"
            id="btn-copy-adobe-plan-header"
            onClick={handleCopyAdobeExpressPlan}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 bg-red-950/70 hover:bg-red-900/60 border border-red-800/70 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Copy Adobe Express video assembly plan"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>COPY ADOBE EXPRESS PLAN</span>
          </button>

          <button
            type="button"
            id="btn-copy-all-seo"
            onClick={handleCopyAllSeo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/70 hover:bg-purple-900/60 border border-purple-800/70 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Copy all 10 platform SEO blocks + keywords"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            <span>COPY ALL SEO</span>
          </button>

          <button
            type="button"
            id="btn-copy-all-thumbnails"
            onClick={handleCopyAllThumbnails}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/70 hover:bg-amber-900/60 border border-amber-800/70 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Copy all 3 thumbnail concepts + platform recommendations"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>COPY ALL THUMBNAILS</span>
          </button>

          <button
            type="button"
            id="btn-copy-all"
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/60 border border-cyan-800/70 transition-all cursor-pointer active:scale-95 shadow-sm shadow-cyan-950"
            title="Copy all generated content and parameters"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-300" />
            <span>COPY ALL CONTENT</span>
          </button>

          <button
            type="button"
            id="btn-regenerate-prompts-header"
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh and regenerate all video prompts and production assets"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>REGENERATE PROMPTS</span>
          </button>
        </div>
      </div>

      {/* Copy notification toast */}
      {copyNotification && (
        <div className="my-3 p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-xs text-cyan-200 flex items-center gap-2 transition-all animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{copyNotification}</span>
        </div>
      )}

      {/* 10-Stage Visual Workflow Pipeline */}
      <div className="mt-4 mb-2">
        <WorkflowStepper
          currentStage={mapTabToWorkflowStage(activeTab)}
          onSelectStage={handleWorkflowStageSelect}
          aiResult={aiResult}
          hasSource={Boolean(hasStoryContent || (config.storyContent && config.storyContent.trim()) || config.title?.trim())}
        />
      </div>

      {/* Navigation Tabs (10 Primary Studio Tabs + Secondary Extra Tools) */}
      <div className="mt-3 border-b border-slate-800/80 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-3">
        <div className="flex items-center gap-1.5 min-w-max">
          {PRIMARY_TABS.map((tab) => {
            const isActive =
              activeTab === tab.id ||
              (tab.id === 'Story Angle' && (activeTab === 'Story' || activeTab === 'Story Angle')) ||
              (tab.id === 'Viral Hooks' && (activeTab === 'Hooks' || activeTab === 'Viral Hooks')) ||
              (tab.id === 'Script' && (activeTab === 'Narration' || activeTab === 'AI Voice' || activeTab === 'Script')) ||
              (tab.id === 'SEO' && (activeTab === 'YouTube Shorts' || activeTab === 'SEO')) ||
              (tab.id === 'Publish Ready' && activeTab === 'Publish Ready');
            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-${tab.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle Extra Tools */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            id="btn-toggle-extra-output-tools"
            onClick={() => setShowMoreTools(!showMoreTools)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer ${
              showMoreTools
                ? 'bg-slate-800 text-cyan-300 border-slate-600'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            {showMoreTools ? 'Hide Extra Tools ▲' : '+ More Tools ▼'}
          </button>
        </div>
      </div>

      {showMoreTools && (
        <div className="pt-2 pb-2 flex items-center gap-1.5 flex-wrap border-b border-slate-800/60 animate-fadeIn">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Extra Studio Hubs:</span>
          {MORE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-purple-950/80 text-purple-200 border border-purple-600/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Tab Content Display Area */}
      <div className="mt-5 min-h-[420px] pt-1 space-y-6">
        {/* Status bar */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-300 leading-relaxed">
              {aiResult ? (
                <>
                  <strong className="text-emerald-400">GODSEYE Studio Active:</strong> Processed
                  for <span className="text-white font-medium">{config.language}</span> ({config.duration} •{' '}
                  {config.videoFormat}) with 3 thumbnail strategies & 10-platform SEO engine.
                </>
              ) : (
                <>
                  <strong className="text-cyan-300">Ready for Story Synthesis:</strong> Enter your
                  article or load a sample story above and click{' '}
                  <span className="text-white font-semibold">GENERATE GODSEYE CONTENT</span> to
                  process with Gemini AI.
                </>
              )}
            </div>
          </div>
          {aiResult && (
            <span className="hidden sm:inline-flex text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 whitespace-nowrap">
              AI Output Ready
            </span>
          )}
        </div>

        {/* TAB 1: SOURCE INTELLIGENCE (Stage 1) */}
        {activeTab === 'Source Intelligence' && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult?.analysis ? (
              <SourceIntelligenceSection
                analysis={aiResult.analysis}
                config={config}
                onCopyText={handleCopyText}
                onContinue={() => setActiveTab('Story Angle')}
                onRegenerate={() => (onRegenerateComponent ? onRegenerateComponent('script') : onRegenerate())}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <Info className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Source Intelligence Extracted Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "GENERATE GODSEYE CONTENT" to synthesize source facts, key people/entities, locations, claims, and uncertainty audits.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  {aiResult ? 'Article Analysis & Strategic Angle' : 'Video Production Strategy Overview'}
                </h3>
                <p className="text-xs text-slate-400">
                  {aiResult
                    ? 'Extracted key facts, core events, and storytelling angle'
                    : 'Calculated deployment blueprint based on your selected parameters'}
                </p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40 self-start sm:self-auto">
                {aiResult ? 'Analysis Complete' : isInitialized ? 'Pipeline Configured' : 'Ready to Run'}
              </span>
            </div>

            {aiResult ? (
              <div className="space-y-6">
                {/* Step 1: Article Analysis Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      Core Topic & Main Event
                    </span>
                    <h4 className="text-sm font-semibold text-white">{aiResult.analysis.mainTopic}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{aiResult.analysis.mainEvent}</p>
                    <div className="pt-2 border-t border-slate-800">
                      <strong className="text-[11px] text-slate-400 uppercase tracking-wide block">
                        Why It Matters:
                      </strong>
                      <p className="text-xs text-slate-200 mt-0.5">{aiResult.analysis.whyItMatters}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      Extracted Facts & Numbers
                    </span>
                    <div className="space-y-1 text-xs text-slate-300">
                      {aiResult.analysis.importantFacts.map((fact, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 2: Story Angle */}
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Selected Story Angle
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {config.contentStyle} • {config.mood}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white font-heading">
                    {aiResult.storyAngle.mainAngle}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiResult.storyAngle.whyInteresting}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-semibold">Curiosity Element:</span>
                      <span className="text-slate-200 mt-0.5 block">{aiResult.storyAngle.curiosityElement}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-semibold">Emotional Hook:</span>
                      <span className="text-slate-200 mt-0.5 block">{aiResult.storyAngle.emotionalElement}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-semibold">Visual Element:</span>
                      <span className="text-slate-200 mt-0.5 block">{aiResult.storyAngle.visualElement}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Pre-generation Blueprint */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Execution Strategy
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Will synthesize an impactful narrative for {config.contentType} ({config.duration}) formatted in {config.videoFormat}.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                    Linguistic & Tone Blueprint
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Spoken-aloud narration generated in authentic <strong className="text-white">{config.language}</strong> with a <strong className="text-white">{config.mood}</strong> tone.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Thumbnail & SEO Coverage
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Auto-generates 3 visual thumbnail concepts, safe-zone instructions, and complete SEO packages for YouTube, Instagram, Facebook, TikTok, X, Snapchat, Pinterest & LinkedIn.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: STORY ANGLE & CONTENT DIRECTOR */}
        {(activeTab === 'Story' || activeTab === 'Story Angle') && (
          <div className="space-y-6 animate-fadeIn">
            {aiResult?.storyAngle ? (
              <>
                <StoryAngleSection
                  storyAngle={aiResult.storyAngle}
                  config={config}
                  onSelectAngle={(selected) => {
                    if (!aiResult || !onUpdateAiResult) return;
                    const updated: GodseyeAiResult = {
                      ...aiResult,
                      storyAngle: {
                        ...aiResult.storyAngle,
                        mainAngle: selected.angle,
                        bestStoryAngle: selected.angle,
                        whyInteresting: selected.shortExplanation,
                        bestAngleReason: selected.shortExplanation,
                      },
                    };
                    onUpdateAiResult(updated);
                    showToast(`Applied Angle: "${selected.angle}"`);
                  }}
                  onCopyText={handleCopyText}
                  onRegenerate={() => onRegenerateComponent?.('storyAngle')}
                  onContinue={() => setActiveTab('Viral Hooks')}
                  isLoading={isLoading}
                />

                <ContentDirectorSection
                  contentDirector={aiResult.contentDirector}
                  storyAngle={aiResult.storyAngle}
                  analysis={aiResult.analysis}
                  onCopyText={handleCopyText}
                />
              </>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <Compass className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Story Angle Generated Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "GENERATE GODSEYE CONTENT" to activate Content Director evaluation, narrative framing, and psychological anchors.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: VIRAL HOOK ENGINE */}
        {(activeTab === 'Hooks' || activeTab === 'Viral Hooks') && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult ? (
              <ViralHooksSection
                hooks={aiResult.hooks}
                onCopyText={handleCopyText}
                selectedHookText={aiResult.hooks?.selectedHook || aiResult.hooks?.bestHook}
                onSelectHook={(hook) => {
                  if (!aiResult || !onUpdateAiResult) return;
                  const currentHook = aiResult.hooks?.selectedHook || aiResult.hooks?.bestHook || '';
                  const updatedText = currentHook && aiResult.script.text.includes(currentHook)
                    ? aiResult.script.text.replace(currentHook, hook.text)
                    : `${hook.text}\n\n${aiResult.script.text}`;
                  const updated: GodseyeAiResult = {
                    ...aiResult,
                    hooks: {
                      ...aiResult.hooks,
                      selectedHook: hook.text,
                    },
                    script: {
                      ...aiResult.script,
                      text: updatedText,
                    },
                  };
                  onUpdateAiResult(updated);
                  showToast(`Selected Hook: "${hook.category}" applied to Spoken Script`);
                }}
                onRegenerateHook={(hookId, category) => {
                  if (onRegenerateComponent) {
                    onRegenerateComponent('hook', { customPrompt: `Regenerate hook category: ${category}` });
                  }
                }}
                onRegenerateAll={() => {
                  if (onRegenerateComponent) {
                    onRegenerateComponent('hook');
                  }
                }}
                onEditHook={(hookId, updatedText) => {
                  if (!aiResult || !onUpdateAiResult) return;
                  const updatedList = (aiResult.hooks?.hookList || []).map((h) =>
                    h.id === hookId ? { ...h, text: updatedText } : h
                  );
                  const updated: GodseyeAiResult = {
                    ...aiResult,
                    hooks: {
                      ...aiResult.hooks,
                      hookList: updatedList,
                      selectedHook: aiResult.hooks?.selectedHook === hookId ? updatedText : aiResult.hooks?.selectedHook,
                    },
                  };
                  onUpdateAiResult(updated);
                  showToast('Hook updated and saved successfully');
                }}
                onContinue={() => setActiveTab('Script')}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <Flame className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Hooks Generated Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "GENERATE GODSEYE CONTENT" to synthesize 10 hook category formulas with AI estimated retention scores.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: QUALITY CHECK (Step 5 Upgrade) */}
        {activeTab === 'Quality Check' && (
          <QualityCheckSection
            qualityCheck={aiResult?.qualityCheck}
            aiResult={aiResult || undefined}
            onCopyText={handleCopyText}
            onViewScript={() => setActiveTab('Script')}
            onContinue={() => setActiveTab('Scenes')}
            onRegenerateAudit={() => {
              if (onRegenerateComponent) {
                onRegenerateComponent('scriptDoctor');
              }
            }}
            onApplyImprovedScript={(improvedScriptText, updatedCheck, improvedPolished, improvedSections) => {
              if (!aiResult || !onUpdateAiResult) return;
              const updated: GodseyeAiResult = {
                ...aiResult,
                script: {
                  ...aiResult.script,
                  text: improvedScriptText,
                  polishedScript: improvedPolished || aiResult.script.polishedScript,
                  sections: (improvedSections && improvedSections.length > 0) ? improvedSections : aiResult.script.sections,
                },
                qualityCheck: updatedCheck || aiResult.qualityCheck,
              };
              onUpdateAiResult(updated);
              showToast('Applied AI Script Doctor improvements to script and scenes!');
            }}
            isLoading={isLoading}
          />
        )}

        {/* TAB 2: SCRIPT */}
        {activeTab === 'Script' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  High-Retention Spoken Script ({config.language})
                </h3>
                <p className="text-xs text-slate-400">
                  Step 3, 4 & 5: Hook variations, voice-over direction, polished narration & performance markers
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                {onRegenerateComponent && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onRegenerateComponent('script')}
                    className="px-2.5 py-1 rounded-md bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Regenerate Script</span>
                  </button>
                )}
                {aiResult && (
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {aiResult.script.duration} Target Duration
                  </span>
                )}
              </div>
            </div>

            {aiResult ? (
              <div className="space-y-6">
                {/* Step 3: Hook Engine Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Hook Engine — 5 Formulations Tested
                    </span>
                    <div className="flex items-center gap-2">
                      {onRegenerateComponent && (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => onRegenerateComponent('hook')}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Regenerate Hooks</span>
                        </button>
                      )}
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Best Hook Selected
                      </span>
                    </div>
                  </div>

                  {/* Best Hook Feature */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-slate-950 border border-amber-500/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                        Winning Hook Formulation
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(aiResult.hooks.bestHook, 'Best Hook')}
                        className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white font-sans">
                      "{aiResult.hooks.bestHook}"
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Why Strongest:</strong> {aiResult.hooks.reason}
                    </p>
                  </div>

                  {/* Other 4 Hooks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-bold text-cyan-400 block mb-0.5">1. Curiosity Hook:</span>
                      <p className="text-slate-200">"{aiResult.hooks.curiosity}"</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-bold text-red-400 block mb-0.5">2. Shock / Surprise Hook:</span>
                      <p className="text-slate-200">"{aiResult.hooks.shock}"</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-bold text-yellow-400 block mb-0.5">3. Question Hook:</span>
                      <p className="text-slate-200">"{aiResult.hooks.question}"</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-bold text-purple-400 block mb-0.5">4. Information Gap Hook:</span>
                      <p className="text-slate-200">"{aiResult.hooks.informationGap}"</p>
                    </div>
                  </div>
                </div>

                {/* TITLE ENGINE (10 Strategic Formulas & Scores) */}
                <TitleEngineSection
                  titleEngine={aiResult.titleEngine}
                  defaultTitle={aiResult.script.title || config.title}
                  onCopyText={handleCopyText}
                />

                {/* VOICE-OVER DIRECTION (Step 5 Upgrade) */}
                {aiResult.voiceOverDirection && (
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Voice-Over Direction & Delivery Markers
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {aiResult.voiceOverDirection.speed}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Voice Style</span>
                        <p className="text-white font-semibold">{aiResult.voiceOverDirection.voiceStyle}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Speed / Tempo</span>
                        <p className="text-cyan-300 font-semibold">{aiResult.voiceOverDirection.speed}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Energy & Emotion</span>
                        <p className="text-amber-300 font-semibold">{aiResult.voiceOverDirection.energy} • {aiResult.voiceOverDirection.emotion}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Dramatic Pauses</span>
                        <p className="text-emerald-300 font-semibold">{aiResult.voiceOverDirection.pauses}</p>
                      </div>
                    </div>

                    {aiResult.voiceOverDirection.emphasis && aiResult.voiceOverDirection.emphasis.length > 0 && (
                      <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-slate-400 text-[11px] font-semibold">Key Words to Emphasize:</span>
                        {aiResult.voiceOverDirection.emphasis.map((word, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 font-mono font-bold text-[11px] border border-purple-800/40"
                          >
                            "{word}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* FINAL POLISHED SCRIPT WITH TIMING & TONE (Step 5 Upgrade) */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Final Polished Script with Performance Cues
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          aiResult.polishedScript || aiResult.script.text,
                          'Final Polished Script'
                        )
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy Polished Script
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    Includes bracketed tone modulations, pacing pauses, and vocal shifts for human voice talent or ElevenLabs/Google TTS.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                    {aiResult.polishedScript || aiResult.script.text}
                  </div>
                </div>

                {/* Step 4 & 5: Timed Voiceover Script Sections */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Timed Voiceover Sequence ({aiResult.script.duration})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(aiResult.script.text, 'Full Script Narration')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy Full Narration
                    </button>
                  </div>

                  {aiResult.script.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                            {sec.phase}
                          </span>
                          <span className="text-xs font-bold text-white uppercase">{sec.name}</span>
                        </div>
                        {sec.cue && (
                          <span className="text-[11px] text-slate-400 italic">Cue: {sec.cue}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-100 font-sans leading-relaxed pl-1 border-l-2 border-cyan-500/40 py-0.5">
                        {sec.narration}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Full Narration Text Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    Continuous Teleprompter Read ({aiResult.script.title})
                  </span>
                  <div className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-all">
                    {aiResult.script.text}
                  </div>
                </div>

                {/* STEP 7: AI VOICE / TTS ENGINE SECTION */}
                <AiVoiceGenerator
                  scriptText={
                    aiResult.polishedScript ||
                    aiResult.script.fullScript ||
                    aiResult.script.text ||
                    aiResult.script.sections.map((s) => s.narration).join(' ')
                  }
                  scenes={aiResult.scenes}
                  contentType={config.contentType}
                  mood={config.mood}
                  existingAudioData={aiResult.ttsAudio}
                  onAudioGenerated={(audioData) => {
                    if (!aiResult) return;
                    const updatedResult: GodseyeAiResult = {
                      ...aiResult,
                      ttsAudio: audioData,
                    };
                    onUpdateAiResult?.(updatedResult);
                  }}
                  onNavigateToAdobeExpress={() => setActiveTab('Adobe Express')}
                />
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <FileText className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Script Generated Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "GENERATE GODSEYE CONTENT" to synthesize natural, spoken-aloud narration in {config.language} tailored to {config.duration}.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: VIDEO GENERATION HUB */}
        {activeTab === 'Video Generation' && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult ? (
              <VideoGenerationHub
                result={aiResult}
                projectName={projectName || config.title || 'GODSEYE Project'}
                selectedFormat={config.videoFormat}
                onFormatChange={onUpdateVideoFormat}
                onRegeneratePrompts={() => onRegenerateComponent?.('videoPrompts')}
                onUpdateScenePrompt={(sceneNumber, newPrompt) => {
                  if (!aiResult) return;
                  const updatedScenes = aiResult.scenes.map((s) => {
                    if (s.sceneNumber === sceneNumber) {
                      return {
                        ...s,
                        videoPrompt: {
                          ...s.videoPrompt,
                          prompt: newPrompt,
                          negativePrompt: s.videoPrompt?.negativePrompt || aiResult.masterVideoStyle?.negativePrompt || '',
                        },
                      };
                    }
                    return s;
                  });
                  const updatedResult: GodseyeAiResult = {
                    ...aiResult,
                    scenes: updatedScenes,
                  };
                  onUpdateAiResult?.(updatedResult);
                }}
              />
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-3">
                <Video className="w-10 h-10 text-cyan-400 mx-auto" />
                <h3 className="text-base font-bold text-white font-mono">VIDEO GENERATION HUB</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Turn your GODSEYE scenes into production-ready AI video clips. Generate your content package first to load scene prompts, master video styling, and camera directions.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SCENES */}
        {activeTab === 'Scenes' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-purple-400" />
                  Scene Breakdown & Visual Storyboard
                </h3>
                <p className="text-xs text-slate-400">
                  Step 6 & 7: Direct visual correspondence, camera movement, on-screen text & SFX
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                {aiResult && (
                  <button
                    type="button"
                    id="btn-copy-full-scene-package"
                    onClick={handleCopyFullScenePackage}
                    className="px-3 py-1 rounded-md bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm shadow-cyan-950"
                    title="Copy full scene breakdown, voice-over & prompts"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>COPY FULL SCENE PACKAGE</span>
                  </button>
                )}
                {onRegenerateComponent && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onRegenerateComponent('scenes')}
                    className="px-2.5 py-1 rounded-md bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Regenerate Scenes</span>
                  </button>
                )}
                {aiResult && (
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {aiResult.scenes.length} Scenes Created
                  </span>
                )}
              </div>
            </div>

            {aiResult ? (
              <div className="space-y-4">
                {aiResult.scenes.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0b101c] border border-slate-800 space-y-4 hover:border-slate-700 transition-colors shadow-lg"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold border border-cyan-800/50 shadow-inner">
                          #{scene.sceneNumber}
                        </span>
                        <span className="text-sm font-bold text-white font-heading">
                          Scene {scene.sceneNumber}
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                          {scene.startTime} - {scene.endTime}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                          {scene.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {onRegenerateComponent && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => onRegenerateComponent('scene', { sceneNumber: scene.sceneNumber })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/40 text-xs font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                            title={`Regenerate Scene ${scene.sceneNumber}`}
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>REGEN</span>
                          </button>
                        )}
                        <button
                          type="button"
                          id={`btn-copy-prompt-scene-${scene.sceneNumber}`}
                          onClick={() => {
                            const promptText = buildStandalonePrompt(scene, config.videoFormat, config.mood, aiResult?.masterVideoStyle);
                            navigator.clipboard.writeText(promptText).catch(() => {});
                            showToast(`Copied Scene ${scene.sceneNumber} Google Flow/Veo Prompt!`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 border border-pink-700/60 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                          title={`Copy standalone Google Flow / Veo Prompt for Scene ${scene.sceneNumber}`}
                        >
                          <Copy className="w-3.5 h-3.5 text-pink-400" />
                          <span>COPY PROMPT</span>
                        </button>
                        <button
                          type="button"
                          id={`btn-copy-scene-${scene.sceneNumber}`}
                          onClick={() => handleCopySingleScene(scene)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                          title={`Copy Scene ${scene.sceneNumber}`}
                        >
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>COPY SCENE</span>
                        </button>
                      </div>
                    </div>

                    {/* Full-width Voice-Over Narration */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Voice-Over Narration:
                      </span>
                      <p className="text-sm sm:text-base text-slate-100 font-sans pl-3 border-l-2 border-cyan-500 font-medium leading-relaxed">
                        "{scene.voiceOver}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                        <strong className="text-[11px] text-purple-400 uppercase tracking-wide block">
                          Visual Description:
                        </strong>
                        <p className="text-slate-300 mt-1 leading-relaxed">{scene.visual}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div>
                          <strong className="text-[11px] text-amber-400 uppercase tracking-wide block mb-1">
                            On-Screen Text Overlay & Safe Area:
                          </strong>
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="inline-block px-3 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 font-bold border border-amber-800/40 font-heading text-xs tracking-wide">
                              {scene.onScreenText || 'None'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Safe Area / Placement:</span>{' '}
                            {scene.textPlacement || (config.videoFormat?.includes('9:16') ? 'Safe central area (middle-third)' : 'Lower-third center safe margin')}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                          <div>
                            <span className="block font-semibold text-slate-300">Camera:</span>
                            <span className="text-slate-200">{scene.camera}</span>
                          </div>
                          <div>
                            <span className="block font-semibold text-slate-300">Transition:</span>
                            <span className="text-slate-200">{scene.transition}</span>
                          </div>
                          <div>
                            <span className="block font-semibold text-slate-300">Sound FX:</span>
                            <span className="text-slate-200">{scene.sound}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Negative Prompt */}
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        Negative Prompt / Avoid Instructions:
                      </span>
                      <p className="font-mono text-xs text-rose-200/90 leading-relaxed">
                        {scene.negativePrompt ||
                          'No watermark. No unwanted logo. No random text rendered inside frame. No distorted anatomy, extra fingers, or deformed faces. No unrelated objects. No cartoonish 3D render artifacts.'}
                      </p>
                    </div>

                    {/* Google Flow / Veo Video Prompt Box */}
                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
                          Google Flow / Veo Video Prompt ({config.videoFormat}):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const promptText = buildStandalonePrompt(scene, config.videoFormat, config.mood, aiResult?.masterVideoStyle);
                            navigator.clipboard.writeText(promptText).catch(() => {});
                            showToast(`Copied Scene ${scene.sceneNumber} Google Flow/Veo Prompt!`);
                          }}
                          className="text-xs font-semibold text-pink-300 hover:text-pink-200 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3 text-pink-400" />
                          <span>Copy Prompt</span>
                        </button>
                      </div>
                      <div className="font-mono text-xs text-purple-200 bg-slate-950/80 p-3 rounded-lg border border-purple-900/40 leading-relaxed select-all whitespace-pre-line max-h-52 sm:max-h-60 overflow-y-auto scrollbar-thin">
                        {buildStandalonePrompt(scene, config.videoFormat, config.mood, aiResult?.masterVideoStyle)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <Clapperboard className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Scenes Generated Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "GENERATE GODSEYE CONTENT" to synthesize structured scenes, camera directives, and overlays.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: VIDEO PROMPTS */}
        {activeTab === 'Video Prompts' && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult ? (
              <VideoPromptsSection
                scenes={aiResult.scenes}
                masterVideoStyle={aiResult.masterVideoStyle}
                videoFormat={config.videoFormat}
                mood={config.mood}
                onCopyText={handleCopyText}
                onRegenerate={() =>
                  onRegenerateComponent ? onRegenerateComponent('videoPrompts') : onRegenerate()
                }
                onRegenerateScene={(sceneNumber) => {
                  if (onRegenerateComponent) {
                    onRegenerateComponent('scene', { sceneNumber });
                  }
                }}
                onUpdateScene={(updatedScene) => {
                  if (!aiResult || !onUpdateAiResult) return;
                  const updatedScenes = aiResult.scenes.map((s) =>
                    s.sceneNumber === updatedScene.sceneNumber ? updatedScene : s
                  );
                  onUpdateAiResult({
                    ...aiResult,
                    scenes: updatedScenes,
                  });
                  showToast(`Saved Scene ${updatedScene.sceneNumber}`);
                }}
                onSwitchToAdobeExpress={() => setActiveTab('Adobe Express')}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-3">
                <Video className="w-10 h-10 text-pink-400 mx-auto" />
                <h4 className="text-base font-bold text-white">No Video Prompts Generated Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Click "GENERATE GODSEYE CONTENT" to synthesize photorealistic Google Flow & Veo prompts with camera trajectory, lighting, negative prompts, and aspect ratio safety for every scene.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: ADOBE EXPRESS (Timeline Video Assembly Plan) */}
        {activeTab === 'Adobe Express' && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult?.adobeExpressPlan ? (
              <AdobeExpressSection
                adobeExpressPlan={aiResult.adobeExpressPlan}
                onCopyText={handleCopyText}
                onSwitchToVideoPrompts={() => setActiveTab('Video Prompts')}
              />
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-red-400 mx-auto" />
                <h4 className="text-base font-bold text-white">No Adobe Express Plan Generated Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Click "GENERATE GODSEYE CONTENT" to generate a synchronized Adobe Express video timeline blueprint with audio tracks, auto-captions, and transition timing.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: THUMBNAIL (Dedicated Modular Section) */}
        {activeTab === 'Thumbnail' && (
          <ThumbnailSection
            thumbnails={aiResult?.thumbnails}
            storyTitle={config.title}
            onCopyText={handleCopyText}
            onRegenerateThumbnail={() => onRegenerateComponent?.('thumbnail')}
            isLoading={isLoading}
          />
        )}

        {/* TAB: AI VOICE GENERATOR (TTS) */}
        {(activeTab === 'Narration' || activeTab === 'AI Voice') && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult ? (
              <AiVoiceGenerator
                scriptText={aiResult.polishedScript || aiResult.script.text}
                defaultLanguage={config.language}
                defaultMood={config.mood}
                defaultStyle={config.contentStyle}
                existingAudio={aiResult.ttsAudio}
                onAudioGenerated={(audioData) => {
                  const updatedResult: GodseyeAiResult = {
                    ...aiResult,
                    ttsAudio: audioData,
                  };
                  onUpdateAiResult?.(updatedResult);
                }}
                onNavigateToAdobeExpress={() => setActiveTab('Adobe Express')}
              />
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <Volume2 className="w-8 h-8 text-violet-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Script Audio Available Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Generate your script first, then create natural AI voiceover narration using Google Gemini TTS.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: TRENDING INTELLIGENCE */}
        {activeTab === 'Trending Intel' && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult ? (
              <TrendingIntelligenceSection
                trendData={aiResult.trendIntelligence}
                storyTitle={aiResult.analysis.mainTopic || config.title}
                onCopyText={handleCopyText}
              />
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Trending Intelligence Evaluated Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "GENERATE GODSEYE CONTENT" to evaluate topic velocity, audience interest, and saturation risk.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 6-14: MULTI-PLATFORM SEO TABS */}
        {(activeTab === 'SEO' ||
          activeTab === 'YouTube Shorts' ||
          activeTab === 'YouTube' ||
          activeTab === 'Instagram' ||
          activeTab === 'Facebook' ||
          activeTab === 'TikTok' ||
          activeTab === 'Snapchat' ||
          activeTab === 'X' ||
          activeTab === 'Pinterest' ||
          activeTab === 'LinkedIn') && (
          <div className="space-y-4 animate-fadeIn">
            {onRegenerateComponent && (
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => onRegenerateComponent('seo')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Regenerate Platform SEO</span>
                </button>
              </div>
            )}
            <SeoPlatformSection
              platformTab={activeTab === 'SEO' ? 'YouTube Shorts' : activeTab}
              seo={aiResult?.seo}
              config={config}
              keywords={aiResult?.keywords}
              titleEngine={aiResult?.titleEngine}
              hooks={aiResult?.hooks}
              script={aiResult?.script}
              analysis={aiResult?.analysis}
              onCopyText={handleCopyText}
              onRegenerateSeo={onRegenerateComponent ? () => onRegenerateComponent('seo') : undefined}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* TAB 15: KEYWORDS (Dedicated Modular Section) */}
        {activeTab === 'Keywords' && (
          <div className="space-y-4 animate-fadeIn">
            {onRegenerateComponent && (
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => onRegenerateComponent('seo')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Regenerate Keywords</span>
                </button>
              </div>
            )}
            <KeywordsSection
              keywords={aiResult?.keywords}
              onCopyText={handleCopyText}
            />
          </div>
        )}

        {/* TAB 16: RETENTION */}
        {activeTab === 'Retention' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Engagement Optimizer & Retention Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Step 10: AI predictive evaluation, drop-off defense, and virality diagnostics
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400">Engagement Defense</span>
            </div>

            {aiResult ? (
              <div className="space-y-4">
                {/* 6 Retention Scores */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Script Retention Diagnostics (Score /10)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { label: 'Hook Strength', score: aiResult.retention.hookStrength, color: 'from-amber-500 to-red-500' },
                      { label: 'Curiosity', score: aiResult.retention.curiosity, color: 'from-cyan-500 to-blue-500' },
                      { label: 'Story Flow', score: aiResult.retention.storyFlow, color: 'from-blue-500 to-indigo-500' },
                      { label: 'Emotional Impact', score: aiResult.retention.emotionalImpact, color: 'from-pink-500 to-rose-500' },
                      { label: 'Visual Potential', score: aiResult.retention.visualPotential, color: 'from-emerald-500 to-teal-500' },
                      { label: 'Shareability', score: aiResult.retention.shareabilityPotential || 8.8, color: 'from-purple-500 to-pink-500' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">{item.label}</span>
                          <span className="text-sm font-bold text-white font-mono">{item.score}/10</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${item.color} h-1.5 rounded-full`}
                            style={{ width: `${item.score * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Improvements Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide block">
                    Top 3 Actionable Retention Improvements:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {(aiResult.retention.top3RetentionImprovements || aiResult.retention.improvements).map(
                      (imp, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 border border-cyan-800/40">
                            {idx + 1}
                          </span>
                          <span className="mt-0.5 leading-relaxed">{imp}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>Disclaimer:</strong> {aiResult.retention.aiEstimateDisclaimer || aiResult.disclaimer}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No Retention Analysis Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "GENERATE GODSEYE CONTENT" to evaluate hook strength, curiosity gaps, and retention drop-off defenses.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: PUBLISH READY (Stage 10) */}
        {activeTab === 'Publish Ready' && (
          <div className="space-y-4 animate-fadeIn">
            {aiResult ? (
              <PublishReadySection
                aiResult={aiResult}
                config={config}
                projectName={projectName}
                onCopyText={handleCopyText}
                onNavigateTab={onNavigateTab}
              />
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                <Send className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">Package Not Ready For Publishing</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Run pipeline generation to produce all assets (script, scenes, thumbnails, SEO) before publishing.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
