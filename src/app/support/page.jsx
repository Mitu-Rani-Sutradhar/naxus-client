"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Mail,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  LifeBuoy,
  Send,
  CheckCircle2,
} from "lucide-react";

/**
 * Nestly — Support page
 * Same visual language as Hero/Blog (PRIMARY/ACCENT/HIGHLIGHT palette,
 * soft pill chips, rounded glass-ish panels).
 *
 * Sections:
 * - Header with search-the-help-center input
 * - Quick contact channel cards (email / chat / phone)
 * - FAQ accordion (filterable by the search input)
 * - Contact form with a success state
 */

const PRIMARY = "#4F46E5";
const ACCENT = "#0D9488";
const HIGHLIGHT = "#F59E0B";

const faqs = [
  {
    question: "How do I cancel or modify a booking?",
    answer:
      "Go to Dashboard → Bookings, open the reservation, and choose Modify or Cancel. Refund eligibility depends on the host's cancellation policy shown on that booking.",
  },
  {
    question: "When will I be charged for a stay?",
    answer:
      "Most bookings charge the full amount at checkout. Some longer stays split payment into two charges — you'll see the schedule before you confirm.",
  },
  {
    question: "How do I contact a host before booking?",
    answer:
      "Open the listing and select Message host. You can ask about availability, amenities, or check-in details before you commit.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. Payments are processed by a PCI-compliant provider — Nestly never stores your full card number on its own servers.",
  },
  {
    question: "How do I become a host on Nestly?",
    answer:
      "Go to Dashboard → Become a host, add your property details and photos, set your price, and submit for review. Most listings go live within 48 hours.",
  },
  {
    question: "What if I have a problem during my stay?",
    answer:
      "Use the Report an issue button on your booking page, or contact support directly below — urgent issues are prioritized 24/7.",
  },
];

const channels = [
  {
    icon: Mail,
    title: "Email us",
    detail: "support@nestly.com",
    note: "Replies within 24 hours",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    detail: "Available 9am–9pm",
    note: "Fastest for booking issues",
  },
  {
    icon: Phone,
    title: "Call us",
    detail: "+1 (800) 555-0173",
    note: "For urgent, active stays",
  },
];

export default function Support() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
  );

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  }

  return (
    <section className="relative w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span
            style={{ background: "rgba(79,70,229,0.08)", color: PRIMARY }}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
          >
            <LifeBuoy size={13} />
            Support center
          </span>

          <h1 className="mt-4 max-w-xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            How can we help?
          </h1>

          <p className="mt-3 max-w-md text-sm text-gray-500 sm:text-base">
            Search common questions or reach the team directly — whichever's faster.
          </p>

          <div className="mt-6 flex w-full max-w-md items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Contact channels */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {channels.map(({ icon: Icon, title, detail, note }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-2xl border border-gray-100 p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white"
              >
                <Icon size={18} />
              </div>
              <p className="mt-3 text-sm font-bold text-gray-900">{title}</p>
              <p className="mt-1 text-sm font-medium" style={{ color: PRIMARY }}>
                {detail}
              </p>
              <p className="mt-1 text-xs text-gray-400">{note}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Frequently asked questions
          </h2>

          <div className="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-100">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-900 sm:text-base">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={18} style={{ color: PRIMARY }} className="shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="shrink-0 text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-sm leading-relaxed text-gray-500">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">
                No articles match "{query}". Try the contact form below.
              </p>
            )}
          </div>
        </div>

        {/* Contact form */}
        <div className="mt-16 rounded-2xl border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Still stuck? Send us a message
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            We'll get back to you at the email you provide, usually within a day.
          </p>

          {submitted ? (
            <div className="mt-6 flex flex-col items-center rounded-xl bg-emerald-50 px-6 py-10 text-center">
              <CheckCircle2 size={28} style={{ color: ACCENT }} />
              <p className="mt-3 text-sm font-semibold text-gray-900">
                Message sent
              </p>
              <p className="mt-1 text-sm text-gray-500">
                We'll reply to {form.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What's going on?"
                  required
                  rows={4}
                  className="resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="submit"
                style={{ background: PRIMARY }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
              >
                Send message
                <Send size={15} />
              </button>
            </form>
          )}
        </div>

        {/* Footer link back */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            style={{ color: PRIMARY }}
            className="flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
          >
            Back to home
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}