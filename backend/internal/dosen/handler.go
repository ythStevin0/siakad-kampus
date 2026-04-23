package dosen

import (
	"encoding/json"
	"net/http"

	"siakad/backend/internal/model"
	"siakad/backend/pkg/response"

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
