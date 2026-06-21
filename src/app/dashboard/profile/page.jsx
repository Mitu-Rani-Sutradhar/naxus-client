"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRoleFromEmail, ROLE_COLORS, ROLE_LABELS } from "@/lib/roles";
import { auth } from "@/lib/firebase";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { User, Mail, Shield, Key, Save, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

// ── Toast ──────────────────────────────────────────────────────────────────
function InlineAlert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
      type === "success"
        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
        : "bg-red-500/15 border border-red-500/30 text-red-300"
    }`}>
      {type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
      {message}
    </div>
  );
}

// ── Password input ─────────────────────────────────────────────────────────
function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 pr-10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();
  const role = getRoleFromEmail(user?.email);

  // Display name section
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [savingName, setSavingName] = useState(false);
  const [nameAlert, setNameAlert] = useState({ type: "", message: "" });

  // Password section
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwAlert, setPwAlert] = useState({ type: "", message: "" });

  async function handleSaveName(e) {
    e.preventDefault();
    if (!displayName.trim()) {
      setNameAlert({ type: "error", message: "Display name cannot be empty" });
      return;
    }
    setSavingName(true);
    setNameAlert({ type: "", message: "" });
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setNameAlert({ type: "success", message: "Display name updated successfully!" });
    } catch (err) {
      setNameAlert({ type: "error", message: err.message || "Failed to update name" });
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwAlert({ type: "", message: "" });

    if (!currentPassword) {
      setPwAlert({ type: "error", message: "Current password is required" });
      return;
    }
    if (newPassword.length < 6) {
      setPwAlert({ type: "error", message: "New password must be at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwAlert({ type: "error", message: "New passwords do not match" });
      return;
    }

    setSavingPw(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPwAlert({ type: "success", message: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        err.code === "auth/wrong-password" || err.code === "auth/invalid-credential"
          ? "Current password is incorrect"
          : err.message || "Failed to change password";
      setPwAlert({ type: "error", message: msg });
    } finally {
      setSavingPw(false);
    }
  }

  const avatarLetter = (user?.displayName || user?.email || "U")[0].toUpperCase();
  const joinedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "Unknown";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar + overview */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
            {avatarLetter}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-white font-bold text-xl">
              {user?.displayName || user?.email?.split("@")[0]}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[role]}`}>
                {ROLE_LABELS[role]}
              </span>
              <span className="text-slate-500 text-xs">Member since {joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Display Name */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={17} className="text-indigo-400" />
          <h3 className="text-white font-semibold">Display Name</h3>
        </div>
        <form onSubmit={handleSaveName} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <InlineAlert {...nameAlert} />
          <button
            type="submit"
            disabled={savingName}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {savingName ? "Saving…" : "Save Name"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Key size={17} className="text-indigo-400" />
          <h3 className="text-white font-semibold">Change Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Your current password"
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
          />
          <InlineAlert {...pwAlert} />
          <button
            type="submit"
            disabled={savingPw}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Key size={14} />
            {savingPw ? "Updating…" : "Change Password"}
          </button>
        </form>
      </div>

      {/* Account Info (read-only) */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={17} className="text-indigo-400" />
          <h3 className="text-white font-semibold">Account Info</h3>
        </div>
        <dl className="space-y-4">
          <div>
            <dt className="text-slate-500 text-xs font-medium mb-1 flex items-center gap-1.5">
              <Mail size={12} /> Email
            </dt>
            <dd className="text-white text-sm bg-slate-800/50 rounded-lg px-3 py-2 border border-white/5">
              {user?.email}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 text-xs font-medium mb-1 flex items-center gap-1.5">
              <Shield size={12} /> UID
            </dt>
            <dd className="text-slate-400 text-xs font-mono bg-slate-800/50 rounded-lg px-3 py-2 border border-white/5 break-all">
              {user?.uid}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 text-xs font-medium mb-1 flex items-center gap-1.5">
              <User size={12} /> Role
            </dt>
            <dd className="mt-1">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[role]}`}>
                {ROLE_LABELS[role]}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 text-xs font-medium mb-1">Member Since</dt>
            <dd className="text-white text-sm bg-slate-800/50 rounded-lg px-3 py-2 border border-white/5">
              {joinedDate}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
