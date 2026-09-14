import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Calendar,
  Layers,
  Sparkles,
  X,
  AlertTriangle,
  FileText,
  FileCode,
  Edit2,
  Check,
  Tag,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';
import { GodseyeProject, ProjectStatus } from '../types';
import { exportProjectAsJson, exportProjectAsTxt } from '../services/projectStorage';

interface ProjectHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: GodseyeProject[];
  activeProjectId: string | null;
  onOpenProject: (project: GodseyeProject) => void;
  onNewProject: () => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
}

export const ProjectHistoryDrawer: React.FC<ProjectHistoryDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onOpenProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProjectStatus>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [projectToDelete, setProjectToDelete] = useState<GodseyeProject | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Filter, Search & Sort Logic
  const filteredProjects = useMemo(() => {
    const list = projects.filter((p) => {
      // Status filter
      if (statusFilter !== 'ALL' && p.status !== statusFilter) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const nameMatch = (p.name || '').toLowerCase().includes(q);
      const titleMatch = (p.article?.title || '').toLowerCase().includes(q);
      const contentTypeMatch = (p.settings?.contentType || '').toLowerCase().includes(q);
      const platformMatch =
        p.settings?.platforms?.some((pl) => (pl || '').toLowerCase().includes(q)) ?? false;

      // Check keywords if content exists
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content panel */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-[#0c1017] border-r border-slate-800 h-full shadow-2xl flex flex-col z-10">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                  GODSEYE PROJECTS
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {projects.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage, reopen, duplicate, and export content packages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Close Projects Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar: + NEW PROJECT and Search */}
        <div className="p-4 border-b border-slate-800/60 space-y-3 bg-slate-900/30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onNewProject();
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ NEW PROJECT</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, title, keywords, platform..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter pills & sort dropdown */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['ALL', 'READY', 'GENERATED', 'DRAFT'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 pl-2 border-l border-slate-800 flex-shrink-0">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3 my-4">
              <FolderArchive className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                {searchQuery ? 'No matching projects found' : 'No saved projects yet'}
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {searchQuery
                  ? 'Try adjusting your search keywords or status filter.'
                  : 'Generate content or click "+ NEW PROJECT" to start your first story package.'}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onNewProject();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-xs font-semibold hover:bg-cyan-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Start First Project
                </button>
              )}
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isActive = project.id === activeProjectId;
              const isEditing = editingId === project.id;
              const formattedDate = new Date(project.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    onOpenProject(project);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900/80 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Status & Active Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono border ${
                          project.status === 'READY'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
                            : project.status === 'GENERATED'
                            ? 'bg-blue-950/80 text-blue-300 border-blue-800/50'
                            : 'bg-amber-950/80 text-amber-300 border-amber-800/50'
                        }`}
                      >
                        {project.status}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                          CURRENT
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                  </div>

                  {/* Project Name (with Inline Edit) */}
                  <div className="mb-2">
                    {isEditing ? (
                      <div
                        className="flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(e, project.id);
                            if (e.key === 'Escape') handleCancelRename(e as any);
                          }}
                          autoFocus
                          className="flex-1 px-2 py-1 bg-slate-950 border border-cyan-500 rounded text-xs text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleSaveRename(e, project.id)}
                          className="p-1 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 cursor-pointer"
                          title="Save Name"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelRename}
                          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group/title">
                        <h3 className="text-sm font-bold text-white line-clamp-1 font-sans">
                          {project.name}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(e, project)}
                          className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-cyan-300 transition-opacity cursor-pointer"
                          title="Rename Project"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Story Title & Meta Details */}
                  {project.article.title && project.article.title !== project.name && (
                    <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                      Article: {project.article.title}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {project.settings.contentType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {project.settings.videoFormat}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {project.settings.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {project.settings.language}
                    </span>
                  </div>

                  {/* Card Action Buttons */}
                  <div
                    className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      {/* OPEN button */}
                      <button
                        type="button"
                        onClick={() => {
                          onOpenProject(project);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold border border-cyan-500/30 text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>OPEN</span>
                      </button>

                      {/* DUPLICATE button */}
                      <button
                        type="button"
                        onClick={() => onDuplicateProject(project.id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Duplicate Project"
                      >
                        <Copy className="w-3 h-3" />
                        <span className="hidden sm:inline">DUPLICATE</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* EXPORT Dropdown / Buttons */}
                      <button
                        type="button"
                        onClick={() => exportProjectAsTxt(project)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Export as TXT Package"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => exportProjectAsJson(project)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="Export as JSON"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                      </button>

                      {/* DELETE button */}
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(project)}
                        className="p-1.5 rounded hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Auto-saves locally</span>
          <span>{projects.length} Saved {projects.length === 1 ? 'Project' : 'Projects'}</span>
        </div>
      </div>

      {/* Confirmation Modal for Project Deletion */}
      {projectToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0f141f] border border-red-900/50 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Delete this GODSEYE project?
                </h3>
                <p className="text-xs text-slate-400">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p>
                <strong className="text-white">Project:</strong> {projectToDelete.name}
              </p>
              <p className="text-slate-400 text-[11px]">
                Created: {new Date(projectToDelete.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
              >
                DELETE PROJECT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
