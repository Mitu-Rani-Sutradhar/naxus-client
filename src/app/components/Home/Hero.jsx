"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ChevronDown,
  Sun,
  Moon,
  Mountain,
  Building2,
  Waves,
  Home as HomeIcon,
  Star,
  MapPin,
} from "lucide-react";

/**
 * Nestly — Hero section (v2: centered "spotlight" style)
 * A different visual direction from the split slider hero — centered
 * headline over an animated gradient backdrop, floating decorative
 * listing cards, clickable category chips, and a search pill.
 *
 * Requirement-doc rules implemented:
 * - Height limited to 60–70% of the viewport
 * - Interactive elements: clickable category chips, working search pill,
 *   floating animated cards, CTA buttons
 * - Clear visual flow to the next section (scroll cue anchored to #explore)
 */

const PRIMARY = "#4F46E5";
const ACCENT = "#0D9488";
const HIGHLIGHT = "#F59E0B";

const categories = [
  { label: "Cabins", icon: Mountain },
  { label: "Apartments", icon: Building2 },
  { label: "Beachfront", icon: Waves },
  { label: "Villas", icon: HomeIcon },
];

const floatingCards = [
  { title: "Lakeside Cabin", price: "$120/night", rating: "4.9", pos: "left-[2%] top-[14%] lg:left-[6%]", rotate: "-rotate-6", delay: "0s" },
  { title: "Downtown Loft", price: "$98/night", rating: "4.7", pos: "right-[2%] top-[10%] lg:right-[7%]", rotate: "rotate-6", delay: "0.6s" },
  { title: "Beach Villa", price: "$210/night", rating: "5.0", pos: "right-[6%] bottom-[8%] lg:right-[12%]", rotate: "rotate-3", delay: "1.2s" },
];

export default function Hero() {
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Cabins");
  const [location, setLocation] = useState("");

  const text = "#FFFFFF";
  const subtext = "rgba(255,255,255,0.85)";
  const panel = isDark ? "rgba(15,17,23,0.55)" : "rgba(255,255,255,0.14)";
  const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.28)";

  function handleSearch(e) {
    e.preventDefault();
    alert(`Searching listings near "${location || "anywhere"}" in ${activeCategory}`);
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Local keyframes for the floating-card animation and mesh drift */}
      <style>{`
        @keyframes nestly-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes nestly-mesh {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .nestly-float-card { animation: nestly-float 5s ease-in-out infinite; }
      `}</style>

      {/* Gradient mesh backdrop */}
      <div
        style={{
          background: isDark
            ? `linear-gradient(120deg, #0B0C0F, #161A2B, #0B0C0F)`
            : `linear-gradient(120deg, ${PRIMARY}, ${ACCENT}, ${HIGHLIGHT}, ${PRIMARY})`,
          backgroundSize: "300% 300%",
          animation: "nestly-mesh 14s ease-in-out infinite",
        }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* Demo control — preview only */}
      <div className="absolute right-4 top-4 z-20">
        <button
          onClick={() => setIsDark((v) => !v)}
          style={{ borderColor: border, color: text, background: panel }}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? "Preview light" : "Preview dark"}
        </button>
      </div>

      {/* Floating decorative listing cards (hidden on small screens to avoid clutter) */}
      {floatingCards.map((c) => (
        <div
          key={c.title}
          style={{ borderColor: border, background: panel, animationDelay: c.delay }}
          className={`nestly-float-card absolute z-10 hidden w-44 rounded-2xl border p-3 backdrop-blur-md lg:block ${c.pos} ${c.rotate}`}
        >
          <div
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }}
            className="h-16 w-full rounded-xl"
          />
          <p style={{ color: text }} className="mt-2 text-xs font-semibold">
            {c.title}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <span style={{ color: subtext }} className="text-xs">
              {c.price}
            </span>
            <span style={{ color: HIGHLIGHT }} className="flex items-center gap-0.5 text-xs font-medium">
              <Star size={11} className="fill-current" />
              {c.rating}
            </span>
          </div>
        </div>
      ))}

      {/* Height capped to 60–70% of the viewport */}
      <div className="relative z-10 mx-auto flex min-h-[60vh] max-h-[70vh] w-full max-w-[1400px] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
        <span
          style={{ background: panel, color: text, borderColor: border }}
          className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur"
        >
          ✨ AI-matched recommendations, updated daily
        </span>

        <h1
          style={{ color: text }}
          className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
        >
          A place worth staying,
          <br />
          matched to how you travel.
        </h1>

        <p style={{ color: subtext }} className="mt-3 max-w-md text-sm sm:text-base">
          Tell Nestly what you're into. We'll narrow thousands of stays down to
          the handful actually worth booking.
        </p>

        {/* Category chips — interactive */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map(({ label, icon: Icon }) => {
            const isActive = activeCategory === label;
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                style={{
                  background: isActive ? HIGHLIGHT : panel,
                  color: isActive ? "#1F2937" : text,
                  borderColor: border,
                }}
                className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition-colors sm:text-sm"
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Search pill */}
        <form
          onSubmit={handleSearch}
          style={{ background: isDark ? "#13161C" : "#FFFFFF" }}
          className="mt-6 flex w-full max-w-lg items-center gap-2 rounded-full p-1.5 shadow-lg"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <MapPin size={16} style={{ color: ACCENT }} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={`Search ${activeCategory.toLowerCase()}...`}
              style={{ color: "#1F2937" }}
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            style={{ background: PRIMARY }}
            className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* CTA buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/auth/login/register"
            style={{ background: HIGHLIGHT, color: "#1F2937" }}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-opacity hover:opacity-90"
          >
            Get started free
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/auth/login"
            style={{ background: panel, color: text, borderColor: border }}
            className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold backdrop-blur transition-opacity hover:opacity-80"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Scroll cue — clear visual flow into the next section */}
      <a
        href="#explore"
        aria-label="Scroll to explore section"
        style={{ color: text }}
        className="relative z-10 mb-4 flex w-full animate-bounce items-center justify-center"
      >
        <ChevronDown size={22} />
      </a>
    </section>
  );
}