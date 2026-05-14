package mahakarya

import (
	"context"
	"fmt"

	"siakad/backend/internal/model"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

// Create menyimpan submisi karya baru
func (r *Repository) Create(ctx context.Context, m *model.MahakaryaSubmission) error {
	query := `
		INSERT INTO mahakarya_submissions (mahasiswa_id, dosen_wali_id, title, category, description, portfolio_url, poster_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, status, created_at, updated_at
	`
	return r.db.QueryRow(ctx, query,
		m.MahasiswaID, m.DosenWaliID, m.Title, m.Category, m.Description, m.PortfolioURL, m.PosterURL,
	).Scan(&m.ID, &m.Status, &m.CreatedAt, &m.UpdatedAt)
}

// GetByMahasiswa mengambil karya milik mahasiswa tertentu
func (r *Repository) GetByMahasiswa(ctx context.Context, mahasiswaID string) ([]model.MahakaryaSubmission, error) {
	query := `
		SELECT id, mahasiswa_id, dosen_wali_id, title, category, description, portfolio_url, poster_url, status, rejection_reason, created_at, updated_at
		FROM mahakarya_submissions
		WHERE mahasiswa_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query, mahasiswaID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []model.MahakaryaSubmission
	for rows.Next() {
		var m model.MahakaryaSubmission
		err := rows.Scan(
			&m.ID, &m.MahasiswaID, &m.DosenWaliID, &m.Title, &m.Category, &m.Description, &m.PortfolioURL, &m.PosterURL,
			&m.Status, &m.RejectionReason, &m.CreatedAt, &m.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		list = append(list, m)
	}
	return list, nil
}

// GetByDosenWali mengambil karya mahasiswa asuhan yang perlu direview
func (r *Repository) GetByDosenWali(ctx context.Context, dosenID string) ([]model.MahakaryaSubmission, error) {
	query := `
		SELECT 
			ms.id, ms.mahasiswa_id, ms.dosen_wali_id, ms.title, ms.category, ms.description, 
			ms.portfolio_url, ms.poster_url, ms.status, ms.rejection_reason, ms.created_at, ms.updated_at,
			m.nama_lengkap as mahasiswa_nama, m.nim as mahasiswa_nim
		FROM mahakarya_submissions ms
		JOIN mahasiswa m ON m.id = ms.mahasiswa_id
		WHERE ms.dosen_wali_id = $1
		ORDER BY ms.status = 'pending' DESC, ms.created_at DESC
	`
	rows, err := r.db.Query(ctx, query, dosenID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []model.MahakaryaSubmission
	for rows.Next() {
		var m model.MahakaryaSubmission
		err := rows.Scan(
			&m.ID, &m.MahasiswaID, &m.DosenWaliID, &m.Title, &m.Category, &m.Description, &m.PortfolioURL, &m.PosterURL,
			&m.Status, &m.RejectionReason, &m.CreatedAt, &m.UpdatedAt, &m.MahasiswaNama, &m.MahasiswaNIM,
		)
		if err != nil {
			return nil, err
		}
		list = append(list, m)
	}
	return list, nil
}

// UpdateStatus mengubah status persetujuan karya
func (r *Repository) UpdateStatus(ctx context.Context, id string, dosenID string, status string, reason string) error {
	query := `
		UPDATE mahakarya_submissions 
		SET status = $1, rejection_reason = $2, updated_at = NOW()
		WHERE id = $3 AND dosen_wali_id = $4
	`
	cmd, err := r.db.Exec(ctx, query, status, reason, id, dosenID)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("karya tidak ditemukan atau Anda bukan dosen walinya")
	}
	return nil
}

// GetAllApproved mengambil semua karya yang sudah disetujui (untuk galeri publik)
func (r *Repository) GetAllApproved(ctx context.Context) ([]model.MahakaryaSubmission, error) {
	query := `
		SELECT 
			ms.id, ms.mahasiswa_id, ms.dosen_wali_id, ms.title, ms.category, ms.description, 
			ms.portfolio_url, ms.poster_url, ms.status, ms.created_at, ms.updated_at,
			m.nama_lengkap as mahasiswa_nama, m.nim as mahasiswa_nim
		FROM mahakarya_submissions ms
		JOIN mahasiswa m ON m.id = ms.mahasiswa_id
		WHERE ms.status = 'approved'
		ORDER BY ms.created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []model.MahakaryaSubmission
	for rows.Next() {
		var m model.MahakaryaSubmission
		err := rows.Scan(
			&m.ID, &m.MahasiswaID, &m.DosenWaliID, &m.Title, &m.Category, &m.Description, &m.PortfolioURL, &m.PosterURL,
			&m.Status, &m.CreatedAt, &m.UpdatedAt, &m.MahasiswaNama, &m.MahasiswaNIM,
		)
		if err != nil {
			return nil, err
		}
		list = append(list, m)
	}
	return list, nil
}
