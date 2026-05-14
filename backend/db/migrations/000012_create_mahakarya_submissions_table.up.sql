-- Create mahakarya_submissions table
CREATE TABLE IF NOT EXISTS mahakarya_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID NOT NULL REFERENCES mahasiswa(id) ON DELETE CASCADE,
    dosen_wali_id UUID REFERENCES dosen(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    portfolio_url TEXT,
    poster_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by advisor and student
CREATE INDEX IF NOT EXISTS idx_mahakarya_mahasiswa ON mahakarya_submissions(mahasiswa_id);
CREATE INDEX IF NOT EXISTS idx_mahakarya_dosen_wali ON mahakarya_submissions(dosen_wali_id);
CREATE INDEX IF NOT EXISTS idx_mahakarya_status ON mahakarya_submissions(status);
