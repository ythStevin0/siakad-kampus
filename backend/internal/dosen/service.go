package dosen

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

func validateNIDN(nidn string) error {
	matched, _ := regexp.MatchString(`^\d{10}$`, nidn)
	if !matched {
		return fmt.Errorf("NIDN harus terdiri dari tepat 10 digit angka")
	}
	return nil
}

func (s *Service) GetAll(ctx context.Context) ([]model.Dosen, error) {
	return s.repo.GetAll(ctx)
}

func (s *Service) Create(ctx context.Context, d *model.Dosen, hashedPassword string) error {
	if err := validateNIDN(d.NIDN); err != nil {
		return err
	}
	if d.NamaLengkap == "" {
		return fmt.Errorf("nama lengkap tidak boleh kosong")
	}
	if d.Departemen == "" {
		return fmt.Errorf("departemen tidak boleh kosong")
	}
	return s.repo.CreateTx(ctx, d, hashedPassword)
}
