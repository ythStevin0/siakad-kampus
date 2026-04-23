import { useState, useEffect } from "react";
import { fetchBerita, createBerita, deleteBerita, type Berita } from "../../lib/api";
import { Modal } from "../../components/ui/Modal";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";
import { TextAreaField } from "../../components/ui/TextAreaField";
import { Newspaper, Send, Trash2, Calendar, Tag } from "lucide-react";

export default function AdminBerita() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    judul: "",
    isi: "",
    kategori: "Umum",
  });

  const loadBerita = () => {
    setLoading(true);
    fetchBerita()
      .then(setBeritaList)
      .catch((err) => console.error("Gagal load berita:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBerita();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ judul: "", isi: "", kategori: "Umum" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus berita: "${judul}"?`)) return;
    try {
      await deleteBerita(id);
      loadBerita();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      await createBerita(formData);
      setIsModalOpen(false);
      loadBerita();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-red-500" />
            Manajemen Berita
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Posting pengumuman dan berita terbaru untuk civitas akademika.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all shadow-lg shadow-red-600/20 text-sm font-medium"
        >
          <Send className="w-4 h-4" />
          Posting Berita
        </button>
      </div>

      {/* List Berita (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-900/40 border border-zinc-800 rounded-xl animate-pulse" />
          ))
        ) : beritaList.length > 0 ? (
          beritaList.map((b) => (
            <div key={b.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3 hover:border-zinc-700 transition-all group relative">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                  {b.kategori}
                </span>
                <button 
                  onClick={() => handleDelete(b.id, b.judul)}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1">{b.judul}</h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{b.isi}</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-zinc-600 pt-1 border-t border-zinc-800/50">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(b.created_at).toLocaleDateString("id-ID")}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {b.kategori}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-zinc-600 italic text-sm">
            Belum ada berita yang diposting.
          </div>
        )}
      </div>

      {/* Modal Posting */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title="Buat Berita Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          <InputField
            label="Judul Berita"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            placeholder="Contoh: Jadwal Pembayaran UKT Semester Ganjil"
            required
          />

          <SelectField
            label="Kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            required
            options={[
              { value: "Umum", label: "Umum" },
              { value: "Akademik", label: "Akademik" },
              { value: "Keuangan", label: "Keuangan" },
              { value: "Kemahasiswaan", label: "Kemahasiswaan" },
              { value: "Beasiswa", label: "Beasiswa" },
            ]}
          />

          <TextAreaField
            label="Isi Berita"
            name="isi"
            value={formData.isi}
            onChange={handleChange}
            placeholder="Tuliskan detail pengumuman di sini..."
            required
            rows={6}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
            >
              {submitting ? "Memposting..." : (
                <>
                  <Send className="w-4 h-4" />
                  Posting Sekarang
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
