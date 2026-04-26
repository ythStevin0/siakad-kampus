package pesan

import (
	"encoding/json"
	"net/http"

	"siakad/backend/internal/middleware"
	"siakad/backend/internal/model"
	"siakad/backend/pkg/response"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type Handler struct {
	service *Service
	logger  *zap.Logger
}

func NewHandler(service *Service, logger *zap.Logger) *Handler {
	return &Handler{service: service, logger: logger}
}

// Create: Untuk Mahasiswa/Dosen mengirim pesan ke Admin
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	// Ambil ID pengirim dari context JWT
	userIDStr, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || userIDStr == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "User ID not found in context")
		return
	}

	parsedID, err := uuid.Parse(userIDStr)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "Invalid User ID")
		return
	}

	var req struct {
		IsiPesan string `json:"isi_pesan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	p := model.Pesan{
		UserID:   parsedID,
		IsiPesan: req.IsiPesan,
	}

	if err := h.service.Create(r.Context(), &p); err != nil {
		h.logger.Error("Gagal mengirim pesan", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengirim pesan", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Pesan berhasil dikirim", p)
}

// GetAllForAdmin: Untuk Admin melihat semua pesan masuk
func (h *Handler) GetAllForAdmin(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.GetAllForAdmin(r.Context())
	if err != nil {
		h.logger.Error("Gagal mengambil data pesan", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data pesan", err.Error())
		return
	}

	if list == nil {
		list = []model.Pesan{}
	}

	response.Success(w, http.StatusOK, "Berhasil mengambil data pesan", list)
}

// MarkAsRead: Untuk Admin menandai pesan sudah dibaca
func (h *Handler) MarkAsRead(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.MarkAsRead(r.Context(), id); err != nil {
		h.logger.Error("Gagal update status pesan", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal update status pesan", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Pesan ditandai sudah dibaca", nil)
}
