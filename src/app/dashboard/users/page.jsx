"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRoleFromEmail, ROLES, ROLE_COLORS, ROLE_LABELS } from "@/lib/roles";
import { Search, Eye, UserCog, Lock } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user", joined: "2024-01-15", status: "active" },
  { id: 2, name: "Bob Manager", email: "bob.manager@example.com", role: "manager", joined: "2024-02-20", status: "active" },
  { id: 3, name: "Carol Admin", email: "carol.admin@example.com", role: "admin", joined: "2024-03-10", status: "active" },
  { id: 4, name: "David Lee", email: "david@example.com", role: "user", joined: "2024-04-05", status: "inactive" },
  { id: 5, name: "Emma Wilson", email: "emma@example.com", role: "user", joined: "2024-05-12", status: "active" },
  { id: 6, name: "Frank Chen", email: "frank@example.com", role: "user", joined: "2024-06-18", status: "active" },
];

// ── View User Modal ────────────────────────────────────────────────────────
function ViewModal({ user: u, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
            {u.name[0]}
          </div>
          <h3 className="text-white font-semibold text-lg">{u.name}</h3>
          <p className="text-slate-400 text-sm">{u.email}</p>
          <span className={`inline-block mt-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
            {ROLE_LABELS[u.role]}
          </span>
        </div>
        <dl className="space-y-3 text-sm border-t border-white/10 pt-4">
          <div className="flex justify-between">
            <dt className="text-slate-500">Status</dt>
            <dd>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                u.status === "active"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-700/50 text-slate-400 border border-white/10"
              }`}>
                {u.status}
              </span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Joined</dt>
            <dd className="text-white">{new Date(u.joined).toLocaleDateString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">User ID</dt>
            <dd className="text-slate-300 font-mono text-xs">#{u.id.toString().padStart(6, "0")}</dd>
          </div>
        </dl>
        <button
          onClick={onClose}
          className="w-full mt-5 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Change Role Modal ──────────────────────────────────────────────────────
function RoleModal({ user: u, onClose, onSave }) {
  const [role, setRole] = useState(u.role);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xs p-6">
        <h3 className="text-white font-semibold mb-1">Change Role</h3>
        <p className="text-slate-400 text-sm mb-4">Update role for <span className="text-white">{u.name}</span></p>
        <div className="space-y-2">
          {Object.values(ROLES).map((r) => (
            <label key={r} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
              role === r
                ? "border-indigo-500/50 bg-indigo-500/10"
                : "border-white/10 hover:border-white/20"
            }`}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="accent-indigo-500"
              />
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[r]}`}>
                {ROLE_LABELS[r]}
              </span>
            </label>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(role)}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { user } = useAuth();
  const role = getRoleFromEmail(user?.email);

  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [viewUser, setViewUser] = useState(null);
  const [roleUser, setRoleUser] = useState(null);

  if (role === ROLES.USER) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <Lock size={28} className="text-red-400" />
        </div>
        <h2 className="text-white font-semibold text-xl">Access Denied</h2>
        <p className="text-slate-400 text-sm text-center max-w-xs">
          You don't have permission to view this page. Contact an admin or manager.
        </p>
      </div>
    );
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  function handleRoleSave(newRole) {
    setUsers((prev) => prev.map((u) => u.id === roleUser.id ? { ...u, role: newRole } : u));
    setRoleUser(null);
  }

  return (
    <>
      {viewUser && <ViewModal user={viewUser} onClose={() => setViewUser(null)} />}
      {roleUser && (
        <RoleModal user={roleUser} onClose={() => setRoleUser(null)} onSave={handleRoleSave} />
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Users</h2>
            <p className="text-slate-400 text-sm">{filtered.length} of {users.length} users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">All Roles</option>
            {Object.values(ROLES).map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="text-left text-slate-400 font-medium px-6 py-3 whitespace-nowrap">User</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">Role</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">Joined</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="text-right text-slate-400 font-medium px-6 py-3 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No users found</td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.name}</p>
                            <p className="text-slate-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                          {ROLE_LABELS[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {new Date(u.joined).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700/50 text-slate-400 border border-white/10"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewUser(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          {role === ROLES.ADMIN && (
                            <button
                              onClick={() => setRoleUser(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                              title="Change Role"
                            >
                              <UserCog size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
