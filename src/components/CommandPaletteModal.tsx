import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
  LayoutDashboard,
  FileText,
  Clapperboard,
  Image as ImageIcon,
  Tag,
  Youtube,
  BarChart3,
  FolderArchive,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { V2NavigationTab, GodseyeProject } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: V2NavigationTab) => void;
  projects: GodseyeProject[];
  onOpenProject: (project: GodseyeProject) => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'NAVIGATION' | 'PROJECTS' | 'ACTIONS';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  projects,
  onOpenProject,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseCommands: CommandItem[] = [
    {
      id: 'cmd-dashboard',
      title: 'Command Center Dashboard',
      subtitle: 'View production metrics, publishing status, and recent activity',
      category: 'NAVIGATION',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigate('Dashboard');
        onClose();
      },
    },
    {
      id: 'cmd-create',
      title: 'Create Studio (New Content)',
      subtitle: 'Source article input, studio controls, and video synthesis',
      category: 'NAVIGATION',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigate('Create');
        onClose();
      },
    },
    {
      id: 'cmd-research',
      title: 'Deep Topic Research',
      subtitle: 'Analyze breaking news, narrative angles, and trending entities',
      category: 'NAVIGATION',
      icon: <Search className="w-4 h-4 text-teal-400" />,
      action: () => {
        onNavigate('Research');
        onClose();
      },
    },
    {
      id: 'cmd-script',
      title: 'Script Studio & Teleprompter',
      subtitle: 'Review narrative pacing, word counts, and voiceover timing',
      category: 'NAVIGATION',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      action: () => {
        onNavigate('Script');
        onClose();
      },
    },
    {
      id: 'cmd-scene',
      title: 'Scene Studio & Visual Directing',
      subtitle: 'Google Veo 2, Runway Gen-3, and Midjourney camera prompts',
      category: 'NAVIGATION',
      icon: <Clapperboard className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigate('Scene Studio');
        onClose();
      },
    },
    {
      id: 'cmd-thumbnail',
      title: 'Thumbnail Studio & Psychology',
      subtitle: 'Click-magnet visual blueprints and 3-word title overlay safe zones',
      category: 'NAVIGATION',
      icon: <ImageIcon className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate('Thumbnail Studio');
        onClose();
      },
    },
    {
      id: 'cmd-seo',
      title: 'Multi-Platform SEO Engine',
      subtitle: 'High-CTR titles, hashtags, and description tags',
      category: 'NAVIGATION',
      icon: <Tag className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onNavigate('SEO Studio');
        onClose();
      },
    },
    {
      id: 'cmd-analytics',
      title: 'Retention & Drop-off Analytics',
      subtitle: 'Simulate 60s viewer attention curves and hook velocity',
      category: 'NAVIGATION',
      icon: <BarChart3 className="w-4 h-4 text-teal-400" />,
      action: () => {
        onNavigate('Analytics');
        onClose();
      },
    },
    {
      id: 'cmd-projects',
      title: 'Saved Projects Library',
      subtitle: 'Manage local project vault, search, and duplicate workflows',
      category: 'NAVIGATION',
      icon: <FolderArchive className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigate('Projects');
        onClose();
      },
    },
    {
      id: 'cmd-settings',
      title: 'Studio Settings & Voice Configuration',
      subtitle: 'Manage theme aesthetics, AI model telemetry, and TTS voices',
      category: 'NAVIGATION',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      action: () => {
        onNavigate('Settings');
        onClose();
      },
    },
  ];

  const projectCommands: CommandItem[] = projects.map((p) => ({
    id: `project-${p.id}`,
    title: p.name,
    subtitle: `${p.settings.contentType} • ${p.settings.videoFormat} • ${p.settings.duration}`,
    category: 'PROJECTS',
    icon: <FolderArchive className="w-4 h-4 text-cyan-400" />,
    action: () => {
      onOpenProject(p);
      onClose();
    },
  }));

  const allItems = [...baseCommands, ...projectCommands];
  const filtered = allItems.filter(
    (item) =>
      (item.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#0b101c] border border-slate-700/80 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            id="input-command-search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search studio tools, workspaces, or saved projects..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 font-sans"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 text-xs scrollbar-thin scrollbar-thumb-slate-800">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No matching tools or projects found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900/90 border border-transparent hover:border-slate-800 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                    {item.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate with mouse or Tab</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
