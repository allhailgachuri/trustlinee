import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { adminApi } from "@/api/admin";
import type { User, UserRole } from "@/lib/types";
import { shortDate, ROLE_LABEL } from "@/lib/format";
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  Mail,
  Plus,
  Shield,
  User as UserIcon,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/app/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOrg, setInviteOrg] = useState("Demo Credit Ltd");
  const [inviteRole, setInviteRole] = useState<UserRole>("analyst");
  const [inviting, setInviting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getUsers();
      setUsers(res);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await adminApi.updateUserRole(userId, role);
      toast.success("User role updated successfully");
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await adminApi.toggleUserStatus(userId);
      toast.success("User account status updated");
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle status");
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await adminApi.inviteUser({
        name: inviteName,
        email: inviteEmail,
        organization: inviteOrg,
        role: inviteRole,
      });
      toast.success(`Invitation sent to ${inviteEmail}`);
      setModalOpen(false);
      setInviteName("");
      setInviteEmail("");
      await fetchUsers();
    } finally {
      setInviting(false);
    }
  };

  return (
    <AppLayout
      title="User Management"
      subtitle="Manage underwriting accounts, role permissions, and access privileges."
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/app/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Admin Hub</span>
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Invite Underwriter</span>
          </button>
        </div>
      }
    >
      {loading && <LoadingState message="Loading institutional users..." />}
      {error && <ErrorState description={error} onRetry={fetchUsers} />}

      {!loading && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{u.organization}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-blue-400 font-mono outline-none focus:border-blue-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="risk_manager">Risk Manager</option>
                        <option value="analyst">Analyst</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          u.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : u.status === "invited"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{shortDate(u.lastLogin)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className="text-xs text-slate-400 hover:text-white underline"
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold">Invite New Underwriter</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleInviteSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Full Name</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Dennis Muli"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Institutional Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="dennis.muli@demobank.co.ke"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Assigned Permission Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="analyst">Analyst (Application review & assessment)</option>
                <option value="risk_manager">Risk Manager (Policy adjustments & oversight)</option>
                <option value="admin">Administrator (Full permissions)</option>
                <option value="viewer">Viewer (Read-only analytics)</option>
              </select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={inviting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {inviting ? "Inviting..." : "Send Invitation"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
