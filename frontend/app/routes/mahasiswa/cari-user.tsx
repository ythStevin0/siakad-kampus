import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router";
import { searchUsers, fetchAllDosen, type SearchResult, type Dosen } from "../../lib/api";

type OutletContext = { user: { email: string; role: string; name: string } | null; roleLabel: string };

export default function CariUser() {
  useOutletContext<OutletContext>();
  const [query, setQuery] = useState("");
  const [hasil, setHasil] = useState<SearchResult[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingDosen, setLoadingDosen] = useState(true);

  // Ambil semua dosen saat halaman pertama dibuka
  useEffect(() => {
    fetchAllDosen()
      .then(setDosenList)
      .catch(() => setDosenList([]))
      .finally(() => setLoadingDosen(false));
  }, []);

  // Debounce search — tunggu 400ms setelah user berhenti mengetik
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 3) { setHasil([]); return; }
    setSearching(true);
    try {
      const results = await searchUsers(q);
      setHasil(results);
    } catch {
      setHasil([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timeout);
  }, [query, doSearch]);

  // Format nama dosen dengan gelar
  const formatNamaDosen = (d: Dosen) => {
    const depan = d.gelar_depan ? `${d.gelar_depan} ` : "";
    const belakang = d.gelar_belakang ? `, ${d.gelar_belakang}` : "";
    return `${depan}${d.nama_lengkap}${belakang}`;
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
          Cari berdasarkan NIM, NIDN, nama lengkap, atau email (minimal 3 huruf)
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Contoh: 3012410001 atau Ahmad atau ahmad@uisi.ac.id"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-zinc-600 transition-all text-zinc-100 placeholder:text-zinc-700"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
            {searching ? (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            )}
          </div>
        </div>

        {/* Hasil Pencarian */}
        {hasil.length > 0 && (
          <div className="space-y-2">
            {hasil.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-100 text-sm">{item.nama_lengkap}</p>
                  <p className="text-xs text-zinc-500 truncate">{item.email}</p>
                  <p className="text-xs text-zinc-600">{item.tipe === "mahasiswa" ? `NIM: ${item.identifier}` : `NIDN: ${item.identifier}`} &mdash; {item.detail}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  item.tipe === "mahasiswa"
                    ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                }`}>
                  {item.tipe.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* No result state */}
        {query.length >= 3 && !searching && hasil.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-3">Tidak ada hasil untuk "{query}"</p>
        )}
      </div>

      {/* List Dosen */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Dosen Departemen</h2>
        </div>

        {loadingDosen ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-zinc-800 animate-pulse"/>
                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse"/>
                <div className="h-2 w-16 bg-zinc-800 rounded animate-pulse"/>
              </div>
            ))}
          </div>
        ) : dosenList.length === 0 ? (
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-8 text-center text-zinc-600 text-sm">
            Belum ada data dosen. Silakan tambahkan dosen melalui Admin Panel.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {dosenList.map((dosen) => (
              <div key={dosen.id}
                className="flex flex-col items-center text-center p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/8 hover:border-white/15 transition-all cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center mb-3">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-200 leading-snug">{formatNamaDosen(dosen)}</p>
                <p className="text-xs text-zinc-600 mt-1">{dosen.departemen}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
