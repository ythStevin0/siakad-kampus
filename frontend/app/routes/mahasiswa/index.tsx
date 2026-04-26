import { useOutletContext } from "react-router";
import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import { fetchBerita, type Berita } from "../../lib/api";

// Aplikasi / Menu SSO Cards (sesuai Gapura UISI referensi)
const appCards = [
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
];

// Dummy berita dihapus karena akan mengambil dari API


type OutletContext = { user: { email: string; role: string; name: string } | null; roleLabel: string };

export default function DashboardIndex() {
  const { user, roleLabel } = useOutletContext<OutletContext>();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);

  useEffect(() => {
    fetchBerita().then(setBeritaList).catch(() => setBeritaList([]));
  }, []);

  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Pengguna";

  return (
    <div className="space-y-6">
      {/* Header + Welcome Banner */}
      <div>
        <h1 className="text-2xl font-light text-zinc-100 mb-1">Beranda <span className="text-zinc-500 font-normal text-lg">{roleLabel}</span></h1>
      </div>

      {/* Welcome Banner */}
      <div className="rounded-xl bg-white/5 border border-white/10 px-6 py-4 backdrop-blur-md">
        <p className="text-sm text-zinc-300">
          <span className="text-zinc-500">Beranda Gapura UISI &mdash;</span>{" "}
          Halo <strong className="text-zinc-100">{user?.name || firstName}</strong>, selamat datang di sistem single sign-on Universitas Internasional Semen Indonesia.
        </p>
      </div>

      {/* Grid: Kiri (Profil) + Kanan (Berita) */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Profil Card */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-6 flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>

          {/* Identitas */}
          <div>
            <p className="font-semibold text-zinc-100 text-base">{user?.name || firstName}</p>
            <p className="text-xs font-semibold tracking-widest text-red-400 mt-0.5">{roleLabel}</p>
          </div>

          {/* Tombol Perubahan Password */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 text-sm hover:bg-red-600/30 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Perubahan Password
          </button>

          {/* Detail Kontak */}
          <div className="w-full space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span className="truncate">{user?.email || "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.94 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>-</span>
            </div>
          </div>
        </div>

        {/* Berita */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-6 space-y-4">
          {/* Header Berita */}
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
              <path d="M4 6h2"/><path d="M4 10h2"/><path d="M16 14H8"/><path d="M16 10H8"/>
            </svg>
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Berita</h2>
          </div>

          <div className="space-y-3">
            {beritaList.length > 0 ? (
              beritaList.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedBerita(item)}
                  className="group cursor-pointer border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors leading-snug">
                    {item.judul}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed line-clamp-1">{item.isi}</p>
                  <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-wider">
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-600 italic">Belum ada berita terbaru.</p>
            )}
          </div>
        </div>
      </div>

      {/* Grid Aplikasi SSO */}
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

      {/* Modal Detail Berita */}
      {selectedBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBerita(null)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-zinc-100 mb-2">{selectedBerita.judul}</h2>
              <p className="text-xs text-zinc-500 mb-6 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {new Date(selectedBerita.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedBerita.isi}
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
              <button 
                onClick={() => setSelectedBerita(null)}
                className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
