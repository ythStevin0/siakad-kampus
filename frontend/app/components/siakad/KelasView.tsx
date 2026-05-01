interface KelasViewProps {
  availableKelas: any[];
  loading: boolean;
}

export function KelasView({ availableKelas, loading }: KelasViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          Detail Kelas <span className="text-zinc-500 font-normal text-sm lowercase tracking-normal">Manage</span>
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          <a href="?view=dashboard" className="hover:text-[#1ea39e] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline mr-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Home
          </a>
          <span className="text-zinc-700">&rsaquo;</span>
          <span className="text-zinc-400">Detail Kelas</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1ea39e" strokeWidth="3"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
          <h3 className="text-xs font-black text-[#1ea39e] uppercase tracking-widest">Daftar Kelas</h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-5">
          <div className="flex items-center">
            <label className="w-44 text-[11px] font-bold text-zinc-500 uppercase text-right mr-8">Program Studi:</label>
            <select className="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-[#1ea39e] transition-colors cursor-pointer appearance-none">
              <option>-- Pilih Programstudi --</option>
              <option>S1 Informatika</option>
              <option>S1 Sistem Informasi</option>
              <option>S1 Manajemen Rekayasa</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="w-44 text-[11px] font-bold text-zinc-500 uppercase text-right mr-8">Tahun Akademik:</label>
            <select className="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-[#1ea39e] transition-colors cursor-pointer appearance-none">
              <option>2025/2026 - Genap</option>
              <option>2025/2026 - Ganjil</option>
              <option>2024/2025 - Genap</option>
            </select>
          </div>

          <div className="flex justify-center pt-4">
            <button className="px-8 py-2.5 rounded-lg bg-[#3498db] hover:bg-[#2980b9] text-[11px] font-black text-white shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 uppercase group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:scale-110 transition-transform"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6" className="hidden"/></svg>
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Lihat
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="h-px w-full bg-white/5 mb-6" />
          <h4 className="text-sm font-bold text-zinc-500 italic">Mata Kuliah</h4>
        </div>
      </div>
    </div>
  );
}
