package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"go.uber.org/zap"

	"siakad/backend/pkg/database"
)

func main() {
	// 1. Load .env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// 2. Inisialisasi logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		log.Fatal("Error initializing logger")
	}
	defer logger.Sync()

	// 3. Koneksi ke database
	db, err := database.NewPool(logger)
	if err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer db.Close()

	// 4. Inisialisasi router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// 5. Health check — sekarang juga cek koneksi database
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		// Ping database saat health check dipanggil
		if err := db.Ping(r.Context()); err != nil {
			logger.Error("Database ping failed", zap.Error(err))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusServiceUnavailable)
			fmt.Fprintln(w, `{"status":"error","message":"database unreachable"}`)
			return
		}

		logger.Info("Health check OK")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"status":"ok","message":"SIAKAD API is running","database":"connected"}`)
	})

	// 6. Jalankan server
	port := os.Getenv("APP_PORT")
	logger.Info("Server starting", zap.String("port", port))

	if err := http.ListenAndServe(":"+port, r); err != nil {
		logger.Fatal("Server failed to start", zap.Error(err))
	}
}