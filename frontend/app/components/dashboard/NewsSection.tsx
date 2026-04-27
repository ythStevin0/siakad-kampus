import type { Berita } from "../../lib/api";

interface NewsSectionProps {
  beritaList: Berita[];
  onSelectBerita: (berita: Berita) => void;
}

export default function NewsSection({ beritaList, onSelectBerita }: NewsSectionProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-6 space-y-4">
      {/* Header Berita */}
      <div className="flex items-center gap-2 mb-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
          <path d="M4 6h2"/><path d="M4 10h2"/><path d="M16 14H8"/><path d="M16 10H8"/>
        </svg>
        <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Berita</h2>
      </div>

      <div className="space-y-3">
        {beritaList.length > 0 ? (
          beritaList.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectBerita(item)}
              className="group cursor-pointer border-b border-white/5 pb-3 last:border-0 last:pb-0"
            >
              <p className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors leading-snug">
                {item.judul}
              </p>
              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed line-clamp-1">{item.isi}</p>
              <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-wider">
                {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-zinc-600 italic">Belum ada berita terbaru.</p>
        )}
      </div>
    </div>
  );
}
