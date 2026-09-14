import React from 'react';
import { Eye, Sparkles, ArrowDownCircle, AlertCircle, Loader2 } from 'lucide-react';
import { StudioConfig } from '../types';

interface GenerateActionProps {
  config: StudioConfig;
  hasStoryContent: boolean;
  isLoading: boolean;
  loadingStage: string;
  onGenerate: () => void;
  statusMessage?: string;
  errorMessage?: string;
}

export const GenerateAction: React.FC<GenerateActionProps> = ({
  config,
  hasStoryContent,
  isLoading,
  loadingStage,
  onGenerate,
  statusMessage,
  errorMessage,
}) => {
  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0e1626] to-[#0a0e17] p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 relative overflow-hidden text-center">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        {/* Status indicator badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-xs font-medium text-cyan-300">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`} />
          <span>
            {isLoading ? loadingStage : 'Ready to Synthesize Strategy & Script'}
          </span>
        </div>

        {/* Selected parameters summary pill */}
        <p className="text-xs text-slate-400">
          Configured for{' '}
          <strong className="text-slate-200">{config.contentType}</strong> ({config.videoFormat})
          in <strong className="text-cyan-300">{config.language}</strong> • {config.duration} •{' '}
          <span className="text-pink-300">{config.contentStyle}</span> •{' '}
          <span className="text-red-300">{config.mood}</span>
        </p>

        {/* 9. MAIN BUTTON */}
        <div>
          <button
            type="button"
            id="btn-generate-godseye-content"
            onClick={onGenerate}
            disabled={isLoading}
            className={`w-full sm:w-auto min-w-[300px] sm:min-w-[360px] py-4 px-8 rounded-2xl font-bold text-base sm:text-lg tracking-wider uppercase font-heading shadow-xl transition-all flex items-center justify-center gap-3 mx-auto border relative group ${
              isLoading
                ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-cyan-600/30 hover:shadow-cyan-500/50 active:scale-[0.98] cursor-pointer border-cyan-400/40'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-slate-200">{loadingStage}</span>
              </>
            ) : (
              <>
                <Eye className="w-6 h-6 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>GENERATE GODSEYE CONTENT</span>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </>
            )}
          </button>
        </div>

        {/* Loading progression steps visual bar */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-3 max-w-2xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono overflow-x-auto pb-1 gap-1">
              {[
                { name: '1. Research', match: 'Analyzing' },
                { name: '2. Angle', match: 'Angle' },
                { name: '3. Hooks', match: 'Building' },
                { name: '4. Script', match: 'Building' },
                { name: '5. Scenes', match: 'Preparing' },
                { name: '6. Thumbnail', match: 'Preparing' },
                { name: '7. SEO', match: 'Preparing' },
                { name: '8. Package', match: 'READY' },
              ].map((stage, idx) => {
                const isCurrent = Boolean(loadingStage && loadingStage.includes(stage.match));
                return (
                  <span
                    key={stage.name}
                    className={`px-1.5 py-0.5 rounded ${
                      isCurrent
                        ? 'text-cyan-300 bg-cyan-950/80 font-bold border border-cyan-700/60 animate-pulse'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.name}
                  </span>
                );
              })}
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2 transition-all duration-500 rounded-full"
                style={{
                  width: (loadingStage || '').includes('Analyzing')
                    ? '20%'
                    : (loadingStage || '').includes('Building')
                    ? '55%'
                    : (loadingStage || '').includes('Preparing')
                    ? '85%'
                    : '100%',
                }}
              />
            </div>
            <p className="text-center font-mono text-[11px] text-cyan-400">{loadingStage}</p>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-center justify-center gap-2 text-xs text-rose-300 bg-rose-950/50 border border-rose-800/50 py-2.5 px-4 rounded-xl max-w-lg mx-auto">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Beginner guidance notice */}
        {!hasStoryContent && !isLoading && !errorMessage && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400/90 bg-amber-950/30 border border-amber-800/40 py-1.5 px-3 rounded-lg max-w-md mx-auto">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Tip: Paste an article in Section 1 or click a "Try sample" button above.</span>
          </div>
        )}

        {statusMessage && !isLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 py-2 px-4 rounded-xl max-w-lg mx-auto">
            <ArrowDownCircle className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
