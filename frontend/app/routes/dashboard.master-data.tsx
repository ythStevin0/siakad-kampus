export default function MasterData() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-light text-zinc-100">Master <span className="text-zinc-500 text-lg">Data</span></h1>
      <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-12 flex flex-col items-center justify-center gap-3 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/>
          <path d="M3 12A9 3 0 0 0 21 12"/>
        </svg>
        <p className="text-zinc-500 text-sm">Fitur Master Data untuk Admin sedang dalam pengembangan</p>
        <p className="text-zinc-700 text-xs">Coming soon — Phase 8</p>
      </div>
    </div>
  );
}
