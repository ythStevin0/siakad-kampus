package mahasiswa

import (
	"context"
	"fmt"

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

func (r *Repository) GetAll(ctx context.Context) ([]model.Mahasiswa, error) {
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

func (r *Repository) CreateTx(ctx context.Context, m *model.Mahasiswa, hashedPassword string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// email otomatis dibuat dengan format: nama.belakangYY@mahasiswa.uisi.ac.id
	username := util.GenerateUsername(m.NamaLengkap, m.Angkatan)
	email := fmt.Sprintf("%s@mahasiswa.uisi.ac.id", username)

	userQuery := `
		INSERT INTO users (email, password, role, is_active)
		VALUES ($1, $2, 'mahasiswa', true)
		RETURNING id
	`
	err = tx.QueryRow(ctx, userQuery, email, hashedPassword).Scan(&m.UserID)
	if err != nil {
		return database.ParsePgError(err)
	}

	mahasiswaQuery := `
		INSERT INTO mahasiswa (user_id, nim, nama_lengkap, program_studi, angkatan, jalur_masuk)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err = tx.QueryRow(ctx, mahasiswaQuery,
		m.UserID, m.NIM, m.NamaLengkap, m.ProgramStudi, m.Angkatan, m.JalurMasuk,
	).Scan(&m.ID, &m.CreatedAt, &m.UpdatedAt)

	if err != nil {
		return database.ParsePgError(err)
	}

	if err := tx.Commit(ctx); err != nil {
		return database.ParsePgError(err)
	}

	return nil
}
