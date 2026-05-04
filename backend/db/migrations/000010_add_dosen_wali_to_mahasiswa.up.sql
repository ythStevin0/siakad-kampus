-- Tambahkan kolom dosen_wali_id ke tabel mahasiswa
-- Relasi opsional: mahasiswa boleh belum punya dosen wali
ALTER TABLE mahasiswa
  ADD COLUMN IF NOT EXISTS dosen_wali_id UUID REFERENCES dosen(id) ON DELETE SET NULL;

-- Index untuk mempercepat query "tampilkan semua mahasiswa asuhan dosen X"
CREATE INDEX IF NOT EXISTS idx_mahasiswa_dosen_wali ON mahasiswa(dosen_wali_id);
