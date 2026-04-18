import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  // Mahasiswa & Dosen
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard._index.tsx"),
    route("cari-user", "routes/dashboard.cari-user.tsx"),
    route("krs", "routes/dashboard.krs.tsx"),
    route("jadwal", "routes/dashboard.jadwal.tsx"),
    route("persetujuan-krs", "routes/dashboard.persetujuan-krs.tsx"),
    route("master-data", "routes/dashboard.master-data.tsx"),
  ]),
  // Admin Panel — terpisah
  route("admin", "routes/admin.tsx", [
    index("routes/admin._index.tsx"),
    route("mahasiswa", "routes/admin.mahasiswa.tsx"),
    route("dosen", "routes/admin.dosen.tsx"),
    route("mata-kuliah", "routes/admin.mata-kuliah.tsx"),
    route("kelas", "routes/admin.kelas.tsx"),
    route("akun", "routes/admin.akun.tsx"),
  ]),
] satisfies RouteConfig;
