import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface AllowlistEntry {
  email: string;
  name?: string;
  role: "OWNER" | "ADMIN" | "CREATOR" | "OPERATOR";
  addedAt: string;
  addedBy: string;
  notes?: string;
}

export interface AllowlistStore {
  ownerEmail: string;
  adminEmails: string[];
  allowedEmails: AllowlistEntry[];
  updatedAt: string;
}

export interface UserSessionPayload {
  email: string;
  name: string;
  avatar: string;
  role: "CREATOR COMMANDER" | "ADMIN" | "CREATOR";
  isOwner: boolean;
  isAdmin: boolean;
  token: string;
  expiresAt: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ALLOWLIST_FILE = path.join(DATA_DIR, "allowlist.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const SECRET_FILE = path.join(DATA_DIR, "session_secret.txt");

// Master owner fallback email from environment or default
const DEFAULT_OWNER_EMAIL = (
  process.env.OWNER_EMAIL ||
  process.env.ADMIN_EMAIL ||
  "andycrepto@gmail.com"
).toLowerCase().trim();

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Retrieves or initializes persistent HMAC session secret
 */
function getSessionSecret(): string {
  ensureDataDir();
  try {
    if (fs.existsSync(SECRET_FILE)) {
      const secret = fs.readFileSync(SECRET_FILE, "utf-8").trim();
      if (secret.length >= 32) return secret;
    }
  } catch (err) {
    console.warn("[ALLOWLIST] Error reading session secret, regenerating:", err);
  }

  const newSecret = crypto.randomBytes(64).toString("hex");
  try {
    fs.writeFileSync(SECRET_FILE, newSecret, "utf-8");
  } catch (err) {
    console.error("[ALLOWLIST] Failed to write session secret to disk:", err);
  }
  return newSecret;
}

const SESSION_SECRET = getSessionSecret();

// Active server sessions cache: token -> UserSessionPayload
const activeSessions = new Map<string, UserSessionPayload>();

/**
 * Loads persistent sessions from disk
 */
function loadPersistedSessions(): void {
  ensureDataDir();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
      const list: UserSessionPayload[] = JSON.parse(raw);
      const now = Date.now();
      for (const item of list) {
        if (item.token && item.email && item.expiresAt > now) {
          activeSessions.set(item.token, item);
        }
      }
      console.log(`[ALLOWLIST] Loaded ${activeSessions.size} active sessions from disk.`);
    }
  } catch (err) {
    console.warn("[ALLOWLIST] Failed to read sessions.json:", err);
  }
}

// Initial session load
loadPersistedSessions();

/**
 * Saves active sessions to disk atomically
 */
function savePersistedSessions(): void {
  ensureDataDir();
  try {
    const list = Array.from(activeSessions.values()).filter((s) => s.expiresAt > Date.now());
    const tmp = `${SESSIONS_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(list, null, 2), "utf-8");
    fs.renameSync(tmp, SESSIONS_FILE);
  } catch (err) {
    console.warn("[ALLOWLIST] Failed to persist sessions:", err);
  }
}

/**
 * Loads the allowlist from data/allowlist.json.
 */
export function loadAllowlist(): AllowlistStore {
  ensureDataDir();
  try {
    if (fs.existsSync(ALLOWLIST_FILE)) {
      const raw = fs.readFileSync(ALLOWLIST_FILE, "utf-8");
      const parsed: AllowlistStore = JSON.parse(raw);
      const owner = (parsed.ownerEmail || DEFAULT_OWNER_EMAIL).toLowerCase().trim();

      // Ensure owner is included in allowedEmails
      const hasOwnerInList = parsed.allowedEmails?.some(
        (e) => e.email.toLowerCase().trim() === owner
      );

      if (!hasOwnerInList) {
        parsed.allowedEmails = [
          {
            email: owner,
            name: "Andy Crepto",
            role: "OWNER",
            addedAt: new Date().toISOString(),
            addedBy: "SYSTEM",
            notes: "Master Project Owner",
          },
          ...(parsed.allowedEmails || []),
        ];
      }

      if (!parsed.adminEmails || !parsed.adminEmails.map((e) => e.toLowerCase().trim()).includes(owner)) {
        parsed.adminEmails = [owner, ...(parsed.adminEmails || [])];
      }

      return parsed;
    }
  } catch (err) {
    console.error("[ALLOWLIST] Error reading allowlist file:", err);
  }

  // Seed default if not exists
  const initialStore: AllowlistStore = {
    ownerEmail: DEFAULT_OWNER_EMAIL,
    adminEmails: [DEFAULT_OWNER_EMAIL],
    allowedEmails: [
      {
        email: DEFAULT_OWNER_EMAIL,
        name: "Andy Crepto",
        role: "OWNER",
        addedAt: new Date().toISOString(),
        addedBy: "SYSTEM_BOOT",
        notes: "Project Founder & Master Commander",
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  saveAllowlist(initialStore);
  return initialStore;
}

/**
 * Persists allowlist store to disk atomically.
 */
export function saveAllowlist(store: AllowlistStore): void {
  ensureDataDir();
  store.updatedAt = new Date().toISOString();
  const tmpFile = `${ALLOWLIST_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), "utf-8");
  fs.renameSync(tmpFile, ALLOWLIST_FILE);
}

