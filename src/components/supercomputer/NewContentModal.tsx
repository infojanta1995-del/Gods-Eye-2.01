import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  Layers,
  Film,
  X,
  ChevronRight,
  ShieldCheck,
  Brain,
  CheckCircle2,
} from 'lucide-react';
import { ContentType, Duration } from '../../types';

interface NewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitialize: (params: {
    topic: string;
    contentType: ContentType;
    duration: Duration;
  }) => void;
  isProcessing?: boolean;
  processingStep?: string;
}

export const NewContentModal: React.FC<NewContentModalProps> = ({
  isOpen,
  onClose,
  onInitialize,
  isProcessing = false,
  processingStep,
}) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('YouTube Short');
  const [duration, setDuration] = useState<Duration>('24 sec');

  if (!isOpen) return null;

  const contentTypes: { id: ContentType; label: string; desc: string }[] = [
    { id: 'YouTube Short', label: 'SHORT (8s BLOCKS)', desc: 'Optimized for TikTok / Shorts / Reels' },
    { id: 'Documentary', label: 'DOCUMENTARY', desc: 'In-depth investigative narrative' },
    { id: 'Instagram Reel', label: 'EXPLAINER / REEL', desc: 'Clear step-by-step breakdown' },
    { id: 'Short / Reel', label: 'STORY', desc: 'Emotional arc & suspense pacing' },
  ];

  const durations: { id: Duration; clips: string; breakdown: string }[] = [
    { id: '24 sec', clips: '3 × 8 SEC CLIPS', breakdown: '01 Hook (8s) → 02 Main (8s) → 03 End (8s)' },
    { id: '32 sec', clips: '4 × 8 SEC CLIPS', breakdown: '01 Hook (8s) → 02 Main A (8s) → 03 Reveal (8s) → 04 End (8s)' },
    { id: '40 sec', clips: '5 × 8 SEC CLIPS', breakdown: '01 Hook (8s) → 02 Main A → 03 Main B → 04 Reveal → 05 End' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onInitialize({ topic, contentType, duration });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl font-mono select-none">
      {/* Outer Glow Card */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/50 bg-[#060b14] shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-900/60 bg-[#040810]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
                <span>NEW CONTENT CREATION CONSOLE</span>
                <span className="text-[10px] text-cyan-400 font-normal">GODSEYE V3.0</span>
              </h2>
              <p className="text-[11px] text-cyan-500/70">8-SECOND GOOGLE FLOW PRECISION ENGINE</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Processing View */}
        {isProcessing ? (
          <div className="p-8 space-y-6 text-center">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 animate-spin" />
              <div
                className="absolute inset-3 rounded-full border border-dashed border-sky-400/40 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '6s' }}
              />
              <Brain className="w-8 h-8 text-cyan-300 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                NEURAL SYNTHESIS IN PROGRESS...
              </h3>
              <p className="text-xs text-cyan-400 font-mono tracking-wide">
                {processingStep || 'Synthesizing 8s clips, Hindi phonetic timing & Flow parameters...'}
              </p>
            </div>

            {/* Simulated Live Stage Walkthrough */}
            <div className="max-w-md mx-auto bg-slate-950/80 border border-cyan-950/80 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. TOPIC & ENTITY ANALYSIS COMPLETE</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. DURATION CALIBRATED: {duration} ({duration === '24 sec' ? 3 : duration === '32 sec' ? 4 : 5} CLIPS)</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>3. SCRIPTING HINDI NARRATION & SCENE VISUALS...</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Input 1: Topic */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-300 tracking-wider uppercase flex items-center justify-between">
                <span>WHAT DO YOU WANT TO CREATE?</span>
                <span className="text-[10px] text-slate-500 font-normal">TOPIC, EVENT OR HEADLINE</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                required
                placeholder="उदा. James Webb Telescope ने ब्रह्मांड के किनारे पर एक रहस्यमयी प्राचीन आकाशगंगा खोजी है..."
                className="w-full bg-[#03060c] border border-cyan-950 focus:border-cyan-400 rounded-xl p-3.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 resize-none font-mono"
              />
            </div>

            {/* Input 2: Content Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-300 tracking-wider uppercase">
                CONTENT ARCHITECTURE
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setContentType(type.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      contentType === type.id
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{type.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Duration / Flow Architecture */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-300 tracking-wider uppercase flex items-center justify-between">
                <span>GOOGLE FLOW DURATION (EXACT 8s MULTIPLES)</span>
                <span className="text-[10px] text-amber-400 font-bold">STRICT 8s SYSTEM</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {durations.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      duration === d.id
                        ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-black text-amber-300 uppercase">{d.id}</div>
                    <div className="text-[10px] text-slate-300 font-bold mt-0.5">{d.clips}</div>
                    <div className="text-[9px] text-slate-500 mt-1 leading-tight">{d.breakdown}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-cyan-950/80">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ABORT
              </button>

              <button
                type="submit"
                disabled={!topic.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>INITIALIZE CREATION</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
