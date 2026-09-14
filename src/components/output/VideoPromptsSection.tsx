import React, { useState } from 'react';
import {
  Film,
  Copy,
  Check,
  Sparkles,
  Compass,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { SceneItem, MasterVideoStyle, VideoFormat, Mood } from '../../types';
import { SceneProductionCard } from './SceneProductionCard';
import { formatAllScenesPackage } from '../../utils/formatSpecs';

interface VideoPromptsSectionProps {
  scenes: SceneItem[];
  masterVideoStyle?: MasterVideoStyle;
  videoFormat: VideoFormat;
  mood: Mood;
  onCopyText: (text: string, label: string) => void;
  onRegenerate?: () => void;
  onRegenerateScene?: (sceneNumber: number) => void;
  onUpdateScene?: (updatedScene: SceneItem) => void;
  onSwitchToAdobeExpress?: () => void;
  isLoading?: boolean;
}

export const VideoPromptsSection: React.FC<VideoPromptsSectionProps> = ({
  scenes,
  masterVideoStyle,
  videoFormat,
  mood,
  onCopyText,
  onRegenerate,
  onRegenerateScene,
  onUpdateScene,
  onSwitchToAdobeExpress,
  isLoading,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showMasterStyle, setShowMasterStyle] = useState(true);

  const isVertical = Boolean(videoFormat && videoFormat.includes('9:16'));

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAllPrompts = () => {
    const formatted = formatAllScenesPackage(scenes, videoFormat, mood, '60 sec', masterVideoStyle);
    handleCopy(formatted, 'all-prompts', 'All Complete Scene Packages');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900/60 border border-pink-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Film className="w-5 h-5 text-pink-400" />
            <h3 className="text-base font-bold text-white tracking-wide font-heading">
              VIDEO PRODUCTION ENGINE — GOOGLE FLOW & VEO PROMPTS
            </h3>
            <span
              className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                isVertical
                  ? 'bg-pink-950/80 text-pink-300 border-pink-700/60'
                  : 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
              }`}
            >
              {videoFormat}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every scene is precision-engineered for Google Flow & Veo generation models with camera trajectory, lighting, depth, strict negative safety prompts, and format-specific safe margins.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <button
            type="button"
            id="btn-copy-all-video-prompts"
            onClick={handleCopyAllPrompts}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-pink-200 bg-pink-950/80 hover:bg-pink-900 border border-pink-700/70 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {copiedKey === 'all-prompts' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-pink-400" />
            )}
            <span>COPY ALL VIDEO PROMPTS</span>
          </button>

          {onSwitchToAdobeExpress && (
            <button
              type="button"
              id="btn-open-adobe-plan"
              onClick={onSwitchToAdobeExpress}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700/60 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ADOBE EXPRESS PLAN</span>
            </button>
          )}

          {onRegenerate && (
            <button
              type="button"
              id="btn-regenerate-prompts"
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>REGENERATE PROMPTS</span>
            </button>
          )}
        </div>
      </div>

      {/* Master Video Style Overview Card */}
      {masterVideoStyle && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white tracking-wide">
                MASTER VIDEO STYLE & VISUAL CONTINUITY BLUEPRINT
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowMasterStyle(!showMasterStyle)}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {showMasterStyle ? 'Collapse Style' : 'Expand Style'}
            </button>
          </div>

          {showMasterStyle && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Cinematic Style & Aesthetic
                </span>
                <p className="text-slate-200 leading-relaxed">{masterVideoStyle.cinematicStyle}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  Color Grading & Lighting
                </span>
                <p className="text-slate-200 leading-relaxed">{masterVideoStyle.colorLighting}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                  Camera Language & Pacing
                </span>
                <p className="text-slate-200 leading-relaxed">{masterVideoStyle.cameraLanguage}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Realism Level & Textures
                </span>
                <p className="text-slate-200 leading-relaxed">{masterVideoStyle.realismLevel}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Visual Continuity Rule
                </span>
                <p className="text-slate-200 leading-relaxed">{masterVideoStyle.visualContinuity}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Editorial / News Safety
                </span>
                <p className="text-slate-200 leading-relaxed">{masterVideoStyle.documentaryApproach}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Format Safe-Zone Directive */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">
            {isVertical ? '9:16 Vertical Safe Area Enforced:' : '16:9 Cinematic Safe Margin Enforced:'}
          </strong>{' '}
          {isVertical
            ? 'All generated prompts and on-screen text are optimized for vertical screens with focal action and overlays centered in the middle third to prevent occlusion by TikTok / Instagram Reels / YouTube Shorts UI elements.'
            : 'Framed for horizontal 16:9 widescreen displays with balanced rule-of-thirds composition, cinematic anamorphic bokeh, and lower-third typography margins.'}
        </div>
      </div>

      {/* Individual Scene Prompts List */}
      <div className="space-y-6">
        {scenes.map((scene) => (
          <SceneProductionCard
            key={scene.sceneNumber}
            scene={scene}
            videoFormat={videoFormat}
            mood={mood}
            masterVideoStyle={masterVideoStyle}
            onCopyText={onCopyText}
            onRegenerateScene={onRegenerateScene}
            onUpdateScene={onUpdateScene}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};
