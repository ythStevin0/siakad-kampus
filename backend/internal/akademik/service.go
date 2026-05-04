package akademik

import (
	"context"
	"errors"
	"fmt"

	"siakad/backend/internal/mahasiswa"
	"siakad/backend/internal/model"

	"github.com/google/uuid"
)

var (
	ErrPaidRequired     = errors.New("anda harus melunasi UKT/BIP atau mendapatkan izin dosen wali untuk mengisi KRS")
	ErrScheduleConflict = errors.New("jadwal kuliah bentrok dengan mata kuliah lain yang sudah diambil")
	ErrClassFull        = errors.New("kuota kelas sudah penuh")
	ErrMaxSKS           = errors.New("anda telah mencapai batas maksimal SKS")
)

type Service struct {
	repo          *Repository
	mahasiswaRepo *mahasiswa.Repository
}

func NewService(repo *Repository, mahasiswaRepo *mahasiswa.Repository) *Service {
	return &Service{
		repo:          repo,
		mahasiswaRepo: mahasiswaRepo,
	}
}

func (s *Service) GetAvailableKelas(ctx context.Context, userID uuid.UUID, semesterAkademik string) ([]model.Kelas, error) {
	// Ambil data mahasiswa untuk tahu prodinya
	mhs, err := s.mahasiswaRepo.GetByUserID(ctx, userID.String())
	if err != nil {
		return nil, fmt.Errorf("failed to get student info: %w", err)
	}

	return s.repo.GetAvailableKelas(ctx, mhs.ProgramStudi, semesterAkademik)
}

func (s *Service) GetKRS(ctx context.Context, userID uuid.UUID, semesterAkademik string) ([]model.KRS, error) {
	mhs, err := s.mahasiswaRepo.GetByUserID(ctx, userID.String())
	if err != nil {
		return nil, fmt.Errorf("failed to get student info: %w", err)
	}

	return s.repo.GetKRSMahasiswa(ctx, mhs.ID.String(), semesterAkademik)
}

func (s *Service) EnrollKelas(ctx context.Context, userID uuid.UUID, kelasID string, semesterAkademik string) error {
	// 1. Ambil data mahasiswa
	mhs, err := s.mahasiswaRepo.GetByUserID(ctx, userID.String())
	if err != nil {
		return fmt.Errorf("failed to get student info: %w", err)
	}

	// 2. Cek syarat pembayaran (UKT lunas ATAU BIP lunas ATAU Izin KRS true)
	// Kebijakan: Mahasiswa harus bayar UKT DAN BIP. Jika belum, harus ada IzinKRS dari dosen wali.
	if !mhs.IzinKRS && (!mhs.StatusUKT || !mhs.StatusBIP) {
		return ErrPaidRequired
	}

	// 3. Cek kapasitas kelas
	hasCapacity, err := s.repo.CheckCapacity(ctx, kelasID)
	if err != nil {
		return err
	}
	if !hasCapacity {
		return ErrClassFull
	}

	// 4. Cek konflik jadwal
	hasConflict, err := s.repo.CheckScheduleConflict(ctx, mhs.ID.String(), kelasID, semesterAkademik)
	if err != nil {
		return err
	}
	if hasConflict {
		return ErrScheduleConflict
	}

	// 5. Cek Batas SKS (Berdasarkan IPS semester sebelumnya)
	// Aturan: IPS < 2.0 (18 SKS), 2.0-2.9 (21 SKS), >= 3.0 (24 SKS)
	// Untuk Mahasiswa Baru (Angkatan 2026), otomatis 24 SKS
	maxSKS := 24
	if mhs.Angkatan != 2026 {
		// Logika Simulasi IPS (Nanti bisa dihubungkan ke tabel KHS/Nilai)
		// Kita asumsikan default 20 SKS jika bukan mahasiswa baru untuk simulasi pembatasan
		maxSKS = 20 
		
		// Jika mahasiswa memiliki izin khusus (IzinKRS), bisa ambil sampai 24
		if mhs.IzinKRS {
			maxSKS = 24
		}
	}

	currentKRS, err := s.repo.GetKRSMahasiswa(ctx, mhs.ID.String(), semesterAkademik)
	if err != nil {
		return err
	}
	
	totalSKS := 0
	for _, k := range currentKRS {
		totalSKS += k.SKS
	}

	// Ambil SKS kelas yang baru akan ditambahkan
	var newSKS int
	err = s.repo.db.QueryRow(ctx, `
		SELECT mk.sks FROM kelas k 
		JOIN mata_kuliah mk ON mk.id = k.mata_kuliah_id 
		WHERE k.id = $1`, kelasID).Scan(&newSKS)
	if err != nil {
		return fmt.Errorf("failed to get class SKS: %w", err)
	}

	if totalSKS+newSKS > maxSKS {
		return fmt.Errorf("batas SKS Anda adalah %d SKS. Anda tidak bisa mengambil mata kuliah ini", maxSKS)
	}

	// 6. Simpan ke database
	status := model.KRSStatusPending
	// Aturan: Mahasiswa Baru (Angkatan 2026) otomatis DISETUJUI
	if mhs.Angkatan == 2026 {
		status = model.KRSStatusDisetujui
	}

	newKRS := &model.KRS{
		MahasiswaID:      mhs.ID,
		KelasID:          uuid.MustParse(kelasID),
		SemesterAkademik: semesterAkademik,
		Status:           status,
	}

	return s.repo.AddKRS(ctx, newKRS)
}

func (s *Service) DropKelas(ctx context.Context, userID uuid.UUID, krsID string) error {
	mhs, err := s.mahasiswaRepo.GetByUserID(ctx, userID.String())
	if err != nil {
		return fmt.Errorf("failed to get student info: %w", err)
	}

	return s.repo.DeleteKRS(ctx, krsID, mhs.ID.String())
}
