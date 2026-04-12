// React Router v7 — semua import dari "react-router"
import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";

type HealthResponse = {
  status: string;
  message: string;
  database: string;
};

// loader tetap sama konsepnya — berjalan di server
// sebelum halaman di-render ke browser
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const response = await fetch("http://localhost:8080/api/health")

    if (!response.ok) {
      throw new Error("API tidak merespons");
    }

    const data: HealthResponse = await response.json();
    return { health: data, error: null };

  } catch (error) {
    return { health: null, error: "Gagal terhubung ke API" };
  }
}

export default function Index() {
  const { health, error } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
            SIAKAD
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Sistem Informasi Akademik
          </p>
        </div>

        {/* Card status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
            Status Sistem
          </p>

          {error && (
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {health && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">API Server</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400">{health.status}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Database</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400">{health.database}</span>
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs">{health.message}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}