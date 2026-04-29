package akademik

import (
	"encoding/json"
	"net/http"
	"siakad/backend/internal/middleware"
	"siakad/backend/pkg/response"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GetAvailableKelas handles GET /api/akademik/kelas/tersedia
func (h *Handler) GetAvailableKelas(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	semester := r.URL.Query().Get("semester")
	if semester == "" {
		semester = "Ganjil 2024/2025" // Default
	}

	userID, _ := uuid.Parse(userCtx.UserID)
	list, err := h.service.GetAvailableKelas(r.Context(), userID, semester)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil daftar kelas", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Daftar kelas tersedia berhasil diambil", list)
}

// GetKRS handles GET /api/akademik/krs
func (h *Handler) GetKRS(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	semester := r.URL.Query().Get("semester")
	if semester == "" {
		semester = "Ganjil 2024/2025"
	}

	userID, _ := uuid.Parse(userCtx.UserID)
	list, err := h.service.GetKRS(r.Context(), userID, semester)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data KRS", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Data KRS berhasil diambil", list)
}

// EnrollKelas handles POST /api/akademik/krs/ambil
func (h *Handler) EnrollKelas(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	
	var req struct {
		KelasID  string `json:"kelas_id"`
		Semester string `json:"semester"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	if req.KelasID == "" || req.Semester == "" {
		response.Error(w, http.StatusBadRequest, "Data tidak lengkap", "kelas_id and semester are required")
		return
	}

	userID, _ := uuid.Parse(userCtx.UserID)
	err := h.service.EnrollKelas(r.Context(), userID, req.KelasID, req.Semester)
	if err != nil {
		if err == ErrPaidRequired || err == ErrScheduleConflict || err == ErrClassFull || err == ErrMaxSKS {
			response.Error(w, http.StatusForbidden, "Gagal mengambil mata kuliah", err.Error())
			return
		}
		response.Error(w, http.StatusInternalServerError, "Terjadi kesalahan server", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Mata kuliah berhasil ditambahkan ke KRS", nil)
}

// DropKelas handles DELETE /api/akademik/krs/batal/{id}
func (h *Handler) DropKelas(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	krsID := chi.URLParam(r, "id")

	if krsID == "" {
		response.Error(w, http.StatusBadRequest, "Data tidak lengkap", "KRS ID is required")
		return
	}

	userID, _ := uuid.Parse(userCtx.UserID)
	err := h.service.DropKelas(r.Context(), userID, krsID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal membatalkan mata kuliah", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Mata kuliah berhasil dibatalkan dari KRS", nil)
}
