import type { Berita } from "../../lib/api";

interface NewsSectionProps {
  beritaList: Berita[];
  onSelectBerita: (berita: Berita) => void;
}

export default function NewsSection({ beritaList, onSelectBerita }: NewsSectionProps) {
  return (
    <div className="relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl p-8 shadow-2xl transition-all hover:border-white/20">
      {/* Background Accent Glow */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#1ea39e]/5 blur-3xl rounded-full" />

      {/* Header Berita */}
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <div className="w-1.5 h-6 bg-[#1ea39e] rounded-full" />
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
            <path d="M4 6h2"/><path d="M4 10h2"/><path d="M16 14H8"/><path d="M16 10H8"/>
          </svg>
          <h2 className="text-xs font-black tracking-[0.25em] text-zinc-400 uppercase">Warta Kampus</h2>
        </div>
      </div>

      <div className="space-y-6">
        {beritaList.length > 0 ? (
          beritaList.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectBerita(item)}
              className="group cursor-pointer border-b border-white/5 pb-6 last:border-0 last:pb-0"
            >
              <h3 className="text-sm font-black text-zinc-200 group-hover:text-[#1ea39e] transition-colors leading-tight uppercase tracking-tight mb-2">
                {item.judul}
              </h3>
              <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed line-clamp-2 font-medium italic">
                "{item.isi}"
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-1 h-1 rounded-full bg-[#1ea39e]/50" />
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                  {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-xs text-zinc-600 italic tracking-wider font-medium">Belum ada warta terbaru untuk saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
