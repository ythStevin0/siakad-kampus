interface KuesionerViewProps {
  myKRS: any[];
  loading: boolean;
}

export function KuesionerView({ myKRS, loading }: KuesionerViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          Kuesioner <span className="text-zinc-500 font-normal text-sm lowercase tracking-normal">Evaluasi Pembelajaran</span>
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          <a href="?view=dashboard" className="hover:text-[#1ea39e] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline mr-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Home
          </a>
          <span className="text-zinc-700">&rsaquo;</span>
          <span className="text-zinc-400">Kuesioner</span>
        </div>
      </div>

      {/* Amber Info Box */}
      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-6 backdrop-blur-md">
        <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Kuesioner</h3>
      </div>

      {/* Main Section */}
      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1ea39e" strokeWidth="3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h3 className="text-xs font-black text-[#1ea39e] uppercase tracking-widest">Daftar Kuesioner</h3>
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5 max-w-md">
          <div className="flex items-center gap-4">
            <label className="text-[11px] font-bold text-zinc-500 uppercase whitespace-nowrap">Tahun Ajaran :</label>
            <select className="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#1ea39e] cursor-pointer">
              <option>2025/2026 - Genap</option>
              <option>2025/2026 - Ganjil</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <th className="px-6 py-4 w-12 text-center">No.</th>
                <th className="px-6 py-4">Kode</th>
                <th className="px-6 py-4">Mata Kuliah</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Dosen</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[12px] text-zinc-300">
              {myKRS.map((item: any, i: number) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-center font-bold text-zinc-500">{i + 1}</td>
                  <td className="px-6 py-4 font-mono text-zinc-400">{item.kode_kelas}</td>
                  <td className="px-6 py-4 font-bold text-zinc-200">{item.nama_mata_kuliah}</td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold">IF-4A</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">Taufiqotul Bariyah, S.Kom., M.IM.</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 text-[9px] font-black uppercase">
                      Belum Diisi
                    </span>
                  </td>
                </tr>
              ))}
              {myKRS.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 italic">Tidak ada daftar kuesioner yang harus diisi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
