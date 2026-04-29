package akademik

import (
	"context"
	"fmt"

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

// GetAvailableKelas mengambil semua kelas yang tersedia untuk prodi tertentu di semester tertentu
func (r *Repository) GetAvailableKelas(ctx context.Context, prodi string, semesterAkademik string) ([]model.Kelas, error) {
	query := `
		SELECT 
			k.id, k.mata_kuliah_id, k.dosen_id, k.kode_kelas, k.hari, k.jam_mulai, k.jam_selesai, 
			k.ruangan, k.kapasitas, k.semester_akademik, k.created_at, k.updated_at,
			mk.nama_mk, d.nama_lengkap as nama_dosen, mk.sks,
			(SELECT COUNT(*) FROM krs kr WHERE kr.kelas_id = k.id AND kr.status != 'ditolak') as terisi
		FROM kelas k
		JOIN mata_kuliah mk ON mk.id = k.mata_kuliah_id
		JOIN dosen d ON d.id = k.dosen_id
		WHERE (mk.program_studi = $1 OR mk.program_studi = 'Umum')
		AND k.semester_akademik = $2
		ORDER BY mk.semester ASC, mk.nama_mk ASC, k.kode_kelas ASC
	`
	rows, err := r.db.Query(ctx, query, prodi, semesterAkademik)
	if err != nil {
		return nil, fmt.Errorf("failed to query available kelas: %w", err)
	}
	defer rows.Close()

	var list []model.Kelas
	for rows.Next() {
		var k model.Kelas
		err := rows.Scan(
			&k.ID, &k.MataKuliahID, &k.DosenID, &k.KodeKelas, &k.Hari, &k.JamMulai, &k.JamSelesai,
			&k.Ruangan, &k.Kapasitas, &k.SemesterAkademik, &k.CreatedAt, &k.UpdatedAt,
			&k.NamaMataKuliah, &k.NamaDosen, &k.SKS, &k.Terisi,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan kelas: %w", err)
		}
		list = append(list, k)
	}
	return list, nil
}

// GetKRSMahasiswa mengambil daftar KRS yang sudah diambil oleh mahasiswa
func (r *Repository) GetKRSMahasiswa(ctx context.Context, mahasiswaID string, semesterAkademik string) ([]model.KRS, error) {
	query := `
		SELECT 
			kr.id, kr.mahasiswa_id, kr.kelas_id, kr.semester_akademik, kr.status, kr.created_at, kr.updated_at,
			mk.nama_mk, k.kode_kelas, mk.sks, k.hari, k.jam_mulai, k.jam_selesai, d.nama_lengkap as nama_dosen
		FROM krs kr
		JOIN kelas k ON k.id = kr.kelas_id
		JOIN mata_kuliah mk ON mk.id = k.mata_kuliah_id
		JOIN dosen d ON d.id = k.dosen_id
		WHERE kr.mahasiswa_id = $1 AND kr.semester_akademik = $2
		ORDER BY k.hari ASC, k.jam_mulai ASC
	`
	rows, err := r.db.Query(ctx, query, mahasiswaID, semesterAkademik)
	if err != nil {
		return nil, fmt.Errorf("failed to query krs: %w", err)
	}
	defer rows.Close()

	var list []model.KRS
	for rows.Next() {
		var kr model.KRS
		err := rows.Scan(
			&kr.ID, &kr.MahasiswaID, &kr.KelasID, &kr.SemesterAkademik, &kr.Status, &kr.CreatedAt, &kr.UpdatedAt,
			&kr.NamaMataKuliah, &kr.KodeKelas, &kr.SKS, &kr.Hari, &kr.JamMulai, &kr.JamSelesai, &kr.NamaDosen,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan krs: %w", err)
		}
		list = append(list, kr)
	}
	return list, nil
}

// AddKRS menambahkan mata kuliah ke rencana studi mahasiswa
func (r *Repository) AddKRS(ctx context.Context, krs *model.KRS) error {
	query := `
		INSERT INTO krs (mahasiswa_id, kelas_id, semester_akademik, status)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, krs.MahasiswaID, krs.KelasID, krs.SemesterAkademik, krs.Status).
		Scan(&krs.ID, &krs.CreatedAt, &krs.UpdatedAt)
	if err != nil {
		return database.ParsePgError(err)
	}
	return nil
}

// DeleteKRS menghapus mata kuliah dari rencana studi (Drop)
func (r *Repository) DeleteKRS(ctx context.Context, id string, mahasiswaID string) error {
	query := `DELETE FROM krs WHERE id = $1 AND mahasiswa_id = $2 AND status = 'pending'`
	cmd, err := r.db.Exec(ctx, query, id, mahasiswaID)
	if err != nil {
		return fmt.Errorf("failed to delete krs: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("krs not found or already approved")
	}
	return nil
}

// CheckScheduleConflict mengecek apakah ada jadwal yang bentrok
func (r *Repository) CheckScheduleConflict(ctx context.Context, mahasiswaID string, kelasID string, semesterAkademik string) (bool, error) {
	// Ambil detail kelas yang akan diambil
	var newHari string
	var newMulai, newSelesai string
	err := r.db.QueryRow(ctx, "SELECT hari, jam_mulai, jam_selesai FROM kelas WHERE id = $1", kelasID).
		Scan(&newHari, &newMulai, &newSelesai)
	if err != nil {
		return false, fmt.Errorf("failed to get class details: %w", err)
	}

	// Cek bentrok dengan kelas yang sudah ada di KRS
	query := `
		SELECT EXISTS (
			SELECT 1 FROM krs kr
			JOIN kelas k ON k.id = kr.kelas_id
			WHERE kr.mahasiswa_id = $1 
			AND kr.semester_akademik = $2
			AND k.hari = $3
			AND (
				(k.jam_mulai, k.jam_selesai) OVERLAPS ($4::TIME, $5::TIME)
			)
			AND kr.status != 'ditolak'
		)
	`
	var conflict bool
	err = r.db.QueryRow(ctx, query, mahasiswaID, semesterAkademik, newHari, newMulai, newSelesai).Scan(&conflict)
	if err != nil {
		return false, fmt.Errorf("failed to check schedule conflict: %w", err)
	}

	return conflict, nil
}

// CheckCapacity mengecek apakah kelas masih memiliki sisa kuota
func (r *Repository) CheckCapacity(ctx context.Context, kelasID string) (bool, error) {
	query := `
		SELECT 
			(SELECT COUNT(*) FROM krs WHERE kelas_id = $1 AND status != 'ditolak') < kapasitas
		FROM kelas WHERE id = $1
	`
	var hasCapacity bool
	err := r.db.QueryRow(ctx, query, kelasID).Scan(&hasCapacity)
	if err != nil {
		return false, fmt.Errorf("failed to check capacity: %w", err)
	}
	return hasCapacity, nil
}
