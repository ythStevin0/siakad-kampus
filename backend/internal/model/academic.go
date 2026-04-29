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
	ID           uuid.UUID `json:"id" db:"id"`
	KodeMK       string    `json:"kode_mk" db:"kode_mk"`
	NamaMK       string    `json:"nama_mk" db:"nama_mk"`
	SKS          int       `json:"sks" db:"sks"`
	Semester     int       `json:"semester" db:"semester"`
	ProgramStudi string    `json:"program_studi" db:"program_studi"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// KelasStatus merepresentasikan status ketersediaan kelas
type KelasStatus string

const (
	KelasStatusBuka   KelasStatus = "buka"
	KelasStatusTutup  KelasStatus = "tutup"
)

// Kelas merepresentasikan satu sesi perkuliahan dari sebuah mata kuliah
type Kelas struct {
	ID               uuid.UUID `json:"id" db:"id"`
	MataKuliahID     uuid.UUID `json:"mata_kuliah_id" db:"mata_kuliah_id"`
	DosenID          uuid.UUID `json:"dosen_id" db:"dosen_id"`
	KodeKelas        string    `json:"kode_kelas" db:"kode_kelas"`
	Hari             string    `json:"hari" db:"hari"`
	JamMulai         string    `json:"jam_mulai" db:"jam_mulai"`
	JamSelesai       string    `json:"jam_selesai" db:"jam_selesai"`
	Ruangan          string    `json:"ruangan" db:"ruangan"`
	Kapasitas        int       `json:"kapasitas" db:"kapasitas"`
	SemesterAkademik string    `json:"semester_akademik" db:"semester_akademik"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`

	// Field tambahan dari JOIN, tidak disimpan di DB
	NamaMataKuliah string `json:"nama_mata_kuliah,omitempty" db:"-"`
	NamaDosen      string `json:"nama_dosen,omitempty" db:"-"`
	SKS            int    `json:"sks,omitempty" db:"-"`
	Terisi         int    `json:"terisi,omitempty" db:"-"`
}

// KRSStatus merepresentasikan alur persetujuan KRS
type KRSStatus string

const (
	KRSStatusPending   KRSStatus = "pending"
	KRSStatusDisetujui KRSStatus = "disetujui"
	KRSStatusDitolak   KRSStatus = "ditolak"
)

// KRS merepresentasikan rencana studi mahasiswa untuk satu kelas di satu semester
type KRS struct {
	ID               uuid.UUID `json:"id" db:"id"`
	MahasiswaID      uuid.UUID `json:"mahasiswa_id" db:"mahasiswa_id"`
	KelasID          uuid.UUID `json:"kelas_id" db:"kelas_id"`
	SemesterAkademik string    `json:"semester_akademik" db:"semester_akademik"`
	Status           KRSStatus `json:"status" db:"status"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`

	// Field tambahan dari JOIN, tidak disimpan di DB
	NamaMataKuliah string `json:"nama_mata_kuliah,omitempty" db:"-"`
	KodeKelas      string `json:"kode_kelas,omitempty" db:"-"`
	SKS            int    `json:"sks,omitempty" db:"-"`
	Hari           string `json:"hari,omitempty" db:"-"`
	JamMulai       string `json:"jam_mulai,omitempty" db:"-"`
	JamSelesai     string `json:"jam_selesai,omitempty" db:"-"`
	NamaDosen      string `json:"nama_dosen,omitempty" db:"-"`
}
