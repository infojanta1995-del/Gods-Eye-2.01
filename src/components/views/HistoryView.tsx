import React, { useState, useMemo } from 'react';
import {
  History as HistoryIcon,
  Clock,
  FolderArchive,
  ArrowRight,
  Download,
  Copy,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  X,
  ArrowUpDown,
  Plus,
} from 'lucide-react';
import { GodseyeProject, ProjectStatus, V2NavigationTab } from '../../types';

interface HistoryViewProps {
  projects: GodseyeProject[];
  activeProjectId: string | null;
  onOpenProject: (project: GodseyeProject) => void;
  onNavigate: (tab: V2NavigationTab) => void;
  onNewProject?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  projects,
  activeProjectId,
  onOpenProject,
  onNavigate,
  onNewProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProjectStatus>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  const filteredProjects = useMemo(() => {
    const list = projects.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (p.name || '').toLowerCase().includes(q);
      const titleMatch = (p.article?.title || '').toLowerCase().includes(q);
      const contentTypeMatch = (p.settings?.contentType || '').toLowerCase().includes(q);
      const platformMatch =
        p.settings?.platforms?.some((pl) => (pl || '').toLowerCase().includes(q)) ?? false;
      return nameMatch || titleMatch || contentTypeMatch || platformMatch;
    });

    return list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [projects, searchQuery, statusFilter, sortBy]);

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `godseye_projects_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Project History & Version Vault
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold">
              LOCAL PERSISTENT VAULT ({projects.length})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Audit log of auto-saved project drafts, generated video packages, and revision snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNewProject && (
            <button
              type="button"
              onClick={() => {
                onNewProject();
                onNavigate('Create');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Backup JSON</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Sort Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d121c]/90 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history by name, title, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            {(['ALL', 'READY', 'DRAFT'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                  statusFilter === status
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-3">
            <FolderArchive className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No history records found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or start a new project.</p>
          </div>
        ) : (
          filteredProjects.map((proj, idx) => {
          const isActive = proj.id === activeProjectId;
          const formattedDate = new Date(proj.updatedAt).toLocaleString();
          const hasContent = Boolean(proj.content);

          return (
            <div
              key={proj.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                  : 'bg-[#0c101a] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0 mt-0.5">
                  <Clock className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        ACTIVE NOW
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        hasContent
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{formattedDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-wide">{proj.name}</h3>

                  <p className="text-xs text-slate-400">
                    Format: <span className="text-slate-200">{proj.settings.videoFormat}</span> • Pace:{' '}
                    <span className="text-slate-200">{proj.settings.duration}</span> • Language:{' '}
                    <span className="text-slate-200">{proj.settings.language}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    onOpenProject(proj);
                    onNavigate('Create');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Load into Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
