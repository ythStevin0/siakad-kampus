package mahasiswa

import (
	"context"
	"fmt"
	"regexp"

	"siakad/backend/internal/model"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func validateNIM(nim string) error {
	matched, _ := regexp.MatchString(`^\d{10}$`, nim)
	if !matched {
		return fmt.Errorf("NIM harus terdiri dari tepat 10 digit angka")
	}
	return nil
}

func (s *Service) GetAll(ctx context.Context) ([]model.Mahasiswa, error) {
	return s.repo.GetAll(ctx)
}

func (s *Service) Create(ctx context.Context, m *model.Mahasiswa, hashedPassword string) error {
	if err := validateNIM(m.NIM); err != nil {
		return err
	}
	if m.NamaLengkap == "" {
		return fmt.Errorf("nama lengkap tidak boleh kosong")
	}
	if m.Angkatan == 0 {
		return fmt.Errorf("angkatan tidak boleh kosong")
	}
	return s.repo.CreateTx(ctx, m, hashedPassword)
}
