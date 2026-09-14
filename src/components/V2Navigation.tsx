import React from 'react';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Clapperboard,
  Image as ImageIcon,
  Tag,
  Youtube,
  Facebook,
  Instagram,
  BarChart3,
  FolderArchive,
  Layers,
  Settings as SettingsIcon,
  Send,
  Link2,
  Flame,
  LineChart,
  User,
  Sliders,
} from 'lucide-react';
import { V2NavigationTab } from '../types';

interface V2NavigationProps {
  activeTab: V2NavigationTab;
  onSelectTab: (tab: V2NavigationTab) => void;
  hasActiveProject: boolean;
  activeProjectName?: string;
}

interface NavItem {
  id: V2NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Core Command
  { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'Create', label: 'Create Studio', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, badge: 'AI' },
  { id: 'Research', label: 'Topic Research', icon: <Search className="w-4 h-4" /> },
  { id: 'Trend Intelligence', label: 'Trends', icon: <Flame className="w-4 h-4 text-amber-400" />, badge: 'Radar' },

  // Dedicated Studios
  { id: 'Scene Studio', label: 'Scene Studio', icon: <Clapperboard className="w-4 h-4 text-purple-400" /> },
  { id: 'Thumbnail Studio', label: 'Thumbnails', icon: <ImageIcon className="w-4 h-4 text-amber-400" /> },
  { id: 'SEO Studio', label: 'SEO Engine', icon: <Tag className="w-4 h-4 text-emerald-400" /> },

  // Publishing & Connections
  { id: 'Publishing Queue', label: 'Publish Queue', icon: <Send className="w-4 h-4 text-cyan-400" />, badge: 'Queue' },
  { id: 'Connected Accounts', label: 'Accounts', icon: <Link2 className="w-4 h-4 text-blue-400" /> },

  // Platforms
  { id: 'YouTube', label: 'YouTube', icon: <Youtube className="w-4 h-4 text-red-500" /> },
  { id: 'Instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4 text-pink-500" /> },
  { id: 'Facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4 text-blue-500" /> },

  // Intelligence & Analytics
  { id: 'Content Analytics', label: 'Retention Doctor', icon: <LineChart className="w-4 h-4 text-teal-400" /> },
  { id: 'Analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-teal-400" /> },

  // Projects & Library
  { id: 'Projects', label: 'Projects', icon: <FolderArchive className="w-4 h-4 text-cyan-400" /> },
  { id: 'Content Library', label: 'Library', icon: <Layers className="w-4 h-4 text-indigo-400" /> },

  // Settings
  { id: 'AI Settings', label: 'AI Models', icon: <Sliders className="w-4 h-4 text-purple-400" /> },
  { id: 'Account', label: 'Operator', icon: <User className="w-4 h-4 text-slate-400" /> },
  { id: 'Settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4 text-slate-400" /> },
];

export const V2Navigation: React.FC<V2NavigationProps> = ({
  activeTab,
  onSelectTab,
  hasActiveProject,
  activeProjectName,
}) => {
  return (
    <nav className="w-full bg-[#0a0e17]/95 border-b border-slate-800/90 backdrop-blur-md sticky top-18 z-30 shadow-md shadow-black/40">
      <div className="w-full max-w-none 2xl:max-w-[1750px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-btn-${item.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20 font-bold'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold tracking-wider ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active project mini pill */}
          {hasActiveProject && activeProjectName && (
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 font-mono text-[11px]">ACTIVE:</span>
              <span className="text-slate-200 font-medium truncate max-w-[160px]" title={activeProjectName}>
                {activeProjectName}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
