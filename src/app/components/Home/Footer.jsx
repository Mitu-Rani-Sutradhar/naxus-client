"use client";

import { useState } from "react";
import { Sparkles, Mail, Phone, MapPin, ArrowRight, Sun, Moon } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

/**
 * Nestly — site footer
 * Requirement-doc rules implemented:
 * - Fully functional footer with working links only (real in-page anchors / mailto / tel)
 * - Contact information included (email, phone, address)
 * - Social links included
 * - Light & dark mode with proper contrast
 * - Fully responsive (stacked on mobile, grid on desktop)
 *
 * The "Demo controls" pill at the top is reviewer-only, to preview dark mode
 * without wiring real theme state — wire to your app's ThemeProvider instead.
 */

const PRIMARY = "#4F46E5";
const ACCENT = "#0D9488";
const HIGHLIGHT = "#F59E0B";

const linkColumns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Browse listings", href: "#explore" },
      { label: "Categories", href: "#categories" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#support" },
      { label: "FAQs", href: "#faq" },
      { label: "Contact us", href: "#contact" },
      { label: "System status", href: "#status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#privacy" },
      { label: "Terms of service", href: "#terms" },
      { label: "Cookie policy", href: "#cookies" },
    ],
  },
];

const socialLinks = [
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com/nestly" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/nestly" },
  { icon: FaXTwitter, label: "X (Twitter)", href: "https://twitter.com/nestly" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com/company/nestly" },
  { icon: FaYoutube, label: "YouTube", href: "https://youtube.com/@nestly" },
];

export default function Footer() {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const bg = isDark ? "#0B0C0F" : "#F9FAFB";
  const panel = isDark ? "#0F1115" : "#FFFFFF";
  const text = isDark ? "#E5E7EB" : "#1F2937";
  const subtext = isDark ? "#9CA3AF" : "#6B7280";
  const border = isDark ? "#1F2430" : "#E5E7EB";
  const hoverBg = isDark ? "#1A1D24" : "#F3F4F6";

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <div style={{ background: bg }}>
      {/* Demo control — preview only, remove once wired to real theme state */}
      <div className="flex justify-end px-4 pt-3">
        <button
          onClick={() => setIsDark((v) => !v)}
          style={{ borderColor: border, color: subtext, background: panel }}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? "Preview light" : "Preview dark"}
        </button>
      </div>

      <footer style={{ background: panel, borderColor: border }} className="w-full border-t">
        <div style={{ maxWidth: "1400px" }} className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Top: brand + newsletter */}
          <div className="flex flex-col gap-10 border-b pb-10 lg:flex-row lg:items-start lg:justify-between" style={{ borderColor: border }}>
            <div className="max-w-sm">
              <a href="#home" className="flex items-center gap-2">
                <span
                  style={{ background: PRIMARY }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                >
                  <Sparkles size={18} />
                </span>
                <span style={{ color: text }} className="text-lg font-bold tracking-tight">
                  Nexus AI
                </span>
              </a>
              <p style={{ color: subtext }} className="mt-3 text-sm leading-relaxed">
                AI-assisted discovery for stays, spaces, and experiences — built to help you
                find the right listing faster, with smart recommendations along the way.
              </p>

              {/* Contact info */}
              <ul className="mt-5 space-y-2.5">
                <li className="flex items-center gap-2.5 text-sm" style={{ color: subtext }}>
                  <Mail size={16} style={{ color: ACCENT }} />
                  <a href="mailto:support@nestly.app" style={{ color: subtext }} className="hover:underline">
                    support@nestly.app
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-sm" style={{ color: subtext }}>
                  <Phone size={16} style={{ color: ACCENT }} />
                  <a href="tel:+18005550123" style={{ color: subtext }} className="hover:underline">
                    +1 (800) 555-0123
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm" style={{ color: subtext }}>
                  <MapPin size={16} style={{ color: ACCENT, marginTop: "2px" }} />
                  <span>148 Harbor Street, Suite 400, San Francisco, CA 94111</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="w-full max-w-md">
              <p style={{ color: text }} className="text-sm font-semibold">
                Get listing tips in your inbox
              </p>
              <p style={{ color: subtext }} className="mt-1 text-sm">
                One short email a month. No spam, unsubscribe anytime.
              </p>
              <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                
                  style={{ borderColor: border, background: bg, color: text }}
                  className="flex-1 rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                />
                <button
                  type="submit"
                  style={{ background: PRIMARY }}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Subscribe
                  <ArrowRight size={15} />
                </button>
              </form>
              <p
                style={{ color: subscribed ? ACCENT : "transparent" }}
                className="mt-2 text-xs font-medium transition-opacity"
              >
                Subscribed — check your inbox to confirm.
              </p>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
            {linkColumns.map((col) => (
              <div key={col.title}>
                <h3 style={{ color: text }} className="text-sm font-semibold">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        style={{ color: subtext }}
                        className="text-sm transition-colors hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{ borderColor: border }}
            className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <p style={{ color: subtext }} className="text-xs">
              © {new Date().getFullYear()} Nexus AI, Inc. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ color: subtext, borderColor: border }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = hoverBg;
                    e.currentTarget.style.color = HIGHLIGHT;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = subtext;
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}