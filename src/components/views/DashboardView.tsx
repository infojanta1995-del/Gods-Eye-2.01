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
  Flame,
  Layers,
  Youtube,
  Facebook,
  Instagram,
  Compass,
  FileText,
  Image as ImageIcon,
  Tag,
  Mic,
  Send,
  Cpu,
  Zap,
  Activity,
  Calendar,
  Radio,
  Check,
  Folder,
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
  const totalProjects = Math.max(projects.length, 3);

  // Workflow steps matching Reference Image 2
  const workflowSteps = [
    { num: 1, label: 'Research', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { num: 2, label: 'Angle', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { num: 3, label: 'Hooks', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { num: 4, label: 'Script', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { num: 5, label: 'Scenes', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { num: 6, label: 'Thumbnail', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { num: 7, label: 'SEO', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
    { num: 8, label: 'Final', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. WELCOME HERO BANNER (Matching Reference Image 2) */}
      <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-r from-[#090e1a] via-[#0b1220] to-[#080d18] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        {/* Golden & Cyan Ambient Backdrops */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Text & CTA */}
          <div className="space-y-4 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-heading">
              Welcome Back,{' '}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500"
                style={{ textShadow: '0 0 25px rgba(245, 158, 11, 0.4)' }}
              >
                Creator
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Turn ideas into viral content with the power of AI. GOD'S EYE AI Studio is your
              all-in-one creator command center.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Gold CTA */}
              <button
                type="button"
                id="btn-hero-create-new"
                onClick={() => {
                  onNewProject();
                  onNavigate('Create');
                }}
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all transform active:scale-98 shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer group"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>Create New Content</span>
              </button>

              {/* Secondary Explore Templates */}
              <button
                type="button"
                id="btn-hero-explore-templates"
                onClick={() => onNavigate('Create')}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Explore Templates</span>
              </button>
            </div>
          </div>

          {/* Right Floating 3D Golden God's Eye Graphic (Matching Reference Image 2) */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
            <div className="relative p-6 rounded-3xl bg-slate-950/60 border border-amber-500/30 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-cyan-500/10 to-amber-500/20 blur-lg pointer-events-none" />
              <GodsEyeLogo size="lg" mode="generating" showText={false} />
              <div className="mt-3">
                <span className="font-black text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400 block font-heading">
                  GOD'S EYE
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                  AI STUDIO
                </span>
                <span className="text-[9px] font-mono tracking-widest text-amber-400/80 mt-1 block">
                  SEE • ANALYZE • CREATE • GROW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 5 ACTION HUB CARDS (Row of 5 glassy cards matching Reference Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: New Content */}
        <div
          onClick={() => onNavigate('Create')}
          className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              New Content
            </h3>
            <p className="text-xs text-slate-400 leading-snug">
              Create viral content from any topic
            </p>
          </div>
          <div className="pt-4 flex justify-end">
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Card 2: Research */}
        <div
          onClick={() => onNavigate('Research')}
          className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Research
            </h3>
            <p className="text-xs text-slate-400 leading-snug">
              Discover trending topics & deep insights
            </p>
          </div>
          <div className="pt-4 flex justify-end">
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Card 3: Scene Studio */}
        <div
          onClick={() => onNavigate('Scene Studio')}
          className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Clapperboard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Scene Studio
            </h3>
            <p className="text-xs text-slate-400 leading-snug">
              Generate scene packages & video prompts
            </p>
          </div>
          <div className="pt-4 flex justify-end">
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Card 4: Thumbnail Studio */}
        <div
          onClick={() => onNavigate('Thumbnail Studio')}
          className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Thumbnail Studio
            </h3>
            <p className="text-xs text-slate-400 leading-snug">
              Create high CTR thumbnails
            </p>
          </div>
          <div className="pt-4 flex justify-end">
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Card 5: SEO Studio */}
        <div
          onClick={() => onNavigate('SEO Studio')}
          className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-900/80 border border-slate-800/80 hover:border-pink-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
              SEO Studio
            </h3>
            <p className="text-xs text-slate-400 leading-snug">
              Optimize for 10+ platforms & rank higher
            </p>
          </div>
          <div className="pt-4 flex justify-end">
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: GENERATION WORKFLOW & STATUS (Matching Reference Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Generation Workflow Card (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Generation Workflow</span>
              </h3>
              <p className="text-xs text-slate-400">
                Your AI-powered content creation journey
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('Create')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Connected Workflow Timeline Nodes */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => onNavigate('Create')}
                className="flex flex-col items-center text-center space-y-2 cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-xs transition-all group-hover:scale-110 shadow-md ${step.color}`}
                >
                  {step.num}
                </div>
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-full">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Generation Status Card (1 col) */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Generation Status</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('Create')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Circular Dial & Status Checklist */}
          <div className="flex items-center gap-5 pt-1">
            {/* Circular Dial */}
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#1e293b"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="213"
                  strokeDashoffset="68"
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute font-black text-sm text-cyan-300 font-mono">68%</span>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-1.5 text-xs flex-1 min-w-0">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span className="text-slate-300">Research</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span className="text-slate-300">Story Angle</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span className="text-slate-300">Script</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>Scenes (In Progress)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Thumbnail</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>SEO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: RECENT PROJECTS, RECENT CONTENT, QUICK STATS (Matching Reference Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Recent Projects */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <span>Recent Projects</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('Projects')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {projects.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center space-y-1.5">
                <p className="text-xs text-slate-400">No saved projects yet</p>
                <button
                  type="button"
                  onClick={() => {
                    onNewProject();
                    onNavigate('Create');
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  + Create your first project
                </button>
              </div>
            ) : (
              projects.slice(0, 4).map((p) => {
                const isCurrent = p.id === activeProjectId;
                const isReady = p.status === 'READY' || p.status === 'GENERATED';
                const timeAgo = (() => {
                  const ms = Date.now() - new Date(p.updatedAt).getTime();
                  const hours = Math.floor(ms / (1000 * 60 * 60));
                  if (hours < 1) return 'Just now';
                  if (hours < 24) return `${hours}h ago`;
                  const days = Math.floor(hours / 24);
                  return `${days}d ago`;
                })();

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
                    <p className="text-[11px] text-slate-400">
                      {p.settings.videoFormat || '9:16'} • {p.settings.language || 'Hindi'} • {timeAgo}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Col 2: Recent Content */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Recent Content</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('Content Library')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => onNavigate('Create')}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 transition-all cursor-pointer space-y-1"
            >
              <h4 className="text-xs font-bold text-slate-200">Viral Hooks (10 variations)</h4>
              <p className="text-[11px] text-slate-400">2 hours ago • Curiosity, Shock & Story gaps</p>
            </div>

            <div
              onClick={() => onNavigate('Scene Studio')}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 transition-all cursor-pointer space-y-1"
            >
              <h4 className="text-xs font-bold text-slate-200">Scene Package (Full)</h4>
              <p className="text-[11px] text-slate-400">3 hours ago • Veo & Google Flow prompts</p>
            </div>

            <div
              onClick={() => onNavigate('Thumbnail Studio')}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 transition-all cursor-pointer space-y-1"
            >
              <h4 className="text-xs font-bold text-slate-200">Thumbnail Concept</h4>
              <p className="text-[11px] text-slate-400">4 hours ago • High CTR golden split layout</p>
            </div>

            <div
              onClick={() => onNavigate('SEO Studio')}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 transition-all cursor-pointer space-y-1"
            >
              <h4 className="text-xs font-bold text-slate-200">SEO Package (10 Platforms)</h4>
              <p className="text-[11px] text-slate-400">5 hours ago • YouTube, Meta, TikTok & LinkedIn</p>
            </div>
          </div>
        </div>

        {/* Col 3: Quick Stats */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Quick Stats</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('Analytics')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-2xl font-black text-amber-300 font-mono">3</span>
              <p className="text-xs text-slate-400">Projects</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-2xl font-black text-cyan-300 font-mono">12</span>
              <p className="text-xs text-slate-400">Content Items</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-2xl font-black text-purple-300 font-mono">8</span>
              <p className="text-xs text-slate-400">This Week</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-2xl font-black text-emerald-300 font-mono">95%</span>
              <p className="text-xs text-slate-400">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
