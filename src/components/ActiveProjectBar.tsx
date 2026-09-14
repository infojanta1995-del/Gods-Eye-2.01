import React, { useState } from 'react';
import {
  Folder,
  Edit3,
  Check,
  X,
  Copy,
  Download,
  FileText,
  FileCode,
  CheckCircle2,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { GodseyeProject } from '../types';
import { exportProjectAsJson, exportProjectAsTxt } from '../services/projectStorage';

interface ActiveProjectBarProps {
  currentProject: GodseyeProject;
  onRenameProject: (newName: string) => void;
  onDuplicateProject: () => void;
  onNewProject: () => void;
  onOpenDrawer: () => void;
  isAutoSaving?: boolean;
}

export const ActiveProjectBar: React.FC<ActiveProjectBarProps> = ({
  currentProject,
  onRenameProject,
  onDuplicateProject,
  onNewProject,
  onOpenDrawer,
  isAutoSaving = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(currentProject.name);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleStartEdit = () => {
    setTempName(currentProject.name);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (tempName.trim() && tempName.trim() !== currentProject.name) {
      onRenameProject(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempName(currentProject.name);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
      {/* Left: Project Icon, Name & Status */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40 flex items-center justify-center flex-shrink-0">
          <Folder className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider hidden xs:inline">
            Active:
          </span>

          {isEditing ? (
            <div className="flex items-center gap-1.5 flex-1 max-w-sm">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
                className="w-full px-2 py-0.5 bg-slate-950 border border-cyan-500 rounded text-xs text-white font-semibold focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="p-1 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 cursor-pointer"
                title="Save Name"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0 group/name">
              <h3 className="font-bold text-white truncate font-sans text-xs sm:text-sm">
                {currentProject.name}
              </h3>
              <button
                type="button"
                onClick={handleStartEdit}
                className="p-1 text-slate-500 hover:text-cyan-300 opacity-60 group-hover/name:opacity-100 transition-opacity cursor-pointer"
                title="Edit Project Name"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider flex-shrink-0 border ${
              currentProject.status === 'READY'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
                : currentProject.status === 'GENERATED'
                ? 'bg-blue-950/80 text-blue-300 border-blue-800/50'
                : 'bg-amber-950/80 text-amber-300 border-amber-800/50'
            }`}
          >
            {currentProject.status}
          </span>
        </div>
      </div>

      {/* Right: Auto-save status & Quick buttons */}
      <div className="flex items-center gap-2 justify-between sm:justify-end flex-shrink-0">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="hidden md:inline">
            {isAutoSaving ? 'Saving...' : 'Auto-Saved'}
          </span>
        </span>

        <div className="flex items-center gap-1.5">
          {/* Duplicate button */}
          <button
            type="button"
            onClick={onDuplicateProject}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Duplicate Current Project"
          >
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Export Current Project"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {isExportOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsExportOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-30 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      exportProjectAsTxt(currentProject);
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Text Package (.txt)</div>
                      <div className="text-[10px] text-slate-400">Full scripts & prompts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportProjectAsJson(currentProject);
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                      <div className="font-semibold">JSON Data (.json)</div>
                      <div className="text-[10px] text-slate-400">Complete raw project</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Open Drawer / All Projects button */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/60 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Projects</span>
          </button>
        </div>
      </div>
    </div>
  );
};
