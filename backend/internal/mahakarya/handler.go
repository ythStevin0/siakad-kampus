package mahakarya

import (
	"encoding/json"
	"net/http"

	"siakad/backend/internal/middleware"
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
	return &Handler{service: service, logger: logger}
}

// Submit — POST /api/mahakarya/submit (Mahasiswa)
func (h *Handler) Submit(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	var req model.MahakaryaSubmission
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	if req.Title == "" || req.Category == "" {
		response.Error(w, http.StatusBadRequest, "Judul dan kategori wajib diisi", "")
		return
	}

	if err := h.service.SubmitKarya(r.Context(), userCtx.UserID, &req); err != nil {
		h.logger.Error("Failed to submit mahakarya", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengirim karya", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Karya berhasil dikirim ke Dosen Wali", req)
}

// GetMySubmissions — GET /api/mahakarya/my (Mahasiswa)
func (h *Handler) GetMySubmissions(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	list, err := h.service.GetMySubmissions(r.Context(), userCtx.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Berhasil", list)
}

// GetToReview — GET /api/dosen/wali/mahakarya (Dosen)
func (h *Handler) GetToReview(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	list, err := h.service.GetSubmissionsToReview(r.Context(), userCtx.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data review", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Berhasil", list)
}

// Review — PUT /api/dosen/wali/mahakarya/{id}/review (Dosen)
func (h *Handler) Review(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	userCtx := middleware.GetUserFromContext(r.Context())

	var req struct {
		Status string `json:"status"` // approved / rejected
		Reason string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid body", "")
		return
	}

	if err := h.service.ReviewKarya(r.Context(), userCtx.UserID, id, req.Status, req.Reason); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal memproses review", err.Error())
		return
	}

	msg := "Karya berhasil disetujui"
	if req.Status == "rejected" {
		msg = "Karya telah diminta revisi"
	}
	response.Success(w, http.StatusOK, msg, nil)
}

// GetGallery — GET /api/mahakarya/gallery (Public)
func (h *Handler) GetGallery(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.GetPublicGallery(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil galeri", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Berhasil", list)
}
