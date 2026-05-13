interface DocCardProps {
  label: string;
  sub: string;
  color: string;
  type: string;
}

export function DocCard({ label, sub, color, type }: DocCardProps) {
  const isYellow = color.includes("f1c40f");
  
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/10 p-4 h-32 flex flex-col justify-between shadow-lg transition-all hover:scale-[1.03] active:scale-[0.97] hover:bg-zinc-900/60 hover:border-white/20">
      {/* Accent Background Glow */}
      <div className={`absolute -top-10 -left-10 w-24 h-24 ${color.split(' ')[0]} opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1.5">
           <div className={`w-1.5 h-1.5 rounded-full ${color.split(' ')[0]}`} />
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{type === 'UNDUH' ? 'Document' : 'Link'}</p>
        </div>
        <p className="text-sm font-black text-zinc-100 leading-tight tracking-tight group-hover:text-[#1ea39e] transition-colors">{label}</p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">{sub}</p>
      </div>

      <div className="relative z-10 flex justify-between items-center text-[10px] font-black tracking-[0.15em] text-zinc-400 group-hover:text-zinc-200 transition-colors">
        {type}
        <div className={`p-1 rounded-lg ${color.split(' ')[0]} bg-opacity-20`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={color.split(' ')[0].replace('bg-', 'text-')}>
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
      
      {/* Decorative Icon */}
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="absolute -bottom-2 -right-2 opacity-5 text-white group-hover:opacity-10 transition-opacity">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      </svg>
    </div>
  );
}
