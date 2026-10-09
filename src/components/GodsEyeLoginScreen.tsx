import React, { useState, useEffect, useRef } from 'react';
import { GodsEyeLogo, GodsEyeLogoMode } from './GodsEyeLogo';
import {
  verifyGoogleWithServer,
  getRecentAccounts,
  removeRecentAccount,
  fetchServerAuthStatus,
  GodseyeUser,
  RecentGoogleAccount,
} from '../services/authService';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowRight,
  Radio,
  Mail,
  RefreshCw,
  User,
  Trash2,
  Plus,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

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
  const [authStep, setAuthStep] = useState<'idle' | 'scanning' | 'verified' | 'denied'>('idle');
  const [authenticatedUser, setAuthenticatedUser] = useState<GodseyeUser | null>(null);
  const [telemetryMessage, setTelemetryMessage] = useState<string>('Ready for authentication');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testedEmail, setTestedEmail] = useState<string>('');

  // Account Picker / Modal State
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [manualEmailInput, setManualEmailInput] = useState('');
  const [manualNameInput, setManualNameInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Recent accounts on this browser
  const [recentAccounts, setRecentAccounts] = useState<RecentGoogleAccount[]>([]);
  const [googleClientId, setGoogleClientId] = useState<string | undefined>(undefined);
  const gsiContainerRef = useRef<HTMLDivElement>(null);

  // Load recent accounts on mount & check server config
  useEffect(() => {
    setRecentAccounts(getRecentAccounts());
    fetchServerAuthStatus().then((status) => {
      if (status.googleClientId) {
        setGoogleClientId(status.googleClientId);
      }
    });
  }, []);

  // Initialize Google Identity Services (GSI) if available
  useEffect(() => {
    if (typeof window === 'undefined' || !window.google?.accounts?.id || !googleClientId) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (gsiContainerRef.current) {
        window.google.accounts.id.renderButton(gsiContainerRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          width: 340,
          text: 'signin_with',
        });
      }
    } catch (err) {
      console.warn('[GODSEYE AUTH] Google Identity Services init notice:', err);
    }
  }, [googleClientId, authStep]);

  // Handle real Google JWT Credential from Google Identity Services
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) return;

    setAuthStep('scanning');
    setLogoMode('scanning');
    setTelemetryMessage('Authenticating Google token with server allowlist...');

    try {
      const result = await verifyGoogleWithServer({
        email: '', // Server extracts verified email from JWT
        credential: response.credential,
      });

      handleVerificationResult(result, result.email || 'Google account');
    } catch (err: any) {
      setAuthStep('denied');
      setLogoMode('idle');
      setErrorMessage(err?.message || 'Failed to authenticate Google token.');
    }
  };

  // Perform backend verification for a specific Google Account identity
  const verifySpecificGoogleAccount = async (targetEmail: string, displayName?: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid Google email address.');
      return;
    }

    setShowAccountSelector(false);
    setErrorMessage(null);
    setAuthStep('scanning');
    setLogoMode('scanning');
    setTestedEmail(cleanEmail);
    setTelemetryMessage(`Authenticating Google Identity: ${cleanEmail}...`);

    try {
      setTimeout(() => {
        setLogoMode('generating');
        setTelemetryMessage(`Validating authorization for: ${cleanEmail}...`);
      }, 400);

      const result = await verifyGoogleWithServer({
        email: cleanEmail,
        name: displayName || cleanEmail.split('@')[0],
      });

      handleVerificationResult(result, cleanEmail);
    } catch (err: any) {
      setAuthStep('denied');
      setLogoMode('idle');
      setErrorMessage(err?.message || 'Access verification failed.');
    }
  };

  // Process server verification outcome
  const handleVerificationResult = (result: any, userEmail: string) => {
    setTestedEmail(userEmail);

    if (!result.success || !result.authorized || !result.user) {
      setAuthStep('denied');
      setLogoMode('idle');
      setErrorMessage(
        result.error ||
          `Access denied. Your Google account (${userEmail}) is not authorized to use this application.`
      );
      return;
    }

    // Authorization SUCCESS: Bind exact user identity
    setAuthenticatedUser(result.user);
    setAuthStep('verified');
    setLogoMode('success');
    setTelemetryMessage(`Authorized & Verified: ${result.user.email}`);

    // Refresh local recent accounts list
    setRecentAccounts(getRecentAccounts());
  };

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmailInput.trim()) {
      setErrorMessage('Please enter a Google email address.');
      return;
    }
    verifySpecificGoogleAccount(manualEmailInput.trim(), manualNameInput.trim());
  };

  const handleRemoveRecent = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    removeRecentAccount(email);
    setRecentAccounts(getRecentAccounts());
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
          ? 'fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4'
          : 'min-h-screen bg-[#02050c] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden'
      }`}
    >
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-b from-amber-500/10 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        {/* Golden Pyramid Eye Logo */}
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
              V3.0
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-xs sm:text-sm font-mono tracking-widest text-cyan-300 uppercase">
              PRIVATE ACCESS CONTROL • ALLOWLIST ENFORCED
            </p>
          </div>
        </div>

        {/* System Telemetry readout during scanning */}
        {authStep === 'scanning' && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 animate-pulse shadow-lg shadow-cyan-950/40">
            <Radio className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{telemetryMessage}</span>
          </div>
        )}

        {/* SUCCESS / VERIFIED USER CARD */}
        {authStep === 'verified' && authenticatedUser && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border border-emerald-500/60 text-left flex items-center gap-3.5 animate-fadeIn shadow-2xl shadow-emerald-950/50">
            <img
              src={authenticatedUser.avatar}
              alt={authenticatedUser.name}
              className="w-12 h-12 rounded-full border-2 border-emerald-400 object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ALLOWLIST VERIFIED • {authenticatedUser.role}</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate">{authenticatedUser.name}</h4>
              <p className="text-xs text-slate-300 truncate font-mono">{authenticatedUser.email}</p>
            </div>
          </div>
        )}

        {/* ACCESS DENIED STATE (Mandatory: clear message, denies access completely) */}
        {authStep === 'denied' && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-left space-y-3 animate-fadeIn shadow-xl shadow-rose-950/40">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300 border border-rose-600/50 flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-rose-200 uppercase tracking-wide font-mono">
                  Access Denied
                </h4>
                <p className="text-xs text-rose-300 font-medium leading-relaxed">
                  Your Google account (<span className="font-mono text-white underline">{testedEmail || 'provided email'}</span>) is not authorized to use this application.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/60 border border-rose-900/50 text-[11px] text-slate-300 font-mono space-y-1">
              <p className="text-rose-400 font-bold">SECURITY ENFORCEMENT ACTIVE:</p>
              <p>• Only email addresses explicitly added to the server allowlist can use GOD'S EYE V3.0.</p>
              <p>• Please ask the application administrator to authorize your email address.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthStep('idle');
                setErrorMessage(null);
                setShowAccountSelector(true);
                setShowManualInput(true);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try a different Google account</span>
            </button>
          </div>
        )}

        {/* Interactive Action Area */}
        <div className="space-y-3 pt-2">
          {authStep !== 'verified' && authStep !== 'denied' && (
            <>
              {/* Optional GSI Container if Google One Tap is loaded */}
              <div ref={gsiContainerRef} className="flex justify-center empty:hidden" />

              {/* Primary Google Login Button (Opens Account Selector / Prompt) */}
              <button
                type="button"
                id="btn-login-google"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.google?.accounts?.id && googleClientId) {
                    try {
                      window.google.accounts.id.prompt();
                    } catch {}
                  }
                  setShowAccountSelector(true);
                }}
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
                <span className="tracking-wide uppercase">Sign In with Google Account</span>
              </button>
            </>
          )}

          {authStep === 'verified' && (
            /* ENTER GOD'S EYE STUDIO Button */
            <button
              type="button"
              id="btn-enter-studio"
              onClick={handleEnterStudio}
              className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all transform active:scale-98 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ACCESS GOD'S EYE STUDIO WORKSPACE</span>
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
            <span>Private Deployment Access Control</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Only explicit authorized emails configured by the application owner have permission to access system intelligence and generation models.
          </p>
        </div>
      </div>

      {/* GOOGLE ACCOUNT SELECTION MODAL */}
      {showAccountSelector && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c121e] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative text-left animate-fadeIn space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Choose a Google Account</h3>
                  <p className="text-xs text-slate-400">to continue to GOD'S EYE V3.0</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountSelector(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            {/* Previously Used Accounts on THIS Browser */}
            {recentAccounts.length > 0 && !showManualInput && (
              <div className="space-y-2">
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Select an account
                </p>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {recentAccounts.map((acc) => (
                    <div
                      key={acc.email}
                      onClick={() => verifySpecificGoogleAccount(acc.email, acc.name)}
                      className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-cyan-400"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{acc.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{acc.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(e, acc.email)}
                          title="Remove from this browser list"
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManualInput(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-cyan-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Use another Google account</span>
                  </button>
                </div>
              </div>
            )}

            {/* Enter Google Email (For new device or other account) */}
            {(recentAccounts.length === 0 || showManualInput) && (
              <form onSubmit={handleManualFormSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">
                    YOUR GOOGLE ACCOUNT EMAIL *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={manualEmailInput}
                      onChange={(e) => setManualEmailInput(e.target.value)}
                      placeholder="your.email@gmail.com"
                      autoFocus
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Enter the Google email address that was added to the application's allowlist.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 block">
                    NAME / DISPLAY NAME (OPTIONAL)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={manualNameInput}
                      onChange={(e) => setManualNameInput(e.target.value)}
                      placeholder="Your Name"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {recentAccounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowManualInput(false)}
                      className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <span>Sign In with this Google Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Note */}
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              <p>
                Authorization check is performed server-side. Unlisted emails will be rejected with an Access Denied response.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
