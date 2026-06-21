export const ROLES = { USER: "user", ADMIN: "admin", MANAGER: "manager" };

export function getRoleFromEmail(email) {
  if (!email) return ROLES.USER;
  if (email.includes("admin")) return ROLES.ADMIN;
  if (email.includes("manager")) return ROLES.MANAGER;
  return ROLES.USER;
}

export const ROLE_COLORS = {
  [ROLES.ADMIN]: "bg-red-500/20 text-red-400 border border-red-500/30",
  [ROLES.MANAGER]: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  [ROLES.USER]: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.USER]: "User",
};
