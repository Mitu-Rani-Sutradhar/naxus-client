"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getRoleFromEmail, ROLES, ROLE_COLORS, ROLE_LABELS } from "@/lib/roles";
import {
  LayoutDashboard,
  Wrench,
  Users,
  BarChart2,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const NAV_BY_ROLE = {
  [ROLES.USER]: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Tools", href: "/dashboard/tools", icon: Wrench },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  [ROLES.MANAGER]: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Tools", href: "/dashboard/tools", icon: Wrench },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  [ROLES.ADMIN]: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Tools Management", href: "/dashboard/tools", icon: Wrench },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
};

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/tools": "Tools Management",
  "/dashboard/users": "Users",
  "/dashboard/analytics": "Analytics",
  "/dashboard/profile": "Profile",
};

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);

  const role = getRoleFromEmail(user?.email);
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE[ROLES.USER];
  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";
  const avatarLetter = (user?.displayName || user?.email || "U")[0].toUpperCase();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  async function handleLogout() {
    await logout();
    router.push("/auth/login/register");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-white/10 flex flex-col z-30
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">NaxusAI</span>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 border-b border-white/10">
          <p className="text-slate-500 text-xs mb-1.5">Signed in as</p>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium truncate max-w-[120px]">
              {user.displayName || user.email?.split("@")[0]}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_COLORS[role]}`}>
              {ROLE_LABELS[role]}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-indigo-500/20 text-indigo-400 border-l-2 border-indigo-500 pl-[10px]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon size={17} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-white/10 px-4 lg:px-6 py-3 flex items-center gap-4">
          {/* Hamburger */}
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Page title */}
          <h1 className="text-white font-semibold text-base flex-1">{pageTitle}</h1>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
              onClick={() => setProfileDropOpen((v) => !v)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {avatarLetter}
              </div>
              <span className="hidden sm:block max-w-[100px] truncate">
                {user.displayName || user.email?.split("@")[0]}
              </span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {profileDropOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileDropOpen(false)}
                />
                <div className="absolute right-0 top-10 z-20 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-medium truncate">
                      {user.displayName || user.email?.split("@")[0]}
                    </p>
                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setProfileDropOpen(false)}
                  >
                    <User size={14} />
                    Profile
                  </Link>
                  <button
                    onClick={() => { setProfileDropOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
