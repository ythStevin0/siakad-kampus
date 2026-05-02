import { useState } from "react";

interface KHSItem {
  id: string;
  kode: string;
  mataKuliah: string;
  sks: number;
  nilai: string;
  bobot: number;
  total: number;
}

export function KHSView({ user }: { user: any }) {
  const [tahunAkademik, setTahunAkademik] = useState("2025/2026 - Genap");

  const khsData: KHSItem[] = [
    { id: "1", kode: "IF-13AD13", mataKuliah: "Analisis Data Eksploratif", sks: 3, nilai: "-", bobot: 0, total: 0 },
    { id: "2", kode: "IF-13AK13", mataKuliah: "Analisis Kebutuhan Perangkat Lunak", sks: 3, nilai: "-", bobot: 0, total: 0 },
    { id: "3", kode: "IF-13KB13", mataKuliah: "Kecerdasan Buatan", sks: 3, nilai: "-", bobot: 0, total: 0 },
    { id: "4", kode: "IF-13MB13", mataKuliah: "Manajemen Basis Data", sks: 3, nilai: "-", bobot: 0, total: 0 },
    { id: "5", kode: "DT13PW13", mataKuliah: "Pemrograman Web", sks: 3, nilai: "-", bobot: 0, total: 0 },
    { id: "6", kode: "IF13WL12", mataKuliah: "Wawasan Lingkungan", sks: 2, nilai: "-", bobot: 0, total: 0 },
    { id: "7", kode: "DT13DP13", mataKuliah: "Desain Pengalaman Pengguna", sks: 3, nilai: "-", bobot: 0, total: 0 },
  ];

  const totalSks = khsData.reduce((acc, curr) => acc + curr.sks, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          Hasil Studi Mahasiswa <span className="text-zinc-500 font-normal text-lg">Tampilan</span>
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span>&rsaquo;</span>
          <span className="text-zinc-400">Hasil Studi Mahasiswa</span>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-md shadow-xl space-y-8">
        <div className="flex justify-between items-start border-b border-white/5 pb-4">
           <h3 className="text-[#1ea39e] font-black text-xs uppercase tracking-[0.2em]">Hasil Studi Mahasiswa</h3>
           <button className="px-4 py-2 rounded-lg bg-[#2d7fb9] hover:bg-[#246a9b] text-white text-[11px] font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
             Cetak
           </button>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px]">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="w-32 text-zinc-500 font-bold uppercase text-[11px] tracking-wider">Nama</span>
              <span className="text-zinc-400 mr-2">:</span>
              <span className="text-zinc-100 font-bold">{user?.name || "Stevino Adi Nugroho"}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-zinc-500 font-bold uppercase text-[11px] tracking-wider">NIM</span>
              <span className="text-zinc-400 mr-2">:</span>
              <span className="text-zinc-100 font-mono">3012410047</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="w-40 text-zinc-500 font-bold uppercase text-[11px] tracking-wider">Programstudi</span>
              <span className="text-zinc-400 mr-2">:</span>
              <span className="text-zinc-100 font-bold">Informatika</span>
            </div>
            <div className="flex items-center">
              <span className="w-40 text-zinc-500 font-bold uppercase text-[11px] tracking-wider">Tahun Akademik</span>
              <span className="text-zinc-400 mr-2">:</span>
              <select 
                value={tahunAkademik}
                onChange={(e) => setTahunAkademik(e.target.value)}
                className="bg-zinc-800/50 border border-white/10 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-[#1ea39e] transition-colors min-w-[200px]"
              >
                <option value="2025/2026 - Genap">2025/2026 - Genap</option>
                <option value="2024/2025 - Ganjil">2024/2025 - Ganjil</option>
              </select>
            </div>
          </div>
        </div>

        {/* KHS Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-white/5">
                <th className="px-6 py-4 text-center w-12">No.</th>
                <th className="px-6 py-4">Kode</th>
                <th className="px-6 py-4">Mata Kuliah</th>
                <th className="px-6 py-4 text-center">SKS</th>
                <th className="px-6 py-4 text-center">Nilai</th>
                <th className="px-6 py-4 text-center">Bobot</th>
                <th className="px-6 py-4 text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {khsData.map((item, index) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3.5 text-center text-zinc-500 font-bold">{index + 1}</td>
                  <td className="px-6 py-3.5 font-mono text-zinc-400 text-xs">{item.kode}</td>
                  <td className="px-6 py-3.5 font-bold text-zinc-200">{item.mataKuliah}</td>
                  <td className="px-6 py-3.5 text-center font-bold">{item.sks}</td>
                  <td className="px-6 py-3.5 text-center text-zinc-500">{item.nilai}</td>
                  <td className="px-6 py-3.5 text-center text-zinc-500">{item.bobot}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-zinc-300">{item.total}</td>
                </tr>
              ))}
              <tr className="bg-white/5 font-black text-xs uppercase tracking-widest text-zinc-400">
                <td colSpan={3} className="px-6 py-4 text-left">Total</td>
                <td className="px-6 py-4 text-center text-white">{totalSks}</td>
                <td colSpan={2} className="px-6 py-4"></td>
                <td className="px-6 py-4 text-center text-white">0</td>
              </tr>
              <tr className="border-t border-white/10 font-black text-xs uppercase tracking-[0.2em] text-zinc-500">
                <td colSpan={3} className="px-6 py-6 text-left">IP Semester</td>
                <td colSpan={4} className="px-6 py-6 text-right text-white text-lg tracking-normal">0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
