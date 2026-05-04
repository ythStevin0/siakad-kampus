package dosenWali

import "github.com/google/uuid"

// MahasiswaAsuhan adalah DTO untuk menampilkan mahasiswa dengan info KRS di dashboard dosen
type MahasiswaAsuhan struct {
	ID           uuid.UUID  `json:"id"`
	NIM          string     `json:"nim"`
	NamaLengkap  string     `json:"nama_lengkap"`
	ProgramStudi string     `json:"program_studi"`
	Angkatan     int        `json:"angkatan"`
	StatusUKT    bool       `json:"status_ukt"`
	StatusBIP    bool       `json:"status_bip"`
	DosenWaliID  *uuid.UUID `json:"dosen_wali_id"`
	KRSPending   int        `json:"krs_pending"`
	KRSDisetujui int        `json:"krs_disetujui"`
}

// DosenSummary adalah DTO untuk ringkasan statistik di dashboard dosen
type DosenSummary struct {
	TotalAsuhan    int `json:"total_asuhan"`
	TotalPending   int `json:"total_pending"`
	TotalDisetujui int `json:"total_disetujui"`
	TotalDitolak   int `json:"total_ditolak"`
}
