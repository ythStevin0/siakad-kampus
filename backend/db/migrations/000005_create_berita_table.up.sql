CREATE TABLE berita (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    kategori VARCHAR(50) DEFAULT 'Umum', -- Contoh: Akademik, Keuangan, Event
    thumbnail_url VARCHAR(255),          -- Jika nanti ingin ada gambar
    penulis_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_berita_created_at ON berita(created_at DESC);
