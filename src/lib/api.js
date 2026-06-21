const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchTools(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/tools?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tools");
  return res.json();
}

export async function fetchFeaturedTools() {
  const res = await fetch(`${BASE}/api/tools/featured`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch featured tools");
  return res.json();
}

export async function fetchToolBySlug(slug) {
  const res = await fetch(`${BASE}/api/tools/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Tool not found");
  return res.json();
}
