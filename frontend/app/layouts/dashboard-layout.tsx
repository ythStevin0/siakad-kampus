import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { logout, getAccessToken } from "../lib/auth";

// Import broken-down components
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { MessageBox } from "../components/layout/MessageBox";
import { PasswordModal } from "../components/layout/PasswordModal";

// Helper to get user from localStorage safely
const getUserFromStorage = () => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [user, setUser] = useState(getUserFromStorage);
  
  const roleLabelMap: Record<string, string> = {
    mahasiswa: "Mahasiswa",
    dosen: "Dosen",
    admin: "Administrator",
  };

  useEffect(() => {
    // Re-sync user dari localStorage setiap kali halaman berpindah
    const freshUser = getUserFromStorage();
    setUser(freshUser);
    if (!freshUser) navigate("/login");
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isSiakad = location.pathname.startsWith("/dashboard/krs") || location.search.includes("view=");

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-red-600/30">
      {/* Campus Background with Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/bg-kampus.png" 
          alt="UISI Campus" 
          className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/5 blur-[120px]" />
      </div>

      <Header 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isSiakad={isSiakad}
        user={user}
        onLogout={handleLogout}
        onChangePassword={() => setIsPasswordModalOpen(true)}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          role={user?.role || "mahasiswa"}
          isSiakad={isSiakad}
          onOpenMessage={() => setIsMessageBoxOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-black/20 custom-scrollbar relative flex flex-col">
          <div className="max-w-[1400px] p-4 sm:p-8 flex-1">
            <Outlet context={{ user, roleLabel: roleLabelMap[user?.role || ""], token: getAccessToken() ?? "" }} />

          </div>
          
          <footer className="mt-auto py-6 px-8 border-t border-white/5 text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex flex-col sm:flex-row justify-between items-center gap-4">
             <p>2015 © <span className="text-zinc-500 hover:text-[#1ea39e] transition-colors cursor-pointer">Universitas Internasional Semen Indonesia</span></p>
             <div className="flex gap-6">
                <span className="hover:text-zinc-400 transition-colors cursor-pointer">Panduan Pengguna</span>
                <span className="hover:text-zinc-400 transition-colors cursor-pointer">Kebijakan Privasi</span>
             </div>
          </footer>
        </main>
      </div>

      <MessageBox 
        isOpen={isMessageBoxOpen} 
        onClose={() => setIsMessageBoxOpen(false)} 
        user={user}
        sidebarOpen={sidebarOpen}
      />

      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
