import { useState } from "react";
import { kirimPesan } from "../../lib/api";

interface MessageBoxProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  sidebarOpen: boolean;
}

export function MessageBox({ isOpen, onClose, user, sidebarOpen }: MessageBoxProps) {
  const [pesanText, setPesanText] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesanText.trim()) return;
    setIsSending(true);
    try {
      await kirimPesan(pesanText);
      alert("Pesan Anda telah dikirim ke Admin!");
      setPesanText("");
      onClose();
    } catch (err: any) {
      alert("Gagal mengirim pesan: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      className={`fixed bottom-0 z-50 w-full sm:w-[350px] bg-[#1ea39e] sm:rounded-t-2xl shadow-2xl transition-all duration-300 ease-in-out left-0 ${sidebarOpen ? "sm:left-52" : "sm:left-0 lg:left-14"}`} 
      style={{ bottom: 0 }}
    >
      <div className="flex justify-end p-3 pb-1">
        <button onClick={onClose} className="text-white hover:text-white/80 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="bg-white m-3 mt-0 p-5 rounded-xl shadow-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative mt-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-zinc-700 font-medium z-10 flex gap-1">
              <span className="text-red-500">*</span> Nama
            </label>
            <input type="text" readOnly value={user?.name || ""} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-800 bg-white focus:outline-none" />
          </div>

          <div className="relative mt-4">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-zinc-700 font-medium z-10 flex gap-1">
              <span className="text-red-500">*</span> Email
            </label>
            <input type="email" readOnly value={user?.email || ""} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-800 bg-white focus:outline-none" />
          </div>

          <div className="relative mt-4 mb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-zinc-700 font-medium z-10 flex gap-1">
              <span className="text-red-500">*</span> Pesan
            </label>
            <textarea required rows={4} value={pesanText} onChange={(e) => setPesanText(e.target.value)} className="w-full border border-zinc-200 rounded-lg px-3 py-3 text-sm text-zinc-800 focus:outline-none focus:border-[#1ea39e] transition-colors resize-none"></textarea>
          </div>

          <button type="submit" disabled={isSending} className="w-full mt-2 bg-[#1ea39e] hover:bg-[#188f88] disabled:bg-[#1ea39e]/50 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
            {isSending ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </div>
    </div>
  );
}
