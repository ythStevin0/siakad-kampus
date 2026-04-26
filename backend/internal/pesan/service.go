package pesan

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

func (s *Service) Create(ctx context.Context, p *model.Pesan) error {
	if p.IsiPesan == "" {
		return fmt.Errorf("pesan tidak boleh kosong")
	}
	return s.repo.Create(ctx, p)
}

func (s *Service) GetAllForAdmin(ctx context.Context) ([]model.Pesan, error) {
	return s.repo.GetAllForAdmin(ctx)
}

func (s *Service) MarkAsRead(ctx context.Context, id string) error {
	return s.repo.MarkAsRead(ctx, id)
}
