"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRoleFromEmail, ROLES } from "@/lib/roles";
import { fetchTools } from "@/lib/api";
import { TrendingUp, TrendingDown, Wrench, Users, DollarSign, Activity, Lock, Star } from "lucide-react";

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, positive, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div>
        <p className="text-white text-2xl font-bold">{value}</p>
        <p className={`flex items-center gap-1 text-xs mt-1 ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </p>
      </div>
    </div>
  );
}

// ── SVG Bar Chart ──────────────────────────────────────────────────────────
function BarChart({ data, title }) {
  if (!data || data.length === 0) return <p className="text-slate-500 text-sm">No data</p>;
  const svgW = 700;
  const svgH = 220;
  const padL = 44;
  const padR = 10;
  const padT = 16;
  const padB = 44;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = Math.floor((chartW / data.length) * 0.52);
  const gap = chartW / data.length;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ height: 220 }}>
      <defs>
        <linearGradient id="anaBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padT + chartH * (1 - t);
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
              {Math.round(max * t)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barH = (d.value / max) * chartH;
        const x = padL + i * gap + (gap - barW) / 2;
        const y = padT + chartH - barH;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill="url(#anaBarGrad)" opacity="0.9" />
            <text x={x + barW / 2} y={svgH - padB + 14} textAnchor="middle" fill="#94a3b8" fontSize="9">
              {d.label.length > 7 ? d.label.slice(0, 6) + "…" : d.label}
            </text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="600">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── SVG Line Chart (Monthly) ───────────────────────────────────────────────
function MonthlyLineChart({ data, labels }) {
  const svgW = 700;
  const svgH = 200;
  const padL = 50;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);

  const pts = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * chartW;
    const y = padT + chartH - ((v - min) / (max - min || 1)) * chartH;
    return [x, y];
  });

  const polyline = pts.map((p) => p.join(",")).join(" ");
  const areaPath =
    `M ${pts[0][0]},${padT + chartH} ` +
    pts.map((p) => `L ${p[0]},${p[1]}`).join(" ") +
    ` L ${pts[pts.length - 1][0]},${padT + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ height: 200 }}>
      <defs>
        <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padT + chartH * (1 - t);
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="9">
              ${Math.round((min + (max - min) * t) / 1000)}k
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#revArea)" />
      <polyline points={polyline} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#a78bfa" stroke="#0f172a" strokeWidth="2" />
      ))}
      {labels.map((l, i) => (
        <text
          key={i}
          x={padL + (i / (data.length - 1)) * chartW}
          y={svgH - 4}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="9"
        >
          {l}
        </text>
      ))}
    </svg>
  );
}

// ── SVG Pie Chart ──────────────────────────────────────────────────────────
function PieChart({ slices }) {
  const cx = 80, cy = 80, r = 65;
  const colors = ["#6366f1", "#a78bfa", "#34d399"];
  let cumAngle = -Math.PI / 2;
  const total = slices.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg viewBox="0 0 160 160" style={{ width: 140, height: 140, flexShrink: 0 }}>
        {slices.map((s, i) => {
          const angle = (s.count / total) * 2 * Math.PI;
          const x1 = cx + r * Math.cos(cumAngle);
          const y1 = cy + r * Math.sin(cumAngle);
          cumAngle += angle;
          const x2 = cx + r * Math.cos(cumAngle);
          const y2 = cy + r * Math.sin(cumAngle);
          const large = angle > Math.PI ? 1 : 0;
          return (
            <path
              key={s.label}
              d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`}
              fill={colors[i % colors.length]}
              opacity="0.9"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={36} fill="#0f172a" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="#94a3b8" fontSize="8">tools</text>
      </svg>
      <ul className="space-y-2">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="text-slate-300">{s.label}</span>
            <span className="text-white font-semibold ml-auto pl-4">
              {Math.round((s.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { user } = useAuth();
  const role = getRoleFromEmail(user?.email);

  const [tools, setTools] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools({ limit: 200 })
      .then((d) => { setTools(d.tools || []); setTotal(d.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (role !== ROLES.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <Lock size={28} className="text-red-400" />
        </div>
        <h2 className="text-white font-semibold text-xl">Access Denied</h2>
        <p className="text-slate-400 text-sm text-center max-w-xs">
          Analytics are only available to admins.
        </p>
      </div>
    );
  }

  // Category bar chart data
  const categoryCounts = tools.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([label, value]) => ({ label, value }));

  // Pricing pie
  const pricingCounts = tools.reduce((acc, t) => {
    const k = t.pricingType || "Unknown";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const pricingSlices = Object.entries(pricingCounts).map(([label, count]) => ({ label, count }));

  // Monthly revenue (mock)
  const monthlyRevenue = [8200, 9400, 7800, 11200, 10500, 13400, 12100, 14800, 13200, 15600, 16100, 17300];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Top tools by rating
  const topTools = [...tools].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);

  const stats = [
    { icon: Wrench, label: "Total Tools", value: loading ? "—" : total.toLocaleString(), change: "+12% this month", positive: true, color: "bg-indigo-600" },
    { icon: Users, label: "Total Users", value: "1,247", change: "+8.1% this month", positive: true, color: "bg-violet-600" },
    { icon: DollarSign, label: "Monthly Revenue", value: "$17,300", change: "+7.5% vs last month", positive: true, color: "bg-amber-600" },
    { icon: Activity, label: "Avg. Rating", value: tools.length ? (tools.reduce((s, t) => s + (t.rating || 0), 0) / tools.length).toFixed(2) : "—", change: "+0.2 from last month", positive: true, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Tools by Category bar chart */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="text-white font-semibold text-base mb-4">Tools by Category</h2>
        {loading ? (
          <div className="h-[220px] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <BarChart data={categoryData} />
        )}
      </div>

      {/* Revenue Line + Pricing Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-white font-semibold text-base mb-1">Monthly Revenue</h2>
          <p className="text-slate-500 text-xs mb-4">12-month revenue trend (mock data)</p>
          <MonthlyLineChart data={monthlyRevenue} labels={months} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-white font-semibold text-base mb-4">Pricing Distribution</h2>
          {loading ? (
            <div className="h-[140px] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <PieChart slices={pricingSlices} />
          )}
        </div>
      </div>

      {/* Top Tools */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-base">Top Rated Tools</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="text-left text-slate-400 font-medium px-6 py-3">#</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">Tool</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">Category</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">Pricing</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">Rating</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading…</td>
                </tr>
              ) : topTools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No tools found</td>
                </tr>
              ) : (
                topTools.map((tool, idx) => (
                  <tr key={tool._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">#{idx + 1}</td>
                    <td className="px-4 py-3 text-white font-medium max-w-[180px] truncate">{tool.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{tool.pricingType}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        <Star size={12} fill="currentColor" />
                        {tool.rating?.toFixed(1) || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{tool.reviewCount || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
