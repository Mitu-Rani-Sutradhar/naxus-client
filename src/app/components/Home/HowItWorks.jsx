"use client";

import {
  Search,
  Sparkles,
  CreditCard,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Your Destination",
    description:
      "Tell us where you want to go and what type of stay you're looking for.",
  },
  {
    icon: Sparkles,
    title: "Get AI Recommendations",
    description:
      "Our AI analyzes your preferences and suggests the best matching stays.",
  },
  {
    icon: CreditCard,
    title: "Book Instantly",
    description:
      "Compare options, choose your favorite property, and book securely.",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Your Stay",
    description:
      "Travel confidently with verified properties and trusted experiences.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-slate-950 py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md">
            How It Works
          </span>

          <h2 className="mt-5 text-4xl font-bold text-white">
            Find your perfect stay in minutes
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            A simple process designed to help travelers discover,
            compare, and book amazing places effortlessly.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500">
                  <Icon className="text-white" size={24} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}