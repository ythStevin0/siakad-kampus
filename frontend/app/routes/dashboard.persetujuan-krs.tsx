export default function PersetujuanKRS() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-light text-zinc-100">Persetujuan <span className="text-zinc-500 text-lg">KRS</span></h1>
      <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-12 flex flex-col items-center justify-center gap-3 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <p className="text-zinc-500 text-sm">Fitur Persetujuan KRS untuk Dosen sedang dalam pengembangan</p>
        <p className="text-zinc-700 text-xs">Coming soon — Phase 6</p>
      </div>
    </div>
  );
}
