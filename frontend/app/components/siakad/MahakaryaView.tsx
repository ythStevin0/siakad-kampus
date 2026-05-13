import { useState } from "react";

// ==========================================
// DATA TYPES
// ==========================================
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
  author: string;
  authorDept: string;
  authorInitials: string;
  authorColor: string;
  featured?: boolean;
  tags?: string[];
}

// ==========================================
// DATA (dummy — siap disambung ke API)
// ==========================================
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Submarine Scavenger",
    description: "Submarine Scavenger adalah game bergenre Arcade, Edukasi dan endless runner. Pemain akan berperan menjadi kapal selam yang berfokus pada pengambilan sampah di laut.",
    category: "Software Development",
    thumbnail: "https://images.unsplash.com/photo-1551244072-5d12893278bc?w=640&q=80",
    rating: 4,
    author: "Alden Muzakky Tri Vicienza",
    authorDept: "Departemen Sistem Informasi",
    authorInitials: "AM",
    authorColor: "bg-emerald-600",
  },
  {
    id: "2",
    title: "Ocean Predatory Academy",
    description: "Ocean Predator Academy adalah sebuah aplikasi permainan edukasi petualangan bawah laut yang dirancang khusus untuk mengenalkan rahasia dunia laut kepada anak-anak.",
    category: "Software Development",
    thumbnail: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?w=640&q=80",
    rating: 4,
    author: "Ayu Kurnia Safitri",
    authorDept: "Departemen Sistem Informasi",
    authorInitials: "AK",
    authorColor: "bg-rose-600",
  },
  {
    id: "3",
    title: "EduTrack Pro",
    description: "Platform pembelajaran adaptif berbasis AI yang mampu menyesuaikan kurikulum dengan kemampuan dan kecepatan belajar setiap mahasiswa secara personal.",
    category: "AI & Machine Learning",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&q=80",
    rating: 5,
    author: "Immanuella Audrey Soegito",
    authorDept: "Departemen Sistem Informasi",
    authorInitials: "IA",
    authorColor: "bg-violet-600",
  },
  {
    id: "4",
    title: "WasteTrack Smart",
    description: "Sistem manajemen sampah cerdas menggunakan IoT dan Computer Vision untuk mengklasifikasikan dan memantau timbulan sampah secara real-time di lingkungan kampus.",
    category: "IoT & Embedded",
    thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=640&q=80",
    rating: 5,
    author: "Adinda Najwa Rahmadanti",
    authorDept: "Departemen Sistem Informasi",
    authorInitials: "AN",
    authorColor: "bg-amber-600",
  },
  {
    id: "5",
    title: "NutriScan",
    description: "Aplikasi mobile scanner nutrisi makanan menggunakan kamera smartphone yang memberikan analisis kandungan gizi secara instan dan rekomendasi diet personal.",
    category: "Mobile Development",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=640&q=80",
    rating: 4,
    author: "Rizky Fadillah Putra",
    authorDept: "Departemen Informatika",
    authorInitials: "RF",
    authorColor: "bg-teal-600",
  },
  {
    id: "6",
    title: "UrbanFlood AI",
    description: "Model prediksi banjir perkotaan berbasis deep learning yang mengintegrasikan data curah hujan, kondisi drainase, dan topografi untuk peringatan dini.",
    category: "Data Science",
    thumbnail: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=640&q=80",
    rating: 5,
    author: "Siti Maisaroh",
    authorDept: "Departemen Informatika",
    authorInitials: "SM",
    authorColor: "bg-blue-600",
  },
];

const FEATURED: Project = {
  id: "featured",
  title: "JATIMeal",
  description: "JATIMeal merupakan aplikasi berbasis website yang menyediakan resep dan cara memasak makanan khas Jawa Timur. Aplikasi ini merupakan jawaban dari permasalahan makanan khas jawa timur yang kurang dikenal di dunia luar bahkan di Indonesia sendiri.",
  category: "Web Development",
  thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  rating: 4,
  author: "Tim JATIMeal",
  authorDept: "Fakultas Teknologi Informasi dan Kreatif",
  authorInitials: "TJ",
  authorColor: "bg-orange-700",
  featured: true,
  tags: ["Kuliner", "Jawa Timur", "Web App"],
};

