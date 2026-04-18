import { useState } from "react";
import { useOutletContext } from "react-router";

type OutletContext = { user: { email: string; role: string; name: string } | null; roleLabel: string };

// Demo data (nanti dari API)
const dosenList = [
  { id: 1, nama: "Dr. Ir. Ahmad Wildan, M.T.", prodi: "Teknik Informatika", email: "ahmad.wildan@dosen.uisi.ac.id" },
  { id: 2, nama: "Dr. Siti Rahayu, M.Kom.", prodi: "Sistem Informasi", email: "siti.rahayu@dosen.uisi.ac.id" },
  { id: 3, nama: "Budi Santoso, S.T., M.T.", prodi: "Teknik Kimia", email: "budi.santoso@dosen.uisi.ac.id" },
  { id: 4, nama: "Anisa Putri, M.Sc.", prodi: "Teknik Informatika", email: "anisa.putri@dosen.uisi.ac.id" },
];

export default function CariUser() {
  useOutletContext<OutletContext>();
  const [query, setQuery] = useState("");
  const [hasil, setHasil] = useState<typeof dosenList[0] | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length >= 3) {
      const found = dosenList.find(
        (d) =>
          d.nama.toLowerCase().includes(q.toLowerCase()) ||
          d.email.toLowerCase().includes(q.toLowerCase())
      );
      setHasil(found || null);
    } else {
      setHasil(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light text-zinc-100">
        Pencarian <span className="text-zinc-500 font-normal text-lg">User</span>
      </h1>

      {/* Search Panel */}
      <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Pencarian User</span>
        </div>

        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 px-4 py-2 text-xs text-zinc-500 flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          Cari user yang ada di Gapura
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Masukkan NIM, email, atau nama (minimal 3 huruf)"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-zinc-600 transition-all text-zinc-100 placeholder:text-zinc-700"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>

        {/* Hasil Pencarian */}
        {hasil && (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-zinc-100">{hasil.nama}</p>
              <p className="text-xs text-zinc-500">{hasil.email}</p>
              <p className="text-xs text-zinc-500">Dosen ({hasil.prodi})</p>
            </div>
          </div>
        )}
      </div>

      {/* List Dosen Departemen */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Dosen Departemen Informatika</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dosenList.map((dosen) => (
            <div
              key={dosen.id}
              className="flex flex-col items-center text-center p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/8 hover:border-white/15 transition-all cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center mb-3">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-200 leading-snug">{dosen.nama}</p>
              <p className="text-xs text-zinc-600 mt-1">{dosen.prodi}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
