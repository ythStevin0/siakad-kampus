export default function KRS() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-light text-zinc-100">Kartu Rencana Studi <span className="text-zinc-500 text-lg">(KRS)</span></h1>
      <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-12 flex flex-col items-center justify-center gap-3 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p className="text-zinc-500 text-sm">Fitur KRS sedang dalam pengembangan</p>
        <p className="text-zinc-700 text-xs">Coming soon — Phase 6</p>
      </div>
    </div>
  );
}
