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
)

func main() {
	// 1. Load file .env
	// godotenv membaca C:\siakad\backend\.env
	// dan menyuntikkan semua variabel ke environment
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// 2. Inisialisasi logger zap
	// zap.NewDevelopment() = format log yang mudah dibaca di terminal
	logger, err := zap.NewDevelopment()
	if err != nil {
		log.Fatal("Error initializing logger")
	}
	defer logger.Sync()

	// 3. Inisialisasi router chi
	r := chi.NewRouter()

	// Middleware bawaan chi:
	// - Logger   : mencatat setiap request masuk
	// - Recoverer: mencegah server crash jika ada panic
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// 4. Endpoint pertama: health check
	// Digunakan untuk memverifikasi server berjalan normal
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Health check called")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"status":"ok","message":"SIAKAD API is running"}`)
	})

	// 5. Jalankan server
	port := os.Getenv("APP_PORT")
	logger.Info("Server starting", zap.String("port", port))

	if err := http.ListenAndServe(":"+port, r); err != nil {
		logger.Fatal("Server failed to start", zap.Error(err))
	}
}