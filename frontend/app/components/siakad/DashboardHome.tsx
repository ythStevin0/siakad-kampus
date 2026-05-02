import { type KRS } from "../../lib/api";
import { StatCard } from "./shared/StatCard";
import { DocCard } from "./shared/DocCard";

interface DashboardHomeProps {
  user: any;
  myKRS: KRS[];
}

export function DashboardHome({ user, myKRS }: DashboardHomeProps) {
  const dataMahasiswa = {
    nama: user?.name || "Stevino Adi Nugroho",
    nim: "3012410047",
    prodi: "Informatika",
    dosenWali: "Taufiqotul Bariyah, S.Kom., M.IM., MCE",
    semesterAktif: "2025/2026 Genap",
    semesterKe: 0,
    ipk: 3.28,
    totalSks: 56,
    frsDiSetujui: { mk: myKRS.length, sks: myKRS.reduce((a, b) => a + b.sks, 0) },
    kuesioner: "Sudah Diisi / Tidak Wajib"
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Page Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          Dashboard <span className="text-zinc-500 font-normal text-lg">Mahasiswa</span>
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <span>Home</span>
          <span>&rsaquo;</span>
          <span className="text-zinc-400">Dashboard</span>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{dataMahasiswa.nama}</h2>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span className="font-mono">{dataMahasiswa.nim}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <span className="flex items-center gap-1.5">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                   {dataMahasiswa.prodi}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1ea39e]"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="font-medium">Dosen Wali:</span> 
                <span className="text-zinc-300">{dataMahasiswa.dosenWali}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1ea39e]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                <span className="font-medium">Semester Aktif:</span>
                <span className="text-zinc-300">{dataMahasiswa.semesterAktif}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1ea39e]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span className="font-medium">Semester Ke:</span>
                <span className="text-zinc-300">{dataMahasiswa.semesterKe}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition-all flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7.5 20 7.5"/></svg>
              Transkrip Nilai
            </button>
            <a href="?view=form" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              FRS
            </a>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1ea39e]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="IPK Kumulatif" value={dataMahasiswa.ipk} color="bg-[#1ea39e]" icon={<path d="M12 20v-6M6 20V10M18 20V4"/>} link="LIHAT TRANSKRIP" shadow="shadow-[#1ea39e]/20" />
        <StatCard label="Total SKS Diambil & Diakui" value={dataMahasiswa.totalSks} color="bg-[#2d7fb9]" icon={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} link="LIHAT TRANSKRIP" shadow="shadow-[#2d7fb9]/20" />
        <StatCard label={`${dataMahasiswa.frsDiSetujui.mk} MK · ${dataMahasiswa.frsDiSetujui.sks} SKS`} value="FRS Disetujui" color="bg-[#d65d4b]" icon={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} link="LIHAT FRS" shadow="shadow-[#d65d4b]/20" />
        <StatCard label={dataMahasiswa.kuesioner} value="Kuesioner" color="bg-[#7b5297]" icon={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} link="LIHAT KUESIONER" shadow="shadow-[#7b5297]/20" />
      </div>

      {/* Table Section */}
      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 overflow-hidden backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#1ea39e]"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              Mata Kuliah Semester Ini <span className="text-zinc-500 font-medium lowercase">— {dataMahasiswa.semesterAktif}</span>
            </h3>
          </div>
          <a href="?view=form" className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-[10px] font-bold text-zinc-300 hover:bg-zinc-700 transition-all flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            Buka FRS
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-black/20">
                <th className="px-6 py-3 w-12 text-center">#</th>
                <th className="px-6 py-3">Mata Kuliah</th>
                <th className="px-6 py-3">Kode</th>
                <th className="px-6 py-3 text-center">SKS</th>
                <th className="px-6 py-3">Kelas</th>
                <th className="px-6 py-3 text-center">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[13px] text-zinc-300">
              {myKRS.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-zinc-600 italic">Belum ada mata kuliah yang disetujui.</td></tr>
              ) : (
                myKRS.map((item, i) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-3.5 text-center font-bold text-zinc-500">{i + 1}</td>
                    <td className="px-6 py-3.5 font-bold text-white group-hover:text-[#1ea39e] transition-colors">{item.nama_mata_kuliah}</td>
                    <td className="px-6 py-3.5 font-mono text-xs">{item.kode_kelas}</td>
                    <td className="px-6 py-3.5 text-center font-black">{item.sks}</td>
                    <td className="px-6 py-3.5 text-zinc-400 font-medium">Reguler</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500 font-bold">-</span>
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-black/20 font-bold text-zinc-400 text-[11px] uppercase tracking-widest">
                <td colSpan={3} className="px-6 py-3 text-right">Total SKS Diambil</td>
                <td className="px-6 py-3 text-center text-white text-sm">{myKRS.reduce((a,b) => a + b.sks, 0)}</td>
                <td colSpan={2} className=""></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7.5 20 7.5"/></svg>
           <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Dokumen & Tautan</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <DocCard label="Jadwal Perkuliahan" sub="Gasal 2025/2026" color="bg-[#e67e22]" type="UNDUH" />
          <DocCard label="Kalender Akademik" sub="2025-2026" color="bg-[#e74c3c]" type="UNDUH" />
          <DocCard label="Peraturan Akademik" sub="versi 2025" color="bg-[#8e44ad]" type="UNDUH" />
          <DocCard label="Tata Kehidupan Kampus" sub="UISI" color="bg-[#7f8c8d]" type="UNDUH" />
          <DocCard label="Layanan Akademik" sub="UISI" color="bg-[#2c3e50]" type="BUKA" />
          <DocCard label="Panduan Upload Mandiri" sub="Masterpiece UISI 202x" color="bg-[#f1c40f] text-black" type="UNDUH" />
        </div>
      </div>
    </div>
  );
}
