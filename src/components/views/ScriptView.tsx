import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Volume2,
  Clock,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  Maximize2,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';

interface ScriptViewProps {
  activeProject: GodseyeProject;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const ScriptView: React.FC<ScriptViewProps> = ({ activeProject, onNavigate }) => {
  const [teleprompterSize, setTeleprompterSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const script = activeProject.content?.script;
  const wordCount = script?.text ? script.text.trim().split(/\s+/).length : 0;
  const estimatedWpm = 145;
  const estimatedDuration = Math.round((wordCount / estimatedWpm) * 60);

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const handleCopyScript = () => {
    if (!script?.text) return;
    navigator.clipboard.writeText(script.text).catch(() => {});
    showToast('Copied full script to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Script Studio
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold">
              TELEPROMPTER READY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Synthesized teleprompter narration, scene timing cues, and speech rate pacing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {script && (
            <>
              <button
                type="button"
                id="btn-copy-script-view"
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/60 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>COPY SCRIPT</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('Scene Studio')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-800/60 transition-all cursor-pointer"
              >
                <span>VISUALIZE IN SCENES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {copyToast && (
        <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-xs text-cyan-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Script Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Target Duration</span>
          <span className="text-base font-bold font-mono text-white mt-1 block">
            {activeProject.settings.duration}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Narration Words</span>
          <span className="text-base font-bold font-mono text-cyan-400 mt-1 block">
            {wordCount} words
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Speaking Pace</span>
          <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
            ~{estimatedWpm} WPM
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Audio</span>
          <span className="text-base font-bold font-mono text-amber-400 mt-1 block">
            ~{estimatedDuration}s
          </span>
        </div>
      </div>

      {/* Main Script Workspace */}
      {!script ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0c101a]/50 space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Script Generated For Active Project</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Input a source story or topic in the Create Studio to automatically generate a high-retention teleprompter script.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Create Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Continuous Teleprompter Reader */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0c101a] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Full Teleprompter Script
                </h3>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setTeleprompterSize('normal')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    teleprompterSize === 'normal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setTeleprompterSize('large')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    teleprompterSize === 'large' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Large
                </button>
                <button
                  type="button"
                  onClick={() => setTeleprompterSize('huge')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    teleprompterSize === 'huge' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Huge
                </button>
              </div>
            </div>

            <div
              className={`p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 leading-relaxed font-sans select-text ${
                teleprompterSize === 'normal'
                  ? 'text-sm sm:text-base leading-7'
                  : teleprompterSize === 'large'
                  ? 'text-lg sm:text-xl leading-8 font-medium'
                  : 'text-2xl sm:text-3xl leading-10 font-medium'
              }`}
            >
              {script.text}
            </div>
          </div>

          {/* Right Col: Structured Section Breakdown & Narration Cues */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c101a] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Scene Narration Cues
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
              {script.sections?.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 border border-slate-700">
                      {sec.phase}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{sec.name}</span>
                  </div>
                  <p className="text-slate-200 font-medium leading-relaxed">{sec.narration}</p>
                  {sec.cue && (
                    <p className="text-[11px] text-amber-300/80 italic">CUE: {sec.cue}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
