import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Terminal,
  Zap,
  Clock,
  User,
  Command as CommandIcon,
  Layers,
  ChevronDown,
  ShieldAlert,
  Sparkles,
  Palette,
} from 'lucide-react';
import { GodsEyeLogo } from '../GodsEyeLogo';
import { GodseyeUser } from '../../services/authService';
import { CoreProcessingState } from './JarvisAiCore';

interface SupercomputerTopBarProps {
  currentProjectName: string;
  coreState: CoreProcessingState;
  onOpenCommandPalette: () => void;
  onOpenNewContentModal: () => void;
  currentUser?: GodseyeUser | null;
  onOpenLogin?: () => void;
  onSignOut?: () => void;
  onNavigateHome: () => void;
  activeTabLabel: string;
  onOpenTheme?: () => void;
}

export const SupercomputerTopBar: React.FC<SupercomputerTopBarProps> = ({
  currentProjectName,
  coreState,
  onOpenCommandPalette,
  onOpenNewContentModal,
  currentUser,
  onOpenLogin,
  onSignOut,
  onNavigateHome,
  activeTabLabel,
  onOpenTheme,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 border-b border-cyan-950/80 bg-[#040810]/95 backdrop-blur-2xl sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between gap-4 font-mono select-none">
      {/* 1. BRAND IDENTITY & OPERATING SYSTEM STATUS */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left cursor-pointer group hover:opacity-90 transition-opacity"
          title="Return to Supercomputer Command Core"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:border-cyan-400">
            <Cpu className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
              <span>GODSEYE</span>
              <span className="text-[10px] text-cyan-400 font-semibold px-1 py-0.2 rounded bg-cyan-950/90 border border-cyan-800/60">
                AI CORE
              </span>
            </div>
            <div className="text-[9px] text-cyan-500/70 tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-cyan-900/40 hidden md:block" />

        {/* Active Project Telemetry */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-[10px] text-slate-500 uppercase">ACTIVE MATRIX:</span>
          <span className="text-slate-200 font-medium truncate max-w-[180px] lg:max-w-[260px] text-[11px] px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
            {currentProjectName || 'DEFAULT_QUANTUM_WORKSPACE'}
          </span>
        </div>
      </div>

      {/* 2. CENTER: PROCESSING STATUS & ACTIVE SUBSYSTEM */}
      <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07111e] border border-cyan-900/60 text-[11px]">
          <Activity
            className={`w-3.5 h-3.5 ${
              coreState === 'idle'
                ? 'text-cyan-400'
                : coreState === 'error'
                ? 'text-rose-400'
                : 'text-amber-400 animate-spin'
            }`}
          />
          <span className="text-slate-400 text-[10px]">CORE STATUS:</span>
          <span
            className={`font-bold uppercase text-[10px] ${
              coreState === 'idle'
                ? 'text-cyan-300'
                : coreState === 'error'
                ? 'text-rose-300'
                : 'text-amber-300'
            }`}
          >
            {coreState}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 text-[10px] font-semibold">{activeTabLabel}</span>
        </div>
      </div>

      {/* 3. RIGHT CONTROLS: TIME, COMMAND TRIGGER, USER */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {/* System Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#07111e] border border-cyan-950 text-cyan-400/90 text-xs">
          <Clock className="w-3.5 h-3.5 text-cyan-500" />
          <span>{timeStr || '00:00:00'}</span>
        </div>

        {/* Launch New Creation Workflow Button */}
        <button
          type="button"
          onClick={onOpenNewContentModal}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">NEW CONTENT</span>
        </button>

        {/* Theme Lab Trigger */}
        {onOpenTheme && (
          <button
            type="button"
            onClick={onOpenTheme}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
            title="Theme Matrix & Visuals"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-[10px] text-amber-300/90">THEME</span>
          </button>
        )}

        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs"
          title="Open Command Console (CTRL/CMD + K)"
        >
          <CommandIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline text-[10px] text-slate-400">CTRL+K</span>
        </button>

        {/* User Profile / Access */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold border border-cyan-400/50">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#070e1b] border border-cyan-900/80 shadow-2xl p-2 z-50 text-xs">
              <div className="p-2 border-b border-slate-800 text-slate-300">
                <p className="font-bold text-white truncate">{currentUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-cyan-400 font-mono">LEVEL 4 SECURITY</p>
              </div>
              <div className="py-1">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onSignOut && onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/30 rounded-lg cursor-pointer transition-colors"
                  >
                    Disconnect Session
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenLogin && onOpenLogin();
                    }}
                    className="w-full text-left px-3 py-2 text-cyan-400 hover:bg-cyan-950/30 rounded-lg cursor-pointer transition-colors"
                  >
                    Authorize User
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
