import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  Cpu,
  User,
  LogOut,
  ChevronDown,
  Sliders,
  Sparkles,
  Command,
} from 'lucide-react';
import { GodsEyeLogo } from './GodsEyeLogo';
import { GodseyeUser } from '../services/authService';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset: () => void;
  projectsCount?: number;
  onOpenProjects?: () => void;
  onNewProject?: () => void;
  onOpenTheme?: () => void;
  currentProjectName?: string;
  currentProjectStatus?: 'DRAFT' | 'GENERATED' | 'READY';
  currentWorkflowStep?: string;
  onOpenCommandPalette?: () => void;
  onToggleRightPanel?: () => void;
  isRightPanelOpen?: boolean;
  currentUser?: GodseyeUser | null;
  onOpenLogin?: () => void;
  onSignOut?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onReset,
  projectsCount = 0,
  onOpenProjects,
  onNewProject,
  onOpenTheme,
  currentProjectName = 'Untitled Project',
  currentProjectStatus = 'DRAFT',
  currentWorkflowStep = 'Create Studio',
  onOpenCommandPalette,
  onToggleRightPanel,
  isRightPanelOpen = false,
  currentUser,
  onOpenLogin,
  onSignOut,
  onNavigateTab,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070a12]/95 backdrop-blur-2xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xl shadow-black/50">
      {/* 1. BRAND IDENTITY & OFFICIAL LOGO (Left) */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('Dashboard')}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
          title="Return to Command Center"
        >
          <GodsEyeLogo size="sm" mode="idle" showText={true} />
        </button>
      </div>

      {/* 2. CENTER: SEARCH BAR (Matching Reference Image 2) */}
      <div className="flex-1 max-w-xl hidden md:flex items-center justify-center">
        <div
          onClick={onOpenCommandPalette}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 transition-all cursor-pointer group shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xs text-slate-400 group-hover:text-slate-300 flex-1">
            Search projects, topics, or commands...
          </span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 3. RIGHT CONTROLS: AI STATUS, NOTIFICATIONS, USER PROFILE (Matching Reference Image 2) */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Gemini Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800/90 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
          <span className="font-semibold text-slate-200 text-[11px]">Gemini 3.8</span>
          <span className="text-emerald-400 text-[11px] font-mono font-medium">Online</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          id="btn-header-notifications"
          className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
        </button>

        {/* Right Contextual AI Panel Toggle */}
        <button
          type="button"
          id="btn-toggle-contextual-panel"
          onClick={onToggleRightPanel}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isRightPanelOpen
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Contextual Intelligence Panel"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User Profile Pill (Matching Reference Image 2) */}
        <div className="relative">
          <button
            type="button"
            id="btn-header-user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
              }
              alt="User Avatar"
              className="w-7 h-7 rounded-full border border-amber-500/60 object-cover"
            />
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-slate-200 block leading-tight group-hover:text-amber-300">
                {currentUser?.name || 'Creator'}
              </span>
              <span className="text-[10px] text-amber-400/90 font-mono block leading-none">
                {currentUser?.role === 'CREATOR COMMANDER' ? 'Pro Plan' : 'Free Plan'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="font-bold text-white">{currentUser?.name || 'Authorized Creator'}</p>
                <p className="text-slate-400 text-[11px] truncate">
                  {currentUser?.email || 'Authenticated User'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                  {currentUser?.role || 'CREATOR'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  if (onNavigateTab) onNavigateTab('Account');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Account & Plan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  if (onNavigateTab) onNavigateTab('Connected Accounts');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Connected Platforms</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  if (onOpenTheme) onOpenTheme();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Customize Theme</span>
              </button>

              <div className="border-t border-slate-800 my-1 pt-1">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onSignOut) onSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenLogin) onOpenLogin();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-amber-300 hover:bg-amber-950/40 transition-colors text-left cursor-pointer font-semibold"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In with Google</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
