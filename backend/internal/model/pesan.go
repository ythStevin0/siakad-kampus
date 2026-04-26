package model

import (
	"time"

	"github.com/google/uuid"
)

type Pesan struct {
	ID        uuid.UUID  `json:"id"`
	UserID    uuid.UUID  `json:"user_id"`
	IsiPesan  string     `json:"isi_pesan"`
	IsRead    bool       `json:"is_read"`
	CreatedAt time.Time  `json:"created_at"`

	// Relasi untuk frontend (nama pengirim, email pengirim)
	PengirimNama  string `json:"pengirim_nama,omitempty"`
	PengirimEmail string `json:"pengirim_email,omitempty"`
	PengirimRole  string `json:"pengirim_role,omitempty"`
}
