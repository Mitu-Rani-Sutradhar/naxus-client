import { Sparkles, Zap, ShieldCheck, Rocket } from "lucide-react";

const highlights = [
  {
    icon: Sparkles,
    title: "AI-Powered Tools",
    description: "Access dozens of curated AI tools built to boost your productivity.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results instantly without complicated setup or configuration.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Your data is protected with industry-standard security practices.",
  },
  {
    icon: Rocket,
    title: "Always Growing",
    description: "New AI tools and features added regularly to keep you ahead.",
  },
];

export default function Highlights() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Why Choose NaxusAI</h2>
        <p className="text-gray-500">Everything you need, in one platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="border rounded-xl p-6 text-center hover:shadow-md transition-shadow bg-white"
          >
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-black text-white">
              <Icon size={22} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}