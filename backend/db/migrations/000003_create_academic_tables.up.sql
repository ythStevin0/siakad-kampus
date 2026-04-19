CREATE TABLE mahasiswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- FK ke tabel users, CASCADE: jika user dihapus, profil mahasiswa ikut terhapus
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    nim VARCHAR(50) NOT NULL UNIQUE,
    nama_lengkap VARCHAR(255) NOT NULL,
    program_studi VARCHAR(100) NOT NULL,
    angkatan INTEGER NOT NULL,
    jalur_masuk VARCHAR(50), -- Contoh: SNBP, SNBT, Mandiri
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dosen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    nidn VARCHAR(50) NOT NULL UNIQUE,
    nama_lengkap VARCHAR(255) NOT NULL,
    gelar_depan VARCHAR(50),    -- Contoh: Dr. , Prof.
    gelar_belakang VARCHAR(50), -- Contoh: M.Kom. , Ph.D.
    departemen VARCHAR(100) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mata_kuliah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_mk VARCHAR(50) NOT NULL UNIQUE,
    nama_mk VARCHAR(255) NOT NULL,
    sks INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing agar pencarian data menjadi secepat kilat (O(log n) vs O(n))
CREATE INDEX idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX idx_dosen_nidn ON dosen(nidn);
CREATE INDEX idx_mata_kuliah_kode ON mata_kuliah(kode_mk);
