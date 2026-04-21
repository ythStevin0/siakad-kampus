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

// validateNIDN memastikan NIDN terdiri dari 10 digit angka
func validateNIDN(nidn string) error {
	matched, _ := regexp.MatchString(`^\d{10}$`, nidn)
	if !matched {
		return fmt.Errorf("NIDN harus terdiri dari tepat 10 digit angka")
	}
	return nil
}

// validateKodeMK memastikan Kode Mata Kuliah berisi huruf dan angka (3-15 karakter)
func validateKodeMK(kode string) error {
	matched, _ := regexp.MatchString(`^[A-Z0-9-]{3,15}$`, kode)
	if !matched {
		return fmt.Errorf("Kode MK tidak valid (harus 3-15 karakter alfanumerik kapital)")
	}
	return nil
}

// CreateMahasiswa membungkus validasi dan pendaftaran mahasiswa
func (s *AcademicService) CreateMahasiswa(ctx context.Context, m *model.Mahasiswa, hashedPassword string) error {
	if err := validateNIM(m.NIM); err != nil {
		return err
	}
	return s.repo.CreateMahasiswaTx(ctx, m, hashedPassword)
}

// CreateDosen membungkus validasi dan pendaftaran dosen
func (s *AcademicService) CreateDosen(ctx context.Context, d *model.Dosen, hashedPassword string) error {
	if err := validateNIDN(d.NIDN); err != nil {
		return err
	}
	return s.repo.CreateDosenTx(ctx, d, hashedPassword)
}

// CreateMataKuliah membungkus validasi dan pendaftaran mata kuliah
func (s *AcademicService) CreateMataKuliah(ctx context.Context, mk *model.MataKuliah) error {
	if err := validateKodeMK(mk.KodeMK); err != nil {
		return err
	}
	if mk.NamaMK == "" {
		return fmt.Errorf("nama mata kuliah tidak boleh kosong")
	}
	if mk.SKS < 1 || mk.SKS > 6 {
		return fmt.Errorf("SKS harus berada di rentang 1-6")
	}
	return s.repo.CreateMataKuliah(ctx, mk)
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

func (s *AcademicService) GetAllMataKuliah(ctx context.Context) ([]model.MataKuliah, error) {
	return s.repo.GetAllMataKuliah(ctx)
}
