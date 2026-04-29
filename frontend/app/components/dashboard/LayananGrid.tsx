import { NavLink } from "react-router";
import type { ReactNode } from "react";

interface AppCard {
  id: string;
  label: string;
  to: string;
  icon: ReactNode;
  color: string;
  iconColor: string;
}

const appCards: AppCard[] = [
  {
    id: "siakad",
    label: "Sistem Informasi Akademik",
    to: "/dashboard/krs",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>
      </svg>
    ),
    color: "from-blue-600/30 to-blue-900/20 border-blue-600/30 hover:border-blue-500/50",
    iconColor: "text-blue-400",
  },
  {
    id: "kehadiran",
    label: "Sistem Kehadiran Perkuliahan",
    to: "/dashboard/jadwal",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
        <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
        <path d="m9 16 2 2 4-4"/>
      </svg>
    ),
    color: "from-emerald-600/30 to-emerald-900/20 border-emerald-600/30 hover:border-emerald-500/50",
    iconColor: "text-emerald-400",
  },
  {
    id: "cari-user",
    label: "Pencarian User & Dosen",
    to: "/dashboard/cari-user",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
    ),
    color: "from-violet-600/30 to-violet-900/20 border-violet-600/30 hover:border-violet-500/50",
    iconColor: "text-violet-400",
  },
  {
    id: "peminjaman",
    label: "Sistem Peminjaman Ruang",
    to: "/dashboard",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    color: "from-orange-600/30 to-orange-900/20 border-orange-600/30 hover:border-orange-500/50",
    iconColor: "text-orange-400",
  },
  {
    id: "repository",
    label: "Repository UISI",
    to: "/dashboard",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      </svg>
    ),
    color: "from-amber-600/30 to-amber-900/20 border-amber-600/30 hover:border-amber-500/50",
    iconColor: "text-amber-400",
  },
  {
    id: "uisilink",
    label: "UISI Link",
    to: "/dashboard",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    color: "from-cyan-600/30 to-cyan-900/20 border-cyan-600/30 hover:border-cyan-500/50",
    iconColor: "text-cyan-400",
  },
  {
    id: "uisipay",
    label: "UISI Pay (Pembayaran)",
    to: "/dashboard/uisi-pay",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><line x1="7" x2="7.01" y1="15" y2="15"/><line x1="11" x2="11.01" y1="15" y2="15"/>
      </svg>
    ),
    color: "from-amber-500/30 to-amber-900/20 border-amber-500/30 hover:border-amber-400/50",
    iconColor: "text-amber-400",
  },
];

export default function LayananGrid() {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase px-1">Layanan Akademik</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {appCards.map((card) => (
          <NavLink
            key={card.id}
            to={card.to}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-linear-to-br border backdrop-blur-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${card.color}`}
          >
            <span className={card.iconColor}>{card.icon}</span>
            <p className="text-xs font-medium text-zinc-300 text-center leading-tight">{card.label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
