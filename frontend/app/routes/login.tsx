import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);
      // Jika berhasil, arahkan ke halaman utama (home)
      if (res.success) {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Gagal melakukan login. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Kiri: Form Login */}
      <div className="flex-1 flex flex-col justify-center relative p-8 sm:p-16 z-10 bg-zinc-950/90 backdrop-blur-md lg:bg-zinc-950 lg:backdrop-blur-none border-r border-zinc-800">
        
        {/* Header Branding */}
        <div className="w-full max-w-md mx-auto">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-linear-to-br from-red-600 to-red-800 rounded flex items-center justify-center shadow-lg shadow-red-900/20">
              {/* Simple Lotus/Flower approximation like UISI logo */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 8 8 8 13C8 15.2091 9.79086 17 12 17C14.2091 17 16 15.2091 16 13C16 8 12 2 12 2Z" fill="white"/>
                <path d="M6.5 6C6.5 6 3 11 4 14.5C4.79526 17.2831 8.5 17.5 12 17.5C15.5 17.5 19.2047 17.2831 20 14.5C21 11 17.5 6 17.5 6C17.5 6 14 11 12 11C10 11 6.5 6 6.5 6Z" fill="rgba(255,255,255,0.7)"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-tight text-zinc-100">UNIVERSITAS INTERNASIONAL</h1>
              <p className="text-sm font-medium tracking-widest text-zinc-400">SEMEN INDONESIA</p>
            </div>
          </div>

          <h2 className="text-4xl font-light text-zinc-200 mb-3 tracking-wide">Login Gapura</h2>
          <p className="text-zinc-500 text-sm mb-10">
            Selamat datang di sistem single sign-on Universitas Internasional Semen Indonesia.
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Email UISI</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@student.uisi.ac.id"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-zinc-600 transition-all text-zinc-100 placeholder:text-zinc-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-zinc-600 transition-all text-zinc-100 placeholder:text-zinc-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="p-3 rounded bg-red-950/40 border border-red-900/50 text-red-400 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-100 text-zinc-950 font-medium rounded-lg px-4 py-3 hover:bg-white active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Icons & Copyright */}
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-xs text-zinc-600 tracking-wide">Login dengan Email UISI dan Password</p>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-5 text-zinc-600">
              <a href="#" className="hover:text-zinc-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
            <p className="text-xs text-zinc-600">Copyright © ICT UISI 2026</p>
          </div>
        </div>
      </div>

      {/* Kanan: Foto Kampus */}
      <div className="hidden lg:block lg:flex-[1.1] relative bg-zinc-900 overflow-hidden">
        {/* Shadow gradient internal yang membuat blend halus dengan sisi form */}
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-zinc-950 to-transparent z-10" />
        
        <img
          src="/bg-kampus.png"
          alt="Semen Indonesia Silos at Dusk"
          className="absolute inset-0 w-full h-full object-cover opacity-70 sepia-[0.2]"
        />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply z-1" />
      </div>
    </div>
  );
}
