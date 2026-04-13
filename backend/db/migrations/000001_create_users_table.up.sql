-- Buat tipe enum untuk role pengguna
-- Enum lebih aman dari string biasa karena
-- nilainya terbatas dan dicek langsung oleh PostgreSQL
CREATE TYPE user_role AS ENUM ('admin', 'dosen', 'mahasiswa');

CREATE TABLE users (
    -- UUID lebih aman dari integer karena
    -- tidak bisa ditebak urutannya oleh penyerang
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,

    -- Password disimpan dalam bentuk bcrypt hash
    -- TIDAK PERNAH simpan plain text password
    password    VARCHAR(255) NOT NULL,
    role        user_role NOT NULL,

    -- is_active untuk nonaktifkan user tanpa hapus data
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pada email karena sering dipakai untuk login
CREATE INDEX idx_users_email ON users(email);