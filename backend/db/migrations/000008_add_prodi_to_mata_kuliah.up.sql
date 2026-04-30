-- Menambahkan program_studi agar mata kuliah bisa difilter per prodi
-- Ini krusial untuk validasi KRS: mahasiswa hanya bisa ambil matkul prodinya
ALTER TABLE mata_kuliah
ADD COLUMN IF NOT EXISTS program_studi VARCHAR(100) NOT NULL DEFAULT 'Umum';

-- Index untuk mempercepat filter GET /api/mata-kuliah?prodi=Teknik+Informatika
CREATE INDEX IF NOT EXISTS idx_mata_kuliah_prodi ON mata_kuliah(program_studi);
