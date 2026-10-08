import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Search,
  FileText,
  Clapperboard,
  Image as ImageIcon,
  TrendingUp,
  Youtube,
  Facebook,
  Instagram,
  Calendar,
  BarChart3,
  Brain,
  Folder,
  Layers,
  Clock,
  Settings as SettingsIcon,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Plus,
  Film,
} from 'lucide-react';
import { V2NavigationTab } from '../types';

interface SidebarNavigationProps {
  activeTab: V2NavigationTab;
  onSelectTab: (tab: V2NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  projectsCount?: number;
  hasActiveProject?: boolean;
  activeProjectName?: string;
  onNewProject?: () => void;
}

interface NavItemDef {
  id: V2NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface NavGroupDef {
  title?: string;
  items: NavItemDef[];
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  projectsCount = 0,
  onNewProject,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const navGroups: NavGroupDef[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        {
          id: 'Dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
        },
        {
          id: 'Create',
          label: 'Short Creator',
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          badge: '8s Flow',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        },
        {
          id: 'Projects',
          label: 'Projects',
          icon: <Folder className="w-4 h-4 text-sky-400" />,
          badge: projectsCount > 0 ? String(projectsCount) : undefined,
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        },
        {
          id: 'Content Library',
          label: 'Content Library',
          icon: <Layers className="w-4 h-4 text-slate-400" />,
        },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'Research',
          label: 'Research Workstation',
          icon: <Search className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'Trend Intelligence',
          label: 'Trend Intelligence',
          icon: <TrendingUp className="w-4 h-4 text-teal-400" />,
        },
        {
          id: 'Story Intelligence',
          label: 'Story Intelligence',
          icon: <Brain className="w-4 h-4 text-blue-400" />,
        },
        {
          id: 'AI Recommendations',
          label: 'AI Recommendations',
          icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        },
        {
          id: 'Analytics',
          label: 'Analytics & Retention',
          icon: <BarChart3 className="w-4 h-4 text-indigo-400" />,
        },
      ],
    },
    {
      title: 'PRODUCTION',
      items: [
        {
          id: 'Short Production',
          label: 'Short Production Engine',
          icon: <Film className="w-4 h-4 text-cyan-400" />,
          badge: '8s Sync',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        },
        {
          id: 'Script Studio',
          label: 'Script Studio (Hindi)',
          icon: <FileText className="w-4 h-4 text-blue-400" />,
        },
        {
          id: 'Scene Studio',
          label: 'Scene Studio (8s Veo)',
          icon: <Clapperboard className="w-4 h-4 text-purple-400" />,
          badge: '8s Sync',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        },
        {
          id: 'Voice Studio',
          label: 'Voice Studio (TTS)',
          icon: <Clock className="w-4 h-4 text-pink-400" />,
        },
        {
          id: 'Thumbnail Studio',
          label: 'Thumbnail Studio',
          icon: <ImageIcon className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'SEO Studio',
          label: 'SEO Studio (10+ Plt)',
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'AI Models',
          label: 'AI Models & Neural',
          icon: <Brain className="w-4 h-4 text-cyan-400" />,
        },
        {
          id: 'Connected Accounts',
          label: 'Connected Accounts',
          icon: <Folder className="w-4 h-4 text-slate-400" />,
        },
        {
          id: 'Settings',
          label: 'System Settings',
          icon: <SettingsIcon className="w-4 h-4 text-slate-400" />,
        },
      ],
    },
  ];

  return (
    <aside
      id="godseye-sidebar-nav"
      className={`relative z-30 flex flex-col flex-shrink-0 border-r border-slate-800/80 bg-[#070a12]/95 backdrop-blur-2xl transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60 lg:w-64'
      }`}
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      {/* Scrollable Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {group.title && !isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const isActive =
                activeTab === item.id ||
                (item.id === 'Script Studio' && activeTab === 'Script') ||
                (item.id === 'AI Models' && activeTab === 'AI Settings');
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-item-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onSelectTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'border border-cyan-500/80 bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`}>
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer Area: Settings & Dark Mode Toggle (Matching Reference Image 2) */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Settings button */}
        <button
          type="button"
          id="nav-item-settings"
          onClick={() => onSelectTab('Settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'Settings'
              ? 'border border-amber-500/80 bg-amber-500/20 text-amber-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <SettingsIcon className="w-4 h-4 text-slate-400" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {/* Dark Mode Switch (Matching Reference Image 2) */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300 font-medium">Dark Mode</span>
            </div>
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-8 h-4 rounded-full bg-amber-500/30 p-0.5 relative transition-colors cursor-pointer"
            >
              <div
                className={`w-3 h-3 rounded-full bg-amber-400 shadow-sm transition-transform ${
                  isDarkMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex justify-center p-2 rounded-xl text-amber-400 hover:bg-slate-800/60 cursor-pointer"
            title="Toggle Dark Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        )}

        {/* Collapse toggle button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer text-xs"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
