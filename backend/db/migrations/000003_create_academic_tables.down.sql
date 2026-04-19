-- Urutan DROP harus terbalik dari urutan CREATE
-- Mata kuliah tidak me-reference siapa pun, tapi aman ditaruh paling atas
DROP TABLE IF EXISTS mata_kuliah;

-- Dosen dan Mahasiswa me-reference Users, drop lebih dulu sebelum Users (meski users di file migrasi lain)
DROP TABLE IF EXISTS dosen;
DROP TABLE IF EXISTS mahasiswa;
