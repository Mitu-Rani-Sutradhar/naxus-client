const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Marketing Lead",
    avatar: "S",
    quote:
      "NaxusAI completely changed how our team works. We saved hours every week using these tools.",
    rating: 5,
  },
  {
    name: "James Okafor",
    role: "Founder, StartupX",
    avatar: "J",
    quote:
      "The variety of AI tools available here is incredible. Everything I need is in one place.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Product Designer",
    avatar: "P",
    quote:
      "Super easy to use and the quality of the tools is genuinely impressive. Highly recommend.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">What Our Users Say</h2>
        <p className="text-gray-500">Trusted by thousands of users worldwide.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(({ name, role, avatar, quote, rating }) => (
          <div
            key={name}
            className="border rounded-xl p-6 bg-white hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < rating ? "text-yellow-400" : "text-gray-200"}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="text-gray-700 text-sm flex-1 mb-4">&quot;{quote}&quot;</p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {avatar}
              </div>
              <div>
                <p className="font-medium text-sm">{name}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}