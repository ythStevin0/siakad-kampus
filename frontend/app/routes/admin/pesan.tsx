import { useState, useEffect } from "react";
import { Mail, CheckCircle2, Clock, Inbox, User } from "lucide-react";
import { fetchAdminPesan, markPesanAsRead } from "../../lib/api";

export default function AdminPesan() {
  const [pesanList, setPesanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPesan();
  }, []);

  const loadPesan = async () => {
    try {
      const data = await fetchAdminPesan();
      setPesanList(data || []);
    } catch (err) {
      console.error("Gagal memuat pesan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markPesanAsRead(id);
      // Update state locally to feel faster
      setPesanList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_read: true } : p))
      );
    } catch (err) {
      console.error("Gagal menandai pesan:", err);
      alert("Gagal menandai pesan telah dibaca.");
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-red-500" />
            Kotak Masuk
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Pesan masuk dari mahasiswa dan dosen terkait keluhan atau bantuan sistem.
          </p>
        </div>
      </div>

      {/* List Pesan */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-md p-4 sm:p-6 min-h-[500px]">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-800/50 rounded-xl h-24 border border-zinc-700/30"></div>
            ))}
          </div>
        ) : pesanList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-zinc-500">
            <Mail className="w-16 h-16 mb-4 opacity-20" />
            <p>Tidak ada pesan masuk saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pesanList.map((pesan) => (
              <div 
                key={pesan.id} 
                className={`relative p-5 rounded-xl border transition-all duration-300 ${
                  pesan.is_read 
                    ? "bg-zinc-900/30 border-zinc-800/50 opacity-70" 
                    : "bg-zinc-800/40 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:border-red-500/50"
                }`}
              >
                {!pesan.is_read && (
                  <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                    pesan.pengirim_role === "mahasiswa" 
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                      <div>
                        <h3 className="text-zinc-200 font-semibold truncate flex items-center gap-2">
                          {pesan.pengirim_nama}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                            pesan.pengirim_role === "mahasiswa" ? "bg-blue-500/10 text-blue-400" : "bg-indigo-500/10 text-indigo-400"
                          }`}>
                            {pesan.pengirim_role}
                          </span>
                        </h3>
                        <p className="text-xs text-zinc-500">{pesan.pengirim_email}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(pesan.created_at)}
                      </div>
                    </div>
                    
                    <div className="text-sm text-zinc-400 bg-black/20 p-3.5 rounded-lg border border-white/5 leading-relaxed whitespace-pre-wrap">
                      {pesan.isi_pesan}
                    </div>
                    
                    {!pesan.is_read && (
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => handleMarkAsRead(pesan.id)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Tandai sudah dibaca
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
