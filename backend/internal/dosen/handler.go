package dosen

import (
	"encoding/json"
	"net/http"

	"siakad/backend/internal/model"
	"siakad/backend/pkg/response"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
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

// GetAllDosen — GET /api/users/dosen (atau sesuai routing baru)
func (h *Handler) GetAllDosen(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.GetAll(r.Context())
	if err != nil {
		h.logger.Error("Failed to get dosen list", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data dosen", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Data dosen berhasil diambil", list)
}

// Create — POST /api/admin/dosen
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req struct {
		NIDN          string  `json:"nidn"`
		NamaLengkap   string  `json:"nama_lengkap"`
		GelarDepan    *string `json:"gelar_depan"`
		GelarBelakang *string `json:"gelar_belakang"`
		Departemen    string  `json:"departemen"`
		Password      string  `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	if len(req.Password) < 6 {
		response.Error(w, http.StatusBadRequest, "Password terlalu pendek", "Minimal 6 karakter")
		return
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	d := model.Dosen{
		NIDN:          req.NIDN,
		NamaLengkap:   req.NamaLengkap,
		GelarDepan:    req.GelarDepan,
		GelarBelakang: req.GelarBelakang,
		Departemen:    req.Departemen,
	}

	err := h.service.Create(r.Context(), &d, string(hashed))
	if err != nil {
		h.logger.Error("Failed to create dosen", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mendaftarkan dosen", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Dosen berhasil didaftarkan", d)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req struct {
		NamaLengkap   string  `json:"nama_lengkap"`
		GelarDepan    *string `json:"gelar_depan"`
		GelarBelakang *string `json:"gelar_belakang"`
		Departemen    string  `json:"departemen"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	parsedID, err := uuid.Parse(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "ID tidak valid", err.Error())
		return
	}

	d := model.Dosen{
		ID:            parsedID,
		NamaLengkap:   req.NamaLengkap,
		GelarDepan:    req.GelarDepan,
		GelarBelakang: req.GelarBelakang,
		Departemen:    req.Departemen,
	}

	if err := h.service.Update(r.Context(), &d); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal memperbarui data", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Data dosen diperbarui", d)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.Delete(r.Context(), id); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menghapus data", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Dosen berhasil dihapus", nil)
}
