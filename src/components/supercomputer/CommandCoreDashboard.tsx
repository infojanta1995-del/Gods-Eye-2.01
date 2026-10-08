import React from 'react';
import {
  Cpu,
  Search,
  BookOpen,
  FileCode,
  Film,
  Zap,
  Image as ImageIcon,
  Tag,
  BarChart3,
  HardDrive,
  FolderKanban,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { JarvisAiCore, CoreProcessingState } from './JarvisAiCore';
import { V2NavigationTab, GodseyeProject } from '../../types';

interface CommandCoreDashboardProps {
  currentProject: GodseyeProject;
  projects: GodseyeProject[];
  coreState: CoreProcessingState;
  onNavigate: (tab: V2NavigationTab) => void;
  onNewContent: () => void;
  onOpenProject: (project: GodseyeProject) => void;
}

export const CommandCoreDashboard: React.FC<CommandCoreDashboardProps> = ({
  currentProject,
  projects,
  coreState,
  onNavigate,
  onNewContent,
  onOpenProject,
}) => {
  const result = currentProject?.result || currentProject?.content;
  const scenesCount = result?.scenes?.length || 0;
  const scriptText = result?.script?.text || '';
  const hasResult = scenesCount > 0;

  // Node subsystems placed around central AI Core
  const systemNodes = [
    {
      id: 'Create' as V2NavigationTab,
      label: 'FLOW STUDIO',
      subtext: '8s CLIP ENGINE',
      badge: 'STRICT 8s',
      color: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      active: scenesCount > 0,
    },
    {
      id: 'Script Studio' as V2NavigationTab,
      label: 'SCRIPT & TIMING',
      subtext: 'HINDI PHONETIC SYNC',
      badge: scriptText ? 'COMPOSED' : 'PENDING',
      color: 'border-sky-500/50 text-sky-300 bg-sky-950/40',
      icon: <FileCode className="w-4 h-4 text-sky-400" />,
      active: Boolean(scriptText),
    },
    {
      id: 'Scene Studio' as V2NavigationTab,
      label: 'SCENE CONTINUITY',
      subtext: `${scenesCount} CINEMATIC NODES`,
      badge: scenesCount ? `${scenesCount} CLIPS` : 'UNSET',
      color: 'border-purple-500/50 text-purple-300 bg-purple-950/40',
      icon: <Film className="w-4 h-4 text-purple-400" />,
      active: scenesCount > 0,
    },
    {
      id: 'Research' as V2NavigationTab,
      label: 'DEEP RESEARCH',
      subtext: 'FACT HARVEST',
      badge: currentProject?.article?.content ? 'VERIFIED' : 'READY',
      color: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
      icon: <Search className="w-4 h-4 text-emerald-400" />,
      active: Boolean(currentProject?.article?.content),
    },
    {
      id: 'Story Intelligence' as V2NavigationTab,
      label: 'STORY ANGLE',
      subtext: 'EMOTIONAL ARC & HOOK',
      badge: 'NEURAL',
      color: 'border-blue-500/50 text-blue-300 bg-blue-950/40',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      active: true,
    },
    {
      id: 'Thumbnail Studio' as V2NavigationTab,
      label: 'THUMBNAILS',
      subtext: 'VISUAL ANCHORS',
      badge: result?.thumbnails?.bestThumbnail ? 'RENDERED' : 'READY',
      color: 'border-yellow-500/50 text-yellow-300 bg-yellow-950/40',
      icon: <ImageIcon className="w-4 h-4 text-yellow-400" />,
      active: Boolean(result?.thumbnails?.bestThumbnail),
    },
    {
      id: 'SEO Studio' as V2NavigationTab,
      label: 'METADATA MATRIX',
      subtext: 'ALGORITHM TITLES',
      badge: result?.seo ? 'GENERATED' : 'STANDBY',
      color: 'border-teal-500/50 text-teal-300 bg-teal-950/40',
      icon: <Tag className="w-4 h-4 text-teal-400" />,
      active: Boolean(result?.seo),
    },
    {
      id: 'Analytics' as V2NavigationTab,
      label: 'RETENTION RADAR',
      subtext: 'ATTENTION PACING',
      badge: '98% ACCURACY',
      color: 'border-indigo-500/50 text-indigo-300 bg-indigo-950/40',
      icon: <BarChart3 className="w-4 h-4 text-indigo-400" />,
      active: true,
    },
    {
      id: 'Content Library' as V2NavigationTab,
      label: 'PROJECT MEMORY',
      subtext: 'CREATOR GRAPH VAULT',
      badge: `${projects.length} ARCHIVES`,
      color: 'border-pink-500/50 text-pink-300 bg-pink-950/40',
      icon: <HardDrive className="w-4 h-4 text-pink-400" />,
      active: projects.length > 0,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16 font-mono select-none">
      {/* 1. TOP SUPERCOMPUTER SYSTEM STATUS BANNER */}
      <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#040810] via-[#07111e] to-[#040711] p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>CENTRAL COMMAND CORE • JARVIS AI SUPERCOMPUTER</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-widest uppercase">
              GODSEYE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                OPERATING MATRIX
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Precision multi-node architecture engineered for 8-second video workflows (24s / 32s / 40s),
              synchronized Hindi acoustic narration, and cinematic visual prompt synthesis.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onNewContent}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>INITIALIZE NEW 8s CONTENT</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('Create')}
                className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-900/60 hover:border-cyan-400/50 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>OPEN FLOW STUDIO</span>
              </button>
            </div>
          </div>

          {/* Quick Telemetry Box */}
          <div className="bg-[#03060c] border border-cyan-900/60 rounded-2xl p-4 min-w-[240px] space-y-2 text-xs">
            <div className="text-[10px] text-cyan-500/70 border-b border-cyan-950 pb-1.5 flex justify-between">
              <span>SYSTEM METRICS</span>
              <span className="text-emerald-400 font-bold">OPTIMAL</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">ACTIVE PROJECT:</span>
              <span className="text-white font-bold truncate max-w-[130px]">
                {currentProject?.name || 'UNTITLED'}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">8s CLIPS:</span>
              <span className="text-amber-400 font-bold">{scenesCount} BLOCKS</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">VOICE SYNC:</span>
              <span className="text-cyan-400 font-bold">15-17 W / CLIP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTRAL ANIMATED AI CORE + CONNECTED SYSTEM NODES */}
      <div className="rounded-3xl border border-cyan-950 bg-[#030711]/90 p-8 sm:p-12 shadow-[0_0_50px_rgba(3,7,17,0.8)] relative overflow-hidden">
        {/* Futuristic Background Coordinate Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
          {/* Section Indicator */}
          <div className="text-center space-y-1">
            <span className="text-[10px] text-cyan-500 tracking-widest uppercase">
              INTERCONNECTED SUBSYSTEM MATRIX
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-widest uppercase">
              CENTRAL AI PROCESSING CORE
            </h2>
          </div>

          {/* Central Core Component */}
          <div className="my-4">
            <JarvisAiCore
              state={coreState}
              currentTask={
                coreState === 'idle'
                  ? 'CLICK TO OPEN 8-SECOND FLOW STUDIO'
                  : 'AI COMPILATION IN PROGRESS'
              }
              onClick={() => onNavigate('Create')}
            />
          </div>

          {/* Orbiting System Nodes Grid */}
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4">
            {systemNodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => onNavigate(node.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                  node.active
                    ? `${node.color} shadow-lg`
                    : 'border-slate-800/80 bg-slate-950/60 hover:border-cyan-500/40 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#040810] border border-cyan-950 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors">
                      {node.icon}
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase text-white">
                      {node.label}
                    </span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 font-mono text-cyan-300">
                    {node.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans flex items-center justify-between">
                  <span>{node.subtext}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-cyan-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. RECENT QUANTUM PROJECTS VAULT */}
      {projects.length > 0 && (
        <div className="rounded-2xl border border-cyan-950 bg-[#040811] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white tracking-widest uppercase">
                ACTIVE QUANTUM PROJECT ARCHIVE ({projects.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('Projects')}
              className="text-[11px] text-cyan-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>VIEW ALL ARCHIVES</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj)}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/80 hover:border-cyan-500/50 hover:bg-[#060c18] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-cyan-500 font-bold uppercase truncate max-w-[160px]">
                    {proj.settings?.contentType || 'SHORT (8s)'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                    {proj.settings?.duration || '24 sec'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {proj.name || 'UNTITLED PROJECT'}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900 pt-2">
                  <span>{new Date(proj.updatedAt || Date.now()).toLocaleDateString()}</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
