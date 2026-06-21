"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, Tag } from "lucide-react";
import { fetchFeaturedTools } from "@/lib/api";

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1 text-amber-400">
      <Star size={13} className="fill-amber-400" />
      <span className="text-xs font-medium text-white/80">{rating.toFixed(1)}</span>
    </span>
  );
}

function PriceBadge({ price, pricingType }) {
  if (pricingType === "Free") {
    return (
      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
        Free
      </span>
    );
  }
  if (pricingType === "Freemium") {
    return (
      <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
        From ${price}/mo
      </span>
    );
  }
  return (
    <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
      ${price}/mo
    </span>
  );
}

function ToolCard({ tool }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
        <Image
          src={tool.images?.[0] || "https://picsum.photos/seed/default/800/500"}
          alt={tool.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Category overlay */}
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          <Tag size={10} />
          {tool.category}
        </span>
      </div>

      {/* Body — grows to fill remaining space */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-white">{tool.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
          {tool.shortDescription}
        </p>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <PriceBadge price={tool.price} pricingType={tool.pricingType} />
          <StarRating rating={tool.rating} />
          <span className="text-xs text-slate-500">({tool.reviewCount})</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-3">
        <Link
          href={`/tools/${tool.slug}`}
          className="flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          View Details
          <ArrowRight size={14} />
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

export default function FeaturedTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTools()
      .then((data) => setTools(data))
      .catch((err) => console.error("FeaturedTools error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      {/* Glow */}
      <div className="absolute right-1/4 top-0 h-80 w-80 rounded-full bg-violet-500/15 blur-[120px]" />
      <div className="absolute left-1/4 bottom-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
            ✨ Hand-picked by our AI experts
          </span>
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Featured AI Tools
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            Discover the most powerful AI tools trusted by thousands of professionals
            to supercharge their productivity and creativity.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : tools.map((tool) => <ToolCard key={tool._id} tool={tool} />)}
        </div>

        {/* Explore link */}
        <div className="mt-10 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
          >
            Explore All Tools
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
