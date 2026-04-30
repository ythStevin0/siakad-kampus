CREATE TABLE IF NOT EXISTS pesan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    isi_pesan TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing untuk mempercepat query Admin yang sering membaca pesan terbaru
CREATE INDEX IF NOT EXISTS idx_pesan_created_at ON pesan(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pesan_is_read ON pesan(is_read);
