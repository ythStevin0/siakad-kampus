import { useOutletContext, useSearchParams, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { 
  fetchAvailableKelas, 
  fetchKRS, 
  enrollKelas, 
  dropKelas, 
  fetchProfilKRS,
  type Kelas, 
  type KRS 
} from "../lib/api";

// Import broken-down views
import { DashboardHome } from "../components/siakad/DashboardHome";
import { KRSForm } from "../components/siakad/KRSForm";
import { KelasView } from "../components/siakad/KelasView";
import { MonitoringView } from "../components/siakad/MonitoringView";
import { KuesionerView } from "../components/siakad/KuesionerView";
import { KHSView } from "../components/siakad/KHSView";
import { RiwayatStudiView } from "../components/siakad/RiwayatStudiView";
import { VerifikasiDataView } from "../components/siakad/VerifikasiDataView";
import { YudisiumView } from "../components/siakad/YudisiumView";
import { TranskripView } from "../components/siakad/TranskripView";
import { DosenWaliPortal } from "../components/dosen/DosenWaliPortal";

interface User {
  email: string;
  role: string;
  name: string;
  token?: string;
}

interface OutletContext {
  user: User | null;
  roleLabel: string;
  token?: string;
}

export default function SIAKADContainer() {
  const { user, token } = useOutletContext<OutletContext & { token?: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get("view") || "dashboard";

  const [availableKelas, setAvailableKelas] = useState<Kelas[]>([]);
  const [myKRS, setMyKRS] = useState<KRS[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSemester, setCurrentSemester] = useState("");

  // Jika role dosen, tampilkan portal dosen langsung
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");
  if (user?.role === "dosen") {
    return (
      <div className="relative pt-8">
        <div className="absolute top-0 right-0 no-print z-50">
          <a 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 hover:bg-[#1ea39e]/20 border border-white/10 hover:border-[#1ea39e]/50 text-[10px] font-black text-zinc-400 hover:text-[#1ea39e] transition-all backdrop-blur-xl group shadow-2xl"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover:-translate-x-1">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            KEMBALI KE GAPURA UISI
          </a>
        </div>
        <DosenWaliPortal token={authToken} />
      </div>
    );
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Ambil profil dulu untuk dapat semester akademik yang tepat
        const profil = await fetchProfilKRS();
        setCurrentSemester(profil.semester_akademik);

        const [kelasData, krsData] = await Promise.all([
          fetchAvailableKelas(profil.semester_akademik),
          fetchKRS(profil.semester_akademik)
        ]);
        setAvailableKelas(kelasData);
        setMyKRS(krsData);
      } catch (err) {
        console.error("Gagal mengambil data akademik:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEnroll = async (kelasId: string) => {
    try {
      await enrollKelas(kelasId, currentSemester);
      const krsData = await fetchKRS(currentSemester);
      setMyKRS(krsData);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDrop = async (krsId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan mata kuliah ini?")) return;
    try {
      await dropKelas(krsId);
      const krsData = await fetchKRS(currentSemester);
      setMyKRS(krsData);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const renderView = () => {
    switch (view) {
      case "form":
        return <KRSForm user={user} availableKelas={availableKelas} myKRS={myKRS} onEnroll={handleEnroll} onDrop={handleDrop} />;
      case "kelas":
        return <KelasView availableKelas={availableKelas} loading={loading} />;
      case "monitoring":
        return <MonitoringView myKRS={myKRS} loading={loading} />;
      case "kuesioner":
        return <KuesionerView myKRS={myKRS} loading={loading} />;
      case "khs":
        return <KHSView user={user} />;
      case "riwayat":
        return <RiwayatStudiView user={user} />;
      case "verifikasi":
        return <VerifikasiDataView user={user} />;
      case "yudisium-form":
        return <YudisiumView />;
      case "transkrip":
        return <TranskripView user={user} />;
      default:
        return <DashboardHome user={user} myKRS={myKRS} />;
    }
  };

  return (
    <div className="relative pt-8">
      {/* Global Back Button - Always shows in SIAKAD to go back to Gapura */}
      <div className="absolute top-0 right-0 no-print z-50">
        <a 
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 hover:bg-[#1ea39e]/20 border border-white/10 hover:border-[#1ea39e]/50 text-[10px] font-black text-zinc-400 hover:text-[#1ea39e] transition-all backdrop-blur-xl group shadow-2xl"
        >
          <svg 
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          KEMBALI KE GAPURA UISI
        </a>
      </div>
      
      {renderView()}
    </div>
  );
}
