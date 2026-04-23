package model

import (
	"time"

	"github.com/google/uuid"
)

type Berita struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	Judul        string     `json:"judul" db:"judul"`
	Isi          string     `json:"isi" db:"isi"`
	Kategori     string     `json:"kategori" db:"kategori"`
	ThumbnailURL *string    `json:"thumbnail_url" db:"thumbnail_url"`
	PenulisID    *uuid.UUID `json:"penulis_id" db:"penulis_id"`
	PenulisNama  string     `json:"penulis_nama,omitempty"` // Virtual field untuk join
	
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}
