import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Flame,
  Layers,
  HeartHandshake,
  Zap,
  HelpCircle,
  Eye,
  Check,
  Copy,
} from 'lucide-react';
import { StoryAngle, StoryAngleOption } from '../../types';

interface StoryAngleSectionProps {
  storyAngle: StoryAngle;
  onSelectAngle: (angle: StoryAngleOption) => void;
  onContinue: () => void;
  onRegenerate?: () => void;
  onCopyText: (text: string, label: string) => void;
  isLoading?: boolean;
}

export const StoryAngleSection: React.FC<StoryAngleSectionProps> = ({
  storyAngle,
  onSelectAngle,
  onContinue,
  onRegenerate,
  onCopyText,
  isLoading,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Default angles if not populated by server
  const angles: StoryAngleOption[] = (storyAngle.angles && storyAngle.angles.length > 0)
    ? storyAngle.angles
    : [
        {
          id: 'angle-curiosity',
          type: 'Curiosity',
          angle: storyAngle.mainAngle || 'The Hidden Anomaly Nobody Anticipated',
          shortExplanation: 'Focuses on the counter-intuitive observation that puzzles researchers and instantly hooks viewer intrigue.',
          curiosityPotential: 9.8,
          visualPotential: 9.5,
          isRecommended: true,
          emotionalDirection: 'Intrigue & intellectual revelation',
          audienceRelevance: 'Mass social media curiosity, mystery enthusiasts, and quick learners',
          recommendedFormat: 'Short/Reel',
        },
        {
          id: 'angle-breaking',
          type: 'Breaking development',
          angle: 'Urgent Timeline: How The Discovery Unfolded In Real Time',
          shortExplanation: 'High-stakes, urgent journalistic pacing detailing how the events were verified hour by hour.',
          curiosityPotential: 9.4,
          visualPotential: 9.2,
          isRecommended: false,
          emotionalDirection: 'Urgency & consequence',
          audienceRelevance: 'Current affairs and tech/science news followers',
          recommendedFormat: 'Short/Reel',
        },
        {
          id: 'angle-human',
          type: 'Human impact',
          angle: 'The Human Stakes: What This Breakthrough Changes For Millions',
          shortExplanation: 'Translates technical specifications into direct emotional relevance for ordinary individuals.',
          curiosityPotential: 9.1,
          visualPotential: 9.0,
          isRecommended: false,
          emotionalDirection: 'Empathy & profound inspiration',
          audienceRelevance: 'General digital audience seeking meaningful stories',
          recommendedFormat: 'Long Video',
        },
        {
          id: 'angle-explainer',
          type: 'Explainer',
          angle: 'Deconstructed: How The Science Actually Operates Step-by-Step',
          shortExplanation: 'Clean didactic clarity eliminating jargon so even casual viewers understand the core mechanism.',
          curiosityPotential: 9.0,
          visualPotential: 9.4,
          isRecommended: false,
          emotionalDirection: 'Clarity, mastery & satisfaction',
          audienceRelevance: 'Educational content viewers and deep-dive researchers',
          recommendedFormat: 'Long Video',
        },
        {
          id: 'angle-investigation',
          type: 'Investigation',
          angle: 'Behind Closed Doors: The Unanswered Questions & Evidence Trail',
          shortExplanation: 'Investigative documentary framing following paper trails, data anomalies, and unresolved conflicts.',
          curiosityPotential: 9.6,
          visualPotential: 9.6,
          isRecommended: false,
          emotionalDirection: 'Suspense, scrutiny & dramatic tension',
          audienceRelevance: 'True-crime, investigative journalism, and deep documentarians',
          recommendedFormat: 'Long Video',
        },
      ];

  const selectedAngleText = storyAngle.selectedAngle || storyAngle.mainAngle;

  const handleCopy = (text: string, id: string, label: string) => {
    onCopyText(text, label);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Curiosity':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/50';
      case 'Breaking development':
        return 'bg-red-950/80 text-red-300 border-red-800/50';
      case 'Human impact':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50';
      case 'Explainer':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/50';
      case 'Investigation':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/50';
      default:
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0a1220] to-[#070b12] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-bold">
                STEP 2 • STORY ANGLE ENGINE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Multi-Perspective Narrative Matrix
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-heading mt-0.5">
              Select Your Core Narrative Angle
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Choose the framing that best maximizes viewer curiosity, emotional driver, and format alignment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isLoading ? 'Regenerating...' : 'Regenerate Angles'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>Viral Hooks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Current Active Angle Summary Bar */}
      {selectedAngleText && (
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                ACTIVE SELECTED STORY ANGLE (DRIVING SCRIPT GENERATION):
              </span>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {selectedAngleText}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold whitespace-nowrap self-start sm:self-auto">
            LOCKED TO PIPELINE
          </span>
        </div>
      )}

      {/* Story Angle Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {angles.map((item) => {
          const isSelected = selectedAngleText === item.angle || storyAngle.selectedAngleId === item.id;

          return (
            <div
              key={item.id}
              className={`group relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0e192c] border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-500/10'
                  : 'bg-[#0b101a] border-slate-800 hover:border-slate-700 hover:bg-[#0d1422]'
              }`}
            >
              {/* Card Header: Type Badge, Recommended Flag, Scores */}
              <div>
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border font-bold ${getBadgeColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                    {item.isRecommended && (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
                        <Sparkles className="w-3 h-3" />
                        AI RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">Curiosity:</span>
                    <span className="font-bold text-cyan-400">{item.curiosityPotential}/10</span>
                  </div>
                </div>

                {/* Angle Title */}
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug mb-2">
                  {item.angle}
                </h4>

                {/* Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.shortExplanation}
                </p>

                {/* Metadata Pills: Emotional Direction, Audience, Format */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/70 text-[11px]">
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-mono text-purple-400 font-semibold w-24 flex-shrink-0">
                      Emotion:
                    </span>
                    <span className="text-slate-200 font-medium">
                      {item.emotionalDirection || 'Intellectual curiosity and revelation'}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-mono text-emerald-400 font-semibold w-24 flex-shrink-0">
                      Audience:
                    </span>
                    <span className="text-slate-200 font-medium">
                      {item.audienceRelevance || 'Digital general interest & science enthusiasts'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="font-mono text-blue-400 font-semibold w-24 flex-shrink-0">
                      Best Format:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/50 text-blue-200 text-[10px] font-mono">
                      {item.recommendedFormat || 'Short/Reel'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleCopy(item.angle, item.id, 'Story Angle')}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-slate-800 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectAngle(item)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                      : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SELECTED ANGLE</span>
                    </>
                  ) : (
                    <span>USE THIS ANGLE</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Takeaway / Why Angle Works */}
      {storyAngle.whyInteresting && (
        <div className="p-4 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Editorial Analysis & Curiosity Psychology
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {storyAngle.whyInteresting}
          </p>
          {storyAngle.bestAngleReason && (
            <p className="text-xs text-slate-400 border-t border-slate-800 pt-2 mt-2">
              <strong className="text-slate-200">Director Rationale:</strong> {storyAngle.bestAngleReason}
            </p>
          )}
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          Story angle selected • Ready to engineer viral opening hooks
        </span>
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <span>Continue to Viral Hook Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
