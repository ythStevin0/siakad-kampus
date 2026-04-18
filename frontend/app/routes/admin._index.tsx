import { useOutletContext } from "react-router";

type OutletContext = { user: { email: string; role: string; name: string } | null };

// Kartu statistik (dummy — nanti dari API)
const stats = [
  {
    label: "Total Mahasiswa",
    value: "0",
    sub: "Terdaftar di sistem",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    label: "Total Dosen",
    value: "0",
    sub: "Pengajar aktif",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    label: "Mata Kuliah Aktif",
    value: "0",
    sub: "Semester ini",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      </svg>
    ),
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    label: "KRS Pending",
    value: "0",
    sub: "Menunggu persetujuan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>
      </svg>
    ),
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

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
];

// Riwayat aktivitas (dummy — nanti dari audit log)
const recentActivity = [
  { id: 1, action: "Login berhasil", actor: "admin@admin.uisi.ac.id", time: "Baru saja", type: "info" },
  { id: 2, action: "Sistem siap digunakan", actor: "System", time: "Hari ini", type: "success" },
];

export default function AdminIndex() {
  const { user } = useOutletContext<OutletContext>();

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
        <div className="text-xs text-zinc-600 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
          ADMINISTRATOR
        </div>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-xl border p-5 flex items-start gap-4 ${stat.bg}`}
          >
            <div className={`mt-0.5 shrink-0 ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-zinc-100 leading-tight">{stat.value}</p>
              <p className="text-sm font-medium text-zinc-300 mt-0.5">{stat.label}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
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
              <a
                key={i}
                href={action.to}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border text-sm font-medium transition-all duration-150 ${action.color}`}
              >
                {action.icon}
                {action.label}
              </a>
            ))}
          </div>

          {/* Info Panel */}
          <div className="mt-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-4">
            <p className="text-xs text-zinc-500 leading-relaxed">
              <span className="text-zinc-300 font-medium">Petunjuk: </span>
              Semua perubahan data melalui panel Admin ini akan langsung tercatat dan memengaruhi akses seluruh pengguna sistem. Pastikan data yang dimasukkan sudah benar sebelum disimpan.
            </p>
          </div>
        </div>

        {/* Recent Activity / Audit Log */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Riwayat Aktivitas</h2>
          </div>

          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
                <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${item.type === "success" ? "bg-emerald-500" : "bg-blue-500"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-300 font-medium leading-tight">{item.action}</p>
                  <p className="text-xs text-zinc-600 truncate mt-0.5">{item.actor}</p>
                </div>
                <span className="text-[11px] text-zinc-600 shrink-0">{item.time}</span>
              </div>
            ))}

            <div className="flex flex-col items-center justify-center py-6 text-zinc-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <p className="text-xs">Audit log penuh akan tersedia setelah data awal dimasukkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
