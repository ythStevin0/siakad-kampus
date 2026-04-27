interface PasswordHistory {
  id: string;
  ip_address: string;
  info: string;
  created_at: string;
}

interface PasswordHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  history: PasswordHistory[];
}

export default function PasswordHistoryModal({ isOpen, onClose, isLoading, history }: PasswordHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-medium text-zinc-700">Perubahan password</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-5">
          {/* Info Alert */}
          <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-3">
            <div className="text-amber-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <p className="text-xs text-amber-800">Menampilkan daftar 5 perubahan password terakhir</p>
          </div>

          {/* Table */}
          <div className="border border-zinc-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider">IP</th>
                  <th className="px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider">Informasi Lainnya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-zinc-400 text-xs">Mengambil data...</td>
                  </tr>
                ) : (history?.length ?? 0) > 0 ? (
                  history.map((item: PasswordHistory) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString("id-ID", { 
                          year: "numeric", month: "2-digit", day: "2-digit",
                          hour: "2-digit", minute: "2-digit", second: "2-digit"
                        }).replace(/\//g, "-")}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">{item.ip_address}</td>
                      <td className="px-4 py-3 text-xs text-zinc-600">{item.info}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-zinc-400 text-xs">Belum ada riwayat perubahan password.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-zinc-50 flex justify-end">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
