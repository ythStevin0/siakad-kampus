package berita

import (
	"encoding/json"
	"net/http"
	"siakad/backend/internal/model"
	"siakad/backend/pkg/response"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

type Handler struct {
	service *Service
	logger  *zap.Logger
}

func NewHandler(service *Service, logger *zap.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.GetAll(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil berita", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Daftar berita", list)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var b model.Berita
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	// Ambil userID dari context jika ada (nanti bisa dari middleware auth)
	// Untuk sekarang opsional

	if err := h.service.Create(r.Context(), &b); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal memposting berita", err.Error())
		return
	}
	response.Success(w, http.StatusCreated, "Berita berhasil diposting", b)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.Delete(r.Context(), id); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menghapus berita", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Berita berhasil dihapus", nil)
}
