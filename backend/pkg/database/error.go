package database

import (
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgconn"
)

// ParsePgError menerjemahkan kode error PostgreSQL menjadi pesan yang bermakna
func ParsePgError(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case "23505": // unique_violation
			if strings.Contains(pgErr.ConstraintName, "nim") {
				return fmt.Errorf("NIM sudah terdaftar di sistem")
			}
			if strings.Contains(pgErr.ConstraintName, "nidn") {
				return fmt.Errorf("NIDN sudah terdaftar di sistem")
			}
			if strings.Contains(pgErr.ConstraintName, "email") {
				return fmt.Errorf("Email sudah terdaftar di sistem")
			}
			return fmt.Errorf("Data sudah terdaftar di sistem")
		case "23503": // foreign_key_violation
			return fmt.Errorf("Data referensi tidak ditemukan")
		case "08006", "08001", "08004": // connection errors
			return fmt.Errorf("Koneksi database terputus, coba beberapa saat lagi")
		}
	}
	return err
}
