package dosenWali

import (
	"encoding/json"
	"errors"
	"net/http"

	"siakad/backend/internal/middleware"
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

// GetProfil — GET /api/dosen/profil
func (h *Handler) GetProfil(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}
	dosen, err := h.service.GetProfilDosen(r.Context(), userCtx.UserID)
	if err != nil {
		response.Error(w, http.StatusNotFound, "Profil dosen tidak ditemukan", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Profil dosen", dosen)
}

// GetDashboard — GET /api/dosen/dashboard
func (h *Handler) GetDashboard(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	summary, err := h.service.GetDashboardSummary(r.Context(), userCtx.UserID)
	if err != nil {
		h.logger.Error("Failed to get dashboard summary", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data dashboard", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Dashboard dosen wali", summary)
}

// GetMahasiswaAsuhan — GET /api/dosen/wali/mahasiswa
func (h *Handler) GetMahasiswaAsuhan(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	list, err := h.service.GetMahasiswaAsuhan(r.Context(), userCtx.UserID)
	if err != nil {
		h.logger.Error("Failed to get mahasiswa asuhan", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data mahasiswa asuhan", err.Error())
		return
	}
	if list == nil {
		list = []MahasiswaAsuhan{}
	}
	response.Success(w, http.StatusOK, "Daftar mahasiswa asuhan", list)
}

// GetKRSMahasiswa — GET /api/dosen/wali/mahasiswa/{mahasiswaId}/krs
func (h *Handler) GetKRSMahasiswa(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	mahasiswaID := chi.URLParam(r, "mahasiswaId")
	krs, err := h.service.GetKRSMahasiswa(r.Context(), userCtx.UserID, mahasiswaID)
	if err != nil {
		h.logger.Error("Failed to get KRS mahasiswa", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil KRS mahasiswa", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "KRS mahasiswa asuhan", krs)
}

// ApproveKRS — PUT /api/dosen/wali/krs/{id}/approve
func (h *Handler) ApproveKRS(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	krsID := chi.URLParam(r, "id")
	if err := h.service.ApproveKRS(r.Context(), userCtx.UserID, krsID); err != nil {
		h.logger.Error("Failed to approve KRS", zap.Error(err))
		response.Error(w, http.StatusBadRequest, "Gagal menyetujui KRS", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "KRS berhasil disetujui", nil)
}

// RejectKRS — PUT /api/dosen/wali/krs/{id}/reject
func (h *Handler) RejectKRS(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	krsID := chi.URLParam(r, "id")
	var req struct {
		Catatan string `json:"catatan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req.Catatan = "Ditolak oleh Dosen Wali"
	}

	if err := h.service.RejectKRS(r.Context(), userCtx.UserID, krsID, req.Catatan); err != nil {
		h.logger.Error("Failed to reject KRS", zap.Error(err))
		response.Error(w, http.StatusBadRequest, "Gagal menolak KRS", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "KRS berhasil ditolak", nil)
}

// ApproveAllKRS — PUT /api/dosen/wali/mahasiswa/{mahasiswaId}/krs/approve-all
func (h *Handler) ApproveAllKRS(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	mahasiswaID := chi.URLParam(r, "mahasiswaId")
	affected, err := h.service.ApproveAllKRS(r.Context(), userCtx.UserID, mahasiswaID)
	if err != nil {
		if errors.Is(err, ErrKRSEmpty) {
			response.Error(w, http.StatusBadRequest, "Tidak ada KRS pending", err.Error())
			return
		}
		h.logger.Error("Failed to approve all KRS", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal menyetujui semua KRS", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Semua KRS berhasil disetujui", map[string]int64{"approved": affected})
}
