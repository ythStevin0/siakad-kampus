package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"go.uber.org/zap"

	"siakad/backend/internal/handler"
	"siakad/backend/internal/middleware"
	"siakad/backend/internal/model"
	"siakad/backend/internal/repository"
	"siakad/backend/internal/service"
	"siakad/backend/pkg/database"
	"siakad/backend/pkg/response"
)

func main() {
	// 1. Load .env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// 2. Init logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		log.Fatal("Error initializing logger")
	}
	defer logger.Sync()

	// 3. Koneksi database
	db, err := database.NewPool(logger)
	if err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer db.Close()

	// 4. Init semua layer (repository → service → handler)
	// Urutan ini penting — setiap layer butuh layer di bawahnya
	authRepo := repository.NewAuthRepository(db)
	authService := service.NewAuthService(authRepo, os.Getenv("JWT_SECRET"))
	authHandler := handler.NewAuthHandler(authService, logger)

	// Layer Akademik (Phase 6)
	academicRepo := repository.NewAcademicRepository(db)
	academicHandler := handler.NewAcademicHandler(academicRepo, logger)

	// 5. Init router
	r := chi.NewRouter()

	// 5.1 Set up CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Port URL development frontend
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)

	// 6. Health check — public, tidak butuh auth
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(r.Context()); err != nil {
			response.Error(w, http.StatusServiceUnavailable, "Database unreachable", err.Error())
			return
		}
		response.Success(w, http.StatusOK, "SIAKAD API is running", map[string]string{
			"database": "connected",
		})
	})

	// 7. Route auth — public, tidak butuh token
	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)
		r.Post("/logout", authHandler.Logout)
	})

	// 8. Route terproteksi untuk User (semua role bisa akses)
	r.Route("/api/users", func(r chi.Router) {
		r.Use(middleware.Authenticate(os.Getenv("JWT_SECRET"), logger))
		// Pencarian user (NIM/NIDN/Nama/Email) — semua role bisa
		r.Get("/search", academicHandler.SearchUsers)
		// Daftar dosen untuk ditampilkan di halaman Cari User
		r.Get("/dosen", academicHandler.GetAllDosen)
	})

	// 9. Route terproteksi khusus Admin
	r.Route("/api/admin", func(r chi.Router) {
		r.Use(middleware.Authenticate(os.Getenv("JWT_SECRET"), logger))
		r.Use(middleware.RequireRole(model.RoleAdmin))
		// Statistik untuk Dashboard Admin
		r.Get("/stats", academicHandler.GetAdminStats)
		// Kelola Mahasiswa
		r.Get("/mahasiswa", academicHandler.GetAllMahasiswa)
		r.Post("/mahasiswa", academicHandler.CreateMahasiswa)
		// Kelola Dosen
		r.Post("/dosen", academicHandler.CreateDosen)
	})

	// 9. Jalankan server
	port := os.Getenv("APP_PORT")
	logger.Info("Server starting", zap.String("port", port))

	if err := http.ListenAndServe(":"+port, r); err != nil {
		logger.Fatal("Server failed to start", zap.Error(err))
	}
}
