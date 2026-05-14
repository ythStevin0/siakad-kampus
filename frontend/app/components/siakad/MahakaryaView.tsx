import { useState, useEffect } from "react";
import { NavLink } from "react-router";

// ==========================================
// DATA TYPES
// ==========================================
interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

interface Creator {
  name: string;
  dept: string;
  avatar: string;
  role?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  thumbnail: string;
  rating: number;
  views: number;
  date: string;
  author: string;
  authorDept: string;
  authorInitials: string;
  authorColor: string;
  creators: Creator[];
  reviews: Review[];
  featured?: boolean;
  tags?: string[];
}

// ==========================================
// DATA (dummy — diperluas untuk detail)
// ==========================================
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Optimasi Rantai Pasok Semen Indonesia",
    description: "Analisis dan pemodelan matematis untuk mengoptimalkan jalur distribusi semen guna menekan biaya logistik hingga 15% menggunakan algoritma genetika.",
    fullDescription: `
      Proyek ini berfokus pada tantangan logistik yang dihadapi oleh industri semen skala besar. Melalui pendekatan algoritma genetika, kami merancang model distribusi yang mempertimbangkan berbagai variabel seperti jarak, kapasitas armada, biaya bahan bakar, dan waktu pengiriman.
      
      Tujuan utama dari proyek ini adalah:
      1. Menurunkan biaya operasional logistik hingga 15%.
      2. Meningkatkan efisiensi waktu pengiriman sebesar 20%.
      3. Memberikan rekomendasi strategis bagi manajemen dalam pengambilan keputusan rute distribusi.
      
      Hasil dari penelitian ini telah diuji coba pada data historis distribusi tahun 2023 dan menunjukkan performa yang sangat stabil.
    `,
    category: "Logistik & Industri",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    rating: 5,
    views: 1240,
    date: "12 Mei 2024",
    author: "Bambang Triatmojo",
    authorDept: "Departemen Teknik Logistik",
    authorInitials: "BT",
    authorColor: "bg-blue-700",
    creators: [
      { name: "Bambang Triatmojo", dept: "Teknik Logistik", avatar: "https://i.pravatar.cc/150?u=bt", role: "Ketua Tim" },
      { name: "Siti Aminah", dept: "Teknik Logistik", avatar: "https://i.pravatar.cc/150?u=sa", role: "Analisis Data" },
      { name: "Rizky Pratama", dept: "Teknik Industri", avatar: "https://i.pravatar.cc/150?u=rp", role: "Pemodelan" },
    ],
    reviews: [
      { id: "r1", user: "Dosen Penguji 1", avatar: "https://i.pravatar.cc/150?u=d1", rating: 5, comment: "Analisis yang sangat tajam dan aplikatif untuk industri nyata.", date: "2 jam yang lalu" },
      { id: "r2", user: "Mahasiswa Logistik", avatar: "https://i.pravatar.cc/150?u=m1", rating: 4, comment: "Inspiratif banget buat tugas akhir saya nanti!", date: "5 jam yang lalu" },
    ],
  },
  {
    id: "2",
    title: "Brand Identity 'Gresik Heritage'",
    description: "Perancangan identitas visual lengkap untuk kampanye pelestarian bangunan bersejarah di Gresik melalui pendekatan desain modern namun tetap membawa unsur lokal.",
    fullDescription: `
      Proyek ini mengeksplorasi bagaimana identitas visual dapat membantu melestarikan bangunan bersejarah. Kami mengembangkan sistem desain yang fleksibel namun tetap menghormati akar budaya Gresik.
      
      Elemen yang dikembangkan meliputi:
      - Tipografi khusus berbasis aksara lokal.
      - Palet warna yang diambil dari warna dominan bangunan kolonial dan pesisir.
      - Sistem ikonografi untuk penanda lokasi bersejarah.
      
      Kampanye ini telah dipresentasikan di depan Dinas Pariwisata dan mendapatkan apresiasi tinggi sebagai model promosi wisata budaya.
    `,
    category: "Desain & Kreatif",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    rating: 5,
    views: 890,
    date: "20 Juni 2024",
    author: "Ayu Kurnia Safitri",
    authorDept: "Departemen Desain Komunikasi Visual",
    authorInitials: "AK",
    authorColor: "bg-rose-600",
    creators: [
      { name: "Ayu Kurnia Safitri", dept: "DKV", avatar: "https://i.pravatar.cc/150?u=aks" },
      { name: "Rendy Wijaya", dept: "DKV", avatar: "https://i.pravatar.cc/150?u=rw" },
    ],
    reviews: [
      { id: "r3", user: "Kolektor Seni", avatar: "https://i.pravatar.cc/150?u=ks", rating: 5, comment: "Visualisasinya luar biasa, sangat berkarakter.", date: "1 hari yang lalu" },
    ],
  },
  {
    id: "3",
    title: "Submarine Scavenger",
    description: "Submarine Scavenger adalah game bergenre Arcade, Edukasi dan endless runner yang berfokus pada pengambilan sampah di laut.",
    fullDescription: `
      Submarine Scavenger adalah sebuah karya interaktif yang menggabungkan hiburan dengan kesadaran lingkungan. Pemain mengendalikan kapal selam canggih untuk mengumpulkan berbagai jenis sampah plastik dan limbah di dasar samudra.
      
      Fitur Utama:
      - Gameplay Arcade yang adiktif dengan kontrol responsif.
      - Edukasi mengenai jenis-jenis sampah dan dampaknya terhadap ekosistem laut.
      - Sistem upgrade kapal selam berdasarkan poin yang dikumpulkan.
      
      Karya ini diharapkan dapat menjadi media edukasi yang menyenangkan bagi anak-anak untuk lebih peduli terhadap kebersihan laut kita.
    `,
    category: "Software & Digital",
    thumbnail: "https://images.unsplash.com/photo-1551244072-5d12893278bc?w=800&q=80",
    rating: 4,
    views: 3500,
    date: "10 April 2024",
    author: "Alden Muzakky Tri Vicienza",
    authorDept: "Departemen Sistem Informasi",
    authorInitials: "AM",
    authorColor: "bg-emerald-600",
    creators: [
      { name: "Alden Muzakky", dept: "Sistem Informasi", avatar: "https://i.pravatar.cc/150?u=am" },
      { name: "Immanuel Audrey", dept: "Sistem Informasi", avatar: "https://i.pravatar.cc/150?u=ia" },
    ],
    reviews: [
      { id: "r4", user: "Gamers UISI", avatar: "https://i.pravatar.cc/150?u=g1", rating: 5, comment: "Grafiknya keren dan gameplay-nya smooth!", date: "3 hari yang lalu" },
    ],
  }
];

