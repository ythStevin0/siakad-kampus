import { useState } from "react";
import { NavLink } from "react-router";

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
// DATA (broad categories)
// ==========================================
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Optimasi Rantai Pasok Semen Indonesia",
    description: "Analisis dan pemodelan matematis untuk mengoptimalkan jalur distribusi semen guna menekan biaya logistik hingga 15% menggunakan algoritma genetika.",
    category: "Logistik & Industri",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=640&q=80",
    rating: 5,
    author: "Bambang Triatmojo",
    authorDept: "Departemen Teknik Logistik",
    authorInitials: "BT",
    authorColor: "bg-blue-700",
  },
  {
    id: "2",
    title: "Brand Identity 'Gresik Heritage'",
    description: "Perancangan identitas visual lengkap untuk kampanye pelestarian bangunan bersejarah di Gresik melalui pendekatan desain modern namun tetap membawa unsur lokal.",
    category: "Desain & Kreatif",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&q=80",
    rating: 5,
    author: "Ayu Kurnia Safitri",
    authorDept: "Departemen Desain Komunikasi Visual",
    authorInitials: "AK",
    authorColor: "bg-rose-600",
  },
  {
    id: "3",
    title: "Submarine Scavenger",
    description: "Submarine Scavenger adalah game bergenre Arcade, Edukasi dan endless runner yang berfokus pada pengambilan sampah di laut.",
    category: "Software & Digital",
    thumbnail: "https://images.unsplash.com/photo-1551244072-5d12893278bc?w=640&q=80",
    rating: 4,
    author: "Alden Muzakky Tri Vicienza",
    authorDept: "Departemen Sistem Informasi",
    authorInitials: "AM",
    authorColor: "bg-emerald-600",
  },
  {
    id: "4",
    title: "Model Bisnis Sustainable Coffee",
    description: "Analisis kelayakan bisnis dan implementasi model rantai pasok kopi berkelanjutan yang menghubungkan petani lokal langsung dengan konsumen perkotaan.",
    category: "Bisnis & Startup",
    thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&q=80",
    rating: 5,
    author: "Adinda Najwa Rahmadanti",
    authorDept: "Departemen Manajemen",
    authorInitials: "AN",
    authorColor: "bg-amber-600",
  },
  {
    id: "5",
    title: "Pemanfaatan Limbah Cangkang Kerang",
    description: "Inovasi pemanfaatan limbah cangkang kerang sebagai adsorben alternatif dalam proses pengolahan limbah cair industri tekstil di wilayah Gresik.",
    category: "Sains & Energi",
    thumbnail: "https://images.unsplash.com/photo-1532187875605-2fe3587b1598?w=640&q=80",
    rating: 4,
    author: "Rizky Fadillah Putra",
    authorDept: "Departemen Teknik Kimia",
    authorInitials: "RF",
    authorColor: "bg-teal-600",
  },
  {
    id: "6",
    title: "Analisis Dampak Sosial Kawasan Industri",
    description: "Studi komprehensif mengenai pergeseran struktur sosial dan ekonomi masyarakat sekitar kawasan industri Semen Indonesia di Tuban.",
    category: "Sosial & Humaniora",
    thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80",
    rating: 5,
    author: "Siti Maisaroh",
    authorDept: "Departemen Akuntansi",
    authorInitials: "SM",
    authorColor: "bg-indigo-600",
  },
];

const FEATURED: Project = {
  id: "featured",
  title: "JATIMeal",
  description: "JATIMeal merupakan aplikasi berbasis website yang menyediakan resep dan cara memasak makanan khas Jawa Timur. Aplikasi ini merupakan jawaban dari permasalahan makanan khas jawa timur yang kurang dikenal.",
  category: "Software & Digital",
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
// HELPERS
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

function CategoryBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    "Software & Digital": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    "Bisnis & Startup": "bg-amber-500/15 text-amber-400 border-amber-500/20",
    "Desain & Kreatif": "bg-rose-500/15 text-rose-400 border-rose-500/20",
    "Logistik & Industri": "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "Sains & Energi": "bg-teal-500/15 text-teal-400 border-teal-500/20",
    "Sosial & Humaniora": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  };
  const cls = colors[label] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
  return (
    <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  );
}

