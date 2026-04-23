package mahasiswa

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

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req struct {
		NamaLengkap  string  `json:"nama_lengkap"`
		ProgramStudi string  `json:"program_studi"`
		Angkatan     int     `json:"angkatan"`
		JalurMasuk   *string `json:"jalur_masuk"`
		StatusUKT    bool    `json:"status_ukt"`
		StatusBIP    bool    `json:"status_bip"`
		IzinKRS      bool    `json:"izin_krs"`
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

	m := model.Mahasiswa{
		ID:           parsedID,
		NamaLengkap:  req.NamaLengkap,
		ProgramStudi: req.ProgramStudi,
		Angkatan:     req.Angkatan,
		JalurMasuk:   req.JalurMasuk,
		StatusUKT:    req.StatusUKT,
		StatusBIP:    req.StatusBIP,
		IzinKRS:      req.IzinKRS,
	}

	if err := h.service.Update(r.Context(), &m); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal memperbarui data", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Data mahasiswa diperbarui", m)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.Delete(r.Context(), id); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menghapus data", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Mahasiswa berhasil dihapus", nil)
}
