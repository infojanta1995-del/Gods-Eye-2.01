import React from 'react';
import { X, CheckCircle, Sparkles, BookOpen, Layers, Video, ArrowRight } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-[#0d131f] p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Welcome to GODSEYE AI
            </h3>
            <p className="text-xs text-slate-400">
              Your quick beginner guide to the AI Content Command Center
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-xs">
                1
              </span>
              Paste Your Raw Story
            </div>
            <p className="text-slate-400 pl-7">
              Paste any news article, report, facts, or bullet points in Section 1. If you just want
              to test, click one of the <strong>"Try sample"</strong> buttons at the top right of
              the box.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-xs">
                2
              </span>
              Choose Video Format & Tone
            </div>
            <p className="text-slate-400 pl-7">
              Select whether you need a vertical <strong>9:16 Portrait</strong> (Shorts/Reels/TikTok)
              or horizontal <strong>16:9</strong> video, target duration (e.g. 60s), language
              (default Hindi), and mood.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-xs">
                3
              </span>
              Click GENERATE GODSEYE CONTENT
            </div>
            <p className="text-slate-400 pl-7">
              The command center configures all 11 output modules. In Stage 2, this triggers our
              server-side Gemini AI models to output real-time high-retention scripts, video prompts,
              and SEO packages!
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Got It, Let's Create</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
