interface ProfileCardProps {
  user: { name: string; email: string } | null;
  roleLabel: string;
  onShowHistory: () => void;
}

export default function ProfileCard({ user, roleLabel, onShowHistory }: ProfileCardProps) {
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Pengguna";

  return (
    <div className="relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl p-8 flex flex-col items-center text-center space-y-6 shadow-2xl transition-all hover:border-white/20">
      {/* Background Accent Glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#1ea39e]/5 blur-3xl rounded-full" />
      
      {/* Avatar Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#1ea39e]/20 blur-xl rounded-full animate-pulse" />
        <div className="relative w-28 h-28 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Identity */}
      <div className="space-y-1">
        <p className="text-xl font-black text-zinc-100 tracking-tight leading-tight uppercase">
          {user?.name || firstName}
        </p>
        <div className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          <p className="text-[10px] font-black tracking-[0.2em] text-rose-400 uppercase">
            {roleLabel}
          </p>
        </div>
      </div>

      {/* Password History Button */}
      <button 
        onClick={onShowHistory}
        className="group/btn w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300 shadow-xl"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:scale-110">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span className="text-[10px] font-black uppercase tracking-widest">Perubahan Password</span>
      </button>

      {/* Contact Details */}
      <div className="w-full space-y-3 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1ea39e]">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span className="text-xs font-bold text-zinc-400 truncate tracking-tight">{user?.email || "-"}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.94 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span className="text-xs font-bold text-zinc-600 tracking-widest">-</span>
        </div>
      </div>
    </div>
  );
}