// ==========================================
// COMPONENTS
// ==========================================
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl bg-white/0.03 border border-white/[0.07] overflow-hidden hover:border-[#1ea39e]/40 hover:bg-white/0.06 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#1ea39e]/5 hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <div className={`w-9 h-9 ${project.authorColor} rounded-full flex items-center justify-center text-white font-black text-xs uppercase shrink-0 ring-1 ring-white/20`}>
          {project.authorInitials}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-zinc-200 truncate">{project.author}</p>
          <p className="text-[10px] text-zinc-500 truncate">{project.authorDept}</p>
        </div>
      </div>

      <div className="relative w-full h-44 overflow-hidden bg-zinc-900">
        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-[#1ea39e]/80 backdrop-blur-sm flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z" /></svg>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3 space-y-2">
        <h3 className="font-black text-zinc-100 uppercase tracking-wide text-[13px] leading-tight group-hover:text-[#1ea39e] transition-colors">{project.title}</h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between pt-1">
          <StarRating count={project.rating} />
          <CategoryBadge label={project.category} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#1ea39e] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  );
}

function FeaturedPanel({ project, onViewDetails }: { project: Project; onViewDetails: () => void }) {
  return (
    <div className="relative h-full min-h-[600px] rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/10 flex flex-col">
      <div className="absolute inset-0">
        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1ea39e] animate-pulse" />
          <span className="text-[10px] font-black text-[#1ea39e] uppercase tracking-[0.25em]">Karya Unggulan</span>
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-8">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-75" />
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/60 w-64 aspect-video">
            <img src={project.thumbnail} alt="App Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent" />
          </div>
        </div>
      </div>
      <div className="relative z-10 p-6 space-y-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">{project.title}</h2>
          <p className="text-[11px] text-zinc-400 leading-relaxed">{project.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StarRating count={project.rating} size={16} />
            <CategoryBadge label={project.category} />
          </div>
          <button onClick={onViewDetails} className="group flex items-center gap-1.5 text-[11px] font-black text-[#1ea39e] hover:text-white transition-colors">
            Lihat Detail <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-zinc-900/95 border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-56 overflow-hidden">
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900/90 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div className="absolute bottom-4 left-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-wide">{project.title}</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className={`w-11 h-11 ${project.authorColor} rounded-full flex items-center justify-center text-white font-black text-xs uppercase shrink-0 ring-1 ring-white/20`}>{project.authorInitials}</div>
            <div>
              <p className="font-bold text-zinc-200 text-sm">{project.author}</p>
              <p className="text-zinc-500 text-xs">{project.authorDept}</p>
            </div>
            <div className="ml-auto"><CategoryBadge label={project.category} /></div>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{project.description}</p>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <StarRating count={project.rating} size={18} />
            <button className="px-4 py-2 rounded-xl bg-[#1ea39e] hover:bg-[#17888a] text-white text-xs font-black uppercase transition-all shadow-lg shadow-[#1ea39e]/20">Kunjungi Proyek</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN VIEW
// ==========================================
const CATEGORIES = ["Semua", "Software & Digital", "Bisnis & Startup", "Desain & Kreatif", "Logistik & Industri", "Sains & Energi", "Sosial & Humaniora"];

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
          <div className="flex items-center gap-4">
            <NavLink
              to="/dashboard"
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-[#1ea39e] hover:bg-white/10 transition-all"
              title="Kembali ke Beranda"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </NavLink>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1ea39e]" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Universitas Internasional Semen Indonesia</span>
              </div>
              <h1 className="text-3xl font-black text-zinc-100 tracking-tight">MAHA<span className="text-[#1ea39e]">KARYA</span></h1>
              <p className="text-xs text-zinc-500 mt-0.5">Karya Terbaik Mahasiswa UISI</p>
            </div>
          </div>
          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Cari karya atau mahasiswa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none w-64" />
          </div>
        </div>
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeCategory === cat ? "bg-[#1ea39e] text-white" : "bg-white/5 border border-white/10 text-zinc-500 hover:text-zinc-300"}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 px-8 pb-10">
        <div className="xl:sticky xl:top-8 xl:self-start">
          <FeaturedPanel project={FEATURED} onViewDetails={() => setSelectedProject(FEATURED)} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/0.03 border border-white/0.06">
            <span className="text-[11px] text-zinc-500 font-bold">Menampilkan <span className="text-zinc-300">{filtered.length}</span> dari <span className="text-zinc-300">{PROJECTS.length}</span> karya</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
            ))}
          </div>
        </div>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}
