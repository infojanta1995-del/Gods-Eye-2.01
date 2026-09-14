import React from 'react';
import {
  Layers,
  FileText,
  Volume2,
  Video,
  Clapperboard,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';

interface ContentLibraryViewProps {
  projects: GodseyeProject[];
  onOpenProject: (project: GodseyeProject) => void;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const ContentLibraryView: React.FC<ContentLibraryViewProps> = ({
  projects,
  onOpenProject,
  onNavigate,
}) => {
  const readyProjects = projects.filter((p) => p.result);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#12102b] via-[#0d0c1e] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-xs font-semibold text-indigo-300 mb-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>CENTRAL ASSET & PRODUCTION VAULT</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">EXPORT PACKAGES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Content Library & Synthesized Media Bank
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct access to all synthesized teleprompter scripts, Gemini TTS audio voiceover files, subtitle SRTs, and scene packages.
            </p>
          </div>
        </div>
      </div>

      {readyProjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-4">
          <Layers className="w-12 h-12 text-indigo-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No generated assets in library yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Generate content in the Creator Studio to build your asset library of scripts, scene prompts, and voiceovers.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate First Content</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readyProjects.map((p) => {
            const scenesCount = p.result?.scenes?.length || 0;
            const wordsCount = p.result?.script?.wordCount || 0;
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                      {p.settings.contentType}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {p.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500">Words:</span> {wordsCount}
                    </div>
                    <div>
                      <span className="text-slate-500">Scenes:</span> {scenesCount}
                    </div>
                    <div>
                      <span className="text-slate-500">Pacing:</span> {p.settings.duration}
                    </div>
                    <div>
                      <span className="text-slate-500">Language:</span> {p.settings.language}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProject(p);
                      onNavigate('Create');
                    }}
                    className="w-full py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-indigo-800/50"
                  >
                    <span>Inspect Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
