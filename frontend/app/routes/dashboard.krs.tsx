// KRS Dashboard - Verified fixed JSX syntax and stray characters
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { 
  fetchAvailableKelas, 
  fetchKRS, 
  enrollKelas, 
  dropKelas, 
  type Kelas, 
  type KRS 
} from "../lib/api";

interface OutletContext {
  user: { email: string; role: string; name: string } | null;
  roleLabel: string;
}

export default function KRSPage() {
  const { user } = useOutletContext<OutletContext>();
  const [activeTab, setActiveTab] = useState<"available" | "my-krs">("available");
  const [availableKelas, setAvailableKelas] = useState<Kelas[]>([]);
  const [myKRS, setMyKRS] = useState<KRS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentSemester = "Ganjil 2024/2025";

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kelasData, krsData] = await Promise.all([
        fetchAvailableKelas(currentSemester),
        fetchKRS(currentSemester)
      ]);
      setAvailableKelas(kelasData);
      setMyKRS(krsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (kelasId: string) => {
    try {
      await enrollKelas(kelasId, currentSemester);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDrop = async (krsId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan mata kuliah ini?")) return;
    try {
      await dropKelas(krsId);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalSKS = myKRS.reduce((acc, curr) => acc + curr.sks, 0);
  const filteredKelas = availableKelas.filter(k => 
    k.nama_mata_kuliah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.kode_kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-zinc-100">
            Kartu Rencana Studi <span className="text-zinc-500 text-lg">(KRS)</span>
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">
            Semester {currentSemester}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Total SKS</p>
            <p className="text-xl font-bold text-zinc-100">{totalSKS} <span className="text-xs font-normal text-zinc-500">/ 24</span></p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Mata Kuliah</p>
            <p className="text-xl font-bold text-zinc-100">{myKRS.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
        <button 
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "available" ? "bg-amber-500 text-zinc-950 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Ambil Mata Kuliah
        </button>
        <button 
          onClick={() => setActiveTab("my-krs")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "my-krs" ? "bg-amber-500 text-zinc-950 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          KRS Saya ({myKRS.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      ) : activeTab === "available" ? (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari mata kuliah atau kode kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKelas.map((k) => {
              const isEnrolled = myKRS.some(item => item.kelas_id === k.id);
              return (
                <div key={k.id} className="group relative rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 transition-all hover:bg-white/10 hover:border-white/20">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-zinc-100 leading-tight">{k.nama_mata_kuliah}</h3>
                      <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Kelas {k.kode_kelas} • {k.sks} SKS</p>
                    </div>
                    {isEnrolled && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">
                        Terambil
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {k.hari}, {k.jam_mulai.substring(0, 5)} - {k.jam_selesai.substring(0, 5)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Ruang {k.ruangan}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {k.nama_dosen}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                      Kuota: <span className={k.terisi >= k.kapasitas ? "text-red-400" : "text-zinc-300"}>{k.terisi} / {k.kapasitas}</span>
                    </div>
                    <button 
                      disabled={isEnrolled || k.terisi >= k.kapasitas}
                      onClick={() => handleEnroll(k.id)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        isEnrolled 
                          ? "bg-emerald-500/10 text-emerald-500 cursor-default" 
                          : k.terisi >= k.kapasitas
                            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                            : "bg-amber-500 text-zinc-950 hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isEnrolled ? "Terdaftar" : k.terisi >= k.kapasitas ? "Penuh" : "Ambil"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mata Kuliah</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">SKS</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jadwal</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {myKRS.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-zinc-600">Anda belum mengambil mata kuliah apa pun.</td>
                </tr>
              ) : (
                myKRS.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-100">{item.nama_mata_kuliah}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Kelas {item.kode_kelas} • {item.nama_dosen}</p>
                    </td>
                    <td className="px-6 py-4 text-center text-zinc-300 font-mono">{item.sks}</td>
                    <td className="px-6 py-4 text-xs text-zinc-400">
                      {item.hari}, {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        item.status === 'disetujui' 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : item.status === 'ditolak'
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'pending' && (
                        <button 
                          onClick={() => handleDrop(item.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Batalkan Mata Kuliah"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
