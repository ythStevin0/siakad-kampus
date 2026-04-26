package pesan

import (
	"context"

	"siakad/backend/internal/model"
	"siakad/backend/pkg/database"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(ctx context.Context, p *model.Pesan) error {
	query := `
		INSERT INTO pesan (user_id, isi_pesan)
		VALUES ($1, $2)
		RETURNING id, created_at, is_read
	`
	err := r.db.QueryRow(ctx, query, p.UserID, p.IsiPesan).Scan(&p.ID, &p.CreatedAt, &p.IsRead)
	return database.ParsePgError(err)
}

func (r *Repository) GetAllForAdmin(ctx context.Context) ([]model.Pesan, error) {
	query := `
		SELECT 
			p.id, p.user_id, p.isi_pesan, p.is_read, p.created_at,
			u.name as pengirim_nama, u.email as pengirim_email, u.role as pengirim_role
		FROM pesan p
		JOIN users u ON p.user_id = u.id
		ORDER BY p.created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, database.ParsePgError(err)
	}
	defer rows.Close()

	var list []model.Pesan
	for rows.Next() {
		var p model.Pesan
		err := rows.Scan(
			&p.ID, &p.UserID, &p.IsiPesan, &p.IsRead, &p.CreatedAt,
			&p.PengirimNama, &p.PengirimEmail, &p.PengirimRole,
		)
		if err != nil {
			return nil, database.ParsePgError(err)
		}
		list = append(list, p)
	}
	return list, nil
}

func (r *Repository) MarkAsRead(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, "UPDATE pesan SET is_read = TRUE WHERE id = $1", id)
	return database.ParsePgError(err)
}
