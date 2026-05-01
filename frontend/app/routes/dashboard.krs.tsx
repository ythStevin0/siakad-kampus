import { useOutletContext, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { 
  fetchAvailableKelas, 
  fetchKRS, 
  enrollKelas, 
  dropKelas, 
  type Kelas, 
  type KRS 
} from "../lib/api";

// Import broken-down views
import { DashboardHome } from "../components/siakad/DashboardHome";
import { KRSForm } from "../components/siakad/KRSForm";
import { KelasView } from "../components/siakad/KelasView";
import { MonitoringView } from "../components/siakad/MonitoringView";
import { KuesionerView } from "../components/siakad/KuesionerView";

interface User {
  email: string;
  role: string;
  name: string;
}

interface OutletContext {
  user: User | null;
  roleLabel: string;
}

export default function SIAKADContainer() {
  const { user } = useOutletContext<OutletContext>();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "dashboard";

  const [availableKelas, setAvailableKelas] = useState<Kelas[]>([]);
  const [myKRS, setMyKRS] = useState<KRS[]>([]);
  const [loading, setLoading] = useState(true);
  const currentSemester = "2025/2026 Genap";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [kelasData, krsData] = await Promise.all([
          fetchAvailableKelas(currentSemester),
          fetchKRS(currentSemester)
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
  }, [currentSemester]);

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

  // Routing Logic
  if (view === "form") {
    return <KRSForm user={user} availableKelas={availableKelas} myKRS={myKRS} onEnroll={handleEnroll} onDrop={handleDrop} />;
  }

  if (view === "kelas") {
    return <KelasView availableKelas={availableKelas} loading={loading} />;
  }

  if (view === "monitoring") {
    return <MonitoringView myKRS={myKRS} loading={loading} />;
  }

  if (view === "kuesioner") {
    return <KuesionerView myKRS={myKRS} loading={loading} />;
  }

  return <DashboardHome user={user} myKRS={myKRS} />;
}
