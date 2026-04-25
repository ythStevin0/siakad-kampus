// api.ts
// Helper terpusat untuk semua request ke backend API
// Menggunakan access token dari auth.ts secara otomatis

import { getAccessToken } from "./auth";

const BASE_URL = "http://localhost:8080";

// Helper dasar — otomatis sisipkan Authorization header
async function apiFetch(path: string, options?: RequestInit) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "omit",
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Terjadi kesalahan");
  }
  return data;
}

// =============================================
// ADMIN STATS
// =============================================
export interface AdminStats {
  total_mahasiswa: number;
  total_dosen: number;
  total_matkul: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await apiFetch("/api/admin/stats");
  return res.data as AdminStats;
}

// =============================================
// PENCARIAN USER
// =============================================
export interface SearchResult {
  tipe: "mahasiswa" | "dosen";
  nama_lengkap: string;
  identifier: string; // NIM atau NIDN
  email: string;
  detail: string;     // Prodi atau Departemen
}

export async function searchUsers(q: string): Promise<SearchResult[]> {
  const res = await apiFetch(`/api/users/search?q=${encodeURIComponent(q)}`);
  return res.data as SearchResult[];
}

// =============================================
// DATA DOSEN (untuk Cari User / halaman dosen)
// =============================================
export interface Dosen {
  id: string;
  nidn: string;
  nama_lengkap: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  departemen: string;
  email?: string;
}

export async function fetchAllDosen(): Promise<Dosen[]> {
  const res = await apiFetch("/api/users/dosen");
  return (res.data as Dosen[]) || [];
}

// =============================================
// DATA MAHASISWA (untuk Admin - Kelola Mahasiswa)
// =============================================
export interface Mahasiswa {
  id: string;
  nim: string;
  nama_lengkap: string;
  program_studi: string;
  angkatan: number;
  jalur_masuk: string | null;
  status_ukt: boolean;
  status_bip: boolean;
  izin_krs: boolean;
}

export async function fetchAllMahasiswa(): Promise<Mahasiswa[]> {
  const res = await apiFetch("/api/admin/mahasiswa");
  return (res.data as Mahasiswa[]) || [];
}

export async function createMahasiswa(payload: Record<string, any>) {
  const res = await apiFetch("/api/admin/mahasiswa", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateMahasiswa(id: string, payload: Record<string, any>) {
  const res = await apiFetch(`/api/admin/mahasiswa/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteMahasiswa(id: string) {
  const res = await apiFetch(`/api/admin/mahasiswa/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

export async function createDosen(payload: Record<string, any>) {
  const res = await apiFetch("/api/admin/dosen", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateDosen(id: string, payload: Record<string, any>) {
  const res = await apiFetch(`/api/admin/dosen/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteDosen(id: string) {
  const res = await apiFetch(`/api/admin/dosen/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

// =============================================
// DATA MATA KULIAH
// =============================================
export interface MataKuliah {
  id: string;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
}

export async function fetchAllMataKuliah(): Promise<MataKuliah[]> {
  const res = await apiFetch("/api/admin/mata-kuliah");
  return (res.data as MataKuliah[]) || [];
}

export async function createMataKuliah(payload: Record<string, any>) {
  const res = await apiFetch("/api/admin/mata-kuliah", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

// =============================================
// BERITA / PENGUMUMAN
// =============================================
export interface Berita {
  id: string;
  judul: string;
  isi: string;
  kategori: string;
  created_at: string;
}

export async function fetchBerita(): Promise<Berita[]> {
  const res = await apiFetch("/api/berita");
  return (res.data as Berita[]) || [];
}

export async function createBerita(payload: Record<string, any>) {
  const res = await apiFetch("/api/admin/berita", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteBerita(id: string) {
  const res = await apiFetch(`/api/admin/berita/${id}`, {
    method: "DELETE",
  });
  return res.data;
}


