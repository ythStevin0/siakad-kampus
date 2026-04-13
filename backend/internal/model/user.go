package model

import (
	"time"
)

// UserRole mendefinisikan tipe enum role
// sesuai dengan yang ada di database
type UserRole string

const (
	RoleAdmin     UserRole = "admin"
	RoleDosen     UserRole = "dosen"
	RoleMahasiswa UserRole = "mahasiswa"
)

// User merepresentasikan satu baris di tabel users
type User struct {
	ID        string    `db:"id"`
	Email     string    `db:"email"`
	Password  string    `db:"password"`
	Role      UserRole  `db:"role"`
	IsActive  bool      `db:"is_active"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

// RefreshToken merepresentasikan satu baris
// di tabel refresh_tokens
type RefreshToken struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	Token     string    `db:"token"`
	ExpiresAt time.Time `db:"expires_at"`
	IsRevoked bool      `db:"is_revoked"`
	CreatedAt time.Time `db:"created_at"`
}