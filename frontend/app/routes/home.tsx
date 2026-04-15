import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";

// Sesuaikan dengan format wrapper pkg/response Go
type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    database: string;
  } | null;
  error?: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const response = await fetch("http://localhost:8080/api/health");
    const json: ApiResponse = await response.json();

    return {
      success: json.success,
      message: json.message,
      database: json.data?.database ?? null,
      error: json.error ?? null,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal terhubung ke API",
      database: null,
      error: "Server tidak merespons",
    };
  }
}

export default function Home() {
  const { success, message, database, error } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
            SIAKAD
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Sistem Informasi Akademik
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
            Status Sistem
          </p>

          {!success && (
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">API Server</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400">online</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Database</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400">{database}</span>
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs">{message}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}