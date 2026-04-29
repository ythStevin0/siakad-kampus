-- Hapus index dulu sebelum tabel (urutan terbalik dari up.sql)
DROP INDEX IF EXISTS idx_krs_status;
DROP INDEX IF EXISTS idx_krs_semester;
DROP INDEX IF EXISTS idx_krs_mahasiswa;
DROP INDEX IF EXISTS idx_kelas_semester;
DROP INDEX IF EXISTS idx_kelas_dosen;
DROP INDEX IF EXISTS idx_kelas_mata_kuliah;

-- Hapus tabel krs dulu karena bergantung pada kelas
DROP TABLE IF EXISTS krs;
DROP TABLE IF EXISTS kelas;
