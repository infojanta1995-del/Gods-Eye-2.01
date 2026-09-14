import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Layers,
  Clock,
  Video,
  Volume2,
  FileText,
  Sliders,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AdobeExpressPackage } from '../../types';

interface AdobeExpressSectionProps {
  adobeExpressPlan?: AdobeExpressPackage;
  onCopyText: (text: string, label: string) => void;
  onSwitchToVideoPrompts?: () => void;
}

export const AdobeExpressSection: React.FC<AdobeExpressSectionProps> = ({
  adobeExpressPlan,
  onCopyText,
  onSwitchToVideoPrompts,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!adobeExpressPlan || !adobeExpressPlan.scenes || adobeExpressPlan.scenes.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
        <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-sm">No Adobe Express plan available. Generate content to view timeline layout.</p>
      </div>
    );
  }

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullPlan = () => {
    const formatted = `==================================================
GODSEYE AI - ADOBE EXPRESS VIDEO ASSEMBLY PLAN
==================================================
PROJECT TITLE: ${adobeExpressPlan.projectTitle}
ASPECT RATIO: ${adobeExpressPlan.aspectRatio}
TARGET DURATION: ${adobeExpressPlan.targetDuration}
OVERVIEW: ${adobeExpressPlan.overview}

TIMELINE SCENE ASSEMBLY SEQUENCE:
${adobeExpressPlan.scenes
  .map(
    (s) => `--------------------------------------------------
SCENE ${s.sceneNumber} (${s.duration})
• Visual Asset / Clip: ${s.visual}
• Voice-Over Line: "${s.voiceOver}"
• On-Screen Headline: "${s.onScreenText}"
• Auto-Caption Subtitle: "${s.captionSubtitle}"
• Transition: ${s.transition}
• Audio Direction: ${s.audioDirection}
`
  )
  .join('\n')}
==================================================`;

    handleCopy(formatted, 'full-plan', 'Adobe Express Assembly Plan');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900/60 border border-red-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white tracking-wide font-heading">
              ADOBE EXPRESS VIDEO EDITING PACKAGE
            </h3>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/60">
              {adobeExpressPlan.aspectRatio}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Ready-to-assemble editing blueprint formatted for Adobe Express timeline tracks: synchronized clips, motion titles, auto-captions, voiceover cuts, and transition points.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <button
            type="button"
            id="btn-copy-adobe-express-plan"
            onClick={handleCopyFullPlan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-200 bg-red-950/80 hover:bg-red-900 border border-red-700/70 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {copiedKey === 'full-plan' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-red-400" />
            )}
            <span>COPY ADOBE EXPRESS PLAN</span>
          </button>

          {onSwitchToVideoPrompts && (
            <button
              type="button"
              onClick={onSwitchToVideoPrompts}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/70 hover:bg-pink-900/80 border border-pink-700/60 transition-all cursor-pointer active:scale-95"
            >
              <Video className="w-3.5 h-3.5 text-pink-400" />
              <span>VIEW VEO PROMPTS</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Project Title
          </span>
          <p className="text-white font-semibold text-sm">{adobeExpressPlan.projectTitle}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
            Target Aspect Ratio
          </span>
          <p className="text-slate-200 font-mono font-medium">{adobeExpressPlan.aspectRatio}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Total Target Duration
          </span>
          <p className="text-slate-200 font-mono font-medium">{adobeExpressPlan.targetDuration}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
            Scene Count
          </span>
          <p className="text-slate-200 font-mono font-medium">{adobeExpressPlan.scenes.length} Timeline Clips</p>
        </div>
      </div>

      {/* Assembly Overview */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Sliders className="w-4 h-4 text-red-400" />
          <span>Timeline Assembly Overview:</span>
        </div>
        <p className="leading-relaxed text-slate-300 pl-6">{adobeExpressPlan.overview}</p>
      </div>

      {/* Scene Timeline Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Scene-by-Scene Timeline Track Layout
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            {adobeExpressPlan.scenes.length} Scenes
          </span>
        </div>

        {adobeExpressPlan.scenes.map((scene) => {
          const sceneKey = `adobe-scene-${scene.sceneNumber}`;
          const isCopied = copiedKey === sceneKey;

          return (
            <div
              key={scene.sceneNumber}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-red-950 text-red-300 font-mono text-xs flex items-center justify-center font-bold border border-red-800/40">
                    {scene.sceneNumber}
                  </span>
                  <span className="text-xs font-bold text-white">
                    Timeline Clip {scene.sceneNumber}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    Duration: {scene.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                    Transition: {scene.transition}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `Scene ${scene.sceneNumber} (${scene.duration})\nVisual: ${scene.visual}\nVoice: ${scene.voiceOver}\nText: ${scene.onScreenText}\nTransition: ${scene.transition}\nAudio: ${scene.audioDirection}`,
                        sceneKey,
                        `Scene ${scene.sceneNumber} Adobe Plan`
                      )
                    }
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Visual Asset Guidance */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                  <strong className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                    Video Track 1 (Visual Clip / Asset)
                  </strong>
                  <p className="text-slate-200 leading-relaxed">{scene.visual}</p>
                </div>

                {/* Voice-Over Audio Line */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                  <strong className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Audio Track 1 (Voiceover Narration)
                  </strong>
                  <p className="text-slate-100 italic leading-relaxed pl-2 border-l-2 border-cyan-500/40">
                    "{scene.voiceOver}"
                  </p>
                </div>

                {/* On-Screen Headline & Captions */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                  <strong className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Text Track (Headline & Auto-Captions)
                  </strong>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 font-bold border border-amber-800/40 font-heading">
                      {scene.onScreenText}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Subtitle: "{scene.captionSubtitle}"
                    </span>
                  </div>
                </div>

                {/* Audio Mix Direction */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                  <strong className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Audio Mix & Timeline Direction
                  </strong>
                  <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                    {scene.audioDirection}
                  </p>
                </div>
              </div>

              {/* Editing & Position Note */}
              {(scene.editingInstruction || scene.textPosition) && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                  {scene.textPosition && (
                    <span className="flex items-center gap-1.5">
                      <strong className="text-slate-300">Text Safe Placement:</strong> {scene.textPosition}
                    </span>
                  )}
                  {scene.editingInstruction && (
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <strong className="text-slate-300">Assembly Cue:</strong> {scene.editingInstruction}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FINAL EDITING CHECKLIST (Step 5 Upgrade) */}
      {adobeExpressPlan.checklist && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 border border-red-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-400" />
              <h4 className="text-sm sm:text-base font-bold text-white tracking-wide font-heading">
                ADOBE EXPRESS FINAL EDITING CHECKLIST
              </h4>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40 self-start sm:self-auto">
              Pre-Export Quality Gate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">1. Aspect Ratio</span>
              <p className="text-slate-200 font-semibold">{adobeExpressPlan.checklist.aspectRatio}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-400 block">2. Resolution & Export</span>
              <p className="text-slate-200">{adobeExpressPlan.checklist.resolutionRecommendation}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">3. Caption Synchronization</span>
              <p className="text-slate-200">{adobeExpressPlan.checklist.captionCheck}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-400 block">4. Audio Balance & Ducking</span>
              <p className="text-slate-200">{adobeExpressPlan.checklist.audioCheck}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">5. Text Safe Margin</span>
              <p className="text-slate-200">{adobeExpressPlan.checklist.textSafeArea}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-pink-400 block">6. Thumbnail Verification</span>
              <p className="text-slate-200">{adobeExpressPlan.checklist.thumbnailCheck}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">7. Branding & Handle</span>
              <p className="text-slate-200">{adobeExpressPlan.checklist.brandingCheck}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-400 block">8. Factual Cross-Check</span>
              <p className="text-slate-200">{adobeExpressPlan.checklist.factCheckReminder}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
