interface DocCardProps {
  label: string;
  sub: string;
  color: string;
  type: string;
}

export function DocCard({ label, sub, color, type }: DocCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${color} p-4 h-32 flex flex-col justify-between shadow-lg transition-all hover:scale-[1.03] active:scale-[0.97]`}>
      <div className="relative z-10">
        <p className="text-sm font-black leading-tight tracking-tight">{label}</p>
        <p className={`text-[10px] font-bold opacity-80 ${label.includes("Panduan") ? "text-black/60" : "text-white/60"}`}>{sub}</p>
      </div>
      <div className="relative z-10 flex justify-between items-center text-[10px] font-black tracking-widest opacity-80">
        {type}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
      </div>
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="absolute -bottom-4 -right-4 opacity-10"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
    </div>
  );
}
