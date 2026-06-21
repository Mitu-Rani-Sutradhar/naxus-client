"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Star,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { fetchTools } from "@/lib/api";

const CATEGORIES = [
  "Productivity",
  "Image AI",
  "Code AI",
  "Writing AI",
  "Video AI",
  "Audio AI",
  "Data AI",
  "Other",
];

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1 text-amber-400">
      <Star size={13} className="fill-amber-400" />
      <span className="text-xs font-medium text-white/80">{rating.toFixed(1)}</span>
    </span>
  );
}

function PriceBadge({ price, pricingType }) {
  if (pricingType === "Free")
    return <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">Free</span>;
  if (pricingType === "Freemium")
    return <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-xs font-semibold text-sky-400">From ${price}/mo</span>;
  return <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-400">${price}/mo</span>;
}

function ToolCard({ tool }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
        <Image
          src={tool.images?.[0] || "https://picsum.photos/seed/default/800/500"}
          alt={tool.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          <Tag size={10} />
          {tool.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-white">{tool.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
          {tool.shortDescription}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <PriceBadge price={tool.price} pricingType={tool.pricingType} />
          <StarRating rating={tool.rating} />
          <span className="text-xs text-slate-500">({tool.reviewCount})</span>
        </div>
      </div>
      <div className="border-t border-white/5 px-5 py-3">
        <Link
          href={`/tools/${tool.slug}`}
          className="flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <div className="aspect-video w-full animate-pulse rounded-t-2xl bg-slate-800" />
      <div className="flex flex-1 flex-col p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-800" />
        <div className="mt-2 h-4 w-full animate-pulse rounded-lg bg-slate-800" />
        <div className="mt-1 h-4 w-2/3 animate-pulse rounded-lg bg-slate-800" />
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-800" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-800" />
        </div>
      </div>
      <div className="border-t border-white/5 px-5 py-3">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
      </div>
    </div>
  );
}

export default function ToolsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── State initialised from URL params ──
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [pricingType, setPricingType] = useState(searchParams.get("pricingType") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [tools, setTools] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Build query and push to URL
  const buildParams = useCallback(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    if (pricingType) params.pricingType = pricingType;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minRating) params.minRating = minRating;
    if (sort) params.sort = sort;
    params.page = page;
    params.limit = 8;
    return params;
  }, [debouncedSearch, category, pricingType, minPrice, maxPrice, minRating, sort, page]);

  // Sync URL with filters
  useEffect(() => {
    const params = buildParams();
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString();
    router.replace(`/tools?${qs}`, { scroll: false });
  }, [buildParams, router]);

  // Fetch tools
  useEffect(() => {
    setLoading(true);
    fetchTools(buildParams())
      .then((data) => {
        setTools(data.tools);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [buildParams]);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setPricingType("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("newest");
    setPage(1);
  }

  const hasActiveFilters = category || pricingType || minPrice || maxPrice || minRating || debouncedSearch;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5 bg-slate-950 pb-12 pt-16">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[100px]" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Explore AI Tools
          </h1>
          <p className="mt-3 text-slate-400">
            {loading ? "Loading..." : `${total} tool${total !== 1 ? "s" : ""} found`}
          </p>

          {/* Search bar */}
          <div className="mt-8 flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search tools by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition ${
                showFilters || hasActiveFilters
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                  : "border-white/10 bg-slate-900 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Pricing Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Pricing</label>
                <select
                  value={pricingType}
                  onChange={(e) => { setPricingType(e.target.value); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                >
                  <option value="">All Types</option>
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Min Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Min Price ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50"
                />
              </div>

              {/* Max Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Max Price ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="199"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50"
                />
              </div>

              {/* Min Rating */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Min Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">

        {/* Sort bar (outside filter panel — always visible) */}
        {!showFilters && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {loading ? "" : `${total} result${total !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500/50"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl">🔍</div>
            <h3 className="mt-4 text-xl font-semibold text-white">No tools found</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              We could not find any AI tools matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => <ToolCard key={tool._id} tool={tool} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-slate-500">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`h-9 w-9 rounded-xl border text-sm font-medium transition ${
                      page === item
                        ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-400"
                        : "border-white/10 bg-slate-900 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
