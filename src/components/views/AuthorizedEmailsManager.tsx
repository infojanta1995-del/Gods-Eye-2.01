import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Trash2,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  KeyRound,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  fetchAuthorizedEmails,
  addAuthorizedEmail,
  removeAuthorizedEmail,
  AllowlistEntry,
  GodseyeUser,
} from '../../services/authService';

interface AuthorizedEmailsManagerProps {
  currentUser: GodseyeUser | null;
}

export const AuthorizedEmailsManager: React.FC<AuthorizedEmailsManagerProps> = ({
  currentUser,
}) => {
  const [allowedEmails, setAllowedEmails] = useState<AllowlistEntry[]>([]);
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New email form states
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'CREATOR' | 'OPERATOR' | 'ADMIN'>('CREATOR');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation dialog
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnerOrAdmin = Boolean(
    currentUser?.isOwner ||
    currentUser?.isAdmin ||
    currentUser?.role === 'CREATOR COMMANDER' ||
    (ownerEmail && currentUser?.email && currentUser.email.toLowerCase() === ownerEmail.toLowerCase())
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAuthorizedEmails();
      if (res.success) {
        setAllowedEmails(res.allowedEmails || []);
        setOwnerEmail(res.ownerEmail || 'andycrepto@gmail.com');
        setAdminEmails(res.adminEmails || []);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to load authorized emails.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Error fetching allowlist.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const emailTrimmed = newEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setFeedback({ type: 'error', message: 'Email address cannot be empty.' });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailTrimmed)) {
      setFeedback({ type: 'error', message: 'Please enter a valid email format (e.g., creator@gmail.com).' });
      return;
    }

    if (allowedEmails.some((e) => e.email.toLowerCase() === emailTrimmed)) {
      setFeedback({ type: 'error', message: `Email '${emailTrimmed}' is already in the authorized list.` });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addAuthorizedEmail({
        email: emailTrimmed,
        name: newName.trim() || undefined,
        role: newRole,
        notes: newNotes.trim() || undefined,
      });

      if (res.success) {
        setFeedback({ type: 'success', message: `Successfully authorized '${emailTrimmed}'!` });
        setNewEmail('');
        setNewName('');
        setNewNotes('');
        await loadData();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to add authorized email.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Network error adding email.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!emailToDelete) return;
    setIsDeleting(true);
    setFeedback(null);

    try {
      const res = await removeAuthorizedEmail(emailToDelete);
      if (res.success) {
        setFeedback({ type: 'success', message: `Removed '${emailToDelete}' from authorized list.` });
        setEmailToDelete(null);
        await loadData();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to remove authorized email.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Error removing email.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // If user is a normal authorized user, hide administrative controls
  if (!isOwnerOrAdmin) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#0b101a] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Access Control Management</h4>
            <p className="text-xs text-slate-400">
              Private allowlist management is restricted to the application Owner and Administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-cyan-500/30 bg-[#0b101a] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                Private Email Allowlist Management
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-semibold">
                OWNER / ADMIN ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Only Google accounts added to this allowlist can log in and use GOD'S EYE V3.0. Non-allowlisted users are strictly blocked at both the UI and API layer.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Master Owner Badge */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Master Owner Account:</span>
          <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/50">
            {ownerEmail || 'andycrepto@gmail.com'}
          </span>
          <span className="text-[11px] text-slate-400">
            (Immutable root administrator)
          </span>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs underline hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add New Authorized Email Form */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d121c] p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <UserPlus className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">Add New Authorized Google Account</h4>
        </div>

        <form onSubmit={handleAddEmail} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1 lg:col-span-2">
            <label className="text-[11px] font-mono text-slate-400 block">
              GOOGLE EMAIL ADDRESS *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="creator@gmail.com"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">
              CREATOR NAME (OPTIONAL)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Andy / Rahul"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">
              ACCESS ROLE
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs font-mono text-white outline-none cursor-pointer"
            >
              <option value="CREATOR">CREATOR (Full Studio Access)</option>
              <option value="OPERATOR">OPERATOR (Studio Operator)</option>
              {currentUser?.isOwner && (
                <option value="ADMIN">ADMIN (Allowlist Management)</option>
              )}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2 lg:col-span-3">
            <label className="text-[11px] font-mono text-slate-400 block">
              NOTES / PERMISSIONS PURPOSE
            </label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Lead Hindi Scriptwriter, Production Partner"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting || !newEmail.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Authorizing...' : 'Authorize Email'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Allowed Emails Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d121c] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">
              Currently Authorized Accounts ({allowedEmails.length})
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-Time Server Synchronization
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs font-mono text-cyan-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading allowlist from server database...</span>
          </div>
        ) : allowedEmails.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No authorized accounts found. (Only root owner has access)
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2.5 font-semibold">EMAIL ADDRESS</th>
                  <th className="pb-2.5 font-semibold">NAME / OPERATOR</th>
                  <th className="pb-2.5 font-semibold">ROLE</th>
                  <th className="pb-2.5 font-semibold">AUTHORIZED AT</th>
                  <th className="pb-2.5 font-semibold">STATUS</th>
                  <th className="pb-2.5 text-right font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allowedEmails.map((item) => {
                  const isMasterOwner = item.email.toLowerCase() === ownerEmail.toLowerCase();
                  return (
                    <tr key={item.email} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        <span>{item.email}</span>
                        {isMasterOwner && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-bold">
                            OWNER
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-300">
                        {item.name || item.email.split('@')[0]}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.role === 'OWNER'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700'
                              : item.role === 'ADMIN'
                              ? 'bg-purple-950 text-purple-300 border border-purple-700'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}
                        >
                          {item.role || 'CREATOR'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-[11px]">
                        {item.addedAt ? new Date(item.addedAt).toLocaleDateString() : 'Initial'}
                      </td>
                      <td className="py-3">
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {isMasterOwner ? (
                          <span className="text-[10px] text-slate-500 italic">Protected</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEmailToDelete(item.email)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                            title="Remove authorization"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Revoking Access */}
      {emailToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0e131f] border border-rose-500/50 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-700/60">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Confirm Revoking Access</h4>
                <p className="text-xs text-rose-300">Allowlist Security Warning</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove <span className="font-mono font-bold text-white underline">{emailToDelete}</span> from the authorized allowlist?
            </p>

            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
              <p>• The user will be immediately blocked from logging in.</p>
              <p>• Any active session tokens will be instantly invalidated on the server.</p>
              <p>• You can re-authorize this email anytime.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEmailToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Revoking...' : 'Confirm & Revoke Access'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
