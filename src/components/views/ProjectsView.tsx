import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  Trash2,
  Copy,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Edit2,
  Check,
  X,
  ArrowRight,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';
import { GodseyeProject, ProjectStatus, V2NavigationTab } from '../../types';
import { exportProjectAsJson, exportProjectAsTxt } from '../../services/projectStorage';

interface ProjectsViewProps {
  projects: GodseyeProject[];
  activeProjectId: string | null;
  onOpenProject: (project: GodseyeProject) => void;
  onNewProject: () => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProjectId,
  onOpenProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProjectStatus>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<GodseyeProject | null>(null);

  // Filter & Search & Sort Logic
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

      let keywordMatch = false;
      if (p.content?.keywords) {
        keywordMatch =
          Boolean(p.content.keywords.primary?.some((k) => (k || '').toLowerCase().includes(q))) ||
          Boolean(p.content.keywords.secondary?.some((k) => (k || '').toLowerCase().includes(q)));
      }

      return nameMatch || titleMatch || contentTypeMatch || platformMatch || keywordMatch;
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

  const handleStartRename = (e: React.MouseEvent, p: GodseyeProject) => {
    e.stopPropagation();
    setEditingId(p.id);
    setEditingName(p.name);
  };

  const handleSaveRename = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editingName.trim()) {
      onRenameProject(id, editingName.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0c1626] via-[#09101c] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-xs font-semibold text-cyan-300 mb-2">
              <FolderArchive className="w-3.5 h-3.5 text-cyan-400" />
              <span>PERSISTENT PROJECT MANAGEMENT REPOSITORY</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">{projects.length} SAVED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Saved Content Workspaces & Versions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Store, duplicate, version, and export your multi-platform scripts, video prompt blueprints, and audio assets.
            </p>
          </div>

          <button
            type="button"
            id="btn-projects-view-new"
            onClick={() => {
              onNewProject();
              onNavigate('Create');
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-cyan-500/20 whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW PROJECT</span>
          </button>
        </div>
      </div>

      {/* Filter, Search, and Sort Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d121c]/90 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name, title, keywords..."
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

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'READY', 'DRAFT'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                  statusFilter === status
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-3">
          <FolderArchive className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">No matching projects found</p>
          <p className="text-xs text-slate-500">Try changing your search query or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const isCurrent = p.id === activeProjectId;
            const isEditing = editingId === p.id;
            const isReady = p.status === 'READY' || p.status === 'GENERATED';

            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-5 shadow-xl transition-all flex flex-col justify-between gap-4 relative group ${
                  isCurrent
                    ? 'border-cyan-500/80 bg-gradient-to-b from-[#0e172a] to-[#090d16]'
                    : 'border-slate-800 bg-[#0d121c]/90 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isReady
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      {p.status}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Title / Rename input */}
                  {isEditing ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(e, p.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 px-2.5 py-1 bg-slate-950 border border-cyan-400 rounded-lg text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={(e) => handleSaveRename(e, p.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="p-1 text-slate-400 hover:text-slate-300 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white line-clamp-1 flex-1">
                        {p.name}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => handleStartRename(e, p)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-400 transition-opacity p-1 cursor-pointer"
                        title="Rename"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="truncate">Format: {p.settings.contentType} ({p.settings.videoFormat})</p>
                    <p className="truncate">Language: {p.settings.language} • {p.settings.duration}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Updated: {new Date(p.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDuplicateProject(p.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => exportProjectAsJson(p)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Export JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(p)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenProject(p);
                      onNavigate('Create');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Continue Project</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0e1626] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Project</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">"{projectToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
