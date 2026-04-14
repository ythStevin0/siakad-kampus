package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"siakad/backend/internal/model"
	"siakad/backend/pkg/response"
)

// contextKey adalah tipe khusus untuk key di context
// Mencegah konflik dengan key dari package lain
type contextKey string

const UserContextKey contextKey = "user"

// UserContext adalah data user yang disimpan di context
// setelah token berhasil divalidasi
type UserContext struct {
	UserID string
	Email  string
	Role   model.UserRole
}

// Claims sama dengan yang ada di auth_service.go
type Claims struct {
	UserID string         `json:"user_id"`
	Email  string         `json:"email"`
	Role   model.UserRole `json:"role"`
	jwt.RegisteredClaims
}

// Authenticate memvalidasi JWT access token
// di setiap request ke route yang terproteksi
func Authenticate(jwtSecret string, logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 1. Ambil header Authorization
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.Error(w, http.StatusUnauthorized, "Token tidak ditemukan", "missing authorization header")
				return
			}

			// 2. Format harus "Bearer <token>"
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || parts[0] != "Bearer" {
				response.Error(w, http.StatusUnauthorized, "Format token tidak valid", "use Bearer token")
				return
			}

			tokenString := parts[1]

			// 3. Parse dan validasi token
			claims := &Claims{}
			token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
				// Pastikan algoritma signing adalah HS256
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				logger.Warn("Invalid token", zap.Error(err))
				response.Error(w, http.StatusUnauthorized, "Token tidak valid atau sudah expired", err.Error())
				return
			}

			// 4. Simpan data user ke context
			// Handler berikutnya bisa ambil data ini
			// menggunakan GetUserFromContext()
			userCtx := &UserContext{
				UserID: claims.UserID,
				Email:  claims.Email,
				Role:   claims.Role,
			}

			ctx := context.WithValue(r.Context(), UserContextKey, userCtx)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RequireRole memastikan hanya role tertentu
// yang boleh mengakses route
func RequireRole(roles ...model.UserRole) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := GetUserFromContext(r.Context())
			if user == nil {
				response.Error(w, http.StatusUnauthorized, "Unauthorized", "user not found in context")
				return
			}

			// Cek apakah role user ada di daftar role yang diizinkan
			for _, role := range roles {
				if user.Role == role {
					next.ServeHTTP(w, r)
					return
				}
			}

			response.Error(w, http.StatusForbidden, "Akses ditolak", "insufficient permissions")
		})
	}
}

// GetUserFromContext mengambil data user dari context
// Dipanggil di handler setelah melewati middleware Authenticate
func GetUserFromContext(ctx context.Context) *UserContext {
	user, ok := ctx.Value(UserContextKey).(*UserContext)
	if !ok {
		return nil
	}
	return user
}