const FEATURED: Project = {
  ...PROJECTS[0],
  id: "featured",
  title: "JATIMeal",
  description: "JATIMeal merupakan aplikasi berbasis website yang menyediakan resep dan cara memasak makanan khas Jawa Timur. Aplikasi ini merupakan jawaban dari permasalahan makanan khas jawa timur yang kurang dikenal.",
  fullDescription: `
    JATIMeal adalah solusi digital untuk melestarikan kuliner Jawa Timur. Aplikasi ini tidak hanya menampilkan resep, tetapi juga cerita di balik setiap masakan dan rekomendasi tempat makan otentik.
    
    Fitur Unggulan:
    - Peta Kuliner Interaktif Jawa Timur.
    - Tutorial Video berkualitas tinggi.
    - Komunitas berbagi resep antar pengguna.
    
    Proyek ini memenangkan Juara 1 kompetisi inovasi digital tingkat provinsi karena keberhasilannya dalam mendokumentasikan lebih dari 200 resep tradisional yang mulai langka.
  `,
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
function StarRating({ count, size = 14, activeColor = "#f59e0b" }: { count: number; size?: number; activeColor?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= count ? activeColor : "none"} stroke={i <= count ? activeColor : "#52525b"} strokeWidth="1.5">
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
// REGISTRATION FORM COMPONENT
// ==========================================
function RegistrationForm({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    link: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Karya berhasil dikirim! Menunggu persetujuan Dosen Wali.");
    onBack();
  };

  return (
    <div className="min-h-screen -m-8 p-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-[#1ea39e] hover:bg-white/10 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-zinc-100 uppercase tracking-widest">PENDAFTARAN KARYA</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Status: <span className="text-amber-500 font-black">Draft</span></p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1ea39e] animate-pulse" />
            <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">Input Data</span>
          </div>
          <div className="w-8 h-px bg-zinc-800" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Review Dosen Wali</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pb-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 space-y-6 backdrop-blur-xl shadow-2xl">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Judul Karya Mahakarya</label>
                <input 
                  type="text" required
                  placeholder="Masukkan judul inovasi Anda..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-zinc-100 focus:outline-none focus:border-[#1ea39e]/50 transition-all placeholder:text-zinc-700"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Kategori Departemen</label>
                <select 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-zinc-300 focus:outline-none focus:border-[#1ea39e]/50 transition-all appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" className="bg-zinc-900">Pilih Kategori...</option>
                  {CATEGORIES.filter(c => c !== "Semua").map(cat => (
                    <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Deskripsi & Abstrak</label>
                <textarea 
                  required rows={6}
                  placeholder="Jelaskan mengenai latar belakang, solusi, dan dampak dari karya Anda..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-zinc-300 focus:outline-none focus:border-[#1ea39e]/50 transition-all resize-none placeholder:text-zinc-700"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 space-y-6 backdrop-blur-xl shadow-2xl">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Tautan Portfolio (GitHub/Drive)</label>
                <input 
                  type="url" required
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-zinc-300 focus:outline-none focus:border-[#1ea39e]/50 transition-all placeholder:text-zinc-700"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Poster Utama</label>
                <div className="group relative border-2 border-dashed border-white/10 rounded-3xl p-10 text-center space-y-3 hover:border-[#1ea39e]/40 transition-all cursor-pointer bg-white/0.01">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-zinc-500 group-hover:text-[#1ea39e] transition-colors">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter">Unggah Thumbnail Karya</p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">PNG / JPG (Maks. 5MB)</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              <p className="text-[10px] text-amber-500/80 font-bold uppercase leading-relaxed tracking-tight">
                Data akan dikirim ke portal Dosen Wali untuk diverifikasi kelayakannya sebelum dipublikasikan di Masterpiece UISI.
              </p>
            </div>

            <button 
              type="submit"
              className="w-full py-5 rounded-2xl bg-[#1ea39e] hover:bg-[#17888a] text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#1ea39e]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Kirim ke Dosen Wali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// DETAIL VIEW (Full Detailed Layout)
// ==========================================
function DetailView({ project, onBack }: { project: Project; onBack: () => void }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar / Breadcrumbs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-[#1ea39e] hover:bg-white/10 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-black text-zinc-100 uppercase tracking-widest">LIHAT KARYA</h1>
        </div>
      </div>

      {/* Project Header Info */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <StarRating count={project.rating} size={16} />
          <span className="text-zinc-500 text-xs font-bold">{project.rating}.0</span>
          <span className="text-zinc-700 mx-2">|</span>
          <CategoryBadge label={project.category} />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-2">{project.title}</h2>
        <p className="text-zinc-500 text-sm font-medium">{project.authorDept}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Poster & Description & Reviews */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Poster */}
          <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
            <img src={project.thumbnail} alt={project.title} className="w-full aspect-video object-cover" />
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#1ea39e] rounded-full" />
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Deskripsi Proyek</h3>
            </div>
            <p className="text-zinc-400 leading-relaxed whitespace-pre-line text-[15px]">
              {project.fullDescription}
            </p>
          </div>

          {/* Review Section */}
          <div className="space-y-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#1ea39e] rounded-full" />
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Berikan Review</h3>
            </div>

            {/* Form */}
            <div className="bg-white/0.02 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Rating Anda</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} onClick={() => setRating(i)} className="focus:outline-none transition-transform hover:scale-110">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={i <= rating ? "#f59e0b" : "none"} stroke={i <= rating ? "#f59e0b" : "#3f3f46"} strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis ulasan Anda di sini..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#1ea39e]/30"
              />
              <div className="flex justify-end">
                <button className="px-8 py-2.5 rounded-xl bg-[#1ea39e] hover:bg-[#17888a] text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#1ea39e]/20" disabled={!rating}>
                  Kirim Review
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">{project.reviews.length} Review Mahasiswa</h4>
              {project.reviews.map((rev) => (
                <div key={rev.id} className="flex gap-4 p-5 rounded-2xl bg-white/0.01 border border-white/0.03">
                  <img src={rev.avatar} alt={rev.user} className="w-10 h-10 rounded-full border border-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200 text-sm">{rev.user}</span>
                      <span className="text-[9px] text-zinc-600 font-bold uppercase">{rev.date}</span>
                    </div>
                    <StarRating count={rev.rating} size={12} />
                    <p className="text-sm text-zinc-400 leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Section: Creators */}
          <div className="bg-white/0.02 border border-white/5 rounded-3xl p-6 space-y-6">
            <h3 className="text-[10px] font-black text-[#1ea39e] uppercase tracking-[0.25em] border-b border-white/5 pb-3">PEMBUAT</h3>
            <div className="space-y-5">
              {project.creators.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full border-2 border-white/10 object-cover" />
                  <div>
                    <p className="text-sm font-bold text-zinc-100">{c.name}</p>
                    <p className="text-[11px] text-zinc-500">{c.dept}</p>
                    {c.role && <span className="text-[9px] font-black text-[#1ea39e] uppercase tracking-tighter">{c.role}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Info */}
          <div className="bg-white/0.02 border border-white/5 rounded-3xl p-6 space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] border-b border-white/5 pb-3">INFO KARYA</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Kategori</span>
                <span className="text-zinc-200 font-bold">{project.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Tahun Lulus</span>
                <span className="text-zinc-200 font-bold">2024</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Views</span>
                <span className="text-[#1ea39e] font-black">{project.views.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Section: Similar Projects */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">KARYA SEJENIS</h3>
            <div className="space-y-3">
              {PROJECTS.filter(p => p.id !== project.id).slice(0, 3).map((p) => (
                <div key={p.id} className="group flex gap-3 p-3 rounded-2xl bg-white/0.02 border border-white/5 hover:bg-white/0.05 transition-all cursor-pointer">
                  <img src={p.thumbnail} alt={p.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-zinc-300 uppercase tracking-tight truncate leading-tight group-hover:text-[#1ea39e]">{p.title}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-1">{p.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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

// ==========================================
// FEATURED PANEL
// ==========================================
function FeaturedPanel({ project, onViewDetails }: { project: Project; onViewDetails: () => void }) {
  return (
    <div className="relative h-full min-h-[600px] rounded-3xl overflow-hidden bg-zinc-900/60 border border-white/10 flex flex-col group cursor-pointer" onClick={onViewDetails}>
      <div className="absolute inset-0">
        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
      </div>
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1ea39e] animate-pulse" />
          <span className="text-[10px] font-black text-[#1ea39e] uppercase tracking-[0.25em]">Karya Unggulan</span>
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-8">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-75" />
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/60 w-72 aspect-video">
            <img src={project.thumbnail} alt="App Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent" />
          </div>
        </div>
      </div>
      <div className="relative z-10 p-8 space-y-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-2 uppercase">{project.title}</h2>
          <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-2">{project.description}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <StarRating count={project.rating} size={16} />
            <CategoryBadge label={project.category} />
          </div>
          <button className="group flex items-center gap-2 text-[11px] font-black text-[#1ea39e] hover:text-white transition-all uppercase tracking-widest">
            Lihat Detail <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
          </button>
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
  const [showRegistration, setShowRegistration] = useState(false);

  const filtered = PROJECTS.filter((p) => {
    const matchCat = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch = searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selectedProject) {
    return <DetailView project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  if (showRegistration) {
    return <RegistrationForm onBack={() => setShowRegistration(false)} />;
  }

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" placeholder="Cari karya atau mahasiswa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none w-64" />
            </div>
            <button 
              onClick={() => setShowRegistration(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1ea39e] hover:bg-[#17888a] text-[11px] font-black text-white uppercase tracking-widest shadow-lg shadow-[#1ea39e]/20 transition-all group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover:rotate-90"><path d="M12 5v14M5 12h14"/></svg>
              Daftarkan Karya
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeCategory === cat ? "bg-[#1ea39e] text-white" : "bg-white/5 border border-white/10 text-zinc-500 hover:text-zinc-300"}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* === CONTENT GRID === */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8 px-8 pb-10">
        <div className="xl:sticky xl:top-8 xl:self-start h-[600px]">
          <FeaturedPanel project={FEATURED} onViewDetails={() => setSelectedProject(FEATURED)} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-white/0.03 border border-white/0.06">
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Eksplorasi Karya — <span className="text-zinc-300">{filtered.length} ditemukan</span></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
