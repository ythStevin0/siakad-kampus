export function YudisiumView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          Pendaftaran Yudisium <span className="text-zinc-500 font-normal text-lg">Online</span>
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          <span>&rsaquo;</span>
          <span className="text-zinc-400">Yudisium</span>
          <span>&rsaquo;</span>
          <span className="text-zinc-400">Pendaftaran</span>
        </div>
      </div>

      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 bg-zinc-900/20 rounded-3xl border border-white/5">
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-[#1ea39e] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-zinc-900 border border-white/10 p-10 rounded-full shadow-2xl backdrop-blur-xl">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1ea39e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-500 uppercase tracking-[0.3em]">
            Segera Hadir
          </h2>
          <div className="h-1 w-20 bg-[#1ea39e] mx-auto rounded-full"></div>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest max-w-xs leading-relaxed">
            Mohon maaf, fitur ini akan segera mendatang
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Status: In Progress</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
            <span>Release: Next Phase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
