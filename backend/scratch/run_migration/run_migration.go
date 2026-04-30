package run_migration

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: go run scratch/run_migration.go <path_to_sql>")
	}

	sqlFile := os.Args[1]
	sql, err := os.ReadFile(sqlFile)
	if err != nil {
		log.Fatalf("Gagal baca file SQL %s: %v", sqlFile, err)
	}

	dbURL := "postgres://postgres:password@localhost:5432/siakad_db?sslmode=disable"
	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatal("Gagal connect DB:", err)
	}
	defer db.Close()

	_, err = db.Exec(context.Background(), string(sql))
	if err != nil {
		log.Fatalf("Gagal menjalankan migration: %v", err)
	}

	fmt.Printf("✅ Migration berhasil dijalankan: %s\n", sqlFile)
}
