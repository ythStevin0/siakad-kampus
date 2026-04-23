-- Menambahkan kolom untuk status keuangan dan izin akademik
ALTER TABLE mahasiswa 
ADD COLUMN status_ukt BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN status_bip BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN izin_krs BOOLEAN NOT NULL DEFAULT false;

-- Tambahkan komentar untuk dokumentasi
COMMENT ON COLUMN mahasiswa.status_ukt IS 'Status pembayaran UKT semester berjalan';
COMMENT ON COLUMN mahasiswa.status_bip IS 'Status pembayaran uang pangkal (BIP)';
COMMENT ON COLUMN mahasiswa.izin_krs IS 'Izin khusus dari dosen wali untuk akses KRS meski belum bayar';
