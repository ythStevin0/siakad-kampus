import { Outlet, NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { logout } from "../lib/auth";

function getUserFromStorage(): { email: string; role: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("siakad_user");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const adminMenus = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="12" rx="1"/><rect width="7" height="9" x="3" y="16" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Kelola Mahasiswa",
    to: "/admin/mahasiswa",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: "Kelola Dosen",
    to: "/admin/dosen",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    label: "Mata Kuliah",
    to: "/admin/mata-kuliah",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      </svg>
    ),
  },
  {
    label: "Kelola Kelas",
    to: "/admin/kelas",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
      </svg>
    ),
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
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const stored = getUserFromStorage();
    if (!stored || stored.role !== "admin") {
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

  const formatDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase();
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      {/* Sidebar Admin — solid, bukan transparent */}
      <aside
        className={`
          flex flex-col bg-zinc-900 border-r border-zinc-800
          transition-all duration-300 ease-in-out shrink-0
          ${sidebarOpen ? "w-60" : "w-0 overflow-hidden lg:w-16"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-zinc-800 shrink-0">
          <div className="w-7 h-7 bg-linear-to-br from-red-600 to-red-700 rounded flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 8 8 8 13C8 15.2091 9.79086 17 12 17C14.2091 17 16 15.2091 16 13C16 8 12 2 12 2Z" fill="white"/>
              <path d="M6.5 6C6.5 6 3 11 4 14.5C4.79526 17.2831 8.5 17.5 12 17.5C15.5 17.5 19.2047 17.2831 20 14.5C21 11 17.5 6 17.5 6C17.5 6 14 11 12 11C10 11 6.5 6 6.5 6Z" fill="rgba(255,255,255,0.75)"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold tracking-wider text-zinc-100 leading-tight whitespace-nowrap">SIAKAD UISI</p>
              <p className="text-[10px] text-red-500 font-semibold tracking-widest">ADMIN PANEL</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-3 space-y-0.5 px-2 overflow-y-auto">
          {adminMenus.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                ${isActive
                  ? "bg-red-600/15 text-red-400 border border-red-600/25"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-zinc-800 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-red-600/10 hover:text-red-400 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 flex items-center justify-between px-5 bg-zinc-900 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            </button>
            <div className="text-xs text-zinc-600 font-mono tabular-nums hidden sm:block">
              {formatDate(time)} &nbsp; {formatTime(time)}
            </div>
          </div>

          {/* Profil Admin */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-800">
              <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-xs font-bold text-red-400">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-zinc-200 leading-tight max-w-[120px] truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-red-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-zinc-950 p-6">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
