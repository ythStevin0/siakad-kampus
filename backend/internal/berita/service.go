package berita

import (
	"context"
	"fmt"
	"siakad/backend/internal/model"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll(ctx context.Context) ([]model.Berita, error) {
	return s.repo.GetAll(ctx)
}

func (s *Service) Create(ctx context.Context, b *model.Berita) error {
	if b.Judul == "" {
		return fmt.Errorf("judul berita tidak boleh kosong")
	}
	if b.Isi == "" {
		return fmt.Errorf("isi berita tidak boleh kosong")
	}
	return s.repo.Create(ctx, b)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
