"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ArrowLeft,
  Tag,
  ChevronRight,
} from "lucide-react";
import { fetchToolBySlug, fetchTools } from "@/lib/api";

function StarRating({ rating, size = 14 }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-700 text-slate-700"
          }
        />
      ))}
    </span>
  );
}

function PriceBadge({ price, pricingType }) {
  if (pricingType === "Free")
    return <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-400">Free</span>;
  if (pricingType === "Freemium")
    return <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sm font-semibold text-sky-400">Freemium — From ${price}/mo</span>;
  return <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm font-semibold text-violet-400">${price}/mo</span>;
}

function RelatedCard({ tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
        <Image
          src={tool.images?.[0] || "https://picsum.photos/seed/default/800/500"}
          alt={tool.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-sm font-semibold text-white">{tool.title}</h4>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-400">
          {tool.shortDescription}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex items-center gap-1 text-amber-400">
            <Star size={11} className="fill-amber-400" />
            <span className="text-xs text-white/70">{tool.rating.toFixed(1)}</span>
          </span>
          {tool.pricingType === "Free" ? (
            <span className="text-xs text-emerald-400">Free</span>
          ) : (
            <span className="text-xs text-slate-400">${tool.price}/mo</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ToolDetailPage() {
  const { slug } = useParams();
  const [tool, setTool] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setActiveImage(0);
    setActiveTab("overview");

    fetchToolBySlug(slug)
      .then((data) => {
        setTool(data);
        return fetchTools({ category: data.category, limit: 5 });
      })
      .then((res) => {
        setRelated(res.tools.filter((t) => t.slug !== slug).slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-800" />
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-slate-800" />
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-slate-800" />
          <div className="h-6 w-1/3 animate-pulse rounded-lg bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950">
        <p className="text-xl text-white">Tool not found</p>
        <Link href="/tools" className="mt-4 text-indigo-400 hover:text-indigo-300">← Back to tools</Link>
      </div>
    );
  }

  const images = tool.images?.length ? tool.images : ["https://picsum.photos/seed/default/800/500"];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href="/tools"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to Explore
        </Link>

        {/* ── Hero / Images ── */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          {/* Main image */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={images[activeImage]}
              alt={`${tool.title} screenshot ${activeImage + 1}`}
              fill
              className="object-cover transition-all duration-300"
              sizes="100vw"
              priority
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto p-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === activeImage ? "border-indigo-500" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`thumb ${i + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Header ── */}
        <div className="mt-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                  <Tag size={11} />
                  {tool.category}
                </span>
                <PriceBadge price={tool.price} pricingType={tool.pricingType} />
              </div>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{tool.title}</h1>
              <p className="mt-2 text-slate-400">{tool.shortDescription}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <StarRating rating={tool.rating} size={18} />
                <span className="text-lg font-semibold text-white">{tool.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-slate-500">{tool.reviewCount} reviews</span>
            </div>
          </div>

          {/* Tags */}
          {tool.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Tab section ── */}
        <div className="mt-10">
          {/* Tab buttons */}
          <div className="flex gap-1 rounded-2xl border border-white/10 bg-slate-900 p-1">
            {["overview", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
            {activeTab === "overview" && (
              <div className="prose prose-invert max-w-none">
                <p className="leading-relaxed text-slate-300">{tool.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                {tool.specifications?.length > 0 ? (
                  <table className="w-full">
                    <tbody className="divide-y divide-white/5">
                      {tool.specifications.map((spec, i) => (
                        <tr key={i}>
                          <td className="py-3 pr-8 text-sm font-medium text-slate-400 w-1/3">
                            {spec.label}
                          </td>
                          <td className="py-3 text-sm text-white">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-slate-500">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {tool.reviews?.length > 0 ? (
                  tool.reviews.map((review, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-slate-800/50 p-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar letter */}
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                          {review.author?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">{review.author}</span>
                            <span className="text-xs text-slate-500">
                              {review.date ? new Date(review.date).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <StarRating rating={review.rating} size={12} />
                          <p className="mt-2 text-sm leading-relaxed text-slate-300">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Tools ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Related Tools</h2>
              <Link
                href={`/tools?category=${encodeURIComponent(tool.category)}`}
                className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
              >
                See all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <RelatedCard key={t._id} tool={t} />
              ))}
            </div>
          </div>
        )}

        {/* Back link bottom */}
        <div className="mt-12">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/80 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Explore
          </Link>
        </div>

      </div>
    </div>
  );
}
