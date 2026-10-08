import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Sparkles,
  CheckCircle2,
  Save,
  HelpCircle,
  Clapperboard,
  Languages,
} from 'lucide-react';
import { GodsEyeLogo } from '../GodsEyeLogo';

export const AiSettingsView: React.FC = () => {
  const [model, setModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-pro-preview'>('gemini-3.8-flash');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [defaultLanguage, setDefaultLanguage] = useState<'Hindi' | 'Hinglish' | 'English'>('Hindi');
  const [videoWorkflow, setVideoWorkflow] = useState<string>('Google Flow / Veo');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              AI Models & Neural Command Settings
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Centralized Google AI Studio Gemini model configuration, spoken Hindi cadence calibration, and Google Flow 8s block tuning
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>AI parameters successfully updated in Studio memory.</span>
        </div>
      )}

      {/* Model Selection */}
      <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Google Gemini Neural Core</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setModel('gemini-3.8-flash')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              model === 'gemini-3.8-flash'
                ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-sm shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-white">gemini-3.8-flash</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                ACTIVE / RECOMMENDED
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-fast generation (~340ms), optimal for rapid Hindi scripts, hooks, and 8-second Google Flow scene prompts.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setModel('gemini-3.1-pro-preview')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              model === 'gemini-3.1-pro-preview'
                ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-sm shadow-purple-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-white">gemini-3.1-pro-preview</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                DEEP THINKING
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extended reasoning and deep research synthesis for complex multi-faceted investigative content.
            </p>
          </button>
        </div>
      </div>

      {/* Temperature & Default Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Creativity Slider */}
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Creativity & Temperature</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Deterministic (0.1)</span>
            <span>Balanced (0.7)</span>
            <span>Wild & Viral (1.0)</span>
          </div>
        </div>

        {/* Default Language */}
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-white block">Default Teleprompter Script Language</span>
          <div className="grid grid-cols-3 gap-2">
            {(['Hindi', 'Hinglish', 'English'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setDefaultLanguage(lang)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  defaultLanguage === lang
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 block">
            All scripts include an English reference translation alongside Hindi Devanagari narration.
          </span>
        </div>
      </div>

      {/* Target Video Generation Model */}
      <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Clapperboard className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white">Target Video Generation Model Format</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Google Flow / Veo', 'Adobe Express', 'Runway Gen-3', 'Midjourney + Kling'].map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => setVideoWorkflow(tool)}
              className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                videoWorkflow === tool
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
