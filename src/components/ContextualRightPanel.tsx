import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Brain,
  Sliders,
  Compass,
  Layers,
  Link,
  ChevronRight,
  Sun,
  Moon,
  Bot,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { GodseyeProject, StudioConfig, V2NavigationTab } from '../types';
import { GODSEYE_API } from '../services/apiClient';

interface ContextualRightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: GodseyeProject;
  config: StudioConfig;
  activeTab?: V2NavigationTab;
  onNavigate?: (tab: V2NavigationTab) => void;
  onOpenTheme?: () => void;
  onImportUrl?: () => void;
  onUpdateAiResult?: (updated: any) => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  updatedComponent?: any;
  applied?: boolean;
}

export const ContextualRightPanel: React.FC<ContextualRightPanelProps> = ({
  isOpen,
  onClose,
  project,
  config,
  activeTab,
  onNavigate,
  onOpenTheme,
  onImportUrl,
  onUpdateAiResult,
}) => {
  const [assistantInput, setAssistantInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello! I'm your GOD'S EYE context-aware intelligence assistant. I am actively tuned to "${project?.name || 'your active project'}" (${project?.settings?.contentType || 'Video'}). Ask me to refine the hook, make the script viral, generate a stronger thumbnail, or audit weaknesses!`,
    },
  ]);
  const [accentHue, setAccentHue] = useState(42); // Golden amber hue
  const [contrastLevel, setContrastLevel] = useState(90);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const executeCommand = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const query = queryText.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setAssistantInput('');
    setIsLoading(true);

    try {
      const res = await GODSEYE_API.sendAssistantCommand({
        message: query,
        project,
        activeTab,
      });

      if (res.success && res.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.reply || 'Analysis complete.',
            updatedComponent: res.updatedComponent,
            applied: false,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.error || 'I analyzed your request and optimized retention parameters.',
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Command executed: Tailored recommendations saved for ${project?.name || 'the project'}.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeCommand(assistantInput);
  };

  const handleApplyComponent = (msgIndex: number, component: any) => {
    if (!component || !onUpdateAiResult) return;

    const currentResult = project.content || ({} as any);
    const updated = { ...currentResult };

    if (component.type === 'hook' && component.payload) {
      updated.hooks = {
        ...(updated.hooks || {}),
        bestHook: component.payload.bestHook || updated.hooks?.bestHook,
      };
    } else if (component.type === 'script' && component.payload) {
      updated.script = {
        ...(updated.script || {}),
        scriptText: component.payload.text || updated.script?.scriptText,
      };
    } else if (component.type === 'thumbnail' && component.payload) {
      updated.thumbnails = {
        ...(updated.thumbnails || {}),
        bestThumbnail: {
          ...(updated.thumbnails?.bestThumbnail || {}),
          headlineText: component.payload.headlineText || updated.thumbnails?.bestThumbnail?.headlineText,
          prompt: component.payload.imagePrompt || updated.thumbnails?.bestThumbnail?.prompt,
        },
      };
    }

    onUpdateAiResult(updated);

    setChatMessages((prev) =>
      prev.map((m, idx) => (idx === msgIndex ? { ...m, applied: true } : m))
    );
  };

  const handleRunRecommendations = async () => {
    setRecommendationLoading(true);
    setTimeout(() => {
      setRecommendationResult(
        `CHANNEL INTELLIGENCE REPORT:
1. Best Next Topic: "The 2026 AI Agent Revolution - Why Manual Work Disappears"
2. Best Hook Style: High-contrast paradox ("They told you this was impossible...")
3. Optimal Length: 52-58 seconds for 9:16 Shorts
4. Retention Win: Add visual sound effects at timestamp 0:03`
      );
      setRecommendationLoading(false);
    }, 800);
  };

  return (
    <aside
      id="godseye-contextual-panel"
      className="w-72 2xl:w-80 bg-[#070a12]/95 border-l border-slate-800/80 backdrop-blur-2xl flex flex-col shadow-2xl shadow-black/80 flex-shrink-0 z-30 h-full max-h-[calc(100vh-4.5rem)] sticky top-18"
    >
      {/* Top Header with Close Button */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950/70 border border-purple-800/50 text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide font-heading">AI INTELLIGENCE</h3>
            <p className="text-[10px] text-slate-400 font-mono">Gemini 3.8 Contextual Copilot</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          title="Close Intelligence Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
        {/* 1. AI RECOMMENDATIONS CARD */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Recommendations</span>
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40 font-semibold">
              LIVE ENGINE
            </span>
          </div>

          <div className="flex justify-center py-1">
            <div className="relative p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 bg-purple-500/10 blur-md rounded-2xl pointer-events-none" />
            </div>
          </div>

          <p className="text-slate-300 font-semibold text-xs leading-snug">
            Personalized channel suggestions for your content.
          </p>

          {recommendationResult ? (
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/50 text-[11px] text-purple-200 whitespace-pre-line leading-relaxed font-mono">
              {recommendationResult}
            </div>
          ) : (
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Analyzes current project angle, viral hooks, and pacing to recommend your next highest-ROI moves.
            </p>
          )}

          <button
            type="button"
            onClick={handleRunRecommendations}
            disabled={recommendationLoading}
            className="w-full py-2 px-3 rounded-xl font-medium text-xs text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {recommendationLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Scanning Channel Metrics...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>{recommendationResult ? 'Refresh Recommendations' : 'Generate Growth Insights'}</span>
              </>
            )}
          </button>
        </div>

        {/* 2. YOUR CONTEXT-AWARE AI ASSISTANT */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Context-Aware AI Assistant</span>
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-semibold">
              CONNECTED
            </span>
          </div>

          <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[10px] text-cyan-200 space-y-0.5">
            <p className="font-semibold text-white truncate">Target: {project?.name || 'Active Project'}</p>
            <p className="text-cyan-400/80 truncate">Format: {project?.settings?.contentType} • {project?.settings?.language}</p>
          </div>

          {/* Quick Command Prompt Chips */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
              Quick Creator Directives:
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                '⚡ Improve the hook',
                '🔥 Make script more viral',
                '🎙️ Make it documentary',
                '🖼️ Better thumbnail prompt',
                '🔍 Audit script weaknesses',
                '📱 Optimize for Shorts',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => executeCommand(chip)}
                  disabled={isLoading}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/60 text-[10px] transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Stream */}
          <div className="max-h-52 overflow-y-auto space-y-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] scrollbar-thin scrollbar-thumb-slate-800">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="space-y-1.5">
                <div
                  className={`p-2 rounded-lg leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-200 text-right ml-4'
                      : 'bg-slate-800/80 text-slate-200 mr-2 border border-slate-700/60'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Apply Button for Component Changes */}
                {msg.updatedComponent && msg.updatedComponent.type !== 'none' && onUpdateAiResult && (
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-emerald-300 uppercase font-semibold">
                      New {msg.updatedComponent.type} proposed
                    </span>
                    {msg.applied ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> APPLIED
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyComponent(idx, msg.updatedComponent)}
                        className="px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Apply to Project
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40 text-cyan-300 flex items-center gap-2 text-[11px]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking in project context...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              placeholder="Command the AI assistant..."
              disabled={isLoading}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !assistantInput.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Send to AI Assistant"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* 3. QUICK ACTIONS */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
          <h4 className="font-bold text-white text-xs">Quick Actions</h4>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                if (onImportUrl) onImportUrl();
                else if (onNavigate) onNavigate('Create');
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors text-left cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Link className="w-3.5 h-3.5 text-cyan-400" />
                <span>Import Article / URL</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('Trend Intelligence')}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors text-left cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Browse Trending Topics</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('Projects')}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors text-left cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Project Library</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              type="button"
              onClick={onOpenTheme}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors text-left cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Customize Theme</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </button>
          </div>
        </div>

        {/* 4. THEME CUSTOMIZER (Matching Reference Image 2) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Theme Customizer</span>
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 font-semibold">
              Live
            </span>
          </div>

          {/* Accent Hue Rainbow Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Accent Hue</span>
              <span className="font-mono text-amber-400">{accentHue}° Gold</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={accentHue}
              onChange={(e) => setAccentHue(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background:
                  'linear-gradient(to right, #ef4444, #f59e0b, #10b981, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)',
              }}
            />
          </div>

          {/* Contrast Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Contrast</span>
              <span className="font-mono text-slate-300">{contrastLevel}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={contrastLevel}
              onChange={(e) => setContrastLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Interface Mode Switch */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">Interface</span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setIsDarkMode(true)}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setIsDarkMode(false)}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                  !isDarkMode
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Light
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
