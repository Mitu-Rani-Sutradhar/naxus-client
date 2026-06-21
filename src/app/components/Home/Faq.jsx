"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does Nestly find personalized recommendations?",
    answer:
      "Our AI analyzes your travel preferences, budget, destination interests, and booking behavior to recommend stays that best match your needs.",
  },
  {
    question: "Are all properties verified?",
    answer:
      "Yes. Every property goes through a verification process to ensure quality, safety, and accuracy before being listed.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Cancellation policies depend on the property host. You can view the cancellation terms before confirming any reservation.",
  },
  {
    question: "Is there a service fee?",
    answer:
      "Some bookings may include service fees depending on the property and location. All fees are shown transparently before checkout.",
  },
  {
    question: "How do I contact property owners?",
    answer:
      "After booking, you'll get direct access to communicate with the property owner through the Nestly platform.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />

      {/* Glow Effects */}
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute right-20 bottom-20 h-72 w-72 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md">
            Frequently Asked Questions
          </span>

          <h2 className="mt-5 text-4xl font-bold text-white">
            Got Questions?
          </h2>

          <p className="mt-4 text-white/60">
            Everything you need to know about booking, payments,
            recommendations, and your travel experience.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-white">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`transition-transform duration-300 text-white ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-white/70">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-teal-500/10 p-8 text-center backdrop-blur-xl">
          <h3 className="text-2xl font-bold text-white">
            Still have questions?
          </h3>

          <p className="mt-3 text-white/60">
            Our support team is available 24/7 to help you plan
            your perfect stay.
          </p>

          <button className="mt-6 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}