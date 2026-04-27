interface ProfileCardProps {
  user: { name: string; email: string } | null;
  roleLabel: string;
  onShowHistory: () => void;
}

export default function ProfileCard({ user, roleLabel, onShowHistory }: ProfileCardProps) {
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Pengguna";

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-6 flex flex-col items-center text-center space-y-4">
      {/* Avatar */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>

      {/* Identitas */}
      <div>
        <p className="font-semibold text-zinc-100 text-base">{user?.name || firstName}</p>
        <p className="text-xs font-semibold tracking-widest text-red-400 mt-0.5">{roleLabel}</p>
      </div>

      {/* Tombol Riwayat Password */}
      <button 
        onClick={onShowHistory}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 text-[11px] font-bold uppercase tracking-wider hover:bg-red-600/30 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Perubahan Password
      </button>

      {/* Detail Kontak */}
      <div className="w-full space-y-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span className="truncate">{user?.email || "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.94 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>-</span>
        </div>
      </div>
    </div>
  );
}
