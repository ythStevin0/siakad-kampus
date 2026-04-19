package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"siakad/backend/internal/model"
)

// AcademicRepository menangani semua operasi database
// untuk entitas akademik (mahasiswa, dosen, mata kuliah)
type AcademicRepository struct {
	db *pgxpool.Pool
}

func NewAcademicRepository(db *pgxpool.Pool) *AcademicRepository {
	return &AcademicRepository{db: db}
}

// --- STATISTIK ---

// GetStats mengambil ringkasan total data untuk Dashboard Admin
func (r *AcademicRepository) GetStats(ctx context.Context) (map[string]int64, error) {
	stats := make(map[string]int64)

	queries := map[string]string{
		"total_mahasiswa": "SELECT COUNT(*) FROM mahasiswa",
		"total_dosen":     "SELECT COUNT(*) FROM dosen",
		"total_matkul":    "SELECT COUNT(*) FROM mata_kuliah",
	}

	for key, q := range queries {
		var count int64
		if err := r.db.QueryRow(ctx, q).Scan(&count); err != nil {
			return nil, fmt.Errorf("failed to count %s: %w", key, err)
		}
		stats[key] = count
	}

	return stats, nil
}

// --- PENCARIAN USER ---

// SearchResult digunakan untuk hasil pencarian gabungan mahasiswa & dosen
type SearchResult struct {
	Tipe         string  `json:"tipe"`          // "mahasiswa" atau "dosen"
	NamaLengkap  string  `json:"nama_lengkap"`
	Identifier   string  `json:"identifier"`    // NIM atau NIDN
	Email        string  `json:"email"`
	Detail       string  `json:"detail"`        // Prodi atau Departemen
}

// SearchUsers mencari pengguna berdasarkan NIM, NIDN, nama, atau email
// Menggabungkan hasil dari tabel mahasiswa dan dosen menggunakan UNION ALL
func (r *AcademicRepository) SearchUsers(ctx context.Context, q string) ([]SearchResult, error) {
	// ILIKE = case-insensitive LIKE di PostgreSQL
	query := `
		SELECT 
			'mahasiswa' AS tipe,
			m.nama_lengkap,
			m.nim AS identifier,
			u.email,
			m.program_studi AS detail
		FROM mahasiswa m
		JOIN users u ON u.id = m.user_id
		WHERE 
			m.nim ILIKE $1
			OR m.nama_lengkap ILIKE $1
			OR u.email ILIKE $1
		
		UNION ALL
		
		SELECT
			'dosen' AS tipe,
			d.nama_lengkap,
			d.nidn AS identifier,
			u.email,
			d.departemen AS detail
		FROM dosen d
		JOIN users u ON u.id = d.user_id
		WHERE
			d.nidn ILIKE $1
			OR d.nama_lengkap ILIKE $1
			OR u.email ILIKE $1
		
		LIMIT 10
	`

	// Tambah wildcard untuk pencarian "mengandung" kata tertentu
	searchTerm := "%" + q + "%"
	rows, err := r.db.Query(ctx, query, searchTerm)
	if err != nil {
		return nil, fmt.Errorf("search failed: %w", err)
	}
	defer rows.Close()

	results := make([]SearchResult, 0)
	for rows.Next() {
		var res SearchResult
		if err := rows.Scan(
			&res.Tipe,
			&res.NamaLengkap,
			&res.Identifier,
			&res.Email,
			&res.Detail,
		); err != nil {
			return nil, fmt.Errorf("failed to scan search result: %w", err)
		}
		results = append(results, res)
	}

	return results, nil
}

// --- CRUD MAHASISWA ---

// GetAllMahasiswa mengambil semua data mahasiswa (untuk halaman Admin kelola mahasiswa)
func (r *AcademicRepository) GetAllMahasiswa(ctx context.Context) ([]model.Mahasiswa, error) {
	query := `
		SELECT id, user_id, nim, nama_lengkap, program_studi, angkatan, jalur_masuk, created_at, updated_at
		FROM mahasiswa
		ORDER BY angkatan DESC, nama_lengkap ASC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query mahasiswa: %w", err)
	}
	defer rows.Close()

	list := make([]model.Mahasiswa, 0)
	for rows.Next() {
		var m model.Mahasiswa
		if err := rows.Scan(
			&m.ID, &m.UserID, &m.NIM, &m.NamaLengkap,
			&m.ProgramStudi, &m.Angkatan, &m.JalurMasuk,
			&m.CreatedAt, &m.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan mahasiswa: %w", err)
		}
		list = append(list, m)
	}
	return list, nil
}

// GetAllDosen mengambil semua data dosen (untuk halaman Admin kelola dosen & Cari User)
func (r *AcademicRepository) GetAllDosen(ctx context.Context) ([]model.Dosen, error) {
	query := `
		SELECT id, user_id, nidn, nama_lengkap, gelar_depan, gelar_belakang, departemen, created_at, updated_at
		FROM dosen
		ORDER BY departemen ASC, nama_lengkap ASC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query dosen: %w", err)
	}
	defer rows.Close()

	list := make([]model.Dosen, 0)
	for rows.Next() {
		var d model.Dosen
		if err := rows.Scan(
			&d.ID, &d.UserID, &d.NIDN, &d.NamaLengkap,
			&d.GelarDepan, &d.GelarBelakang, &d.Departemen,
			&d.CreatedAt, &d.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan dosen: %w", err)
		}
		list = append(list, d)
	}
	return list, nil
}
