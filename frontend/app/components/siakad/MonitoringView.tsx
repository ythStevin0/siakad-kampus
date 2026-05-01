interface MonitoringViewProps {
  myKRS: any[];
  loading: boolean;
}

export function MonitoringView({ myKRS, loading }: MonitoringViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          Monitoring <span className="text-zinc-500 font-normal text-lg">Perkuliahan</span>
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          <a href="?view=dashboard" className="hover:text-[#1ea39e] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline mr-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Home
          </a>
          <span className="text-zinc-700">&rsaquo;</span>
          <span className="text-zinc-400">Monitoring Perkuliahan</span>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/40 border border-white/10 p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1ea39e" strokeWidth="3"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
            <h3 className="text-xs font-black text-[#1ea39e] uppercase tracking-widest">Status Kehadiran</h3>
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-zinc-400 focus:outline-none cursor-pointer">
            <option>2025/2026 - Genap</option>
            <option>2025/2026 - Ganjil</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <th className="px-6 py-4">Mata Kuliah</th>
                <th className="px-6 py-4 text-center">Hadir</th>
                <th className="px-6 py-4 text-center">Izin/Sakit</th>
                <th className="px-6 py-4 text-center">Alpa</th>
                <th className="px-6 py-4">Persentase</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[12px] text-zinc-300">
              {myKRS.map((item: any) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-200">{item.nama_mata_kuliah}</p>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter mt-0.5">{item.kode_kelas}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-500">14</td>
                  <td className="px-6 py-4 text-center text-amber-500">0</td>
                  <td className="px-6 py-4 text-center text-red-500">0</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-[10px] font-black mt-1 text-emerald-400">100%</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase">
                      Memenuhi
                    </span>
                  </td>
                </tr>
              ))}
              {myKRS.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 italic">Belum ada data monitoring.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
