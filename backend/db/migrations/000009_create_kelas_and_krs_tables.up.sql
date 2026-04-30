-- Tabel kelas: merepresentasikan satu sesi perkuliahan dari sebuah mata kuliah
-- Satu mata kuliah bisa punya banyak kelas (kelas A, B, C, dll)
CREATE TABLE IF NOT EXISTS kelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relasi ke mata kuliah yang diajarkan di kelas ini
    mata_kuliah_id UUID NOT NULL REFERENCES mata_kuliah(id) ON DELETE CASCADE,

    -- Relasi ke dosen yang mengajar kelas ini
    dosen_id UUID NOT NULL REFERENCES dosen(id) ON DELETE RESTRICT,

    -- Identitas kelas
    kode_kelas   VARCHAR(20) NOT NULL,  -- Contoh: A, B, atau TI-A
    hari         VARCHAR(15) NOT NULL,  -- Contoh: Senin, Selasa
    jam_mulai    TIME NOT NULL,
    jam_selesai  TIME NOT NULL,
    ruangan      VARCHAR(50) NOT NULL,
    kapasitas    INT NOT NULL DEFAULT 40,

    -- Semester akademik, contoh: "Ganjil 2024/2025"
    semester_akademik VARCHAR(30) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Satu kombinasi kode kelas + semester harus unik
    UNIQUE (kode_kelas, semester_akademik)
);

-- Tabel krs: merepresentasikan rencana studi mahasiswa per semester
-- Satu baris = mahasiswa mendaftar ke satu kelas tertentu
CREATE TABLE IF NOT EXISTS krs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Mahasiswa yang mengambil kelas ini
    mahasiswa_id UUID NOT NULL REFERENCES mahasiswa(id) ON DELETE CASCADE,

    -- Kelas yang diambil
    kelas_id UUID NOT NULL REFERENCES kelas(id) ON DELETE RESTRICT,

    -- Semester saat KRS diisi
    semester_akademik VARCHAR(30) NOT NULL,

    -- Status persetujuan dosen wali
    -- pending: sudah diisi, menunggu persetujuan
    -- disetujui: dosen wali sudah approve
    -- ditolak: dosen wali menolak
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'disetujui', 'ditolak')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Satu mahasiswa tidak boleh daftar kelas yang sama di semester yang sama
    UNIQUE (mahasiswa_id, kelas_id, semester_akademik)
);

-- Index untuk mempercepat query "tampilkan KRS mahasiswa X semester ini"
CREATE INDEX IF NOT EXISTS idx_kelas_mata_kuliah ON kelas(mata_kuliah_id);
CREATE INDEX IF NOT EXISTS idx_kelas_dosen ON kelas(dosen_id);
CREATE INDEX IF NOT EXISTS idx_kelas_semester ON kelas(semester_akademik);
CREATE INDEX IF NOT EXISTS idx_krs_mahasiswa ON krs(mahasiswa_id);
CREATE INDEX IF NOT EXISTS idx_krs_semester ON krs(semester_akademik);
CREATE INDEX IF NOT EXISTS idx_krs_status ON krs(status);
