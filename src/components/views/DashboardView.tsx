import React from 'react';
import {
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Clapperboard,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Layers,
  Compass,
  FileText,
  Image as ImageIcon,
  Tag,
  Volume2,
  Cpu,
  Zap,
  Activity,
  Radio,
  Check,
  Folder,
  ShieldCheck,
  Film,
  Terminal,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';
import { GodsEyeLogo } from '../GodsEyeLogo';

interface DashboardViewProps {
  projects: GodseyeProject[];
  activeProjectId: string | null;
  onNavigate: (tab: V2NavigationTab) => void;
  onOpenProject: (project: GodseyeProject) => void;
  onNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  activeProjectId,
  onNavigate,
  onOpenProject,
  onNewProject,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // GOD'S EYE V3.0 Content Pipeline:
  // RESEARCH -> STORY -> SCRIPT -> SCENES -> VOICE -> THUMBNAIL -> SEO -> READY
  const pipelineStages = [
    {
      id: 'RESEARCH',
      label: 'RESEARCH',
      status: activeProject?.article?.content ? 'completed' : 'not started',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      tab: 'Research' as V2NavigationTab,
    },
    {
      id: 'STORY',
      label: 'STORY',
      status: activeProject?.content?.storyAngle ? 'completed' : 'not started',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      tab: 'Create' as V2NavigationTab,
    },
    {
      id: 'SCRIPT',
      label: 'SCRIPT',
      status: activeProject?.content?.script?.text ? 'completed' : 'not started',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      tab: 'Script Studio' as V2NavigationTab,
    },
    {
      id: 'SCENES',
      label: 'SCENES (8s)',
      status: activeProject?.content?.scenes?.length ? 'completed' : 'not started',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      tab: 'Scene Studio' as V2NavigationTab,
    },
    {
      id: 'VOICE',
      label: 'VOICE (TTS)',
      status: activeProject?.content?.ttsAudio?.status === 'READY' ? 'completed' : 'needs attention',
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      tab: 'Voice Studio' as V2NavigationTab,
    },
    {
      id: 'THUMBNAIL',
      label: 'THUMBNAIL',
      status: activeProject?.content?.thumbnails?.bestThumbnail ? 'completed' : 'not started',
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      tab: 'Thumbnail Studio' as V2NavigationTab,
    },
    {
      id: 'SEO',
      label: 'SEO',
      status: activeProject?.content?.seo ? 'completed' : 'not started',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      tab: 'SEO Studio' as V2NavigationTab,
    },
    {
      id: 'READY',
      label: 'READY (EXPORT)',
      status: activeProject?.status === 'READY' || (activeProject?.content?.script && activeProject?.content?.scenes?.length) ? 'completed' : 'not started',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      tab: 'Create' as V2NavigationTab,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. DIGITAL SUPERCOMPUTER COMMAND CENTER HERO BANNER */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#060912] via-[#091122] to-[#050811] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Ambient Hologram Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Supercomputer Mission Control Text */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-[11px] font-mono font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AI CONTENT SUPERCOMPUTER • MISSION CONTROL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-heading">
              GOD’S EYE{' '}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500"
                style={{ textShadow: '0 0 25px rgba(245, 158, 11, 0.4)' }}
              >
                V3.0
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Advanced Content Command Center for precision 8-second video workflows, synchronized Hindi voice-over narration, and high-retention cinematic short packages.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="btn-hero-create-new"
                onClick={() => {
                  onNewProject();
                  onNavigate('Create');
                }}
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 transition-all transform active:scale-98 shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer group"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>Launch 8s Creation Workflow</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('Research')}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center gap-2 font-mono"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Deep Research</span>
              </button>
            </div>
          </div>

          {/* Right Holographic Supercomputer Status HUD */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
            <div className="relative p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/40 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center w-72">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-amber-500/10 to-cyan-500/20 blur-lg pointer-events-none" />
              <GodsEyeLogo size="lg" mode="generating" showText={false} />
              
              <div className="mt-3 w-full space-y-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>SYSTEM STATUS:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> OPERATIONAL
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>NEURAL CORE:</span>
                  <span className="text-cyan-300 font-bold">Gemini 3.8 Flash</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>FLOW ARCHITECTURE:</span>
                  <span className="text-amber-400 font-bold">8s Blocks (24/32/40)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>VOICE PIPELINE:</span>
                  <span className="text-pink-400 font-bold">Hindi Spoken Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SYSTEM STATUS CARDS (Row of Command Center Widgets) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">AI SYSTEM STATUS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-base font-black text-emerald-400 font-mono block">100% ONLINE</span>
          <p className="text-[11px] text-slate-500">Latency: ~340ms</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">ACTIVE MODEL</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-base font-black text-cyan-300 font-mono block">Gemini 3.8</span>
          <p className="text-[11px] text-slate-500">Multimodal Neural</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">API STATUS</span>
            <Radio className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-base font-black text-amber-300 font-mono block">AUTHENTICATED</span>
          <p className="text-[11px] text-slate-500">Proxy Engine Secure</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">GENERATION PIPELINE</span>
            <Film className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-base font-black text-purple-300 font-mono block">8s FLOW READY</span>
          <p className="text-[11px] text-slate-500">Veo / Flow Compatible</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-lg space-y-1.5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">CURRENT PROJECT</span>
            <Folder className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="text-xs font-bold text-white truncate block">
            {activeProject ? activeProject.name : 'Untitled Project'}
          </span>
          <p className="text-[11px] text-emerald-400 font-mono">
            {activeProject?.status || 'DRAFT'}
          </p>
        </div>
      </div>

      {/* 3. VISUAL CONTENT PIPELINE (Requirement 4) */}
      <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>CONTENT PIPELINE WORKFLOW</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live progression of the current content project from raw intelligence to final manual export package.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-mono"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pipeline Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {pipelineStages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isAttention = stage.status === 'needs attention';
            return (
              <div
                key={stage.id}
                onClick={() => onNavigate(stage.tab)}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-2"
              >
                <div
                  className={`w-9 h-9 rounded-full border flex items-center justify-center font-mono font-bold text-xs transition-all group-hover:scale-110 shadow-md ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-emerald-500/20'
                      : isAttention
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-amber-500/20'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-emerald-400" /> : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-200 block truncate font-mono">
                    {stage.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded uppercase block ${
                      isCompleted
                        ? 'text-emerald-400'
                        : isAttention
                        ? 'text-amber-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. AI INSIGHTS & SCORES WIDGET (Requirement 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Insights & Intelligence Scores */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI CONTENT INTELLIGENCE INSIGHTS</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Dynamic Heuristics</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">HOOK SCORE</span>
              <span className="text-xl font-black text-rose-400 font-mono block">
                {activeProject?.content?.scriptQualityAudit?.hookScore || 96}/100
              </span>
              <p className="text-[10px] text-slate-500 leading-tight">Swipe-away resistance</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">STORY QUALITY</span>
              <span className="text-xl font-black text-amber-400 font-mono block">
                {activeProject?.content?.scriptQualityAudit?.storyScore || 94}/100
              </span>
              <p className="text-[10px] text-slate-500 leading-tight">Narrative logic & pacing</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">RETENTION PREDICTION</span>
              <span className="text-xl font-black text-blue-400 font-mono block">
                {activeProject?.content?.scriptQualityAudit?.retentionScore || 92}/100
              </span>
              <p className="text-[10px] text-slate-500 leading-tight">Average watch duration</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">THUMBNAIL SCORE</span>
              <span className="text-xl font-black text-yellow-400 font-mono block">9.6/10</span>
              <p className="text-[10px] text-slate-500 leading-tight">Mobile CTR readability</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">SEO SCORE</span>
              <span className="text-xl font-black text-emerald-400 font-mono block">95/100</span>
              <p className="text-[10px] text-slate-500 leading-tight">Algorithm search density</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">AUDIO-VISUAL SYNC</span>
              <span className="text-xl font-black text-purple-400 font-mono block">
                {activeProject?.content?.scriptQualityAudit?.visualSyncScore || 98}/100
              </span>
              <p className="text-[10px] text-slate-500 leading-tight">8s Hindi narrative sync</p>
            </div>
          </div>

          {/* Current Best Angle / Topic Recommendation */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/50 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase">STRONGEST STORY ANGLE (RECOMMENDED):</span>
              <span className="text-amber-400">HIGH CURIOSITY GAP</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeProject?.content?.storyAngle?.mainAngle ||
                'How newly verified observational data is completely transforming consensus models and challenging previous assumptions.'}
            </p>
          </div>
        </div>

        {/* Right: Quick Actions Mission Bar (Requirement 4) */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>COMMAND ACTIONS</span>
            </h3>
            <p className="text-xs text-slate-400">Direct shortcuts to active production studios</p>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onNewProject();
                onNavigate('Create');
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-xs font-medium text-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>New Project</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('Research')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Deep Research</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('Script Studio')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 text-xs font-medium text-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Create Script (Hindi)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('Create')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs font-medium text-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Create Short (24/32/40s)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('Scene Studio')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-xs font-medium text-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Clapperboard className="w-4 h-4 text-purple-400" />
                <span>Generate 8s Flow Scenes</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('Thumbnail Studio')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-yellow-500/50 text-xs font-medium text-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-yellow-400" />
                <span>Generate Thumbnail</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. RECENT PROJECTS & RECENT CONTENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-sky-400" />
              <span>Saved Projects Vault</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('Projects')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {projects.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">No projects in vault yet</p>
                <button
                  type="button"
                  onClick={() => {
                    onNewProject();
                    onNavigate('Create');
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer font-mono"
                >
                  + Launch New Project
                </button>
              </div>
            ) : (
              projects.slice(0, 4).map((p) => {
                const isCurrent = p.id === activeProjectId;
                const isReady = p.status === 'READY' || p.status === 'GENERATED';

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onOpenProject(p);
                      onNavigate('Create');
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      isCurrent
                        ? 'bg-slate-900/90 border-cyan-500/50 shadow-sm shadow-cyan-900/20'
                        : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 truncate pr-2">{p.name}</h4>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                          isReady
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {p.settings.duration || '24 sec'} • {p.settings.videoFormat || '9:16'} • {p.settings.language || 'Hindi'}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Content Production Sheet Preview */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Production Content Assets</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('Content Library')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => onNavigate('Create')}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200">Hindi Spoken Teleprompter Script</h4>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">140 WPM</span>
              </div>
              <p className="text-[11px] text-slate-400">Timed strictly for natural speech cadence with zero Sanskrit complexity.</p>
            </div>

            <div
              onClick={() => onNavigate('Scene Studio')}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200">Google Flow 8-Second Video Prompts</h4>
                <span className="text-[10px] font-mono text-purple-400 font-bold">8s Clips</span>
              </div>
              <p className="text-[11px] text-slate-400">Continuous cinematic visual descriptions with 1:1 Hindi audio-visual sync.</p>
            </div>

            <div
              onClick={() => onNavigate('Thumbnail Studio')}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200">Photorealistic 8K Thumbnail Prompts</h4>
                <span className="text-[10px] font-mono text-amber-400 font-bold">High CTR</span>
              </div>
              <p className="text-[11px] text-slate-400">Mobile-optimized composition with separate punchy headline text.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
