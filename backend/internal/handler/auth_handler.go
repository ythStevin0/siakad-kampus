package handler

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"
	"siakad/backend/internal/service"
	"siakad/backend/pkg/response"
)

// AuthHandler menerima HTTP request yang berkaitan
// dengan autentikasi dan meneruskannya ke AuthService
type AuthHandler struct {
	service *service.AuthService
	logger  *zap.Logger
}

// NewAuthHandler membuat instance baru AuthHandler
func NewAuthHandler(service *service.AuthService, logger *zap.Logger) *AuthHandler {
	return &AuthHandler{
		service: service,
		logger:  logger,
	}
}

// Login menangani POST /api/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	// 1. Decode request body ke struct LoginRequest
	var req service.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	// 2. Panggil service untuk proses login
	result, refreshToken, err := h.service.Login(r.Context(), req)
	if err != nil {
		h.logger.Warn("Login failed", zap.String("email", req.Email), zap.Error(err))
		response.Error(w, http.StatusUnauthorized, "Login gagal", err.Error())
		return
	}

	// 3. Simpan refresh token di httpOnly cookie
	// httpOnly = tidak bisa diakses JavaScript (aman dari XSS)
	// Secure = hanya dikirim lewat HTTPS di production
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Path:     "/api/auth/refresh",
		MaxAge:   7 * 24 * 60 * 60, // 7 hari dalam detik
	})

	h.logger.Info("Login success", zap.String("email", req.Email))
	response.Success(w, http.StatusOK, "Login berhasil", result)
}

// Refresh menangani POST /api/auth/refresh
// Menukar refresh token dengan access token baru
func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	// 1. Ambil refresh token dari cookie
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "Refresh token tidak ditemukan", err.Error())
		return
	}

	// 2. Panggil service untuk generate access token baru
	accessToken, err := h.service.RefreshAccessToken(r.Context(), cookie.Value)
	if err != nil {
		h.logger.Warn("Refresh token failed", zap.Error(err))
		response.Error(w, http.StatusUnauthorized, "Refresh token tidak valid", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Token diperbarui", map[string]string{
		"access_token": accessToken,
	})
}

// Logout menangani POST /api/auth/logout
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	// 1. Ambil refresh token dari cookie
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Refresh token tidak ditemukan", err.Error())
		return
	}

	// 2. Revoke refresh token di database
	if err := h.service.Logout(r.Context(), cookie.Value); err != nil {
		h.logger.Error("Logout failed", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Logout gagal", err.Error())
		return
	}

	// 3. Hapus cookie di browser
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		HttpOnly: true,
		Path:     "/api/auth/refresh",
		MaxAge:   -1, // MaxAge -1 = hapus cookie
	})

	h.logger.Info("Logout success")
	response.Success(w, http.StatusOK, "Logout berhasil", nil)
}