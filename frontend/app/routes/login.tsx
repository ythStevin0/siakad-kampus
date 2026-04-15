import { Form, Link } from "react-router";

export default function Login() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(24,24,27,0.95),rgba(9,9,11,1))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-2xl shadow-black/30 backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden border-r border-zinc-800 bg-zinc-950/80 p-10 md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                SIAKAD UISI
              </p>
              <h1 className="mt-6 max-w-sm text-4xl font-semibold tracking-tight text-zinc-100">
                Portal akademik yang aman, cepat, dan siap dipakai per role.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
                Kita mulai dari satu pintu masuk yang jelas dulu. Admin, dosen,
                dan mahasiswa nanti akan diarahkan ke dashboard masing-masing
                setelah autentikasi selesai kita sambungkan.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-zinc-300">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                <p className="text-zinc-500">Role aktif</p>
                <p className="mt-2 font-medium text-zinc-100">
                  Admin, Dosen, Mahasiswa
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                <p className="text-zinc-500">Metode login</p>
                <p className="mt-2 font-medium text-zinc-100">
                  Email domain kampus + password
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto flex w-full max-w-md flex-col">
              <Link
                to="/"
                className="mb-8 inline-flex w-fit items-center text-sm text-zinc-500 transition hover:text-zinc-300"
              >
                Kembali ke beranda
              </Link>

              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                  Login
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100">
                  Masuk ke SIAKAD
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Di langkah ini kita siapkan halaman dan struktur form dulu.
                  Submit ke backend akan kita sambungkan di langkah berikutnya.
                </p>
              </div>

              <Form className="mt-10 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Email Kampus
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@admin.uisi.ac.id"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white"
                >
                  Masuk
                </button>
              </Form>

              <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                Form ini belum mengirim request ke backend. Kita sengaja
                pisahkan agar Anda paham dulu struktur route dan UI sebelum
                masuk ke action login.
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
