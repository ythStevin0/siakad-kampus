package handler

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	
	"siakad/backend/internal/model"
	"siakad/backend/internal/service"
	"siakad/backend/pkg/response"
)

// AcademicHandler menangani request HTTP untuk fitur-fitur akademik
type AcademicHandler struct {
	academicService *service.AcademicService
	logger          *zap.Logger
}

func NewAcademicHandler(academicService *service.AcademicService, logger *zap.Logger) *AcademicHandler {
	return &AcademicHandler{
		academicService: academicService,
		logger:          logger,
	}
}

// GetAdminStats — GET /api/admin/stats
func (h *AcademicHandler) GetAdminStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.academicService.GetStats(r.Context())
	if err != nil {
		h.logger.Error("Failed to get admin stats", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil statistik", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Stats berhasil diambil", stats)
}

// SearchUsers — GET /api/users/search?q=...
func (h *AcademicHandler) SearchUsers(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	if len(q) < 3 {
		response.Error(w, http.StatusBadRequest, "Kata kunci terlalu pendek", "Minimal 3 karakter")
		return
	}

	results, err := h.academicService.SearchUsers(r.Context(), q)
	if err != nil {
		h.logger.Error("Search failed", zap.Error(err), zap.String("query", q))
		response.Error(w, http.StatusInternalServerError, "Pencarian gagal", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Pencarian berhasil", results)
}

// GetAllDosen — GET /api/users/dosen
func (h *AcademicHandler) GetAllDosen(w http.ResponseWriter, r *http.Request) {
	list, err := h.academicService.GetAllDosen(r.Context())
	if err != nil {
		h.logger.Error("Failed to get dosen list", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data dosen", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Data dosen berhasil diambil", list)
}

// GetAllMahasiswa — GET /api/admin/mahasiswa
func (h *AcademicHandler) GetAllMahasiswa(w http.ResponseWriter, r *http.Request) {
	list, err := h.academicService.GetAllMahasiswa(r.Context())
	if err != nil {
		h.logger.Error("Failed to get mahasiswa list", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data mahasiswa", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Data mahasiswa berhasil diambil", list)
}

// CreateMahasiswa — POST /api/admin/mahasiswa
func (h *AcademicHandler) CreateMahasiswa(w http.ResponseWriter, r *http.Request) {
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

	// Validasi dasar
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

	// Panggil Service Layer (Validasi Regex NIM dilakukan di sana)
	err := h.academicService.CreateMahasiswa(r.Context(), &m, string(hashed))
	if err != nil {
		h.logger.Error("Failed to insert mahasiswa", zap.Error(err))
		// Pesan error dari service/repository sudah cantik (PgError parsing)
		response.Error(w, http.StatusInternalServerError, "Gagal menambahkan mahasiswa", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Mahasiswa berhasil didaftarkan", m)
}


// CreateDosen — POST /api/admin/dosen
func (h *AcademicHandler) CreateDosen(w http.ResponseWriter, r *http.Request) {
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

	err := h.academicService.CreateDosen(r.Context(), &d, string(hashed))
	if err != nil {
		h.logger.Error("Failed to create dosen", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mendaftarkan dosen", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Dosen berhasil didaftarkan", d)
}

// CreateMataKuliah — POST /api/admin/mata-kuliah
func (h *AcademicHandler) CreateMataKuliah(w http.ResponseWriter, r *http.Request) {
	var req struct {
		KodeMK   string `json:"kode_mk"`
		NamaMK   string `json:"nama_mk"`
		SKS      int    `json:"sks"`
		Semester int    `json:"semester"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	mk := model.MataKuliah{
		KodeMK:   req.KodeMK,
		NamaMK:   req.NamaMK,
		SKS:      req.SKS,
		Semester: req.Semester,
	}

	err := h.academicService.CreateMataKuliah(r.Context(), &mk)
	if err != nil {
		h.logger.Error("Failed to create mata kuliah", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal membuat mata kuliah", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Mata kuliah berhasil ditambahkan", mk)
}

// GetAllMataKuliah — GET /api/admin/mata-kuliah
func (h *AcademicHandler) GetAllMataKuliah(w http.ResponseWriter, r *http.Request) {
	list, err := h.academicService.GetAllMataKuliah(r.Context())
	if err != nil {
		h.logger.Error("Failed to get mata kuliah list", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data mata kuliah", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Data mata kuliah berhasil diambil", list)
}
