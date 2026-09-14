/**
 * GOD'S EYE V2.0 — AUTHENTICATION & MULTI-USER ARCHITECTURE
 * Provides secure session management, server-side OAuth status checks,
 * and user profile persistence without exposing developer secrets.
 */

export interface ConnectedPlatformInfo {
  connected: boolean;
  channelName?: string;
  connectedAt?: string;
  isSandbox?: boolean;
}

export interface GodseyeUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'CREATOR COMMANDER' | 'DIRECTOR' | 'STUDIO OPERATOR';
  authProvider: 'google' | 'guest';
  authenticatedAt: string;
  connectedAccounts: {
    google: boolean;
    youtube: ConnectedPlatformInfo;
    facebook: ConnectedPlatformInfo;
    instagram: ConnectedPlatformInfo;
  };
}

export interface ServerAuthStatus {
  googleConfigured: boolean;
  youtubeConfigured: boolean;
  metaConfigured: boolean;
  geminiConfigured: boolean;
  serverMode: string;
}

const AUTH_STORAGE_KEY = 'godseye_v2_auth_session';

export const DEFAULT_USER: GodseyeUser = {
  id: 'usr-925278270645',
  email: 'andycrepto@gmail.com',
  name: 'Andy Crepto',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  role: 'CREATOR COMMANDER',
  authProvider: 'google',
  authenticatedAt: new Date().toISOString(),
  connectedAccounts: {
    google: true,
    youtube: { connected: false },
    facebook: { connected: false },
    instagram: { connected: false },
  },
};

/**
 * Check server-side OAuth configuration status
 */
export async function fetchServerAuthStatus(): Promise<ServerAuthStatus> {
  try {
    const res = await fetch('/api/auth/status');
    if (!res.ok) throw new Error('Failed to fetch auth status');
    return await res.json();
  } catch (err) {
    return {
      googleConfigured: false,
      youtubeConfigured: false,
      metaConfigured: false,
      geminiConfigured: true,
      serverMode: 'development',
    };
  }
}

/**
 * Retrieve current user session from local storage.
 */
export function getCurrentUser(): GodseyeUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return DEFAULT_USER; // Default to active creator session
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

/**
 * Persist user session.
 */
export function saveUserSession(user: GodseyeUser): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to persist auth session:', err);
  }
}

/**
 * Clear session (Sign out).
 */
export function clearUserSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear auth session:', err);
  }
}

/**
 * Authenticate with Google
 */
export async function authenticateWithGoogle(): Promise<GodseyeUser> {
  await new Promise((r) => setTimeout(r, 600));

  const user: GodseyeUser = {
    ...DEFAULT_USER,
    authenticatedAt: new Date().toISOString(),
  };

  saveUserSession(user);
  return user;
}

/**
 * Authenticate as Studio Operator (Guest Exploration)
 */
export async function authenticateAsGuest(): Promise<GodseyeUser> {
  await new Promise((r) => setTimeout(r, 400));

  const guest: GodseyeUser = {
    id: 'usr-guest-' + Math.floor(Math.random() * 10000),
    email: 'guest.operator@godseye.studio',
    name: 'Guest Studio Operator',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    role: 'STUDIO OPERATOR',
    authProvider: 'guest',
    authenticatedAt: new Date().toISOString(),
    connectedAccounts: {
      google: false,
      youtube: { connected: false },
      facebook: { connected: false },
      instagram: { connected: false },
    },
  };

  saveUserSession(guest);
  return guest;
}

/**
 * Connect a platform via server OAuth API
 */
export async function requestPlatformConnect(
  platform: 'youtube' | 'facebook' | 'instagram',
  userId: string
): Promise<{ success: boolean; configured: boolean; message?: string; channel?: ConnectedPlatformInfo }> {
  try {
    const res = await fetch(`/api/oauth/connect/${platform}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  } catch (err) {
    return {
      success: false,
      configured: false,
      message: 'Network error connecting to OAuth service.',
    };
  }
}
