import React from 'react';
import {
  FolderArchive,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Video,
} from 'lucide-react';
import { GodseyeProject } from '../types';

interface DashboardSummaryProps {
  projects: GodseyeProject[];
  activeProjectId: string | null;
  onOpenProjectsList: () => void;
  onOpenProject: (project: GodseyeProject) => void;
  onNewProject: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  projects,
  activeProjectId,
  onOpenProjectsList,
  onOpenProject,
  onNewProject,
}) => {
  const totalProjects = projects.length;

  // Find last generated project (most recent with status === 'READY' or 'GENERATED')
  const lastGenerated = projects.find(
    (p) => p.status === 'READY' || p.status === 'GENERATED'
  );

  // Top 3 recent projects
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0d1424]/90 to-slate-900/90 border border-slate-800/80 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-heading">
                GODSEYE PROJECT REPOSITORY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {totalProjects} {totalProjects === 1 ? 'Project' : 'Projects'} Saved
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant access to your saved scripts, scenes, prompts & multi-platform packages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <button
            type="button"
            onClick={onNewProject}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ NEW PROJECT</span>
          </button>

          <button
            type="button"
            onClick={onOpenProjectsList}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 hover:text-white border border-slate-700/70 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Last Generated Project Highlight & Recent Projects Quick Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Card 1 & 2: Last Generated Project */}
        <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Last Generated Project
            </span>
            {lastGenerated && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                {lastGenerated.status}
              </span>
            )}
          </div>

          {lastGenerated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {lastGenerated.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>{lastGenerated.settings.contentType}</span>
                  <span>•</span>
                  <span>{lastGenerated.settings.duration}</span>
                  <span>•</span>
                  <span>{lastGenerated.settings.videoFormat}</span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono">
                    {new Date(lastGenerated.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenProject(lastGenerated)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-800/50 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Open Project</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="text-slate-500 text-xs py-2">
              No generated projects yet. Enter an article below and click "GENERATE GODSEYE CONTENT" to create your first package.
            </div>
          )}
        </div>

        {/* Card 3: Recent Projects List */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Recent Stories
            </span>
            <button
              type="button"
              onClick={onOpenProjectsList}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              All ({totalProjects})
            </button>
          </div>

          <div className="space-y-1.5">
            {recentProjects.length === 0 ? (
              <p className="text-slate-500 text-[11px] py-1">No recent projects found.</p>
            ) : (
              recentProjects.map((p) => {
                const isCurrent = p.id === activeProjectId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onOpenProject(p)}
                    className={`w-full text-left p-1.5 rounded-lg text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/40'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="truncate max-w-[160px] font-medium">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2 flex-shrink-0">
                      {p.settings.duration}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
