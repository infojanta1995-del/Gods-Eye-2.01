/**
 * GOD'S EYE V3.0 — MULTI-USER AUTHENTICATION & ALLOWLIST SERVICE
 * Strictly separates Authentication (identifying the user via Google)
 * from Authorization (verifying whether their email is on the server allowlist).
 * Ensures zero identity bleeding across devices and accounts.
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
  role: 'CREATOR COMMANDER' | 'ADMIN' | 'CREATOR' | 'STUDIO OPERATOR';
  authProvider: 'google' | 'guest';
  isOwner?: boolean;
  isAdmin?: boolean;
  token?: string;
  authenticatedAt: string;
  connectedAccounts: {
    google: boolean;
    youtube: ConnectedPlatformInfo;
    facebook: ConnectedPlatformInfo;
    instagram: ConnectedPlatformInfo;
  };
}

export interface AllowlistEntry {
  email: string;
  name?: string;
  role: 'OWNER' | 'ADMIN' | 'CREATOR' | 'OPERATOR';
  addedAt: string;
  addedBy: string;
  notes?: string;
}

export interface AllowlistResponse {
  success: boolean;
  ownerEmail: string;
  adminEmails: string[];
  allowedEmails: AllowlistEntry[];
  totalCount: number;
  requesterIsOwner: boolean;
  updatedAt: string;
  error?: string;
}

export interface ServerAuthStatus {
  googleConfigured: boolean;
  googleClientId?: string;
  youtubeConfigured: boolean;
  metaConfigured: boolean;
  geminiConfigured: boolean;
  serverMode: string;
}

export interface RecentGoogleAccount {
  email: string;
  name: string;
  avatar: string;
  lastUsedAt: string;
}

const AUTH_STORAGE_KEY = 'godseye_v2_auth_session';
const TOKEN_STORAGE_KEY = 'godseye_auth_token';
const RECENT_ACCOUNTS_KEY = 'godseye_recent_google_accounts';

/**
 * Retrieve active session token from local storage.
 */
export function getStoredAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Set active session token.
 */
export function setStoredAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (err) {
    console.warn('Failed to store auth token:', err);
  }
}

/**
 * Check server-side OAuth and system configuration status
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
    if (!raw) return null;
    const user: GodseyeUser = JSON.parse(raw);
    return user;
  } catch {
    return null;
  }
}

/**
 * Retrieve previously authenticated accounts on this browser.
 */
export function getRecentAccounts(): RecentGoogleAccount[] {
  try {
    const raw = localStorage.getItem(RECENT_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save account to local browser recent accounts list.
 */
export function saveRecentAccount(account: { email: string; name: string; avatar?: string }): void {
  try {
    const list = getRecentAccounts().filter(
      (a) => a.email.toLowerCase() !== account.email.toLowerCase()
    );
    list.unshift({
      email: account.email.toLowerCase().trim(),
      name: account.name || account.email.split('@')[0],
      avatar:
        account.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80`,
      lastUsedAt: new Date().toISOString(),
    });
    // Keep max 5 recent accounts
    localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(list.slice(0, 5)));
  } catch (err) {
    console.warn('Failed to save recent account:', err);
  }
}

/**
 * Remove an account from local recent accounts list.
 */
export function removeRecentAccount(email: string): void {
  try {
    const list = getRecentAccounts().filter(
      (a) => a.email.toLowerCase() !== email.toLowerCase()
    );
    localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to remove recent account:', err);
  }
}

/**
 * Persist user session.
 */
export function saveUserSession(user: GodseyeUser): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    if (user.token) {
      setStoredAuthToken(user.token);
    }
    saveRecentAccount({
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });
  } catch (err) {
    console.warn('Failed to persist auth session:', err);
  }
}

/**
 * Clear session (Sign out).
 */
export function clearUserSession(): void {
  const token = getStoredAuthToken();
  if (token) {
    // Notify server to revoke session
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear auth session:', err);
  }
}

/**
 * Validate active session with server. If expired or unauthorized, clears local session.
 */
export async function validateServerSession(): Promise<GodseyeUser | null> {
  const token = getStoredAuthToken();
  if (!token) {
    return null;
  }

  try {
    const res = await fetch('/api/auth/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      clearUserSession();
      return null;
    }

    const data = await res.json();
    if (data.success && data.authorized && data.user) {
      const refreshedUser: GodseyeUser = {
        ...data.user,
        token,
      };
      saveUserSession(refreshedUser);
      return refreshedUser;
    }

    clearUserSession();
    return null;
  } catch (err) {
    console.warn('Error validating session with server:', err);
    return getCurrentUser();
  }
}

export interface GoogleAuthPayload {
  email: string;
  name?: string;
  avatar?: string;
  credential?: string;
  idToken?: string;
}

export interface AuthVerificationResult {
  success: boolean;
  authorized: boolean;
  email?: string;
  user?: GodseyeUser;
  error?: string;
}

/**
 * Verifies a Google account with the backend server against the private allowlist.
 */
export async function verifyGoogleWithServer(payload: GoogleAuthPayload): Promise<AuthVerificationResult> {
  try {
    const res = await fetch('/api/auth/google-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.authorized) {
      return {
        success: false,
        authorized: false,
        email: data.email || payload.email,
        error:
          data.error ||
          `Access denied. Your Google account (${payload.email}) is not authorized to use this application.`,
      };
    }

    const user: GodseyeUser = {
      ...data.user,
      token: data.token,
    };

    saveUserSession(user);
    if (data.token) {
      setStoredAuthToken(data.token);
    }

    return {
      success: true,
      authorized: true,
      email: user.email,
      user,
    };
  } catch (err: any) {
    return {
      success: false,
      authorized: false,
      email: payload.email,
      error: err?.message || 'Server connection failed while verifying Google account.',
    };
  }
}

/**
 * Fetch all authorized emails (Admin / Owner only)
 */
export async function fetchAuthorizedEmails(): Promise<AllowlistResponse> {
  const token = getStoredAuthToken();
  try {
    const res = await fetch('/api/admin/allowlist', {
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch authorized emails.');
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      ownerEmail: '',
      adminEmails: [],
      allowedEmails: [],
      totalCount: 0,
      requesterIsOwner: false,
      updatedAt: new Date().toISOString(),
      error: err?.message || 'Failed to retrieve allowlist from server.',
    };
  }
}

/**
 * Add a new email to the server allowlist (Admin / Owner only)
 */
export async function addAuthorizedEmail(params: {
  email: string;
  name?: string;
  role?: 'CREATOR' | 'OPERATOR' | 'ADMIN';
  notes?: string;
}): Promise<{ success: boolean; entry?: AllowlistEntry; error?: string; message?: string }> {
  const token = getStoredAuthToken();
  try {
    const res = await fetch('/api/admin/allowlist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to add email to allowlist.' };
    }

    return {
      success: true,
      entry: data.entry,
      message: data.message,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error adding email.' };
  }
}

/**
 * Remove an email from the server allowlist (Admin / Owner only)
 */
export async function removeAuthorizedEmail(
  email: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const token = getStoredAuthToken();
  try {
    const res = await fetch('/api/admin/allowlist/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to remove email from allowlist.' };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error removing email.' };
  }
}

/**
 * Connect a platform via server OAuth API
 */
export async function requestPlatformConnect(
  platform: 'youtube' | 'facebook' | 'instagram',
  userId: string
): Promise<{ success: boolean; configured: boolean; message?: string; channel?: ConnectedPlatformInfo }> {
  const token = getStoredAuthToken();
  try {
    const res = await fetch(`/api/oauth/connect/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
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