// ==========================================
// STAR RATING
// ==========================================
function StarRating({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= count ? "#f59e0b" : "none"} stroke={i <= count ? "#f59e0b" : "#52525b"} strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ==========================================
// AVATAR
// ==========================================
function Avatar({ initials, color, size = "w-9 h-9" }: { initials: string; color: string; size?: string }) {
  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center text-white font-black text-xs uppercase shrink-0 ring-1 ring-white/20`}>
      {initials}
    </div>
  );
}

// ==========================================
// CATEGORY BADGE
// ==========================================
function CategoryBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    "Software Development": "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "AI & Machine Learning": "bg-violet-500/15 text-violet-400 border-violet-500/20",
    "IoT & Embedded": "bg-amber-500/15 text-amber-400 border-amber-500/20",
    "Mobile Development": "bg-teal-500/15 text-teal-400 border-teal-500/20",
    "Data Science": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    "Web Development": "bg-rose-500/15 text-rose-400 border-rose-500/20",
  };
  const cls = colors[label] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
  return (
    <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  );
}

// ==========================================
// PROJECT CARD
// ==========================================
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl bg-white/0.03 border border-white/[0.07] overflow-hidden hover:border-[#1ea39e]/40 hover:bg-white/0.06 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#1ea39e]/5 hover:-translate-y-0.5"
    >
      {/* Author row */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <Avatar initials={project.authorInitials} color={project.authorColor} />
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-zinc-200 truncate">{project.author}</p>
          <p className="text-[10px] text-zinc-500 truncate">{project.authorDept}</p>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="relative w-full h-44 overflow-hidden bg-zinc-900">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-[#1ea39e]/80 backdrop-blur-sm flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-3 space-y-2">
        <h3 className="font-black text-zinc-100 uppercase tracking-wide text-[13px] leading-tight group-hover:text-[#1ea39e] transition-colors">
          {project.title}
        </h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3">{project.description}</p>
        <div className="flex items-center justify-between pt-1">
          <StarRating count={project.rating} />
          <CategoryBadge label={project.category} />
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#1ea39e] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  );
}

// ==========================================
// FEATURED PANEL
// ==========================================
function FeaturedPanel({ project, onViewDetails }: { project: Project; onViewDetails: () => void }) {
  return (
    <div className="relative h-full min-h-[600px] rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/10 flex flex-col">
      {/* Background image with parallax-like overlay */}
      <div className="absolute inset-0">
        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
      </div>

      {/* Top: "FEATURED" badge */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1ea39e] animate-pulse" />
          <span className="text-[10px] font-black text-[#1ea39e] uppercase tracking-[0.25em]">Karya Unggulan</span>
        </div>
      </div>

      {/* Middle: App screenshot mockup area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8">
        <div className="relative">
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-75" />
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/60 w-64 aspect-video">
            <img src={project.thumbnail} alt="App Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent" />
          </div>
          {/* Tags float */}
          {project.tags?.map((tag, i) => (
            <div
              key={tag}
              className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold text-zinc-300 shadow-lg"
              style={{
                top: `${-20 + i * 30}px`,
                right: i % 2 === 0 ? "-60px" : "-40px",
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Info */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Institution logos placeholder */}
        <div className="flex items-center gap-3 pb-2 border-b border-white/10">
          <div className="w-6 h-6 rounded bg-red-700/80 flex items-center justify-center">
            <span className="text-[8px] font-black text-white">FT</span>
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">FAKULTAS TEKNOLOGI INFORMASI DAN KREATIF</p>
            <p className="text-[9px] text-zinc-600 uppercase tracking-wider">UNIVERSITAS INTERNASIONAL SEMEN INDONESIA</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
            {project.title}
          </h2>
          <p className="text-[11px] text-zinc-400 leading-relaxed">{project.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StarRating count={project.rating} size={16} />
            <CategoryBadge label={project.category} />
          </div>
          <button
            onClick={onViewDetails}
            className="group flex items-center gap-1.5 text-[11px] font-black text-[#1ea39e] hover:text-white transition-colors"
          >
            Lihat Detail
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PROJECT DETAIL MODAL
// ==========================================
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-zinc-900/95 border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thumbnail */}
        <div className="relative h-56 overflow-hidden">
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900/90 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div className="absolute bottom-4 left-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-wide">{project.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Author */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Avatar initials={project.authorInitials} color={project.authorColor} size="w-11 h-11" />
            <div>
              <p className="font-bold text-zinc-200 text-sm">{project.author}</p>
              <p className="text-zinc-500 text-xs">{project.authorDept}</p>
            </div>
            <div className="ml-auto">
              <CategoryBadge label={project.category} />
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[12px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Deskripsi Proyek</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{project.description}</p>
          </div>

          {/* Rating & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Rating Komunitas</p>
              <StarRating count={project.rating} size={18} />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-all">
                Beri Rating
              </button>
              <button className="px-4 py-2 rounded-xl bg-[#1ea39e] hover:bg-[#17888a] text-white text-xs font-black uppercase transition-all shadow-lg shadow-[#1ea39e]/20">
                Kunjungi Proyek
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FILTER / TABS
// ==========================================
const CATEGORIES = ["Semua", "Software Development", "AI & Machine Learning", "IoT & Embedded", "Mobile Development", "Data Science", "Web Development"];

// ==========================================
// MAIN VIEW
// ==========================================
export function MahakaryaView() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = PROJECTS.filter((p) => {
    const matchCat = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch = searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen -m-8 animate-in fade-in duration-500">
      {/* === PAGE HEADER === */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1ea39e]" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Universitas Internasional Semen Indonesia</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight">
              MAHA<span className="text-[#1ea39e]">KARYA</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">Karya Terbaik Mahasiswa UISI</p>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Cari karya atau mahasiswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#1ea39e]/50 focus:border-[#1ea39e]/30 transition-all w-64"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#1ea39e] text-white shadow-md shadow-[#1ea39e]/30"
                  : "bg-white/5 border border-white/10 text-zinc-500 hover:text-zinc-300 hover:bg-white/8"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* === SPLIT LAYOUT === */}
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 px-8 pb-10">
        {/* LEFT: Featured */}
        <div className="xl:sticky xl:top-8 xl:self-start">
          <FeaturedPanel project={FEATURED} onViewDetails={() => setSelectedProject(FEATURED)} />
        </div>

        {/* RIGHT: Grid */}
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/0.03 border border-white/0.06">
            <span className="text-[11px] text-zinc-500 font-bold">
              Menampilkan <span className="text-zinc-300">{filtered.length}</span> dari <span className="text-zinc-300">{PROJECTS.length}</span> karya
            </span>
            <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
              Filter: {activeCategory}
            </div>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl bg-white/0.02 border border-white/0.05">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-700 mb-4">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <p className="text-zinc-500 font-bold">Tidak ada karya ditemukan</p>
              <p className="text-xs text-zinc-700 mt-1">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
