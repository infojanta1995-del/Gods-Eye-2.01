import React, { useState } from 'react';
import {
  Film,
  Video,
  Layers,
  Copy,
  Check,
  Download,
  RotateCw,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Edit3,
  CheckSquare,
  Square,
  PlaySquare,
  Zap,
  Maximize2,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import {
  GodseyeAiResult,
  VideoWorkflowType,
  SceneStatusType,
  VideoQualityOption,
  CameraStyleOption,
  MotionLevelOption,
  VisualConsistencyOption,
  VideoSettingsConfig,
  SceneItem,
  VideoFormat
} from '../types';
import { triggerBrowserDownload } from '../services/ttsService';

interface VideoGenerationHubProps {
  result: GodseyeAiResult;
  projectName?: string;
  selectedFormat: VideoFormat;
  onFormatChange?: (format: VideoFormat) => void;
  onRegeneratePrompts?: () => void;
  onUpdateScenePrompt?: (sceneNumber: number, newPrompt: string) => void;
}

export const VideoGenerationHub: React.FC<VideoGenerationHubProps> = ({
  result,
  projectName = 'GODSEYE Project',
  selectedFormat,
  onFormatChange,
  onRegeneratePrompts,
  onUpdateScenePrompt,
}) => {
  // Workflow selector
  const [workflow, setWorkflow] = useState<VideoWorkflowType>('Google Flow / Veo');

  // Video Settings
  const [videoSettings, setVideoSettings] = useState<VideoSettingsConfig>({
    videoQuality: 'Cinematic',
    cameraStyle: 'Cinematic',
    motionLevel: 'Medium',
    visualConsistency: 'High',
  });

  // Scene status map: sceneNumber -> SceneStatusType
  const [sceneStatuses, setSceneStatuses] = useState<Record<number, SceneStatusType>>(() => {
    const initial: Record<number, SceneStatusType> = {};
    result.scenes.forEach((s) => {
      initial[s.sceneNumber] = 'NOT READY';
    });
    return initial;
  });

  // Edited prompts map
  const [editedPrompts, setEditedPrompts] = useState<Record<number, string>>({});
  const [editingScene, setEditingScene] = useState<number | null>(null);

  // Copy states
  const [copiedMasterStyle, setCopiedMasterStyle] = useState(false);
  const [copiedAllPrompts, setCopiedAllPrompts] = useState(false);
  const [copiedAdobePlan, setCopiedAdobePlan] = useState(false);
  const [copiedSceneId, setCopiedSceneId] = useState<number | null>(null);

  // Future Generation Modal
  const [showFutureModal, setShowFutureModal] = useState(false);

  // Format toggle
  const isPortrait = Boolean(selectedFormat && selectedFormat.includes('9:16'));

  const handleToggleFormat = (newFormat: VideoFormat) => {
    if (onFormatChange) {
      onFormatChange(newFormat);
    }
  };

  // Scene status toggle
  const handleToggleStatus = (sceneNumber: number) => {
    const current = sceneStatuses[sceneNumber] || 'NOT READY';
    const nextMap: Record<SceneStatusType, SceneStatusType> = {
      'NOT READY': 'READY',
      'READY': 'COMPLETED',
      'COMPLETED': 'NOT READY',
      'COPIED': 'READY',
    };
    setSceneStatuses({
      ...sceneStatuses,
      [sceneNumber]: nextMap[current],
    });
  };

  // Copy single scene prompt
  const handleCopyScenePrompt = (scene: SceneItem) => {
    const promptText = getFormattedPrompt(scene);
    navigator.clipboard.writeText(promptText);
    setCopiedSceneId(scene.sceneNumber);
    setSceneStatuses({
      ...sceneStatuses,
      [scene.sceneNumber]: 'COPIED',
    });
    setTimeout(() => setCopiedSceneId(null), 2000);
  };

  // Get prompt formatted with current aspect ratio and camera setting
  const getFormattedPrompt = (scene: SceneItem): string => {
    const raw = scene.videoPrompt as unknown;
    const promptStr = typeof raw === 'string' ? raw : (raw as { prompt?: string })?.prompt;
    const base = editedPrompts[scene.sceneNumber] ?? promptStr ?? scene.visual;
    const arTag = isPortrait ? '--ar 9:16' : '--ar 16:9';
    const camTag = videoSettings.cameraStyle !== 'Auto' ? `, ${videoSettings.cameraStyle.toLowerCase()} camera movement` : '';
    const qualTag = videoSettings.videoQuality === 'Cinematic' ? ', cinematic lighting 8k resolution hyper-realistic' : '';
    return `${base}${camTag}${qualTag} ${arTag}`;
  };

  // Copy Master Video Style
  const handleCopyMasterStyle = () => {
    const ms = result.masterVideoStyle;
    const styleText = `MASTER VIDEO STYLE — GODSEYE AI
Visual Aesthetic: ${ms?.visualAesthetic || 'Cinematic Documentary, Ultra-High Definition'}
Color Palette: ${ms?.colorPalette || 'High contrast deep blacks with teal/cyan highlights'}
Lighting: ${ms?.lighting || 'Dramatic volumetric lighting, rim light separation'}
Camera Movement: ${ms?.cameraMovement || 'Slow controlled push-ins and gimbal pans'}
Atmosphere: ${ms?.atmosphere || 'Serious, gripping, mysterious'}
Negative Prompt: ${ms?.negativePrompt || 'blurry, cartoonish, low resolution, warped hands, distorted faces'}`;

    navigator.clipboard.writeText(styleText);
    setCopiedMasterStyle(true);
    setTimeout(() => setCopiedMasterStyle(false), 2000);
  };

  // Copy All Video Prompts
  const handleCopyAllPrompts = () => {
    const text = result.scenes
      .map((s) => `SCENE ${s.sceneNumber.toString().padStart(2, '0')} (${s.time}):\n${getFormattedPrompt(s)}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAllPrompts(true);
    setTimeout(() => setCopiedAllPrompts(false), 2000);
  };

  // Download Video Prompts TXT
  const handleDownloadPromptsTxt = () => {
    const content = `GODSEYE AI — VIDEO GENERATION PROMPT PACKAGE
==================================================
Project: ${projectName}
Format: ${selectedFormat}
Total Scenes: ${result.scenes.length}
Video Quality: ${videoSettings.videoQuality}
Camera Style: ${videoSettings.cameraStyle}
Motion Level: ${videoSettings.motionLevel}
Consistency: ${videoSettings.visualConsistency}

--------------------------------------------------
MASTER VIDEO STYLE
--------------------------------------------------
Visual Aesthetic: ${result.masterVideoStyle?.visualAesthetic || 'Cinematic Documentary'}
Color Palette: ${result.masterVideoStyle?.colorPalette || 'High-contrast cinematic'}
Lighting: ${result.masterVideoStyle?.lighting || 'Volumetric cinematic lighting'}
Camera Movement: ${result.masterVideoStyle?.cameraMovement || 'Steady slow pans'}
Atmosphere: ${result.masterVideoStyle?.atmosphere || 'Gripping and suspenseful'}
Negative Prompt: ${result.masterVideoStyle?.negativePrompt || 'blurry, distorted, artifacts'}

--------------------------------------------------
SCENE PROMPT BREAKDOWN
--------------------------------------------------
${result.scenes
  .map(
    (s) => `[SCENE ${s.sceneNumber.toString().padStart(2, '0')}] Time: ${s.time}
Voice-over: "${s.voiceOver}"
Visual Intent: ${s.visual}
VIDEO PROMPT:
${getFormattedPrompt(s)}
Negative Prompt: ${s.negativePrompt || (s.videoPrompt as { negativePrompt?: string })?.negativePrompt || result.masterVideoStyle?.negativePrompt || 'low resolution, artifacts'}
On-Screen Text: ${s.onScreenText || 'None'}
`
  )
  .join('\n--------------------------------------------------\n')}

==================================================
END OF PROMPT PACKAGE
`;

    triggerBrowserDownload(content, `${projectName.toLowerCase().replace(/\s+/g, '-')}-video-prompts.txt`, 'text/plain');
  };

  // Download Video Prompts JSON
  const handleDownloadPromptsJson = () => {
    const payload = {
      project: projectName,
      format: selectedFormat,
      settings: videoSettings,
      masterVideoStyle: result.masterVideoStyle,
      scenes: result.scenes.map((s) => ({
        sceneNumber: s.sceneNumber,
        time: s.time,
        status: sceneStatuses[s.sceneNumber] || 'NOT READY',
        voiceOver: s.voiceOver,
        visual: s.visual,
        formattedPrompt: getFormattedPrompt(s),
        rawPrompt: s.videoPrompt?.prompt || s.visual,
        negativePrompt: s.videoPrompt?.negativePrompt || result.masterVideoStyle?.negativePrompt || '',
        onScreenText: s.onScreenText,
      })),
      generatedAt: new Date().toISOString(),
    };

    triggerBrowserDownload(JSON.stringify(payload, null, 2), `${projectName.toLowerCase().replace(/\s+/g, '-')}-video-prompts.json`, 'application/json');
  };

  // Download Complete Production Package
  const handleDownloadFullPackage = () => {
    const fullText = `GODSEYE AI — COMPLETE PRODUCTION PACKAGE
==================================================
Project: ${projectName}
Format: ${selectedFormat}
Generated At: ${new Date().toLocaleString()}

==================================================
1. SCRIPT & NARRATION
==================================================
${result.polishedScript || result.script?.fullScript || result.script?.text || result.script?.sections?.map((s) => s.narrationText || s.narration).join(' ')}

==================================================
2. MASTER VIDEO STYLE
==================================================
Aesthetic: ${result.masterVideoStyle?.visualAesthetic || result.masterVideoStyle?.cinematicStyle}
Color Palette: ${result.masterVideoStyle?.colorPalette || result.masterVideoStyle?.colorLighting}
Lighting: ${result.masterVideoStyle?.lighting || result.masterVideoStyle?.colorLighting}
Negative Prompt: ${result.masterVideoStyle?.negativePrompt || 'low resolution, artifacts'}

==================================================
3. SCENE BREAKDOWN & VIDEO PROMPTS
==================================================
${result.scenes
  .map(
    (s) => `SCENE ${s.sceneNumber.toString().padStart(2, '0')} (${s.time || s.duration})
VO: ${s.voiceOver}
VISUAL: ${s.visual}
PROMPT: ${getFormattedPrompt(s)}
TEXT: ${s.onScreenText || 'N/A'}`
  )
  .join('\n\n')}

==================================================
4. THUMBNAIL CONCEPTS
==================================================
Headline: ${result.thumbnails?.youtube?.headline || result.thumbnails?.concepts?.[0]?.headline || 'N/A'}
Visual Prompt: ${result.thumbnails?.youtube?.imagePrompt || result.thumbnails?.concepts?.[0]?.imagePrompt || 'N/A'}
Concept: ${result.thumbnails?.youtube?.concept || result.thumbnails?.concepts?.[0]?.concept || 'N/A'}

==================================================
5. MULTI-PLATFORM SEO & KEYWORDS
==================================================
Keywords: ${(result.keywords?.primary || []).join(', ')}
Hashtags: ${(result.seo?.youtubeShorts?.hashtags || []).join(' ')}

==================================================
6. ADOBE EXPRESS TIMELINE
==================================================
${((result.adobeExpressPlan?.timeline as any[]) || result.adobeExpressPlan?.scenes || []).map((t: any) => `[${t.clip || t.sceneNumber}] ${t.time || t.duration} | ${t.onScreenText} | Cut: ${t.cutInstruction || t.editingInstruction}`).join('\n')}
`;

    triggerBrowserDownload(fullText, `${projectName.toLowerCase().replace(/\s+/g, '-')}-complete-production-package.txt`, 'text/plain');
  };

  // Checklist verification
  const checklist = [
    { label: 'Script ready', checked: Boolean(result.script?.fullScript || result.script?.text || result.polishedScript) },
    { label: 'Scenes ready', checked: result.scenes.length > 0 },
    { label: 'Video prompts ready', checked: result.scenes.some((s) => Boolean(s.videoPrompt)) },
    { label: 'Format selected', checked: Boolean(selectedFormat) },
    { label: 'Master style ready', checked: Boolean(result.masterVideoStyle) },
    { label: 'Thumbnail ready', checked: Boolean(result.thumbnails?.youtube?.imagePrompt || result.thumbnails?.concepts?.length) },
    { label: 'SEO ready', checked: Boolean(result.seo?.youtubeShorts?.titles?.highCtr || result.seo?.youtubeShorts?.primaryKeyword) },
  ];

  const readyCount = Object.values(sceneStatuses).filter((s) => s === 'READY' || s === 'COMPLETED').length;

  return (
    <div id="godseye-video-generation-hub" className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 text-cyan-400 shadow-inner">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white font-mono">
                    VIDEO GENERATION HUB
                  </h1>
                  <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 text-xs font-bold text-cyan-300">
                    STEP 7
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">
                  Turn your GODSEYE scenes into production-ready AI video clips.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats / Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800 px-3.5 py-2">
              <span className="text-xs text-slate-400">Scenes Prepared:</span>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {readyCount} / {result.scenes.length}
              </span>
            </div>

            {/* Direct Video Generation Button */}
            <button
              id="godseye-btn-direct-generate-video"
              type="button"
              onClick={() => setShowFutureModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>GENERATE VIDEO</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Controls Bar: Workflow Selector & Format Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Selector */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5" />
              CHOOSE VIDEO WORKFLOW
            </label>
            <span className="text-xs text-slate-400">Select production target</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Google Flow / Veo', 'Other AI Video Tool', 'Adobe Express', 'Manual Production'] as VideoWorkflowType[]).map((wf) => (
              <button
                key={wf}
                type="button"
                onClick={() => setWorkflow(wf)}
                className={`rounded-xl border p-3 text-xs font-semibold text-center transition-all ${
                  workflow === wf
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {wf}
              </button>
            ))}
          </div>

          {/* Dynamic Instructions based on Workflow */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-300">
            <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              {workflow === 'Google Flow / Veo' && (
                <p>
                  <strong className="text-cyan-300">Google Flow / Veo Mode:</strong> Use the generated scene prompts in Google Flow/Veo. Generate each scene clip individually and keep visual consistency using the Master Video Style.
                </p>
              )}
              {workflow === 'Adobe Express' && (
                <p>
                  <strong className="text-cyan-300">Adobe Express Mode:</strong> Use the GODSEYE production plan to assemble your final video in Adobe Express. Align video clips, synced voiceover, subtitles, transitions, and audio cues.
                </p>
              )}
              {workflow === 'Manual Production' && (
                <p>
                  <strong className="text-cyan-300">Manual Production Mode:</strong> Download or copy the complete scene production package. Contains full scripts, scene timings, visual prompts, and timeline cues for your video editor.
                </p>
              )}
              {workflow === 'Other AI Video Tool' && (
                <p>
                  <strong className="text-cyan-300">Multi-Model AI Workflow:</strong> High-fidelity camera directions and lighting prompts ready for Runway Gen-3, Luma Dream Machine, Kling, or Sora.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Format Switcher */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2 mb-3">
              <Maximize2 className="h-3.5 w-3.5" />
              VIDEO FORMAT & ASPECT RATIO
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleToggleFormat('9:16 Portrait')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 px-2 text-xs font-bold transition-all ${
                  isPortrait
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="h-6 w-3.5 rounded border-2 border-current"></div>
                <span>9:16 PORTRAIT</span>
                <span className="text-[10px] opacity-75">Shorts / Reels / TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleFormat('16:9 Horizontal')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 px-2 text-xs font-bold transition-all ${
                  !isPortrait
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="h-3.5 w-6 rounded border-2 border-current"></div>
                <span>16:9 HORIZONTAL</span>
                <span className="text-[10px] opacity-75">YouTube / Landscape</span>
              </button>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500 italic">
            Changing format automatically reconfigures prompts with correct aspect ratio tags.
          </p>
        </div>
      </div>

      {/* 3. Master Video Style & Production Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Video Style (Col 1-2) */}
        <div className="lg:col-span-2 rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  MASTER VIDEO STYLE
                </h3>
                <p className="text-xs text-slate-400">
                  Global visual DNA applied across all scene generations for continuity
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyMasterStyle}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
            >
              {copiedMasterStyle ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedMasterStyle ? 'STYLE COPIED' : 'COPY MASTER STYLE'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-semibold text-cyan-400 block mb-1">Visual Aesthetic</span>
              <p className="text-slate-200">{result.masterVideoStyle?.visualAesthetic || 'Cinematic Documentary, Hyper-realistic 8K'}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-semibold text-cyan-400 block mb-1">Color Palette</span>
              <p className="text-slate-200">{result.masterVideoStyle?.colorPalette || 'High contrast deep blacks with teal/cyan highlights'}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-semibold text-cyan-400 block mb-1">Lighting & Camera</span>
              <p className="text-slate-200">{result.masterVideoStyle?.lighting || 'Volumetric cinematic lighting'} • {result.masterVideoStyle?.cameraMovement || 'Slow controlled push-ins'}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-semibold text-red-400 block mb-1">Negative Prompt (Exclusions)</span>
              <p className="text-slate-300 line-clamp-2">{result.masterVideoStyle?.negativePrompt || 'blurry, cartoonish, low resolution, warped hands, distorted faces, watermark'}</p>
            </div>
          </div>
        </div>

        {/* Video Production Checklist (Col 3) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              VIDEO PRODUCTION CHECKLIST
            </h3>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 px-3 py-2 text-xs"
              >
                <span className="text-slate-300">{item.label}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 font-mono">
                  <Check className="h-3.5 w-3.5" />
                  READY
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Workflow Specific Guide Section */}
      {workflow === 'Google Flow / Veo' && (
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-slate-900/90 p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Film className="h-5 w-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  GOOGLE FLOW / VEO 7-STEP BEGINNER WORKFLOW
                </h3>
                <p className="text-xs text-slate-400">Step-by-step guidance to produce high-impact clips</p>
              </div>
            </div>
            <span className="text-xs font-mono text-blue-400 border border-blue-500/30 rounded-full px-3 py-1 bg-blue-500/10">
              Veo Optimized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
              <span className="rounded bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 font-mono text-[10px] mr-1.5">STEP 1</span>
              <p className="font-semibold text-white mt-1.5">Copy Master Video Style</p>
              <p className="text-slate-400 text-[11px] mt-1">Copy the master visual style above to establish consistent lighting and look.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
              <span className="rounded bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 font-mono text-[10px] mr-1.5">STEP 2</span>
              <p className="font-semibold text-white mt-1.5">Open Google Flow</p>
              <p className="text-slate-400 text-[11px] mt-1">Launch your Google Flow or Veo environment in your browser window.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
              <span className="rounded bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 font-mono text-[10px] mr-1.5">STEP 3</span>
              <p className="font-semibold text-white mt-1.5">Create Selected Format</p>
              <p className="text-slate-400 text-[11px] mt-1">Set video canvas to {selectedFormat} before beginning clip generation.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
              <span className="rounded bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 font-mono text-[10px] mr-1.5">STEP 4</span>
              <p className="font-semibold text-white mt-1.5">Generate Each Scene Prompt</p>
              <p className="text-slate-400 text-[11px] mt-1">Use the pre-formatted scene prompt cards below one by one.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
              <span className="rounded bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 font-mono text-[10px] mr-1.5">STEP 5</span>
              <p className="font-semibold text-white mt-1.5">Visual Continuity</p>
              <p className="text-slate-400 text-[11px] mt-1">Keep subject, atmosphere, and color grading uniform across clips.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
              <span className="rounded bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 font-mono text-[10px] mr-1.5">STEP 6</span>
              <p className="font-semibold text-white mt-1.5">Download Generated Clips</p>
              <p className="text-slate-400 text-[11px] mt-1">Save each rendered high-resolution MP4 clip locally.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 lg:col-span-2">
              <span className="rounded bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 font-mono text-[10px] mr-1.5">STEP 7</span>
              <p className="font-semibold text-white mt-1.5">Assemble in Adobe Express</p>
              <p className="text-slate-400 text-[11px] mt-1">Drop the clips into Adobe Express, overlay the synced voiceover, and add animated subtitles.</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-950/60 border border-slate-800 p-2.5 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <span>
              Note: GODSEYE AI prepares and optimizes all scene prompts. Flow and Veo are accessed in their respective web tools.
            </span>
          </div>
        </div>
      )}

      {/* Adobe Express Production Mode Display */}
      {workflow === 'Adobe Express' && (
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/90 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <Film className="h-4 w-4 text-indigo-400" />
                ADOBE EXPRESS PRODUCTION MODE
              </h3>
              <p className="text-xs text-slate-400">Complete multi-track timeline breakdown for rapid video assembly</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const planText = (result.adobeExpressPlan?.timeline || [])
                  .map(
                    (t) =>
                      `[${t.clip}] ${t.time} | Duration: ${t.duration}
Voiceover: "${t.voiceOverLine}"
Subtitle: ${t.subtitleText}
On-Screen Text: ${t.onScreenText}
Transition: ${t.transition} | Music: ${t.musicCue} | SFX: ${t.sfxCue}
Instruction: ${t.cutInstruction}`
                  )
                  .join('\n\n');
                navigator.clipboard.writeText(planText);
                setCopiedAdobePlan(true);
                setTimeout(() => setCopiedAdobePlan(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-indigo-600/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/40 active:scale-95 transition-all self-start sm:self-auto"
            >
              {copiedAdobePlan ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedAdobePlan ? 'PLAN COPIED' : 'COPY ADOBE EXPRESS PLAN'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {(result.adobeExpressPlan?.timeline || []).map((tl, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 font-mono font-bold text-indigo-300">
                      {tl.clip}
                    </span>
                    <span className="font-mono text-cyan-300">{tl.time}</span>
                    <span className="text-slate-500">({tl.duration})</span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                    {tl.transition}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Voice-over</span>
                    <p className="text-slate-200 italic mt-0.5">"{tl.voiceOverLine}"</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">On-Screen Text & Subtitle</span>
                    <p className="text-cyan-300 font-semibold mt-0.5">{tl.onScreenText || tl.subtitleText}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/40">
                  <span><strong>Music:</strong> {tl.musicCue}</span>
                  <span><strong>SFX:</strong> {tl.sfxCue}</span>
                  <span className="text-slate-300"><strong>Cut:</strong> {tl.cutInstruction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Video Generation Settings Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            VIDEO PROMPT ENHANCEMENT SETTINGS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Quality */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">VIDEO QUALITY</label>
            <select
              value={videoSettings.videoQuality}
              onChange={(e) => setVideoSettings({ ...videoSettings, videoQuality: e.target.value as VideoQualityOption })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="Standard">Standard (720p/1080p)</option>
              <option value="High">High Definition</option>
              <option value="Cinematic">Cinematic (8K Ultra)</option>
            </select>
          </div>

          {/* Camera Style */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">CAMERA STYLE</label>
            <select
              value={videoSettings.cameraStyle}
              onChange={(e) => setVideoSettings({ ...videoSettings, cameraStyle: e.target.value as CameraStyleOption })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="Auto">Auto Movement</option>
              <option value="Cinematic">Cinematic Pan & Push</option>
              <option value="Documentary">Documentary Steady</option>
              <option value="Handheld">Handheld Dynamic</option>
              <option value="Technical">Technical Orbit / Macro</option>
              <option value="Dramatic">Dramatic Crash Zoom</option>
            </select>
          </div>

          {/* Motion Level */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">MOTION LEVEL</label>
            <select
              value={videoSettings.motionLevel}
              onChange={(e) => setVideoSettings({ ...videoSettings, motionLevel: e.target.value as MotionLevelOption })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="Low">Low (Subtle Atmospheric)</option>
              <option value="Medium">Medium (Balanced)</option>
              <option value="High">High (High Velocity Action)</option>
            </select>
          </div>

          {/* Visual Consistency */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">VISUAL CONSISTENCY</label>
            <select
              value={videoSettings.visualConsistency}
              onChange={(e) => setVideoSettings({ ...videoSettings, visualConsistency: e.target.value as VisualConsistencyOption })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="Standard">Standard</option>
              <option value="High">High (Enforce Master Style)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Batch Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Batch Actions:</span>
          <button
            type="button"
            onClick={handleCopyAllPrompts}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
          >
            {copiedAllPrompts ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedAllPrompts ? 'ALL COPIED' : 'COPY ALL VIDEO PROMPTS'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPromptsTxt}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PROMPTS (TXT)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPromptsJson}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PROMPTS (JSON)</span>
          </button>

          <button
            id="godseye-btn-download-production-package"
            type="button"
            onClick={handleDownloadFullPackage}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>DOWNLOAD PRODUCTION PACKAGE</span>
          </button>
        </div>
      </div>

      {/* 7. Scene Prompt List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
            SCENE PROMPT CARDS ({result.scenes.length} SCENES)
          </h3>
          <span className="text-xs text-slate-500">
            Click prompt to edit • Mark scenes READY after review
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {result.scenes.map((scene) => {
            const status = sceneStatuses[scene.sceneNumber] || 'NOT READY';
            const isEditing = editingScene === scene.sceneNumber;
            const rawPrompt = scene.videoPrompt as unknown;
            const promptStr = typeof rawPrompt === 'string' ? rawPrompt : (rawPrompt as { prompt?: string })?.prompt;
            const currentPrompt = editedPrompts[scene.sceneNumber] ?? promptStr ?? scene.visual;

            return (
              <div
                key={scene.sceneNumber}
                className={`rounded-2xl border p-5 backdrop-blur-xl transition-all ${
                  status === 'COMPLETED'
                    ? 'border-emerald-500/30 bg-slate-900/60'
                    : status === 'READY'
                    ? 'border-cyan-500/30 bg-slate-900/80'
                    : 'border-slate-800 bg-slate-900/70'
                }`}
              >
                {/* Scene Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
                      {scene.sceneNumber.toString().padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                        SCENE {scene.sceneNumber.toString().padStart(2, '0')}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        Timestamp: {scene.time}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge & Mark Ready Action */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(scene.sceneNumber)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                        status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : status === 'READY'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : status === 'COPIED'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {status === 'COMPLETED' || status === 'READY' ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Square className="h-3 w-3" />
                      )}
                      <span>{status}</span>
                    </button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                  {/* Voice-over & Visual Intent */}
                  <div className="space-y-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                        Voice-over Narration
                      </span>
                      <p className="text-slate-200 italic">"{scene.voiceOver}"</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Visual Concept & On-Screen Text
                      </span>
                      <p className="text-slate-300">{scene.visual}</p>
                      {scene.onScreenText && (
                        <p className="mt-1.5 text-cyan-300 font-semibold text-[11px]">
                          Overlay: "{scene.onScreenText}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Video Prompt Area */}
                  <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] uppercase font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                          <Video className="h-3.5 w-3.5" />
                          VIDEO PROMPT (GOOGLE FLOW / VEO READY)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {isPortrait ? '9:16' : '16:9'}
                        </span>
                      </div>

                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={currentPrompt}
                          onChange={(e) => {
                            setEditedPrompts({
                              ...editedPrompts,
                              [scene.sceneNumber]: e.target.value,
                            });
                          }}
                          className="w-full rounded-lg border border-cyan-500/50 bg-slate-900 p-2 text-xs text-white focus:outline-none"
                        />
                      ) : (
                        <div className="text-slate-200 font-mono text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 max-h-48 overflow-y-auto scrollbar-thin select-all whitespace-pre-wrap">
                          {getFormattedPrompt(scene)}
                        </div>
                      )}
                    </div>

                    {/* Negative prompt hint */}
                    <p className="mt-2 text-[10px] text-slate-500 truncate">
                      Negative: {scene.negativePrompt || (scene.videoPrompt as { negativePrompt?: string })?.negativePrompt || result.masterVideoStyle?.negativePrompt || 'artifacts, blur'}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    {/* Copy Prompt */}
                    <button
                      type="button"
                      onClick={() => handleCopyScenePrompt(scene)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                    >
                      {copiedSceneId === scene.sceneNumber ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedSceneId === scene.sceneNumber ? 'COPIED' : 'COPY PROMPT'}</span>
                    </button>

                    {/* Edit Prompt Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditing) {
                          if (onUpdateScenePrompt) {
                            onUpdateScenePrompt(scene.sceneNumber, currentPrompt);
                          }
                          setEditingScene(null);
                        } else {
                          setEditingScene(scene.sceneNumber);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>{isEditing ? 'SAVE PROMPT' : 'EDIT PROMPT'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mark Ready toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(scene.sceneNumber)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
                    >
                      <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                      <span>MARK {status === 'READY' || status === 'COMPLETED' ? 'NOT READY' : 'READY'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Future Direct Video Generation Modal */}
      {showFutureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">DIRECT AI VIDEO GENERATION</h3>
                <p className="text-xs text-slate-400">Provider Status Information</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3.5 text-amber-200">
                <div className="flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-300">
                      Direct AI video generation is not configured yet.
                    </p>
                    <p className="mt-1 text-[11px] text-amber-200/90">
                      Use Google Flow/Veo prompts or Adobe Express production mode. All prompts have been formatted with aspect ratios and camera movements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Future-Ready Provider Architecture:
                </span>
                <p className="text-slate-400">• GoogleVeoProvider (Standby / Not Configured)</p>
                <p className="text-slate-400">• OtherVideoProvider (Modular Integration)</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowFutureModal(false)}
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
              >
                CLOSE
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowFutureModal(false);
                  setWorkflow('Google Flow / Veo');
                }}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all"
              >
                USE GOOGLE FLOW WORKFLOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
