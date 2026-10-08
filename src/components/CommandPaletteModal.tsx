import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
  Zap,
  Cpu,
  FileCode,
  Film,
  Image as ImageIcon,
  Tag,
  BarChart3,
  HardDrive,
  FolderKanban,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { V2NavigationTab, GodseyeProject } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: V2NavigationTab) => void;
  projects: GodseyeProject[];
  onOpenProject: (project: GodseyeProject) => void;
  onTriggerQuickAction?: (actionName: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'SUPERCOMPUTER ACTIONS' | 'SUBSYSTEMS' | 'PROJECTS';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  projects,
  onOpenProject,
  onTriggerQuickAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
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
    // Supercomputer System Actions
    {
      id: 'cmd-new-content',
      title: 'Initialize 8-Second Creation Matrix',
      subtitle: 'Open high-precision creation console (24s / 32s / 40s)',
      category: 'SUPERCOMPUTER ACTIONS',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigate('Create');
        if (onTriggerQuickAction) onTriggerQuickAction('new-content');
        onClose();
      },
    },
    {
      id: 'cmd-auto-fit-voice',
      title: 'Auto Fit All Voice Timings (15-17 W / Clip)',
      subtitle: 'Strictly calibrate all Hindi voiceovers to 8.0s audio limits',
      category: 'SUPERCOMPUTER ACTIONS',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate('Create');
        if (onTriggerQuickAction) onTriggerQuickAction('fix-timing');
        onClose();
      },
    },
    {
      id: 'cmd-convert-24',
      title: 'Convert Workflow to 24 Seconds (3 × 8s)',
      subtitle: 'Recalibrate timeline into 3 clips: Hook -> Main -> End',
      category: 'SUPERCOMPUTER ACTIONS',
      icon: <Clock className="w-4 h-4 text-sky-400" />,
      action: () => {
        onNavigate('Create');
        if (onTriggerQuickAction) onTriggerQuickAction('duration-24');
        onClose();
      },
    },
    {
      id: 'cmd-convert-32',
      title: 'Convert Workflow to 32 Seconds (4 × 8s)',
      subtitle: 'Recalibrate timeline into 4 clips: Hook -> Main A -> Reveal -> End',
      category: 'SUPERCOMPUTER ACTIONS',
      icon: <Clock className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigate('Create');
        if (onTriggerQuickAction) onTriggerQuickAction('duration-32');
        onClose();
      },
    },
    {
      id: 'cmd-convert-40',
      title: 'Convert Workflow to 40 Seconds (5 × 8s)',
      subtitle: 'Recalibrate timeline into 5 clips: Hook -> Main A -> Main B -> Reveal -> End',
      category: 'SUPERCOMPUTER ACTIONS',
      icon: <Clock className="w-4 h-4 text-pink-400" />,
      action: () => {
        onNavigate('Create');
        if (onTriggerQuickAction) onTriggerQuickAction('duration-40');
        onClose();
      },
    },

    // Subsystems
    {
      id: 'cmd-core',
      title: 'Command Core Matrix (JARVIS Kernel)',
      subtitle: 'Central AI Processing Core & Subsystem Radar',
      category: 'SUBSYSTEMS',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigate('Dashboard');
        onClose();
      },
    },
    {
      id: 'cmd-flow',
      title: 'Google Flow Studio',
      subtitle: 'Visual 8-second timeline, camera angles & Hindi narration prompts',
      category: 'SUBSYSTEMS',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate('Create');
        onClose();
      },
    },
    {
      id: 'cmd-research',
      title: 'Deep Research Subsystem',
      subtitle: 'Fact-checking, intelligence harvesting & entity verification',
      category: 'SUBSYSTEMS',
      icon: <Search className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onNavigate('Research');
        onClose();
      },
    },
    {
      id: 'cmd-script',
      title: 'Script Studio (Hindi Acoustic Engine)',
      subtitle: 'Phonetic speaking speeds, word counters and Hook engineering',
      category: 'SUBSYSTEMS',
      icon: <FileCode className="w-4 h-4 text-sky-400" />,
      action: () => {
        onNavigate('Script');
        onClose();
      },
    },
    {
      id: 'cmd-scenes',
      title: 'Scene Studio (Cinematic Timeline)',
      subtitle: 'Veo 2, Runway Gen-3 & Google Flow multi-scene directorship',
      category: 'SUBSYSTEMS',
      icon: <Film className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigate('Scene Studio');
        onClose();
      },
    },
    {
      id: 'cmd-analytics',
      title: 'Retention Radar & Audience Modeling',
      subtitle: 'Drop-off prevention and attention trajectory curves',
      category: 'SUBSYSTEMS',
      icon: <BarChart3 className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onNavigate('Analytics');
        onClose();
      },
    },
    {
      id: 'cmd-memory',
      title: 'Persistent Project Memory Vault',
      subtitle: 'Historical creator preferences and successful story patterns',
      category: 'SUBSYSTEMS',
      icon: <HardDrive className="w-4 h-4 text-pink-400" />,
      action: () => {
        onNavigate('Content Library');
        onClose();
      },
    },
  ];

  const projectCommands: CommandItem[] = projects.map((p) => ({
    id: `project-${p.id}`,
    title: p.name || 'Untitled Quantum Archive',
    subtitle: `${p.settings?.contentType || 'Short'} • ${p.settings?.duration || '24 sec'}`,
    category: 'PROJECTS',
    icon: <FolderKanban className="w-4 h-4 text-cyan-400" />,
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-xl font-mono select-none">
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#060b14] border border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-cyan-950/80 bg-[#040810] flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            id="input-command-search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="EXECUTE COMMAND: Type an action, subsystem, or project archive..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 font-mono tracking-wider"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              NO MATCHING COMMANDS FOUND IN QUANTUM KERNEL.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/40 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-950 border border-cyan-950/80 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate uppercase">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#03060d] text-cyan-400 border border-cyan-900/60 uppercase">
                    {item.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-950/80 bg-[#03060c] flex items-center justify-between text-[10px] text-cyan-500/70">
          <span>JARVIS COMMAND INTERFACE READY</span>
          <span>PRESS [ESC] TO DISMISS</span>
        </div>
      </div>
    </div>
  );
};
