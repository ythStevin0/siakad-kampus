package model

import (
	"time"

	"github.com/google/uuid"
)

type Mahasiswa struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"user_id" db:"user_id"`
	NIM          string    `json:"nim" db:"nim"`
	NamaLengkap  string    `json:"nama_lengkap" db:"nama_lengkap"`
	ProgramStudi string    `json:"program_studi" db:"program_studi"`
	Angkatan     int       `json:"angkatan" db:"angkatan"`
	JalurMasuk   *string   `json:"jalur_masuk" db:"jalur_masuk"`
	StatusUKT    bool      `json:"status_ukt" db:"status_ukt"`
	StatusBIP    bool      `json:"status_bip" db:"status_bip"`
	IzinKRS      bool      `json:"izin_krs" db:"izin_krs"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type Dosen struct {
	ID            uuid.UUID `json:"id" db:"id"`
	UserID        uuid.UUID `json:"user_id" db:"user_id"`
	NIDN          string    `json:"nidn" db:"nidn"`
	NamaLengkap   string    `json:"nama_lengkap" db:"nama_lengkap"`
	GelarDepan    *string   `json:"gelar_depan" db:"gelar_depan"`
	GelarBelakang *string   `json:"gelar_belakang" db:"gelar_belakang"`
	Departemen    string    `json:"departemen" db:"departemen"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

type MataKuliah struct {
	ID        uuid.UUID `json:"id" db:"id"`
	KodeMK    string    `json:"kode_mk" db:"kode_mk"`
	NamaMK    string    `json:"nama_mk" db:"nama_mk"`
	SKS       int       `json:"sks" db:"sks"`
	Semester  int       `json:"semester" db:"semester"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
