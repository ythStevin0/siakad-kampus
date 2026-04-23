import { useState, useEffect } from "react";
import { fetchAllMahasiswa, createMahasiswa, type Mahasiswa } from "../../lib/api";
import Modal from "../../components/ui/Modal";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";

export default function AdminMahasiswa() {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    nim: "",
    nama_lengkap: "",
    program_studi: "",
    angkatan: new Date().getFullYear(),
    jalur_masuk: "SNBT",
    password: "",
  });

  // Fetch list mahasiswa
  const loadMahasiswa = () => {
    setLoading(true);
    fetchAllMahasiswa()
      .then(setMahasiswaList)
      .catch((err) => console.error("Gagal load mahasiswa:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMahasiswa();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "angkatan" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      await createMahasiswa(formData);
      setIsModalOpen(false); // Tutup modal
      setFormData({ // Reset form
        ...formData,
        nim: "",
        nama_lengkap: "",
        password: "",
      });
      loadMahasiswa(); // Refresh tabel
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-zinc-100">
            Kelola <span className="text-zinc-500 font-normal">Mahasiswa</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Data master mahasiswa terdaftar.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tambah Mahasiswa
        </button>
      </div>

      {/* Tabel Data Grid */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-xs uppercase font-medium text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">NIM</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Program Studi</th>
                <th className="px-6 py-4">Angkatan</th>
                <th className="px-6 py-4">Jalur Masuk</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                // Skeletons
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-zinc-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-zinc-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-zinc-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-zinc-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-zinc-800 rounded"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : mahasiswaList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                    Belum ada data mahasiswa.
                  </td>
                </tr>
              ) : (
                mahasiswaList.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-300">{m.nim}</td>
                    <td className="px-6 py-4 font-medium text-zinc-100">{m.nama_lengkap}</td>
                    <td className="px-6 py-4">{m.program_studi}</td>
                    <td className="px-6 py-4 text-zinc-300">{m.angkatan}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-[10px] font-semibold bg-zinc-800 rounded-full text-zinc-400">
                        {m.jalur_masuk || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-blue-400 transition-colors">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Mahasiswa */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title="Daftarkan Mahasiswa Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
              {errorMsg}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="NIM"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              placeholder="Contoh: 3012410001"
              required
            />
            <InputField
              label="Angkatan"
              name="angkatan"
              type="number"
              value={formData.angkatan}
              onChange={handleChange}
              required
            />
          </div>

          <InputField
            label="Nama Lengkap"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            placeholder="Sesuai Akta Kelahiran"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Program Studi"
              name="program_studi"
              value={formData.program_studi}
              onChange={handleChange}
              required
              options={[
                { value: "Teknik Informatika", label: "Teknik Informatika" },
                { value: "Sistem Informasi", label: "Sistem Informasi" },
                { value: "Manajemen Rekayasa", label: "Manajemen Rekayasa" },
                { value: "Desain Komunikasi Visual", label: "Desain Komunikasi Visual" },
                { value: "Manajemen", label: "Manajemen" },
                { value: "Akuntansi", label: "Akuntansi" },
              ]}
            />
            <SelectField
              label="Jalur Masuk"
              name="jalur_masuk"
              value={formData.jalur_masuk}
              onChange={handleChange}
              required
              options={[
                { value: "SNBP", label: "SNBP" },
                { value: "SNBT", label: "SNBT" },
                { value: "Mandiri", label: "Mandiri" },
                { value: "Prestasi", label: "Prestasi" },
              ]}
            />
          </div>

          {/* Pemisah antara profil dan autentikasi */}
          <div className="border-t border-zinc-800 my-4"></div>

          <div className="space-y-1">
            <InputField
              label="Password Mahasiswa Baru"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              required
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Username otomatis: <span className="text-zinc-400 font-mono">{formData.nim || "[nim]"}@mahasiswa.uisi.ac.id</span>
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
