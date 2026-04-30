package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	dbURL := "postgres://postgres:password@localhost:5432/siakad_db?sslmode=disable"
	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatal("Gagal connect DB:", err)
	}
	defer db.Close()

	if err := db.Ping(context.Background()); err != nil {
		log.Fatal("DB tidak bisa dijangkau. Pastikan PostgreSQL sudah berjalan:", err)
	}

	fmt.Println("=== TABEL YANG ADA DI DATABASE siakad_db ===")
	rows, err := db.Query(context.Background(), `
		SELECT table_name 
		FROM information_schema.tables 
		WHERE table_schema = 'public' 
		ORDER BY table_name
	`)
	if err != nil {
		log.Fatal("Gagal query:", err)
	}
	defer rows.Close()

	for rows.Next() {
		var name string
		rows.Scan(&name)
		fmt.Println(" -", name)
	}
}
