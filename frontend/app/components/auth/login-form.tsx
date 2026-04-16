import { Form, Link } from "react-router";

type LoginFormActionData = {
  success: boolean;
  message: string;
  error?: string;
  user?: {
    email: string;
    role: string;
  };
  accessToken?: string;
};

type LoginFormProps = {
  actionData?: LoginFormActionData;
  isSubmitting: boolean;
};

export function LoginForm({ actionData, isSubmitting }: LoginFormProps) {
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
                  Sekarang form ini sudah terhubung ke backend auth. Di fase ini
                  kita fokus memastikan submit dan error handling berjalan
                  dengan benar.
                </p>
              </div>

              <Form method="post" className="mt-10 space-y-5">
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
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Memproses..." : "Masuk"}
                </button>
              </Form>

              {actionData?.success === false && (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                  <p className="font-medium">{actionData.message}</p>
                  <p className="mt-1 text-red-200/90">{actionData.error}</p>
                </div>
              )}

              {actionData?.success === true && actionData.user && (
                <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                  <p className="font-medium">{actionData.message}</p>
                  <p className="mt-1 text-emerald-200/90">
                    Login backend berhasil untuk {actionData.user.email} dengan
                    role {actionData.user.role}.
                  </p>
                  <p className="mt-3 text-xs text-emerald-200/80">
                    Session frontend sekarang sudah tersimpan di cookie
                    httpOnly. Di langkah berikutnya kita akan memakai session
                    ini untuk proteksi route dan alur role-based access.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
