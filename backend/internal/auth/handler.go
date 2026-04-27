package auth

import (
	"encoding/json"
	"net/http"
	"os"

	"siakad/backend/pkg/response"
	"siakad/backend/internal/middleware"

	"go.uber.org/zap"
)

// AuthHandler menerima HTTP request yang berkaitan dengan autentikasi
type AuthHandler struct {
	service *AuthService
	logger  *zap.Logger
}

// NewAuthHandler membuat instance baru AuthHandler
func NewAuthHandler(service *AuthService, logger *zap.Logger) *AuthHandler {
	return &AuthHandler{
		service: service,
		logger:  logger,
	}
}

func buildRefreshTokenCookie(token string, maxAge int) *http.Cookie {
	return &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   os.Getenv("APP_ENV") == "production",
		Path:     "/api/auth",
		MaxAge:   maxAge,
	}
}

// Login menangani POST /api/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	result, refreshToken, err := h.service.Login(r.Context(), req)
	if err != nil {
		h.logger.Warn("Login failed", zap.String("email", req.Email), zap.Error(err))
		response.Error(w, http.StatusUnauthorized, "Login gagal", err.Error())
		return
	}

	http.SetCookie(w, buildRefreshTokenCookie(refreshToken, 7*24*60*60))

	h.logger.Info("Login success", zap.String("email", req.Email))
	response.Success(w, http.StatusOK, "Login berhasil", result)
}

// Refresh menangani POST /api/auth/refresh
func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "Refresh token tidak ditemukan", err.Error())
		return
	}

	accessToken, newRefreshToken, err := h.service.RefreshAccessToken(r.Context(), cookie.Value)
	if err != nil {
		h.logger.Warn("Refresh token failed", zap.Error(err))
		response.Error(w, http.StatusUnauthorized, "Refresh token tidak valid", err.Error())
		return
	}

	http.SetCookie(w, buildRefreshTokenCookie(newRefreshToken, 7*24*60*60))

	response.Success(w, http.StatusOK, "Token diperbarui", map[string]string{
		"access_token": accessToken,
	})
}

// Logout menangani POST /api/auth/logout
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Refresh token tidak ditemukan", err.Error())
		return
	}

	if err := h.service.Logout(r.Context(), cookie.Value); err != nil {
		h.logger.Error("Logout failed", zap.Error(err))
		response.Error(w, http.StatusInternalServerError, "Logout gagal", err.Error())
		return
	}

	http.SetCookie(w, buildRefreshTokenCookie("", -1))

	h.logger.Info("Logout success")
	response.Success(w, http.StatusOK, "Logout berhasil", nil)
}

// ChangePasswordRequest adalah payload untuk ganti password
type ChangePasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

// ChangePassword menangani POST /api/auth/change-password
func (h *AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	userCtx := middleware.GetUserFromContext(r.Context())
	if userCtx == nil {
		response.Error(w, http.StatusUnauthorized, "Unauthorized", "User not found in context")
		return
	}

	var req ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format request tidak valid", err.Error())
		return
	}

	if err := h.service.ChangePassword(r.Context(), userCtx.UserID, req.OldPassword, req.NewPassword); err != nil {
		h.logger.Warn("Failed to change password", zap.String("userID", userCtx.UserID), zap.Error(err))
		response.Error(w, http.StatusBadRequest, "Gagal mengganti password", err.Error())
		return
	}

	h.logger.Info("Password changed successfully", zap.String("userID", userCtx.UserID))
	response.Success(w, http.StatusOK, "Password berhasil diubah", nil)
}
