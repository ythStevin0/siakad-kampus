package service

import (
	"context"
	"fmt"
	"regexp"

	"siakad/backend/internal/model"
	"siakad/backend/internal/repository"
)

// AcademicService menangani logika bisnis akademik
type AcademicService struct {
	repo *repository.AcademicRepository
}

func NewAcademicService(repo *repository.AcademicRepository) *AcademicService {
	return &AcademicService{repo: repo}
}

// validateNIM memastikan NIM hanya terdiri dari angka dan panjangnya tepat 10 digit
func validateNIM(nim string) error {
	// Regex: ^ = awal, \d = digit, {10} = tepat 10, $ = akhir
	matched, _ := regexp.MatchString(`^\d{10}$`, nim)
	if !matched {
		return fmt.Errorf("NIM harus terdiri dari tepat 10 digit angka")
	}
	return nil
}

// CreateMahasiswa membungkus validasi dan pendaftaran mahasiswa
func (s *AcademicService) CreateMahasiswa(ctx context.Context, m *model.Mahasiswa, password string) error {
	// 1. Validasi format NIM — jangan percaya input
	if err := validateNIM(m.NIM); err != nil {
		return err
	}

	// 2. Panggil repository layer untuk transaksi database
	// Catatan: Hashing password dilakukan di handler atau service. 
	// Karena handler sudah melakukan hashing, kita teruskan saja hashed password di parameter.
	return s.repo.CreateMahasiswaTx(ctx, m, password)
}

// Teruskan fungsi-fungsi lain ke repository (Passthrough untuk saat ini)
func (s *AcademicService) GetStats(ctx context.Context) (map[string]int64, error) {
	return s.repo.GetStats(ctx)
}

func (s *AcademicService) SearchUsers(ctx context.Context, q string) ([]repository.SearchResult, error) {
	return s.repo.SearchUsers(ctx, q)
}

func (s *AcademicService) GetAllDosen(ctx context.Context) ([]model.Dosen, error) {
	return s.repo.GetAllDosen(ctx)
}

func (s *AcademicService) GetAllMahasiswa(ctx context.Context) ([]model.Mahasiswa, error) {
	return s.repo.GetAllMahasiswa(ctx)
}
