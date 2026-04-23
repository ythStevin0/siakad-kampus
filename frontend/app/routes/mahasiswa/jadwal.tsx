export default function Jadwal() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-light text-zinc-100">Jadwal <span className="text-zinc-500 text-lg">Perkuliahan</span></h1>
      <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-12 flex flex-col items-center justify-center gap-3 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <p className="text-zinc-500 text-sm">Fitur Jadwal sedang dalam pengembangan</p>
        <p className="text-zinc-700 text-xs">Coming soon — Phase 7</p>
      </div>
    </div>
  );
}
