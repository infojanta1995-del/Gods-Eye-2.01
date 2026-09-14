import React, { useState } from 'react';
import { GodsEyeLogo, GodsEyeLogoMode } from './GodsEyeLogo';
import {
  authenticateWithGoogle,
  authenticateAsGuest,
  GodseyeUser,
} from '../services/authService';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Radio,
  Cpu,
} from 'lucide-react';

interface GodsEyeLoginScreenProps {
  onLoginSuccess: (user: GodseyeUser) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const GodsEyeLoginScreen: React.FC<GodsEyeLoginScreenProps> = ({
  onLoginSuccess,
  onClose,
  isModal = false,
}) => {
  const [logoMode, setLogoMode] = useState<GodsEyeLogoMode>('idle');
  const [authStep, setAuthStep] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [authenticatedUser, setAuthenticatedUser] = useState<GodseyeUser | null>(null);
  const [telemetryMessage, setTelemetryMessage] = useState<string>('Ready for authentication');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trigger Google Authentication
  const handleContinueWithGoogle = async () => {
    setErrorMsg(null);
    setAuthStep('scanning');
    setLogoMode('scanning');
    setTelemetryMessage('Connecting to Google Identity Services...');

    try {
      setTimeout(() => {
        setLogoMode('generating');
        setTelemetryMessage('Validating identity credentials & security tokens...');
      }, 600);

      const user = await authenticateWithGoogle();

      setTimeout(() => {
        setAuthenticatedUser(user);
        setAuthStep('verified');
        setLogoMode('success');
        setTelemetryMessage('Authenticated: ' + user.email);
      }, 1200);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg('Google authentication encountered an issue. You may continue as Studio Operator.');
      setAuthStep('idle');
      setLogoMode('idle');
    }
  };

  // Instant Studio Operator Access
  const handleContinueAsGuest = async () => {
    setErrorMsg(null);
    setAuthStep('scanning');
    setLogoMode('scanning');
    setTelemetryMessage('Initializing Studio Operator session...');

    try {
      const user = await authenticateAsGuest();
      setTimeout(() => {
        setAuthenticatedUser(user);
        setAuthStep('verified');
        setLogoMode('success');
        setTelemetryMessage('Studio Operator session active');
      }, 700);
    } catch (err: any) {
      console.error('Guest login error:', err);
      setAuthStep('idle');
      setLogoMode('idle');
    }
  };

  const handleEnterStudio = () => {
    if (authenticatedUser) {
      onLoginSuccess(authenticatedUser);
    }
  };

  return (
    <div
      id="godseye-login-screen"
      className={`${
        isModal
          ? 'fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4'
          : 'min-h-screen bg-[#03060c] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden'
      }`}
    >
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        {/* The Golden Pyramid Eye Logo */}
        <div className="flex justify-center py-2">
          <GodsEyeLogo size="hero" mode={logoMode} showText={false} />
        </div>

        {/* Brand Headline matching Official Identity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-3xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 font-heading"
              style={{ textShadow: '0 0 25px rgba(245, 158, 11, 0.4)' }}
            >
              GOD'S
            </span>
            <span
              className="text-3xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-slate-300 font-heading"
              style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.3)' }}
            >
              EYE
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
              V2.0
            </span>
          </div>

          <p className="text-xs sm:text-sm font-mono tracking-widest text-cyan-300 uppercase">
            AI CREATOR INTELLIGENCE
          </p>
        </div>

        {/* System Telemetry readout during scanning */}
        {authStep === 'scanning' && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 animate-pulse">
            <Radio className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{telemetryMessage}</span>
          </div>
        )}

        {/* Verified User Card */}
        {authStep === 'verified' && authenticatedUser && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-emerald-950/70 border border-emerald-500/50 text-left flex items-center gap-3.5 animate-fadeIn shadow-xl shadow-emerald-950/30">
            <img
              src={authenticatedUser.avatar}
              alt={authenticatedUser.name}
              className="w-12 h-12 rounded-full border-2 border-emerald-400 object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Account</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate">{authenticatedUser.name}</h4>
              <p className="text-xs text-slate-400 truncate">{authenticatedUser.email}</p>
            </div>
          </div>
        )}

        {/* Error message if any */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 text-left">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {authStep !== 'verified' ? (
            <>
              {/* Primary: CONTINUE WITH GOOGLE */}
              <button
                type="button"
                id="btn-login-google"
                onClick={handleContinueWithGoogle}
                disabled={authStep === 'scanning'}
                className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all transform active:scale-98 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
              >
                {/* Official Google G Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="tracking-wide">CONTINUE WITH GOOGLE</span>
              </button>

              {/* Secondary: ENTER AS STUDIO OPERATOR (Instant Access) */}
              <button
                type="button"
                id="btn-login-guest"
                onClick={handleContinueAsGuest}
                disabled={authStep === 'scanning'}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enter as Studio Operator (Quick Access)</span>
              </button>
            </>
          ) : (
            /* ENTER GOD'S EYE STUDIO Button */
            <button
              type="button"
              id="btn-enter-studio"
              onClick={handleEnterStudio}
              className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all transform active:scale-98 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ENTER GOD'S EYE STUDIO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors pt-1 cursor-pointer"
            >
              Cancel & Return to Workspace
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="pt-4 border-t border-slate-800/80 space-y-1.5 text-slate-400 text-xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-300 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Secure account access</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Your connected platforms, channels, and saved projects remain associated with your private account.
          </p>
        </div>
      </div>
    </div>
  );
};
