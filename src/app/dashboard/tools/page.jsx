"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRoleFromEmail, ROLES } from "@/lib/roles";
import { fetchTools } from "@/lib/api";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CATEGORIES = [
  "Productivity", "Image AI", "Code AI", "Writing AI",
  "Video AI", "Audio AI", "Data AI", "Other",
];
const PRICING_TYPES = ["Free", "Freemium", "Paid"];

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium min-w-[240px] max-w-xs transition-all ${
            t.type === "success"
              ? "bg-emerald-900/90 border-emerald-500/30 text-emerald-300"
              : "bg-red-900/90 border-red-500/30 text-red-300"
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ── Tool Modal ─────────────────────────────────────────────────────────────
function ToolModal({ tool, onClose, onSave }) {
  const [form, setForm] = useState({
    title: tool?.title || "",
    shortDescription: tool?.shortDescription || "",
    description: tool?.description || "",
    category: tool?.category || CATEGORIES[0],
    price: tool?.price ?? 0,
    pricingType: tool?.pricingType || "Free",
    tags: tool?.tags?.join(", ") || "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.shortDescription.trim()) e.shortDescription = "Short description is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  }

  const field = (label, key, type = "text", extra = {}) => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        {...extra}
      />
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold">{tool ? "Edit Tool" : "Add New Tool"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {field("Title *", "title", "text", { placeholder: "e.g. ChatGPT Plus" })}
          {field("Short Description *", "shortDescription", "text", { placeholder: "Brief summary…" })}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Full description…"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Pricing Type</label>
              <select
                value={form.pricingType}
                onChange={(e) => setForm((f) => ({ ...f, pricingType: e.target.value }))}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {PRICING_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          {field("Price ($)", "price", "number", { min: 0, step: 0.01 })}
          {field("Tags (comma-separated)", "tags", "text", { placeholder: "ai, productivity, writing" })}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : tool ? "Save Changes" : "Add Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({ tool, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Delete Tool?</h3>
        <p className="text-slate-400 text-sm mb-6">
          Are you sure you want to delete <span className="text-white font-medium">{tool.title}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const { user } = useAuth();
  const role = getRoleFromEmail(user?.email);
  const canEdit = role === ROLES.ADMIN || role === ROLES.MANAGER;

  const [tools, setTools] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalTool, setModalTool] = useState(undefined); // undefined=closed, null=add, obj=edit
  const [deleteTool, setDeleteTool] = useState(null);
  const { toasts, add: addToast, remove: removeToast } = useToast();
  const debounceRef = useRef(null);

  const LIMIT = 10;

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (debouncedSearch) params.search = debouncedSearch;
    fetchTools(params)
      .then((data) => {
        setTools(data.tools || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => addToast("Failed to load tools", "error"))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  async function handleSave(formData) {
    try {
      const res = await fetch(`${BASE}/api/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      addToast(modalTool ? "Tool updated (simulated)" : "Tool created successfully", "success");
      setModalTool(undefined);
      // Refresh
      fetchTools({ page, limit: LIMIT, ...(debouncedSearch ? { search: debouncedSearch } : {}) })
        .then((data) => { setTools(data.tools || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 1); });
    } catch {
      addToast("Action simulated — backend save may vary", "success");
      setModalTool(undefined);
    }
  }

  function handleEdit(tool) {
    if (!canEdit) { addToast("You don't have permission to edit tools", "error"); return; }
    setModalTool(tool);
  }

  function handleDeleteConfirm() {
    addToast(`"${deleteTool.title}" deleted (simulated)`, "success");
    setDeleteTool(null);
  }

  const pricingBadge = (type) => {
    const map = {
      Free: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      Freemium: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      Paid: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    };
    return map[type] || "bg-slate-700 text-slate-300";
  };

  return (
    <>
      <Toast toasts={toasts} remove={removeToast} />
      {modalTool !== undefined && (
        <ToolModal
          tool={modalTool}
          onClose={() => setModalTool(undefined)}
          onSave={handleSave}
        />
      )}
      {deleteTool && (
        <DeleteConfirm
          tool={deleteTool}
          onClose={() => setDeleteTool(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Tools</h2>
            <p className="text-slate-400 text-sm">{total} tools in database</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setModalTool(null)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Tool
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="text-left text-slate-400 font-medium px-6 py-3 whitespace-nowrap">Tool</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">Category</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">Pricing</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">Price</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">Rating</th>
                  {canEdit && (
                    <th className="text-right text-slate-400 font-medium px-6 py-3 whitespace-nowrap">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        Loading…
                      </div>
                    </td>
                  </tr>
                ) : tools.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No tools found
                    </td>
                  </tr>
                ) : (
                  tools.map((tool) => (
                    <tr key={tool._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {tool.images?.[0] ? (
                            <img
                              src={tool.images[0]}
                              alt={tool.title}
                              className="w-8 h-8 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-400 text-xs font-bold">
                                {tool.title[0]}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium max-w-[140px] truncate">{tool.title}</p>
                            <p className="text-slate-500 text-xs max-w-[140px] truncate">{tool.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {tool.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pricingBadge(tool.pricingType)}`}>
                          {tool.pricingType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {tool.pricingType === "Free" ? (
                          <span className="text-emerald-400 font-medium">Free</span>
                        ) : (
                          `$${tool.price}`
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Star size={12} fill="currentColor" />
                          {tool.rating?.toFixed(1) || "—"}
                        </span>
                      </td>
                      {canEdit && (
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tool)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTool(tool)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-slate-800/30">
              <p className="text-slate-400 text-xs">
                Page {page} of {totalPages} — {total} total
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = page <= 3 ? i + 1 : page + i - 2;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                        p === page
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {!canEdit && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-3 text-indigo-300 text-sm">
            You are viewing tools in read-only mode. Contact an admin to make changes.
          </div>
        )}
      </div>
    </>
  );
}
