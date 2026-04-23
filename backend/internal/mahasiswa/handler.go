package mahasiswa

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

func (h *Handler) GetAllMahasiswa(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.GetAll(r.Context())
	if err != nil {
		h.logger.Error("Failed to get mahasiswa list", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data mahasiswa", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Data mahasiswa berhasil diambil", list)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req struct {
		NIM          string  `json:"nim"`
		NamaLengkap  string  `json:"nama_lengkap"`
		ProgramStudi string  `json:"program_studi"`
		Angkatan     int     `json:"angkatan"`
		JalurMasuk   *string `json:"jalur_masuk"`
		Password     string  `json:"password"`
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

	m := model.Mahasiswa{
		NIM:          req.NIM,
		NamaLengkap:  req.NamaLengkap,
		ProgramStudi: req.ProgramStudi,
		Angkatan:     req.Angkatan,
		JalurMasuk:   req.JalurMasuk,
	}

	err := h.service.Create(r.Context(), &m, string(hashed))
	if err != nil {
		h.logger.Error("Failed to insert mahasiswa", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal menambahkan mahasiswa", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Mahasiswa berhasil didaftarkan", m)
}
