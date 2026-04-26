import { useOutletContext } from "react-router";
import { useState, useEffect, type ReactNode } from "react";
import { fetchAdminStats, fetchBerita, type AdminStats, type Berita } from "../../lib/api";

type OutletContext = { user: { email: string; role: string; name: string } | null };

// Quick action buttons
const quickActions = [
  {
    label: "Tambah Mahasiswa",
    to: "/admin/mahasiswa",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <line x1="12" x2="12" y1="14" y2="20"/><line x1="9" x2="15" y1="17" y2="17"/>
      </svg>
    ),
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  },
  {
    label: "Tambah Dosen",
    to: "/admin/dosen",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        <line x1="12" x2="12" y1="17" y2="23"/><line x1="9" x2="15" y1="20" y2="20"/>
      </svg>
    ),
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  {
    label: "Tambah Mata Kuliah",
    to: "/admin/mata-kuliah",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        <line x1="12" x2="12" y1="6" y2="12"/><line x1="9" x2="15" y1="9" y2="9"/>
      </svg>
    ),
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20",
  },
  {
    label: "Manajemen Akun",
    to: "/admin/akun",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
  },
  {
    label: "Posting Berita",
    to: "/admin/berita",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
        <path d="M16 14H8"/><path d="M16 10H8"/>
      </svg>
    ),
    color: "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20",
  },
];

// Komponen kartu statistik individual
function StatCard({
  label, sub, value, loading, icon, color, bg,
}: {
  label: string; sub: string; value: number | string;
  loading: boolean; icon: ReactNode; color: string; bg: string;
}) {
  return (
    <div className={`rounded-xl border p-5 flex items-start gap-4 ${bg}`}>
      <div className={`mt-0.5 shrink-0 ${color}`}>{icon}</div>
      <div>
        {loading ? (
          <div className="h-8 w-12 bg-zinc-800 rounded animate-pulse mb-1" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100 leading-tight">{value}</p>
        )}
        <p className="text-sm font-medium text-zinc-300 mt-0.5">{label}</p>
        <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function AdminIndex() {
  const { user } = useOutletContext<OutletContext>();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setErrorStats(err.message))
      .finally(() => setLoadingStats(false));

    fetchBerita().then(setBeritaList).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Dashboard Admin</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Selamat datang, <span className="text-zinc-300">{user?.name || "Admin"}</span>. Berikut ringkasan sistem SIAKAD.
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
          ADMINISTRATOR
        </div>
      </div>

      {/* Error Banner */}
      {errorStats && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          ⚠️ Gagal memuat statistik: {errorStats}. Pastikan server backend sudah berjalan.
        </div>
      )}

      {/* Kartu Statistik — data dari API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Mahasiswa" sub="Terdaftar di sistem"
          value={stats?.total_mahasiswa ?? 0} loading={loadingStats}
          color="text-blue-400" bg="bg-blue-500/10 border-blue-500/20"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard
          label="Total Dosen" sub="Pengajar aktif"
          value={stats?.total_dosen ?? 0} loading={loadingStats}
          color="text-emerald-400" bg="bg-emerald-500/10 border-emerald-500/20"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
        />
        <StatCard
          label="Mata Kuliah Aktif" sub="Semester ini"
          value={stats?.total_matkul ?? 0} loading={loadingStats}
          color="text-violet-400" bg="bg-violet-500/10 border-violet-500/20"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>}
        />
        <StatCard
          label="KRS Pending" sub="Menunggu persetujuan"
          value="—" loading={false}
          color="text-amber-400" bg="bg-amber-500/10 border-amber-500/20"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>}
        />
      </div>

      {/* Grid: Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Quick Actions */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Aksi Cepat</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <a key={i} href={action.to}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border text-sm font-medium transition-all duration-150 ${action.color}`}
              >
                {action.icon}
                {action.label}
              </a>
            ))}
          </div>
          <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-4">
            <p className="text-xs text-zinc-500 leading-relaxed">
              <span className="text-zinc-300 font-medium">Petunjuk: </span>
              Semua perubahan data melalui panel Admin ini akan langsung tercatat dan memengaruhi akses seluruh pengguna sistem.
            </p>
          </div>
        </div>

        {/* Recent Berita — Visual Matching User Reference */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
            </svg>
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Berita Terakhir</h2>
          </div>
          <div className="space-y-4">
            {beritaList.length > 0 ? (
              beritaList.slice(0, 4).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedBerita(item)}
                  className="group cursor-pointer border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-[13px] font-medium text-blue-400 group-hover:text-blue-300 transition-colors leading-snug">
                    {item.judul}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5 line-clamp-1">{item.isi}</p>
                  <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-wider">
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-zinc-700 gap-2">
                 <p className="text-xs italic">Belum ada berita diposting</p>
              </div>
            )}
          </div>
          <a href="/admin/berita" className="block text-center text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest pt-2">
            Lihat Semua Berita &rsaquo;
          </a>
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
