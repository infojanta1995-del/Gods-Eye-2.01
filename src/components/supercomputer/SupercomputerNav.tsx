import React, { useState, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Flame,
  Send,
  Link2,
  Youtube,
  Instagram,
  Facebook,
  LineChart,
  Sliders,
  User,
  Settings as SettingsIcon,
  Mic,
  History,
  Palette,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';
import { V2NavigationTab } from '../../types';

interface SupercomputerNavProps {
  activeTab: V2NavigationTab;
  onSelectTab: (tab: V2NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  projectsCount?: number;
  onOpenThemeModal?: () => void;
  currentProjectName?: string;
}

interface NavModuleItem {
  id: V2NavigationTab;
  code: string;
  label: string;
  subsystem: string;
  icon: React.ReactNode;
  category: 'CORE' | 'STUDIOS' | 'CHANNELS' | 'INTELLIGENCE' | 'SYSTEM';
  badge?: string;
}

const ALL_SYSTEM_MODULES: NavModuleItem[] = [
  // 1. CORE & PRODUCTION
  {
    id: 'Dashboard',
    code: 'SYS-01',
    label: 'COMMAND CORE',
    subsystem: 'JARVIS KERNEL',
    category: 'CORE',
    icon: <Cpu className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'Create',
    code: 'SYS-02',
    label: 'FLOW STUDIO (8s)',
    subsystem: '24s / 32s / 40s ENGINE',
    category: 'CORE',
    badge: '8s FLOW',
    icon: <Zap className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 'Research',
    code: 'SYS-03',
    label: 'RESEARCH MATRIX',
    subsystem: 'INTELLIGENCE HARVEST',
    category: 'CORE',
    icon: <Search className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'Trend Intelligence',
    code: 'SYS-04',
    label: 'TREND RADAR',
    subsystem: 'VIRAL SIGNALS',
    category: 'CORE',
    badge: 'LIVE',
    icon: <Flame className="w-4 h-4 text-rose-400" />,
  },

  // 2. CREATIVE STUDIOS
  {
    id: 'Story Intelligence',
    code: 'SYS-05',
    label: 'STORY ENGINE',
    subsystem: 'NARRATIVE LOGIC',
    category: 'STUDIOS',
    icon: <BookOpen className="w-4 h-4 text-blue-400" />,
  },
  {
    id: 'Script Studio',
    code: 'SYS-06',
    label: 'SCRIPT ACOUSTICS',
    subsystem: 'HINDI TELEPROMPTER',
    category: 'STUDIOS',
    icon: <FileCode className="w-4 h-4 text-sky-400" />,
  },
  {
    id: 'Voice Studio',
    code: 'SYS-07',
    label: 'VOICE STUDIO',
    subsystem: 'CADENCE & SYNTHESIS',
    category: 'STUDIOS',
    icon: <Mic className="w-4 h-4 text-teal-400" />,
  },
  {
    id: 'Scene Studio',
    code: 'SYS-08',
    label: 'SCENE STUDIO',
    subsystem: 'CONTINUITY CUTS',
    category: 'STUDIOS',
    icon: <Film className="w-4 h-4 text-purple-400" />,
  },
  {
    id: 'Thumbnail Studio',
    code: 'SYS-09',
    label: 'THUMBNAIL LAB',
    subsystem: 'VISUAL ANCHORS',
    category: 'STUDIOS',
    icon: <ImageIcon className="w-4 h-4 text-yellow-400" />,
  },
  {
    id: 'SEO Studio',
    code: 'SYS-10',
    label: 'SEO MATRIX',
    subsystem: 'ALGORITHMIC HOOK',
    category: 'STUDIOS',
    icon: <Tag className="w-4 h-4 text-lime-400" />,
  },

  // 3. CHANNELS & STAGING
  {
    id: 'Publishing Queue',
    code: 'SYS-11',
    label: 'STAGING QUEUE',
    subsystem: 'READY TO EXPORT',
    category: 'CHANNELS',
    badge: 'QUEUE',
    icon: <Send className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'Connected Accounts',
    code: 'SYS-12',
    label: 'CHANNEL MATRIX',
    subsystem: 'OAUTH PLATFORMS',
    category: 'CHANNELS',
    icon: <Link2 className="w-4 h-4 text-indigo-400" />,
  },
  {
    id: 'YouTube',
    code: 'SYS-13',
    label: 'YOUTUBE CORE',
    subsystem: 'SHORTS SYNC',
    category: 'CHANNELS',
    icon: <Youtube className="w-4 h-4 text-red-400" />,
  },
  {
    id: 'Instagram',
    code: 'SYS-14',
    label: 'INSTAGRAM LAB',
    subsystem: 'REELS PACKAGING',
    category: 'CHANNELS',
    icon: <Instagram className="w-4 h-4 text-pink-400" />,
  },
  {
    id: 'Facebook',
    code: 'SYS-15',
    label: 'FACEBOOK LAB',
    subsystem: 'VIDEO OPTIMIZATION',
    category: 'CHANNELS',
    icon: <Facebook className="w-4 h-4 text-blue-400" />,
  },

  // 4. INTELLIGENCE & VAULT
  {
    id: 'Content Analytics',
    code: 'SYS-16',
    label: 'RETENTION DOCTOR',
    subsystem: 'DROP-OFF AUDIT',
    category: 'INTELLIGENCE',
    badge: 'AUDIT',
    icon: <LineChart className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'Analytics',
    code: 'SYS-17',
    label: 'ANALYTICS RADAR',
    subsystem: 'METRIC TELEMETRY',
    category: 'INTELLIGENCE',
    icon: <BarChart3 className="w-4 h-4 text-teal-400" />,
  },
  {
    id: 'Content Library',
    code: 'SYS-18',
    label: 'PERSISTENT MEMORY',
    subsystem: 'ASSET ARCHIVE',
    category: 'INTELLIGENCE',
    icon: <HardDrive className="w-4 h-4 text-fuchsia-400" />,
  },
  {
    id: 'Projects',
    code: 'SYS-19',
    label: 'PROJECT MATRIX',
    subsystem: 'SAVED WORKSPACES',
    category: 'INTELLIGENCE',
    icon: <FolderKanban className="w-4 h-4 text-slate-300" />,
  },
  {
    id: 'History',
    code: 'SYS-20',
    label: 'AUDIT LOGS',
    subsystem: 'VERSION REVISIONS',
    category: 'INTELLIGENCE',
    icon: <History className="w-4 h-4 text-slate-400" />,
  },

  // 5. SYSTEM & CONFIG
  {
    id: 'AI Settings',
    code: 'SYS-21',
    label: 'NEURAL ENGINES',
    subsystem: 'GEMINI 3.8 FLASH',
    category: 'SYSTEM',
    icon: <Sliders className="w-4 h-4 text-purple-400" />,
  },
  {
    id: 'Account',
    code: 'SYS-22',
    label: 'OPERATOR ACCESS',
    subsystem: 'SECURITY CREDENTIALS',
    category: 'SYSTEM',
    icon: <User className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'Settings',
    code: 'SYS-23',
    label: 'SYSTEM CONFIG',
    subsystem: 'GLOBAL PARAMETERS',
    category: 'SYSTEM',
    icon: <SettingsIcon className="w-4 h-4 text-slate-400" />,
  },
];

const CATEGORY_HEADERS: Record<NavModuleItem['category'], { title: string; tag: string }> = {
  CORE: { title: 'CORE COMMAND', tag: '01' },
  STUDIOS: { title: 'PRODUCTION STUDIOS', tag: '02' },
  CHANNELS: { title: 'CHANNELS & STAGING', tag: '03' },
  INTELLIGENCE: { title: 'INTELLIGENCE & VAULT', tag: '04' },
  SYSTEM: { title: 'SYSTEM CONTROL', tag: '05' },
};

export const SupercomputerNav: React.FC<SupercomputerNavProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  projectsCount = 0,
  onOpenThemeModal,
  currentProjectName,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredModules = useMemo(() => {
    if (!searchFilter.trim()) return ALL_SYSTEM_MODULES;
    const q = searchFilter.toLowerCase();
    return ALL_SYSTEM_MODULES.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.subsystem.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  // Group filtered modules by category
  const groupedModules = useMemo(() => {
    const groups: { [key in NavModuleItem['category']]?: NavModuleItem[] } = {};
    for (const mod of filteredModules) {
      if (!groups[mod.category]) {
        groups[mod.category] = [];
      }
      groups[mod.category]!.push(mod);
    }
    return groups;
  }, [filteredModules]);

  const categoriesOrder: NavModuleItem['category'][] = [
    'CORE',
    'STUDIOS',
    'CHANNELS',
    'INTELLIGENCE',
    'SYSTEM',
  ];

  return (
    <aside
      id="godseye-supercomputer-nav"
      className={`relative z-30 flex flex-col border-r border-cyan-950/70 bg-[#03060e]/98 backdrop-blur-2xl transition-all duration-300 font-mono select-none flex-shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 ${
        isCollapsed ? 'w-18' : 'w-72 2xl:w-80'
      }`}
    >
      {/* 1. Header Bar with Collapse Toggle & Subsystem Counter */}
      <div className="h-11 border-b border-cyan-950/80 px-3 flex items-center justify-between text-[10px] text-cyan-500/80 bg-[#040813]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-widest uppercase font-bold text-white text-[11px]">
              SUBSYSTEMS
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
              {ALL_SYSTEM_MODULES.length}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-cyan-950/60 text-cyan-400 hover:text-white transition-all cursor-pointer ml-auto border border-cyan-950 hover:border-cyan-800"
          title={isCollapsed ? 'Expand Navigation Subsystems' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Fast Subsystem Filter Input (When Expanded) */}
      {!isCollapsed && (
        <div className="p-2 border-b border-cyan-950/60 bg-[#030712]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-500/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search 23 subsystems..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#060c18] border border-cyan-950 hover:border-cyan-800/80 focus:border-cyan-500 text-white placeholder-slate-500 text-[11px] focus:outline-none transition-colors font-mono"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-[10px] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Modules List (Categorized & Scrollable) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin scrollbar-thumb-cyan-950/80 scrollbar-track-transparent">
        {categoriesOrder.map((catKey) => {
          const catModules = groupedModules[catKey];
          if (!catModules || catModules.length === 0) return null;
          const catMeta = CATEGORY_HEADERS[catKey];

          return (
            <div key={catKey} className="space-y-1">
              {/* Category Section Header */}
              {!isCollapsed ? (
                <div className="flex items-center justify-between px-2 pt-1 pb-1 text-[9px] font-bold tracking-wider text-slate-500 uppercase border-b border-cyan-950/40">
                  <span className="flex items-center gap-1.5 text-cyan-400/90 font-mono">
                    <span className="text-[8px] text-slate-600">// {catMeta.tag}</span>
                    <span>{catMeta.title}</span>
                  </span>
                  <span className="text-[8px] text-slate-600">{catModules.length}</span>
                </div>
              ) : (
                <div className="h-px bg-cyan-950/60 my-1 mx-2" />
              )}

              {/* Modules in this category */}
              <div className="space-y-1">
                {catModules.map((mod) => {
                  const isActive =
                    activeTab === mod.id ||
                    (mod.id === 'Script Studio' && activeTab === 'Script') ||
                    (mod.id === 'Create' && activeTab === 'Short Production') ||
                    (mod.id === 'Analytics' && activeTab === 'Channel Analytics') ||
                    (mod.id === 'Content Analytics' && activeTab === 'AI Recommendations') ||
                    (mod.id === 'AI Settings' && activeTab === 'AI Models');

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      id={`nav-item-${mod.code.toLowerCase()}`}
                      onClick={() => onSelectTab(mod.id)}
                      className={`w-full group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-950/90 via-[#071324] to-transparent border border-cyan-500/60 shadow-[0_0_16px_rgba(6,182,212,0.3)] text-white'
                          : 'hover:bg-[#07101e]/80 border border-transparent text-slate-400 hover:text-slate-100'
                      }`}
                      title={isCollapsed ? `${mod.label} (${mod.code} - ${mod.subsystem})` : undefined}
                    >
                      {/* Active Indicator Strip */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                      )}

                      {/* Module Icon Container */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                          isActive
                            ? 'bg-cyan-950/90 border border-cyan-400/70 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                            : 'bg-[#060a14] border border-cyan-950/80 group-hover:border-cyan-600/40 group-hover:bg-[#081224]'
                        }`}
                      >
                        {mod.icon}
                      </div>

                      {/* Text Info (Expanded) */}
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-[11px] font-bold tracking-wider uppercase truncate ${
                                isActive ? 'text-cyan-200' : 'text-slate-200 group-hover:text-white'
                              }`}
                            >
                              {mod.label}
                            </span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {mod.badge && (
                                <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold uppercase tracking-wider">
                                  {mod.badge}
                                </span>
                              )}
                              <span className="text-[8px] text-cyan-600/70 group-hover:text-cyan-400 font-mono">
                                {mod.code}
                              </span>
                            </div>
                          </div>
                          <div className="text-[9px] text-slate-500 uppercase truncate font-mono">
                            {mod.id === 'Projects' ? `SAVED: ${projectsCount}` : mod.subsystem}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Controls: Theme Trigger & Telemetry */}
      <div className="border-t border-cyan-950/80 bg-[#02050b] p-2 space-y-2 text-[10px] text-cyan-500/80">
        {onOpenThemeModal && (
          <button
            type="button"
            onClick={onOpenThemeModal}
            className={`w-full flex items-center gap-2 p-2 rounded-xl bg-[#060e1d] hover:bg-cyan-950/50 border border-cyan-900/60 hover:border-cyan-500/50 text-cyan-300 hover:text-white transition-all cursor-pointer ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title="Open Theme & Interface Customizer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Palette className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-[10px] font-bold tracking-wider uppercase truncate">
                  THEME LAB
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-300">
                COLOR MATRIX
              </span>
            )}
          </button>
        )}

        {!isCollapsed && (
          <div className="p-2 rounded-lg bg-[#040812] border border-cyan-950 space-y-1 text-[9px] text-slate-400 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">ACTIVE:</span>
              <span className="text-cyan-300 font-bold truncate max-w-[140px]">
                {currentProjectName || 'GODSEYE_PRIME'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">NEURAL LINK:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE (99.9%)
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
