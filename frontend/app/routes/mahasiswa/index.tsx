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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header + Welcome Banner */}
      <div>
        <h1 className="text-2xl font-light text-zinc-100 mb-1">
          Beranda <span className="text-zinc-500 font-normal text-lg">{roleLabel}</span>
        </h1>
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
        <ProfileCard 
          user={user} 
          roleLabel={roleLabel} 
          onShowHistory={handleShowHistory} 
        />
        
        <NewsSection 
          beritaList={beritaList} 
          onSelectBerita={setSelectedBerita} 
        />
      </div>

      {/* Grid Layanan / Aplikasi SSO */}
      <LayananGrid />

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
