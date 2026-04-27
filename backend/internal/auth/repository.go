package auth

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"siakad/backend/internal/model"
)

// AuthRepository menangani semua operasi database yang berkaitan dengan autentikasi
type AuthRepository struct {
	db *pgxpool.Pool
}

// NewAuthRepository membuat instance baru AuthRepository
func NewAuthRepository(db *pgxpool.Pool) *AuthRepository {
	return &AuthRepository{db: db}
}

// FindUserByEmail mencari user berdasarkan email
func (r *AuthRepository) FindUserByEmail(ctx context.Context, email string) (*model.User, error) {
	user := &model.User{}
	query := `
		SELECT id, email, password, role, is_active, created_at, updated_at
		FROM users
		WHERE email = $1 AND is_active = true
	`
	err := r.db.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Role,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	return user, nil
}

// FindUserByID mencari user berdasarkan ID
func (r *AuthRepository) FindUserByID(ctx context.Context, id string) (*model.User, error) {
	user := &model.User{}
	query := `
		SELECT id, email, password, role, is_active, created_at, updated_at
		FROM users
		WHERE id = $1 AND is_active = true
	`
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Role,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	return user, nil
}

// SaveRefreshToken menyimpan refresh token baru ke database
func (r *AuthRepository) SaveRefreshToken(ctx context.Context, token *model.RefreshToken) error {
	query := `
		INSERT INTO refresh_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
	`
	_, err := r.db.Exec(ctx, query, token.UserID, token.Token, token.ExpiresAt)
	if err != nil {
		return fmt.Errorf("failed to save refresh token: %w", err)
	}
	return nil
}

// FindRefreshToken mencari refresh token yang valid
func (r *AuthRepository) FindRefreshToken(ctx context.Context, token string) (*model.RefreshToken, error) {
	rt := &model.RefreshToken{}
	query := `
		SELECT id, user_id, token, expires_at, is_revoked, created_at
		FROM refresh_tokens
		WHERE token = $1 AND is_revoked = false
	`
	err := r.db.QueryRow(ctx, query, token).Scan(
		&rt.ID,
		&rt.UserID,
		&rt.Token,
		&rt.ExpiresAt,
		&rt.IsRevoked,
		&rt.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("refresh token not found: %w", err)
	}
	return rt, nil
}

// RevokeRefreshToken mencabut refresh token saat logout
func (r *AuthRepository) RevokeRefreshToken(ctx context.Context, token string) error {
	query := `
		UPDATE refresh_tokens
		SET is_revoked = true
		WHERE token = $1
	`
	_, err := r.db.Exec(ctx, query, token)
	if err != nil {
		return fmt.Errorf("failed to revoke token: %w", err)
	}
	return nil
}

// UpdatePassword memperbarui password user
func (r *AuthRepository) UpdatePassword(ctx context.Context, userID string, newHashedPassword string) error {
	query := `
		UPDATE users
		SET password = $1, updated_at = NOW()
		WHERE id = $2
	`
	_, err := r.db.Exec(ctx, query, newHashedPassword, userID)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}
	return nil
}
