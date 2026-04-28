package dosen

import (
	"context"
	"fmt"
	"time"

	"siakad/backend/internal/model"
	"siakad/backend/pkg/database"
	"siakad/backend/pkg/util"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAll(ctx context.Context) ([]model.Dosen, error) {
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

func (r *Repository) CreateTx(ctx context.Context, d *model.Dosen, hashedPassword string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// email otomatis dibuat dengan format: nama.belakangYY@dosen.uisi.ac.id
	// Untuk dosen, kita gunakan tahun saat ini sebagai YY
	currentYear := time.Now().Year()
	username := util.GenerateUsername(d.NamaLengkap, currentYear)
	email := fmt.Sprintf("%s@dosen.uisi.ac.id", username)

	userQuery := `
		INSERT INTO users (email, password, role, is_active)
		VALUES ($1, $2, 'dosen', true)
		RETURNING id
	`
	err = tx.QueryRow(ctx, userQuery, email, hashedPassword).Scan(&d.UserID)
	if err != nil {
		return database.ParsePgError(err)
	}

	dosenQuery := `
		INSERT INTO dosen (user_id, nidn, nama_lengkap, gelar_depan, gelar_belakang, departemen)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err = tx.QueryRow(ctx, dosenQuery,
		d.UserID, d.NIDN, d.NamaLengkap, d.GelarDepan, d.GelarBelakang, d.Departemen,
	).Scan(&d.ID, &d.CreatedAt, &d.UpdatedAt)

	if err != nil {
		return database.ParsePgError(err)
	}

	if err := tx.Commit(ctx); err != nil {
		return database.ParsePgError(err)
	}

	return nil
}

func (r *Repository) Update(ctx context.Context, d *model.Dosen) error {
	query := `
		UPDATE dosen 
		SET nama_lengkap = $1, gelar_depan = $2, gelar_belakang = $3, departemen = $4, updated_at = NOW()
		WHERE id = $5
	`
	_, err := r.db.Exec(ctx, query, d.NamaLengkap, d.GelarDepan, d.GelarBelakang, d.Departemen, d.ID)
	return database.ParsePgError(err)
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	var userID string
	err := r.db.QueryRow(ctx, "SELECT user_id FROM dosen WHERE id = $1", id).Scan(&userID)
	if err != nil {
		return database.ParsePgError(err)
	}

	_, err = r.db.Exec(ctx, "DELETE FROM users WHERE id = $1", userID)
	return database.ParsePgError(err)
}

func (r *Repository) GetByDepartemen(ctx context.Context, departemen string) ([]model.Dosen, error) {
	query := `
		SELECT id, user_id, nidn, nama_lengkap, gelar_depan, gelar_belakang, departemen, created_at, updated_at
		FROM dosen
		WHERE departemen ILIKE $1 
		   OR $1 ILIKE '%' || departemen || '%'
		   OR (departemen = 'DKV' AND $2 = 'Desain Komunikasi Visual')
		   OR (departemen = 'Desain Komunikasi Visual' AND $2 = 'DKV')
		ORDER BY nama_lengkap ASC
	`
	// Gunakan % agar bisa mencocokkan sebagian (misal Informatika di Teknik Informatika)
	searchTerm := "%" + departemen + "%"
	rows, err := r.db.Query(ctx, query, searchTerm, departemen)
	if err != nil {
		return nil, fmt.Errorf("failed to query dosen by departemen: %w", err)
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
