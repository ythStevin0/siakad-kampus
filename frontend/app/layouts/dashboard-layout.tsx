import { Outlet, NavLink, useNavigate } from "react-router";
import { useState, useEffect, type ReactNode } from "react";
import { logout, getAccessToken } from "../lib/auth";

// Tipe untuk data user dari JWT (nanti akan diambil dari context/state)
// Sementara kita parse manual dari localStorage sebagai simulasi
function getUserFromStorage(): { email: string; role: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("siakad_user");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

// Definisi menu berdasarkan role
const menuByRole: Record<string, { label: string; to: string; icon: ReactNode }[]> = {
  mahasiswa: [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="5" x="14" y="12" rx="1"/><rect width="7" height="9" x="3" y="16" rx="1"/>
        </svg>
      ),
    },
    {
      label: "Cari User",
      to: "/dashboard/cari-user",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      ),
    },
    {
      label: "KRS",
      to: "/dashboard/krs",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
    {
      label: "Jadwal",
      to: "/dashboard/jadwal",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      ),
    },
  ],
  dosen: [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="5" x="14" y="12" rx="1"/><rect width="7" height="9" x="3" y="16" rx="1"/>
        </svg>
      ),
    },
    {
      label: "Cari User",
      to: "/dashboard/cari-user",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      ),
    },
    {
      label: "Persetujuan KRS",
      to: "/dashboard/persetujuan-krs",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
    {
      label: "Jadwal Mengajar",
      to: "/dashboard/jadwal",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      ),
    },
  ],
  admin: [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="5" x="14" y="12" rx="1"/><rect width="7" height="9" x="3" y="16" rx="1"/>
        </svg>
      ),
    },
    {
      label: "Cari User",
      to: "/dashboard/cari-user",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      ),
    },
    {
      label: "Master Data",
      to: "/dashboard/master-data",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/>
          <path d="M3 12A9 3 0 0 0 21 12"/>
        </svg>
      ),
    },
  ],
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const stored = getUserFromStorage();
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(stored);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("siakad_user");
    navigate("/login");
  };

  const role = user?.role || "mahasiswa";
  const menus = menuByRole[role] || menuByRole.mahasiswa;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase();
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const roleLabel: Record<string, string> = {
    mahasiswa: "MAHASISWA",
    dosen: "DOSEN",
    admin: "ADMINISTRATOR",
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100"
      style={{
        backgroundImage: "url('/bg-dashboard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay gelap agar konten terbaca */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="relative z-20 flex items-center justify-between px-4 py-0 h-14 bg-black/40 border-b border-white/10 backdrop-blur-md">
        {/* Kiri: Logo + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-linear-to-br from-red-600 to-red-700 rounded flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 8 8 8 13C8 15.2091 9.79086 17 12 17C14.2091 17 16 15.2091 16 13C16 8 12 2 12 2Z" fill="white"/>
                <path d="M6.5 6C6.5 6 3 11 4 14.5C4.79526 17.2831 8.5 17.5 12 17.5C15.5 17.5 19.2047 17.2831 20 14.5C21 11 17.5 6 17.5 6C17.5 6 14 11 12 11C10 11 6.5 6 6.5 6Z" fill="rgba(255,255,255,0.75)"/>
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wider">
              GAPURA<span className="text-red-500">UISI</span>
            </span>
          </div>
        </div>

        {/* Kanan: Waktu + Notif + Profil */}
        <div className="flex items-center gap-4">
          {/* Notif Bell */}
          <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>

          {/* Profil */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-zinc-300"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:block max-w-[120px] truncate">{user?.name || user?.email}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Body: Sidebar + Konten */}
      <div className="relative z-10 flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/10
            transition-all duration-300 ease-in-out overflow-hidden
            ${sidebarOpen ? "w-52" : "w-0 lg:w-14"}
          `}
        >
          <nav className="flex-1 mt-4 space-y-0.5 px-2">
            {menus.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
                  ${isActive
                    ? "bg-red-600/20 text-red-400 border border-red-600/30"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className={`whitespace-nowrap transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 lg:opacity-0"}`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Logout di bawah */}
          <div className="px-2 pb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-red-600/10 hover:text-red-400 transition-all duration-150"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
              <span className={`whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>Logout</span>
            </button>
          </div>
        </aside>

        {/* Konten Utama */}
        <main className="flex-1 overflow-auto">
          {/* Breadcrumb Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20 backdrop-blur-sm text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-zinc-600">&rsaquo;</span>
              <span className="text-zinc-400">Beranda</span>
            </div>
            <span className="text-zinc-500 font-mono tabular-nums">
              {formatDate(time)} {formatTime(time)}
            </span>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <Outlet context={{ user, roleLabel: roleLabel[role] || "USER" }} />
          </div>
        </main>
      </div>
    </div>
  );
}