/**
 * Validates email format.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

/**
 * Checks if a given email is on the server-side allowlist.
 * Returns exact role and permissions without guessing or bleeding identity.
 */
export function isEmailAuthorized(email: string): {
  authorized: boolean;
  entry?: AllowlistEntry;
  isOwner: boolean;
  isAdmin: boolean;
} {
  if (!email || typeof email !== "string") {
    return { authorized: false, isOwner: false, isAdmin: false };
  }

  const normalized = email.toLowerCase().trim();
  const store = loadAllowlist();
  const owner = store.ownerEmail.toLowerCase().trim();

  const isOwner = normalized === owner;
  const isAdmin =
    isOwner ||
    (store.adminEmails || []).some((a) => a.toLowerCase().trim() === normalized);

  const entry = (store.allowedEmails || []).find(
    (e) => e.email.toLowerCase().trim() === normalized
  );

  if (isOwner || entry) {
    return {
      authorized: true,
      entry: entry || {
        email: normalized,
        name: isOwner ? "Master Owner" : normalized.split("@")[0],
        role: isOwner ? "OWNER" : "CREATOR",
        addedAt: new Date().toISOString(),
        addedBy: "SYSTEM",
      },
      isOwner,
      isAdmin,
    };
  }

  return { authorized: false, isOwner: false, isAdmin: false };
}

/**
 * Adds an email to the allowlist (Admin or Owner only).
 */
export function addAuthorizedEmail(
  requesterEmail: string,
  newEmail: string,
  name?: string,
  role: "CREATOR" | "OPERATOR" | "ADMIN" = "CREATOR",
  notes?: string
): { success: boolean; error?: string; entry?: AllowlistEntry } {
  const check = isEmailAuthorized(requesterEmail);
  if (!check.authorized || (!check.isAdmin && !check.isOwner)) {
    return {
      success: false,
      error: "Unauthorized: Only Owner or Admin can manage authorized emails.",
    };
  }

  const cleanEmail = (newEmail || "").toLowerCase().trim();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: "Invalid email address format." };
  }

  const store = loadAllowlist();
  if (store.allowedEmails.some((e) => e.email.toLowerCase().trim() === cleanEmail)) {
    return {
      success: false,
      error: `Email '${cleanEmail}' is already authorized on the allowlist.`,
    };
  }

  const newEntry: AllowlistEntry = {
    email: cleanEmail,
    name: name?.trim() || cleanEmail.split("@")[0],
    role: role === "ADMIN" && check.isOwner ? "ADMIN" : "CREATOR",
    addedAt: new Date().toISOString(),
    addedBy: requesterEmail.toLowerCase().trim(),
    notes: notes?.trim() || undefined,
  };

  store.allowedEmails.push(newEntry);
  if (newEntry.role === "ADMIN" && !store.adminEmails.includes(cleanEmail)) {
    store.adminEmails.push(cleanEmail);
  }

  saveAllowlist(store);
  return { success: true, entry: newEntry };
}

/**
 * Removes an email from the allowlist (Admin or Owner only).
 */
