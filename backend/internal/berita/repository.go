package berita

import (
	"context"
	"siakad/backend/internal/model"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAll(ctx context.Context) ([]model.Berita, error) {
	query := `
		SELECT b.id, b.judul, b.isi, b.kategori, b.thumbnail_url, b.penulis_id, b.created_at, b.updated_at
		FROM berita b
		ORDER BY b.created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []model.Berita
	for rows.Next() {
		var b model.Berita
		err := rows.Scan(
			&b.ID, &b.Judul, &b.Isi, &b.Kategori, &b.ThumbnailURL, &b.PenulisID, &b.CreatedAt, &b.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		list = append(list, b)
	}
	return list, nil
}

func (r *Repository) Create(ctx context.Context, b *model.Berita) error {
	query := `
		INSERT INTO berita (judul, isi, kategori, thumbnail_url, penulis_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(ctx, query,
		b.Judul, b.Isi, b.Kategori, b.ThumbnailURL, b.PenulisID,
	).Scan(&b.ID, &b.CreatedAt, &b.UpdatedAt)
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, "DELETE FROM berita WHERE id = $1", id)
	return err
}
