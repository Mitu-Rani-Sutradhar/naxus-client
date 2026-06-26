"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Bell,
  Sparkles,
} from "lucide-react";

const PRIMARY = "#4F46E5";
const ACCENT = "#0D9488";
const HIGHLIGHT = "#F59E0B";

const loggedOutRoutes = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const loggedInRoutes = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Support", href: "/support" },
  { label: "Privacy", href: "/privacy" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
    router.push("/auth/login/register");
  }

  const routes = isLoggedIn ? loggedInRoutes : loggedOutRoutes;

  // Theme tokens
  const bg       = isDark ? "#0F1115" : "#FFFFFF";
  const text      = isDark ? "#E5E7EB" : "#1F2937";
  const subtext   = isDark ? "#9CA3AF" : "#6B7280";
  const border    = isDark ? "#1F2430" : "#E5E7EB";
  const hoverBg   = isDark ? "#1A1D24" : "#F3F4F6";
  const panelBg   = isDark ? "#13161C" : "#FFFFFF";
  const outerBg   = isDark ? "#0B0C0F" : "#F9FAFB";

  // Display name / avatar letter
  const displayName = user?.displayName || user?.email || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div style={{ background: outerBg }}>
      {/* Theme toggle pill */}
      <div style={{ background: outerBg }} className="flex justify-end px-4 pt-3">
        <button
          onClick={() => setIsDark((v) => !v)}
          style={{ borderColor: border, color: subtext, background: panelBg }}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>

      {/* Sticky header */}
      <header
        style={{ background: bg, borderColor: border }}
        className="sticky top-0 z-50 w-full border-b"
      >
        <div
          style={{ maxWidth: "1400px" }}
          className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span
              style={{ background: PRIMARY }}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            >
              <Sparkles size={18} />
            </span>
            <span style={{ color: text }} className="text-lg font-bold tracking-tight">
              NaxusAI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {routes.map((r) => (
              <Link
                key={r.label}
                href={r.href}
                style={{ color: subtext }}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-current"
                onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {r.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLoggedIn ? (
              <>
                {/* Notification bell */}
                <button
                  aria-label="Notifications"
                  style={{ color: subtext, borderColor: border }}
                  className="relative rounded-full border p-2 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Bell size={16} />
                  <span
                    style={{ background: HIGHLIGHT }}
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
                  />
                </button>

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    style={{ borderColor: border }}
                    className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span
                      style={{ background: ACCENT }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                    >
                      {avatarLetter}
                    </span>
                    <ChevronDown
                      size={14}
                      style={{ color: subtext }}
                      className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      style={{ background: panelBg, borderColor: border }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border p-1.5 shadow-lg"
                    >
                      {/* User info */}
                      <div style={{ borderColor: border }} className="border-b px-3 py-2.5">
                        <p style={{ color: text }} className="text-sm font-semibold truncate">
                          {user?.displayName || "User"}
                        </p>
                        <p style={{ color: subtext }} className="text-xs truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      {[
                        { icon: User, label: "Profile", href: "#profile" },
                        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
                        { icon: Settings, label: "Settings", href: "#settings" },
                      ].map(({ icon: Icon, label, href }) => (
                        <a
                          key={label}
                          href={href}
                          style={{ color: text }}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm"
                          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          onClick={() => setProfileOpen(false)}
                        >
                          <Icon size={15} style={{ color: subtext }} />
                          {label}
                        </a>
                      ))}

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        style={{ color: "#EF4444" }}
                        className="mt-1 flex w-full items-center gap-2.5 rounded-lg border-t px-3 py-2 text-left text-sm font-medium"
                        style={{ color: "#EF4444", borderColor: border }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={15} />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  style={{ color: text, borderColor: border }}
                  className="rounded-lg border px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/login/register"
                  style={{ background: PRIMARY }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            style={{ color: text }}
            className="lg:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div style={{ background: panelBg, borderColor: border }} className="border-t lg:hidden">
            <div className="flex flex-col gap-1 px-4 py-3">
              {routes.map((r) => (
                <Link
                  key={r.label}
                  href={r.href}
                  style={{ color: text }}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {r.label}
                </Link>
              ))}

              <div style={{ borderColor: border }} className="mt-2 border-t pt-3">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    {/* User info in mobile */}
                    <div className="flex items-center gap-2.5 px-1 py-1">
                      <span
                        style={{ background: ACCENT }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      >
                        {avatarLetter}
                      </span>
                      <div className="min-w-0">
                        <p style={{ color: text }} className="text-sm font-semibold truncate">
                          {user?.displayName || "User"}
                        </p>
                        <p style={{ color: subtext }} className="text-xs truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {/* Logout button */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-500"
                      onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full gap-2">
                    <Link
                      href="/auth/login"
                      style={{ borderColor: border, color: text }}
                      className="flex-1 rounded-lg border py-2 text-center text-sm font-semibold"
                      onClick={() => setMobileOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/login/register"
                      style={{ background: PRIMARY }}
                      className="flex-1 rounded-lg py-2 text-center text-sm font-semibold text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
