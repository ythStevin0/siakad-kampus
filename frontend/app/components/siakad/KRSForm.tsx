import { useState } from "react";

interface KRSFormProps {
  user: any;
  availableKelas: any[];
  myKRS: any[];
  onEnroll: (kelasId: string) => void;
  onDrop: (krsId: string) => void;
}

export function KRSForm({ user, availableKelas, myKRS, onEnroll, onDrop }: KRSFormProps) {
  const [activeTab, setActiveTab] = useState("general");
  const dataMahasiswa = {
    nim: "3012410047",
    nama: user?.name || "Stevino Adi Nugroho",
    semester: "2025/2026 - Genap",
    ipSemesterLalu: "2.81",
    dosenWali: "Taufiqotul Bariyah, S.Kom., M.IM., MCE",
    prodi: "S1 Informatika"
  };

  const totalSks = myKRS.reduce((a: any, b: any) => a + b.sks, 0);
  const maxSks = 20;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            Formulir Rencana Studi <span className="text-zinc-500 font-normal text-sm lowercase tracking-normal">Cetak</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          <a href="?view=dashboard" className="hover:text-[#1ea39e] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline mr-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Home
          </a>
          <span className="text-zinc-700">&rsaquo;</span>
          <span className="text-zinc-400">Formulir Rencana Studi</span>
        </div>
      </div>

      {/* SECTION 1: PROFIL MAHASISWA */}
      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-md shadow-xl">
        <h3 className="text-xs font-black text-[#1ea39e] uppercase tracking-widest mb-6">Profil Mahasiswa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-24 text-[11px] font-bold text-zinc-500 uppercase">NIM:</label>
              <input readOnly value={dataMahasiswa.nim} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-[11px] font-bold text-zinc-500 uppercase">Nama:</label>
              <input readOnly value={dataMahasiswa.nama} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-24 text-[11px] font-bold text-zinc-500 uppercase">Semester:</label>
              <select disabled className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none appearance-none">
                <option>{dataMahasiswa.semester}</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="w-24 text-[11px] font-bold text-zinc-500 uppercase leading-tight">IP Semester Lalu:</label>
              <input readOnly value={dataMahasiswa.ipSemesterLalu} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none" />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1">
             <div className="flex items-start">
              <label className="w-24 text-[11px] font-bold text-zinc-500 uppercase pt-2">Dosen Wali:</label>
              <textarea readOnly rows={2} value={dataMahasiswa.dosenWali} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-[11px] font-black text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 uppercase">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Cetak KRS
          </button>
        </div>
      </div>

      {/* SECTION 2: STATUS APPROVAL */}
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3 text-emerald-400">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p className="text-xs font-medium italic">FRS sudah disetujui Dosen Wali</p>
      </div>

      {/* SECTION 3: FORMULIR ENTRI */}
      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-md shadow-xl">
        <h3 className="text-xs font-black text-[#1ea39e] uppercase tracking-widest mb-6">Formulir Entri</h3>
        
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button 
            onClick={() => setActiveTab("general")}
            className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === "general" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            FRS General
            {activeTab === "general" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />}
          </button>
          <button 
            onClick={() => setActiveTab("kampus")}
            className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === "kampus" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            FRS Kampus Berdampak
            {activeTab === "kampus" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />}
          </button>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          <div className="flex items-center">
            <label className="w-40 text-[11px] font-bold text-zinc-500 uppercase text-right mr-6">Program Studi:</label>
            <input readOnly value={dataMahasiswa.prodi} className="flex-1 bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-400 focus:outline-none" />
          </div>
          <div className="flex items-center">
            <label className="w-40 text-[11px] font-bold text-zinc-500 uppercase text-right mr-6">Mata Kuliah (Kelas):</label>
            <select className="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#1ea39e] transition-colors cursor-pointer">
              <option>-- Pilih Mata Kuliah --</option>
              {availableKelas.map((k: any) => (
                <option key={k.id} value={k.id}>{k.nama_mata_kuliah} ({k.kode_kelas}) - {k.sks} SKS</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-2">
            <button className="px-6 py-2 rounded-lg bg-[#3498db] hover:bg-[#2980b9] text-[11px] font-black text-white shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 uppercase">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Tambahkan
            </button>
          </div>
        </div>

        {/* SECTION 4: RENCANA STUDI TABLE */}
        <div className="mt-12 space-y-4">
          <div className="text-center mb-8">
            <h4 className="text-sm font-bold text-zinc-400">Rencana Studi</h4>
            <div className="h-px w-full bg-white/5 mt-4" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 px-2 mb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total SKS diambil: <span className="text-zinc-200">{totalSks}</span></p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SKS Tersisa: <span className="text-zinc-200">{maxSks - totalSks}</span></p>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest self-start">SKS yang boleh diambil: <span className="text-zinc-200">{maxSks}</span></p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Kode</th>
                  <th className="px-6 py-4">Mata Kuliah</th>
                  <th className="px-6 py-4">Kelas</th>
                  <th className="px-6 py-4">Programstudi</th>
                  <th className="px-6 py-4 text-center">SKS</th>
                  <th className="px-6 py-4">Nilai Target</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[12px] text-zinc-300">
                {myKRS.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-500">{item.kode_kelas}</td>
                    <td className="px-6 py-4 font-bold text-zinc-200">{item.nama_mata_kuliah}</td>
                    <td className="px-6 py-4">
                       <span className="bg-[#1ea39e]/10 text-[#1ea39e] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border border-[#1ea39e]/20">
                         IF-4A
                       </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">S1 Informatika</td>
                    <td className="px-6 py-4 text-center font-black text-zinc-100">{item.sks}</td>
                    <td className="px-6 py-4">
                      <select className="bg-zinc-800/50 border border-white/10 rounded-md px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-[#1ea39e] cursor-pointer">
                        <option>A</option>
                        <option>AB</option>
                        <option>B</option>
                        <option>BC</option>
                        <option>C</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => onDrop(item.id)} className="px-3 py-1 rounded bg-red-600/20 text-red-500 border border-red-600/30 text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end gap-6 pt-6">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">IP Target: <span className="text-white text-sm ml-2">3.85</span></p>
            <button className="px-8 py-2.5 rounded-xl bg-[#1ea39e] hover:bg-[#188f88] text-[12px] font-black text-white shadow-xl shadow-[#1ea39e]/20 transition-all flex items-center gap-2 uppercase">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
               Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