export function removeAuthorizedEmail(
  requesterEmail: string,
  targetEmail: string
): { success: boolean; error?: string } {
  const check = isEmailAuthorized(requesterEmail);
  if (!check.authorized || (!check.isAdmin && !check.isOwner)) {
    return {
      success: false,
      error: "Unauthorized: Only Owner or Admin can manage authorized emails.",
    };
  }

  const cleanTarget = (targetEmail || "").toLowerCase().trim();
  const store = loadAllowlist();

  // Prevent removal of master owner
  if (cleanTarget === store.ownerEmail.toLowerCase().trim()) {
    return {
      success: false,
      error: "Forbidden: The Master Owner account cannot be removed from the allowlist.",
    };
  }

  // Non-owner admin cannot remove another admin or owner
  if (!check.isOwner && store.adminEmails.includes(cleanTarget)) {
    return {
      success: false,
      error: "Forbidden: Only the Master Owner can remove Admin accounts.",
    };
  }

  const initialCount = store.allowedEmails.length;
  store.allowedEmails = store.allowedEmails.filter(
    (e) => e.email.toLowerCase().trim() !== cleanTarget
  );
  store.adminEmails = store.adminEmails.filter(
    (a) => a.toLowerCase().trim() !== cleanTarget
  );

  if (store.allowedEmails.length === initialCount) {
    return {
      success: false,
      error: `Email '${cleanTarget}' was not found in the allowlist.`,
    };
  }

  saveAllowlist(store);

  // Invalidate any active sessions for the removed email
  let changed = false;
  for (const [token, sess] of activeSessions.entries()) {
    if (sess.email.toLowerCase().trim() === cleanTarget) {
      activeSessions.delete(token);
      changed = true;
    }
  }
  if (changed) {
    savePersistedSessions();
  }

  return { success: true };
}

/**
 * Creates and stores a session token specifically for the authenticated user.
 * Each token is bound exclusively to that user's email.
 */
export function createSessionToken(
  payload: Omit<UserSessionPayload, "token" | "expiresAt">
): string {
  const normalizedEmail = payload.email.toLowerCase().trim();
  const tokenBytes = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  const token = `ge_${tokenBytes}`;

  const sessionData: UserSessionPayload = {
    ...payload,
    email: normalizedEmail,
    token,
    expiresAt,
  };

  activeSessions.set(token, sessionData);
  savePersistedSessions();

  return token;
}

/**
 * Invalidates a session token (User Sign Out)
 */
export function invalidateSessionToken(tokenHeader: string | undefined): boolean {
  if (!tokenHeader) return false;
  const token = tokenHeader.startsWith("Bearer ")
    ? tokenHeader.substring(7).trim()
    : tokenHeader.trim();

  if (!token) return false;

  const deleted = activeSessions.delete(token);
  if (deleted) {
    savePersistedSessions();
  }
  return deleted;
}

/**
 * Verifies a session token.
 * Strictly verifies identity against the allowlist.
 * NEVER falls back to the Owner or another user!
 */
export function verifySessionToken(tokenHeader: string | undefined): UserSessionPayload | null {
  if (!tokenHeader) return null;

  const token = tokenHeader.startsWith("Bearer ")
    ? tokenHeader.substring(7).trim()
    : tokenHeader.trim();

  if (!token) return null;

  // 1. Look up in active server sessions
  let session = activeSessions.get(token);

  // 2. If not found in cache, reload from disk in case another worker saved it
  if (!session) {
    loadPersistedSessions();
    session = activeSessions.get(token);
  }

  if (!session) {
    return null;
  }

  // Check expiration
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    savePersistedSessions();
    return null;
  }

  // 3. Re-verify that user's email is STILL authorized on allowlist
  const check = isEmailAuthorized(session.email);
  if (!check.authorized) {
    console.warn(`[ALLOWLIST] Revoking session for '${session.email}': no longer authorized on allowlist.`);
    activeSessions.delete(token);
    savePersistedSessions();
    return null;
  }

  // Keep role & permissions up to date with latest allowlist state
  session.isOwner = check.isOwner;
  session.isAdmin = check.isAdmin;
  session.role = check.isOwner ? "CREATOR COMMANDER" : check.isAdmin ? "ADMIN" : "CREATOR";

  return session;
}
