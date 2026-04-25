package database

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

// RunMigrations membaca semua file .up.sql di folder migrations dan menjalankannya
func RunMigrations(db *pgxpool.Pool, logger *zap.Logger) error {
	ctx := context.Background()

	// 1. Buat tabel siakad_migrations jika belum ada untuk mencatat migrasi yang sudah jalan
	_, err := db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS siakad_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMPTZ DEFAULT NOW()
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create migration table: %w", err)
	}

	// 2. Baca daftar file di folder db/migrations
	entries, err := os.ReadDir("db/migrations")
	if err != nil {
		return fmt.Errorf("failed to read migrations folder: %w", err)
	}

	var upFiles []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".up.sql") {
			upFiles = append(upFiles, entry.Name())
		}
	}
	sort.Strings(upFiles)

	// 2.5 Cek kondisi transisi (Jika database sudah ada isinya tapi siakad_migrations kosong)
	var count int
	db.QueryRow(ctx, "SELECT COUNT(*) FROM siakad_migrations").Scan(&count)
	
	if count == 0 {
		var usersExists bool
		db.QueryRow(ctx, "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')").Scan(&usersExists)
		
		if usersExists {
			logger.Info("Existing database detected. Synchronizing migration state for initial tables.")
			// Anggap migrasi 1, 2, 3 sudah dijalankan sebelumnya
			for _, f := range upFiles {
				if strings.HasPrefix(f, "000001_") || strings.HasPrefix(f, "000002_") || strings.HasPrefix(f, "000003_") {
					db.Exec(ctx, "INSERT INTO siakad_migrations (version) VALUES ($1)", f)
				}
			}
		}
	}

	// 3. Jalankan migrasi satu per satu
	for _, fileName := range upFiles {
		// Cek apakah versi ini sudah pernah dijalankan
		var exists bool
		err := db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM siakad_migrations WHERE version = $1)", fileName).Scan(&exists)
		if err != nil {
			return err
		}

		if exists {
			continue // Skip jika sudah pernah jalan
		}

		logger.Info("Applying migration", zap.String("file", fileName))

		// Baca isi file SQL
		content, err := os.ReadFile(filepath.Join("db/migrations", fileName))
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", fileName, err)
		}

		// Jalankan SQL
		_, err = db.Exec(ctx, string(content))
		if err != nil {
			return fmt.Errorf("error in migration %s: %w", fileName, err)
		}

		// Catat ke tabel siakad_migrations
		_, err = db.Exec(ctx, "INSERT INTO siakad_migrations (version) VALUES ($1)", fileName)
		if err != nil {
			return err
		}

		logger.Info("Migration applied successfully", zap.String("file", fileName))
	}

	return nil
}
