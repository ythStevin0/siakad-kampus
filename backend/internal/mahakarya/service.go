package mahakarya

import (
	"context"
	"fmt"

	"siakad/backend/internal/model"
)

type Service struct {
	repo          *Repository
	mahasiswaRepo interface {
		GetByUserID(ctx context.Context, userID string) (*model.Mahasiswa, error)
	}
	dosenRepo interface {
		GetDosenByUserID(ctx context.Context, userID string) (*model.Dosen, error)
	}
}

func NewService(repo *Repository, mRepo interface {
	GetByUserID(ctx context.Context, userID string) (*model.Mahasiswa, error)
}, dRepo interface {
	GetDosenByUserID(ctx context.Context, userID string) (*model.Dosen, error)
}) *Service {
	return &Service{
		repo:          repo,
		mahasiswaRepo: mRepo,
		dosenRepo:     dRepo,
	}
}

// SubmitKarya memproses pendaftaran karya baru oleh mahasiswa
func (s *Service) SubmitKarya(ctx context.Context, userID string, req *model.MahakaryaSubmission) error {
	// 1. Ambil info mahasiswa (untuk dapat dosen_wali_id)
	m, err := s.mahasiswaRepo.GetByUserID(ctx, userID)
	if err != nil {
		return fmt.Errorf("gagal mendapatkan profil mahasiswa: %w", err)
	}

	if m.DosenWaliID == nil {
		return fmt.Errorf("Anda belum memiliki Dosen Wali. Silakan hubungi admin.")
	}

	// 2. Siapkan data
	req.MahasiswaID = m.ID
	req.DosenWaliID = *m.DosenWaliID

	// 3. Simpan
	return s.repo.Create(ctx, req)
}

// UpdateKarya memproses perbaikan karya yang direvisi oleh dosen
func (s *Service) UpdateKarya(ctx context.Context, userID string, submissionID string, title, category, description, portfolioURL string) error {
	m, err := s.mahasiswaRepo.GetByUserID(ctx, userID)
	if err != nil {
		return fmt.Errorf("gagal mendapatkan profil mahasiswa: %w", err)
	}
	return s.repo.Update(ctx, submissionID, m.ID.String(), title, category, description, portfolioURL)
}

// GetMySubmissions mengambil riwayat karya mahasiswa yang login
func (s *Service) GetMySubmissions(ctx context.Context, userID string) ([]model.MahakaryaSubmission, error) {
	m, err := s.mahasiswaRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetByMahasiswa(ctx, m.ID.String())
}

// GetSubmissionsToReview mengambil daftar karya yang perlu direview oleh dosen wali
func (s *Service) GetSubmissionsToReview(ctx context.Context, userID string) ([]model.MahakaryaSubmission, error) {
	d, err := s.dosenRepo.GetDosenByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetByDosenWali(ctx, d.ID.String())
}

// ReviewKarya (ACC/Reject) oleh dosen wali
func (s *Service) ReviewKarya(ctx context.Context, userID string, submissionID string, status string, reason string) error {
	d, err := s.dosenRepo.GetDosenByUserID(ctx, userID)
	if err != nil {
		return err
	}
	return s.repo.UpdateStatus(ctx, submissionID, d.ID.String(), status, reason)
}

// GetPublicGallery mengambil semua karya yang sudah disetujui
func (s *Service) GetPublicGallery(ctx context.Context) ([]model.MahakaryaSubmission, error) {
	return s.repo.GetAllApproved(ctx)
}
