import React, { useState } from 'react';
import {
  Clapperboard,
  Camera,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Film,
  Video,
  ShieldCheck,
  AlertTriangle,
  Type,
  Volume2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab, SceneItem } from '../../types';
import {
  buildStandalonePrompt,
  formatSingleScenePackage,
  formatAllScenesPackage,
  getFormatSpec,
} from '../../utils/formatSpecs';

interface SceneStudioViewProps {
  activeProject: GodseyeProject | null;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const SceneStudioView: React.FC<SceneStudioViewProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [copiedFullPackage, setCopiedFullPackage] = useState(false);
  const [copiedScenePackageIndex, setCopiedScenePackageIndex] = useState<number | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [showAdvancedTimeline, setShowAdvancedTimeline] = useState(false);

  const config = activeProject?.config;
  const result = activeProject?.result;
  const scenes: SceneItem[] = result?.scenes || [];
  const hasScenes = scenes.length > 0;

  const videoFormat = config?.videoFormat || result?.masterVideoStyle?.aspectRatio || '9:16 Vertical (1080x1920)';
  const mood = config?.mood || 'Dramatic';
  const duration = config?.duration || result?.script?.duration || '60 sec';
  const masterVideoStyle = result?.masterVideoStyle;
  const formatSpec = getFormatSpec(videoFormat);
  const isVertical = formatSpec.aspectRatio === '9:16';

  // Copy top-level Full Scene Package (all scenes)
  const handleCopyFullPackage = () => {
    if (!scenes.length) return;
    const fullPackage = formatAllScenesPackage(
      scenes,
      videoFormat,
      mood,
      duration,
      masterVideoStyle
    );
    navigator.clipboard.writeText(fullPackage).catch(() => {});
    setCopiedFullPackage(true);
    setTimeout(() => setCopiedFullPackage(false), 2000);
  };

  // Copy single scene complete production package
  const handleCopyScene = (scene: SceneItem, index: number) => {
    const scenePackage = formatSingleScenePackage(
      scene,
      videoFormat,
      mood,
      masterVideoStyle
    );
    navigator.clipboard.writeText(scenePackage).catch(() => {});
    setCopiedScenePackageIndex(index);
    setTimeout(() => setCopiedScenePackageIndex(null), 2000);
  };

