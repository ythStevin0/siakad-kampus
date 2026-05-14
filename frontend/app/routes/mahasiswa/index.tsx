import { useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { fetchBerita, type Berita } from "../../lib/api";
import { getPasswordHistory } from "../../lib/auth";

// Sub-komponen yang telah diekstrak
import ProfileCard from "../../components/dashboard/ProfileCard";
import NewsSection from "../../components/dashboard/NewsSection";
import LayananGrid from "../../components/dashboard/LayananGrid";
import NewsModal from "../../components/dashboard/NewsModal";
import PasswordHistoryModal from "../../components/dashboard/PasswordHistoryModal";

interface OutletContext {
  user: { email: string; role: string; name: string } | null;
  roleLabel: string;
}

export default function DashboardIndex() {
  const { user, roleLabel } = useOutletContext<OutletContext>();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);
  
  // State Riwayat Password
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Efek untuk mengambil berita saat mount
  useEffect(() => {
    let isMounted = true;
    fetchBerita()
      .then((data) => {
        if (isMounted) setBeritaList(data);
      })
      .catch(() => {
        if (isMounted) setBeritaList([]);
      });
    return () => { isMounted = false; };
  }, []);

  // Handler untuk menampilkan riwayat password
  const handleShowHistory = async () => {
    setIsHistoryModalOpen(true);
    setIsLoadingHistory(true);
    try {
      const data = await getPasswordHistory();
      setPasswordHistory(data);
    } catch (err) {
      console.error("Gagal mengambil riwayat password:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "Pengguna";

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Page Header - Masterpiece Style */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1ea39e]" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Universitas Internasional Semen Indonesia</span>
        </div>
        <h1 className="text-4xl font-black text-zinc-100 tracking-tight uppercase">
          Beranda <span className="text-[#1ea39e]">{roleLabel}</span>
        </h1>
      </div>

      {/* Welcome Banner - Premium Glass */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1ea39e]/5 border border-[#1ea39e]/20 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1ea39e]/10 blur-3xl rounded-full -mr-20 -mt-20 animate-pulse" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#1ea39e]/20 items-center justify-center text-[#1ea39e] shrink-0 border border-[#1ea39e]/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <p className="text-sm md:text-base text-zinc-300 font-medium leading-relaxed">
            <span className="text-[10px] font-black text-[#1ea39e] uppercase tracking-[0.25em] block mb-2 opacity-70">Sistem Single Sign-On Gapura UISI</span>
            Halo <strong className="text-white font-black uppercase tracking-tight">{user?.name || firstName}</strong>, selamat datang kembali di gerbang digital kampus. Kelola seluruh aktivitas akademik Anda dengan satu pintu yang terintegrasi.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        <div className="animate-in slide-in-from-left-4 duration-700 delay-100">
          <ProfileCard 
            user={user} 
            roleLabel={roleLabel} 
            onShowHistory={handleShowHistory} 
          />
        </div>
        
        <div className="animate-in slide-in-from-right-4 duration-700 delay-200">
          <NewsSection 
            beritaList={beritaList} 
            onSelectBerita={setSelectedBerita} 
          />
        </div>
      </div>

      {/* Services Section */}
      <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
        <LayananGrid />
      </div>

      {/* Modals Section */}
      <NewsModal 
        berita={selectedBerita} 
        onClose={() => setSelectedBerita(null)} 
      />

      <PasswordHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        isLoading={isLoadingHistory}
        history={passwordHistory}
      />
    </div>
  );
}
