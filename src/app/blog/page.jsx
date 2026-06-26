"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Clock,
  Tag,
  TrendingUp,
  Home as HomeIcon,
  Mountain,
  Building2,
  Waves,
} from "lucide-react";


/**
 * Nestly — Blog section
 * Same visual language as the Hero (centered "spotlight" palette,
 * pill chips, soft glass panels) but built for a listing/grid layout.
 *
 * Interactive elements:
 * - Category filter chips
 * - Search input (filters posts client-side)
 * - Hoverable blog cards with a "Read more" CTA
 */

const PRIMARY = "#4F46E5";
const ACCENT = "#0D9488";
const HIGHLIGHT = "#F59E0B";

const categories = [
  { label: "All", icon: TrendingUp },
  { label: "Cabins", icon: Mountain },
  { label: "Apartments", icon: Building2 },
  { label: "Beachfront", icon: Waves },
  { label: "Villas", icon: HomeIcon },
];

const posts = [
  {
    id: 1,
    title: "5 Lakeside Cabins That Feel Like a Reset Button",
    excerpt:
      "Slow mornings, loon calls, and zero notifications. Here's where to disappear for a weekend.",
    category: "Cabins",
    readTime: "4 min read",
    date: "Jun 12, 2026",
  },
  {
    id: 2,
    title: "Downtown Lofts for People Who Hate Tourist Traps",
    excerpt:
      "Walkable, well-lit, and close to the good coffee. A short list of city stays worth booking.",
    category: "Apartments",
    readTime: "6 min read",
    date: "Jun 18, 2026",
  },
  {
    id: 3,
    title: "How to Pick a Beach Villa Without Getting Burned",
    excerpt:
      "Tide schedules, hidden fees, and the one amenity that actually matters in July.",
    category: "Beachfront",
    readTime: "5 min read",
    date: "Jun 21, 2026",
  },
  {
    id: 4,
    title: "Villas With Private Pools Under $200/Night",
    excerpt:
      "Yes, they exist. We found six that don't skimp on space or privacy.",
    category: "Villas",
    readTime: "7 min read",
    date: "Jun 24, 2026",
  },
  {
    id: 5,
    title: "The Cabin Packing List Nobody Tells You About",
    excerpt:
      "Past the flashlight and bug spray — small things that make remote stays painless.",
    category: "Cabins",
    readTime: "3 min read",
    date: "Jun 9, 2026",
  },
  {
    id: 6,
    title: "Apartment vs Hotel: What Actually Saves You Money",
    excerpt:
      "A blunt cost breakdown for stays longer than four nights.",
    category: "Apartments",
    readTime: "5 min read",
    date: "Jun 15, 2026",
  },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesQuery = post.title
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    
    <section id="blog" className="relative w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span
            style={{ background: "rgba(79,70,229,0.08)", color: PRIMARY }}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
          >
            <Tag size={13} />
            From the Nestly journal
          </span>

          <h2 className="mt-4 max-w-xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Stories, guides, and stays worth talking about
          </h2>

          <p className="mt-3 max-w-md text-sm text-gray-500 sm:text-base">
            Real recommendations from real trips — no sponsored fluff.
          </p>
        </div>

        {/* Controls: search + category chips */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(({ label, icon: Icon }) => {
              const isActive = activeCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  style={{
                    background: isActive ? PRIMARY : "#F3F4F6",
                    color: isActive ? "#FFFFFF" : "#374151",
                  }}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm"
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})`,
                }}
                className="relative h-40 w-full"
              >
                <span
                  style={{ background: HIGHLIGHT, color: "#1F2937" }}
                  className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold"
                >
                  {post.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={12} />
                  {post.readTime}
                  <span className="mx-1">·</span>
                  {post.date}
                </div>

                <h3 className="mt-2 text-base font-bold leading-snug text-gray-900 sm:text-lg">
                  {post.title}
                </h3>

                <p className="mt-2 flex-1 text-sm text-gray-500">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  style={{ color: PRIMARY }}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                >
                  Read more
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </article>
          ))}

          {filteredPosts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-gray-400">
                No articles match "{query}" in {activeCategory}.
              </p>
            </div>
          )}
        </div>

        {/* View all CTA */}
        {filteredPosts.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/blog"
              style={{ borderColor: PRIMARY, color: PRIMARY }}
              className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-indigo-50"
            >
              View all articles
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}