package model

import (
	"time"

	"github.com/google/uuid"
)

type MahakaryaSubmission struct {
	ID               uuid.UUID `json:"id"`
	MahasiswaID      uuid.UUID `json:"mahasiswa_id"`
	DosenWaliID      uuid.UUID `json:"dosen_wali_id"`
	Title            string    `json:"title"`
	Category         string    `json:"category"`
	Description      *string   `json:"description"`
	PortfolioURL     *string   `json:"portfolio_url"`
	PosterURL        *string   `json:"poster_url"`
	Status           string    `json:"status"` // pending, approved, rejected
	RejectionReason  *string   `json:"rejection_reason,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`

	// Join fields
	MahasiswaNama string `json:"mahasiswa_nama,omitempty"`
	MahasiswaNIM  string `json:"mahasiswa_nim,omitempty"`
}
