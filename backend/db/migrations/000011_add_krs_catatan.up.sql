-- Tambahkan kolom catatan untuk dosen wali ketika menolak KRS
-- Nullable: hanya diisi saat KRS ditolak
ALTER TABLE krs
  ADD COLUMN IF NOT EXISTS catatan VARCHAR(500) NULL;