  // Copy standalone Google Flow / Veo Prompt
  const handleCopyPrompt = (scene: SceneItem, index: number) => {
    const standalonePrompt = buildStandalonePrompt(
      scene,
      videoFormat,
      mood,
      masterVideoStyle
    );
    navigator.clipboard.writeText(standalonePrompt).catch(() => {});
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* 1. TOP HEADER BANNER & GLOBAL COPY CONTROLS */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#140e24] via-[#0f0a1c] to-[#080b12] p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-700/60 text-xs font-semibold text-purple-200 shadow-sm">
                <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
                <span>SCENE & CINEMATOGRAPHY STUDIO</span>
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isVertical
                    ? 'bg-pink-950/80 text-pink-300 border-pink-700/60'
                    : 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
                }`}
              >
                {formatSpec.aspectRatio} • {formatSpec.frameSize}
              </span>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {hasScenes ? `${scenes.length} Production Scenes` : 'Ready'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Visual Scene Blueprint & Camera Engineering
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Frame-by-frame visual choreography, teleprompter voice-over synchronization, camera lens directives, and production-ready Google Flow & Veo AI generation prompts.
            </p>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2.5 flex-wrap self-start xl:self-auto">
            {hasScenes && (
              <button
                type="button"
                id="btn-copy-full-scene-package-studio"
                onClick={handleCopyFullPackage}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 transition-all cursor-pointer active:scale-95 border border-cyan-400/40"
                title="Copy all scenes in structured multi-scene production package"
              >
                {copiedFullPackage ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span className="text-emerald-100">COPIED FULL PACKAGE!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>COPY FULL SCENE PACKAGE</span>
                  </>
                )}
              </button>
            )}

            {!hasScenes && (
              <button
                type="button"
                onClick={() => onNavigate('Create')}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-purple-600/30"
              >
                <span>Go to Content Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN SCENE WORKSPACE */}
      {!hasScenes ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-4">
          <Film className="w-12 h-12 text-purple-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active project scenes loaded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Generate content in the Creator Studio or select an existing project from the Dashboard to inspect its scene choreography and Google Flow / Veo prompts.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Creator Studio</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Format Safe-Zone Directive Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 shadow-md">
            <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-300 leading-relaxed flex-1">
              <strong className="text-white">
                {isVertical ? '9:16 Vertical Safe Area Directive Enforced:' : '16:9 Horizontal Safe Margin Directive Enforced:'}
              </strong>{' '}
              {isVertical
                ? 'All generated prompts and on-screen overlays are composed for vertical mobile viewing with key action and captions centered in the safe middle-third, avoiding occlusion by TikTok, Instagram Reels, and YouTube Shorts native interface buttons.'
                : 'Framed for widescreen 16:9 displays with rule-of-thirds composition balance, cinematic focal depth, and lower-third typography margins.'}
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40 hidden sm:inline-block">
              {formatSpec.composition}
            </span>
          </div>

          {/* 3. SCENE CARDS LIST — CONSISTENT FULL PRODUCTION STRUCTURE */}
          <div className="space-y-6">
            {scenes.map((scene, idx) => {
              const sceneNumStr = scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : `${scene.sceneNumber}`;
              const standalonePrompt = buildStandalonePrompt(scene, videoFormat, mood, masterVideoStyle);
              const isPromptCopied = copiedPromptIndex === idx;
              const isSceneCopied = copiedScenePackageIndex === idx;

              return (
                <div
                  key={scene.sceneNumber || idx}
                  className="rounded-2xl border border-slate-800 bg-[#0b101c] p-5 sm:p-6 shadow-2xl space-y-5 hover:border-slate-700/80 transition-colors"
                >
                  {/* Scene Card Header: Title/Number & Quick Copy Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="w-9 h-9 rounded-xl bg-purple-950 text-purple-300 border border-purple-800/60 font-mono font-bold text-sm flex items-center justify-center shadow-inner">
                        #{sceneNumStr}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                            Scene {scene.sceneNumber}
                            {scene.title ? ` — ${scene.title}` : ''}
                          </h3>
                          <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                            {scene.startTime || '00:00'} - {scene.endTime || '00:05'}
                          </span>
                          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                            {scene.duration || '5s'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Copy Controls (Clearly Visible & Accessible) */}
                    <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                      <button
                        type="button"
                        id={`btn-copy-prompt-studio-${scene.sceneNumber}`}
                        onClick={() => handleCopyPrompt(scene, idx)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 border border-pink-700/60 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
                        title={`Copy standalone Google Flow / Veo Prompt for Scene ${scene.sceneNumber}`}
                      >
                        {isPromptCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">COPIED PROMPT</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-pink-400" />
                            <span>COPY PROMPT</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        id={`btn-copy-scene-studio-${scene.sceneNumber}`}
                        onClick={() => handleCopyScene(scene, idx)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/60 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                        title={`Copy Scene ${scene.sceneNumber} full production package`}
                      >
                        {isSceneCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">COPIED SCENE!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-cyan-400" />
                            <span>COPY SCENE</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 1. VOICE-OVER NARRATION */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">
                      Voice-Over Narration (Teleprompter Line):
                    </span>
                    <p className="text-sm sm:text-base text-slate-100 font-sans pl-3 border-l-2 border-cyan-500 font-medium leading-relaxed">
                      "{scene.voiceOver || scene.narration || 'Voice-over narration line for this sequence.'}"
                    </p>
                  </div>

                  {/* 2. VISUAL OBJECTIVE */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block font-mono">
                      Visual Objective & Shot Choreography:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {scene.visualObjective || scene.visual || 'Visual composition and narrative focus.'}
                    </p>
                  </div>

                  {/* 3. GOOGLE FLOW / VEO VIDEO PROMPT (With its own dedicated scrollable content area) */}
                  <div className="p-4 sm:p-5 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-purple-900/30">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Video className="w-4 h-4 text-pink-400" />
                        <span className="text-xs font-bold text-pink-300 uppercase tracking-wider font-mono">
                          GOOGLE FLOW / VEO VIDEO PROMPT
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/40">
                          {formatSpec.aspectRatio}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(scene, idx)}
                        className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {isPromptCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-pink-400" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Dedicated scrollable container for long prompt text */}
                    <div className="w-full max-h-52 sm:max-h-60 overflow-y-auto scrollbar-thin p-3.5 rounded-xl bg-[#060911] border border-purple-900/40 text-xs font-mono text-purple-200 leading-relaxed select-all whitespace-pre-wrap shadow-inner">
                      {standalonePrompt}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2 pt-1">
                      <span className="text-purple-300 font-mono text-[11px]">
                        ✓ Formatted for {formatSpec.outputFormat} ({formatSpec.aspectRatio}) • {formatSpec.frameSize}
                      </span>
                      <span className="text-slate-500 font-mono">Ready for direct paste into Google Flow / Veo</span>
                    </div>
                  </div>

                  {/* 4. NEGATIVE PROMPT */}
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block font-mono flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      NEGATIVE PROMPT / AVOID INSTRUCTIONS:
                    </span>
                    <p className="font-mono text-xs text-rose-200/90 leading-relaxed">
                      {scene.negativePrompt ||
                        'No watermark. No unwanted logo. No random text rendered inside frame. No distorted anatomy, extra fingers, or deformed faces. No unrelated objects. No cartoonish 3D render artifacts.'}
                    </p>
                  </div>

                  {/* 5. ON-SCREEN TEXT & SAFE AREA / TEXT PLACEMENT */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block font-mono flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-amber-300" />
                      ON-SCREEN TEXT & SAFE AREA PLACEMENT:
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-amber-950/50 text-amber-300 font-bold border border-amber-800/50 font-heading text-xs tracking-wide">
                          {scene.onScreenText || 'None'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                        <span className="text-slate-400 font-medium">Safe Area Placement:</span>
                        <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {scene.textPlacement || (isVertical ? 'Safe central area (middle-third)' : 'Lower-third center safe margin')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 6. TECHNICAL DIRECTIVES (Camera, Transition, Sound FX) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <Camera className="w-3 h-3 text-cyan-400" />
                        Camera Movement:
                      </span>
                      <p className="text-slate-200 font-mono text-[11px]">
                        {scene.movement || scene.camera || 'Cinematic tracking shot'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-purple-400" />
                        Transition:
                      </span>
                      <p className="text-slate-200 font-mono text-[11px]">
                        {scene.transition || 'Rapid whip pan on beat'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-amber-400" />
                        Sound FX:
                      </span>
                      <p className="text-slate-200 text-[11px]">
                        {scene.audio?.sfx || scene.sound || 'Subtle whoosh foley'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                    <span className="font-mono text-[11px]">
                      Scene {scene.sceneNumber} • {formatSpec.videoFormat} • {scene.duration || '5s'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyScene(scene, idx)}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Scene Package</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. OPTIONAL ADVANCED TIMELINE & PRODUCTION TOOLS ACCORDION */}
          {result?.adobeExpressPlan?.timeline && result.adobeExpressPlan.timeline.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#0b101c] p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Multi-Track Timeline Assembly Breakdown
                  </h4>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                    {result.adobeExpressPlan.timeline.length} Clips
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedTimeline(!showAdvancedTimeline)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{showAdvancedTimeline ? 'Collapse Timeline' : 'Expand Timeline'}</span>
                  {showAdvancedTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showAdvancedTimeline && (
                <div className="space-y-3 pt-4 border-t border-slate-800/80 mt-3 animate-fadeIn">
                  {result.adobeExpressPlan.timeline.map((tl, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-800/60 pb-1.5">
                        <span className="font-mono font-bold text-indigo-300">
                          {tl.clip} • {tl.time} ({tl.duration})
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Transition: {tl.transition}
                        </span>
                      </div>
                      <p className="text-slate-200">
                        <strong className="text-cyan-400">Voiceover:</strong> "{tl.voiceOverLine}"
                      </p>
                      {tl.onScreenText && (
                        <p className="text-amber-300 font-mono text-[11px]">
                          <strong>Overlay:</strong> "{tl.onScreenText}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
