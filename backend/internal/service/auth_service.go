package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"siakad/backend/internal/model"
	"siakad/backend/internal/repository"
)

// Durasi hidup masing-masing token
const (
	AccessTokenDuration  = 15 * time.Minute
	RefreshTokenDuration = 7 * 24 * time.Hour
)

// domainByRole mendefinisikan domain email
// yang diizinkan untuk setiap role
var domainByRole = map[model.UserRole]string{
	model.RoleMahasiswa: "@mahasiswa.uisi.ac.id",
	model.RoleDosen:     "@dosen.uisi.ac.id",
	model.RoleAdmin:     "@admin.uisi.ac.id",
}

// Claims adalah isi payload JWT kita
// Berisi informasi user yang disimpan di dalam token
type Claims struct {
	UserID string         `json:"user_id"`
	Email  string         `json:"email"`
	Role   model.UserRole `json:"role"`
	jwt.RegisteredClaims
}

// AuthService menangani semua logika bisnis autentikasi
type AuthService struct {
	repo      *repository.AuthRepository
	jwtSecret string
}

// NewAuthService membuat instance baru AuthService
func NewAuthService(repo *repository.AuthRepository, jwtSecret string) *AuthService {
	return &AuthService{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

// validateEmailDomain memastikan email yang digunakan
// sesuai dengan domain kampus dan role yang dipilih
func validateEmailDomain(email string, role model.UserRole) error {
	expectedDomain, ok := domainByRole[role]
	if !ok {
		return fmt.Errorf("role tidak valid")
	}

	if !strings.HasSuffix(email, expectedDomain) {
		return fmt.Errorf(
			"email untuk role %s harus menggunakan domain %s",
			role,
			expectedDomain,
		)
	}
	return nil
}

// LoginRequest adalah data yang dikirim client saat login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse adalah data yang dikembalikan setelah login berhasil
type LoginResponse struct {
	AccessToken string         `json:"access_token"`
	Role        model.UserRole `json:"role"`
	Email       string         `json:"email"`
}

// Login memvalidasi kredensial dan menghasilkan token
func (s *AuthService) Login(ctx context.Context, req LoginRequest) (*LoginResponse, string, error) {
	// 1. Validasi field tidak kosong
	if req.Email == "" || req.Password == "" {
		return nil, "", fmt.Errorf("email dan password tidak boleh kosong")
	}

	// 2. Cari user di database berdasarkan email
	user, err := s.repo.FindUserByEmail(ctx, req.Email)
	if err != nil {
		// Pesan error dibuat generik agar penyerang
		// tidak tahu apakah email terdaftar atau tidak
		return nil, "", fmt.Errorf("email atau password salah")
	}

	// 3. Validasi domain email sesuai role user
	if err := validateEmailDomain(user.Email, user.Role); err != nil {
		return nil, "", err
	}

	// 4. Bandingkan password dengan hash di database
	// bcrypt.CompareHashAndPassword aman dari timing attack
	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(req.Password),
	); err != nil {
		return nil, "", fmt.Errorf("email atau password salah")
	}

	// 5. Generate access token (berlaku 15 menit)
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return nil, "", fmt.Errorf("gagal membuat access token")
	}

	// 6. Generate refresh token (berlaku 7 hari)
	refreshToken, err := s.generateRefreshToken(ctx, user)
	if err != nil {
		return nil, "", fmt.Errorf("gagal membuat refresh token")
	}

	return &LoginResponse{
		AccessToken: accessToken,
		Role:        user.Role,
		Email:       user.Email,
	}, refreshToken, nil
}

// generateAccessToken membuat JWT access token
func (s *AuthService) generateAccessToken(user *model.User) (string, error) {
	claims := Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(AccessTokenDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "siakad-uisi",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

// generateRefreshToken membuat refresh token acak
// dan menyimpannya ke database
func (s *AuthService) generateRefreshToken(ctx context.Context, user *model.User) (string, error) {
	// Refresh token menggunakan JWT juga
	// tapi dengan expiry yang lebih panjang
	claims := jwt.RegisteredClaims{
		Subject:   user.ID,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(RefreshTokenDuration)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Issuer:    "siakad-uisi",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", err
	}

	// Simpan refresh token ke database
	rt := &model.RefreshToken{
		UserID:    user.ID,
		Token:     tokenString,
		ExpiresAt: time.Now().Add(RefreshTokenDuration),
	}

	if err := s.repo.SaveRefreshToken(ctx, rt); err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *AuthService) parseRefreshToken(refreshToken string) (*jwt.RegisteredClaims, error) {
	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(s.jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("refresh token tidak valid")
	}

	return claims, nil
}

// RefreshAccessToken menukar refresh token dengan access token baru
// sekaligus melakukan rotasi refresh token agar token lama tidak bisa dipakai lagi
func (s *AuthService) RefreshAccessToken(ctx context.Context, refreshToken string) (string, string, error) {
	// 1. Cari refresh token di database
	rt, err := s.repo.FindRefreshToken(ctx, refreshToken)
	if err != nil {
		return "", "", fmt.Errorf("refresh token tidak valid")
	}

	// 2. Validasi signature dan claims JWT refresh token
	claims, err := s.parseRefreshToken(refreshToken)
	if err != nil {
		return "", "", err
	}

	// 3. Cek apakah token sudah expired
	if time.Now().After(rt.ExpiresAt) {
		return "", "", fmt.Errorf("refresh token sudah expired")
	}

	if claims.Subject != rt.UserID {
		return "", "", fmt.Errorf("refresh token tidak cocok dengan user")
	}

	// 4. Ambil data user
	user, err := s.repo.FindUserByID(ctx, rt.UserID)
	if err != nil {
		return "", "", fmt.Errorf("user tidak ditemukan")
	}

	// 5. Revoke refresh token lama agar tidak bisa dipakai ulang
	if err := s.repo.RevokeRefreshToken(ctx, refreshToken); err != nil {
		return "", "", fmt.Errorf("gagal mencabut refresh token lama")
	}

	// 6. Generate pasangan token baru
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return "", "", fmt.Errorf("gagal membuat access token")
	}

	newRefreshToken, err := s.generateRefreshToken(ctx, user)
	if err != nil {
		return "", "", fmt.Errorf("gagal membuat refresh token baru")
	}

	return accessToken, newRefreshToken, nil
}

// Logout mencabut refresh token agar tidak bisa dipakai lagi
func (s *AuthService) Logout(ctx context.Context, refreshToken string) error {
	return s.repo.RevokeRefreshToken(ctx, refreshToken)
}
