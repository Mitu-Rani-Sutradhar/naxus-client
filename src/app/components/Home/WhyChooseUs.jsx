"use client";

import {
  Sparkles,
  ShieldCheck,
  Zap,
  HeartHandshake,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description:
      "Our recommendation engine analyzes your preferences and finds the perfect stay for your travel style.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Properties",
    description:
      "Every property is carefully reviewed to ensure quality, safety, and a trustworthy booking experience.",
  },
  {
    icon: Zap,
    title: "Instant Discovery",
    description:
      "Smart filtering and recommendations help you discover great places faster.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted by Travelers",
    description:
      "Thousands of travelers rely on Nestly to find memorable stays worldwide.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="explore"
      className="relative overflow-hidden bg-slate-950 py-24"
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
            <Sparkles size={14} />
            Why Choose Nestly
          </span>

          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Travel smarter, stay better.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
            Discover handpicked stays powered by intelligent recommendations,
            trusted reviews, and seamless booking experiences.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              value: "15K+",
              label: "Verified Stays",
            },
            {
              value: "98%",
              label: "Guest Satisfaction",
            },
            {
              value: "120+",
              label: "Destinations",
            },
            {
              value: "24/7",
              label: "Support",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl"
            >
              <h3 className="text-3xl font-bold text-white">
                {item.value}
              </h3>

              <p className="mt-2 text-sm text-white/60">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/40 hover:bg-white/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500">
                  <Icon size={22} className="text-white" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}