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
	if d.NIDN == "" {
		return fmt.Errorf("NIDN tidak boleh kosong")
	}
	if d.NamaLengkap == "" {
		return fmt.Errorf("nama lengkap tidak boleh kosong")
	}
	if d.Departemen == "" {
		return fmt.Errorf("departemen tidak boleh kosong")
	}
	return s.repo.CreateTx(ctx, d, hashedPassword)
}

func (s *Service) Update(ctx context.Context, d *model.Dosen) error {
	if d.NamaLengkap == "" {
		return fmt.Errorf("nama tidak boleh kosong")
	}
	return s.repo.Update(ctx, d)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("ID tidak valid")
	}
	return s.repo.Delete(ctx, id)
}
