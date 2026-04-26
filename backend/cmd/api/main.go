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

	"siakad/backend/internal/admin"
	"siakad/backend/internal/auth"
	"siakad/backend/internal/berita"
	"siakad/backend/internal/dosen"
	"siakad/backend/internal/mahasiswa"
	"siakad/backend/internal/mata_kuliah"
	"siakad/backend/internal/middleware"
	"siakad/backend/internal/model"
	"siakad/backend/internal/pesan"
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

	// 3.1 Jalankan Migrasi Otomatis
	if err := database.RunMigrations(db, logger); err != nil {
		logger.Fatal("Failed to run migrations", zap.Error(err))
	}

	// 4. Init semua domain (Domain-Driven)

	// Auth
	authRepo := auth.NewAuthRepository(db)
	authService := auth.NewAuthService(authRepo, os.Getenv("JWT_SECRET"))
	authHandler := auth.NewAuthHandler(authService, logger)

	// Admin (Stats, MK, Search)
	adminRepo := admin.NewRepository(db)
	adminService := admin.NewService(adminRepo)

	// Dosen
	dosenRepo := dosen.NewRepository(db)
	dosenService := dosen.NewService(dosenRepo)
	dosenHandler := dosen.NewHandler(dosenService, logger)

	// Mahasiswa
	mahasiswaRepo := mahasiswa.NewRepository(db)
	mahasiswaService := mahasiswa.NewService(mahasiswaRepo)
	mahasiswaHandler := mahasiswa.NewHandler(mahasiswaService, logger)

	// Mata Kuliah & Pesan
	mataKuliahRepo := mata_kuliah.NewRepository(db)
	mataKuliahService := mata_kuliah.NewService(mataKuliahRepo)

	pesanRepo := pesan.NewRepository(db)
	pesanService := pesan.NewService(pesanRepo)
	pesanHandler := pesan.NewHandler(pesanService, logger)

	// Admin Handler
	adminHandler := admin.NewHandler(adminService, mahasiswaService, dosenService, mataKuliahService, logger)

	beritaRepo := berita.NewRepository(db)
	beritaService := berita.NewService(beritaRepo)
	beritaHandler := berita.NewHandler(beritaService, logger)

	// 5. Init router
	r := chi.NewRouter()

	// 5.1 Set up CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)

	// 6. Health check
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(r.Context()); err != nil {
			response.Error(w, http.StatusServiceUnavailable, "Database unreachable", err.Error())
			return
		}
		response.Success(w, http.StatusOK, "SIAKAD API is running", map[string]string{
			"database": "connected",
		})
	})

	// 7. Route Auth
	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)
		r.Post("/logout", authHandler.Logout)
	})

	// 8. Route User (Search & Public Dosen List)
	r.Route("/api/users", func(r chi.Router) {
		r.Use(middleware.Authenticate(os.Getenv("JWT_SECRET"), logger))
		r.Get("/search", adminHandler.SearchUsers)
		r.Get("/dosen", dosenHandler.GetAllDosen)
	})

	// 9. Route Admin
	r.Route("/api/admin", func(r chi.Router) {
		r.Use(middleware.Authenticate(os.Getenv("JWT_SECRET"), logger))
		r.Use(middleware.RequireRole(model.RoleAdmin))

		r.Get("/stats", adminHandler.GetAdminStats)

		// Mahasiswa
		r.Get("/mahasiswa", mahasiswaHandler.GetAllMahasiswa)
		r.Post("/mahasiswa", mahasiswaHandler.Create)
		r.Put("/mahasiswa/{id}", mahasiswaHandler.Update)
		r.Delete("/mahasiswa/{id}", mahasiswaHandler.Delete)

		// Dosen
		r.Get("/dosen", dosenHandler.GetAllDosen)
		r.Post("/dosen", dosenHandler.Create)
		r.Put("/dosen/{id}", dosenHandler.Update)
		r.Delete("/dosen/{id}", dosenHandler.Delete)

		// Mata Kuliah
		r.Get("/mata-kuliah", adminHandler.GetAllMataKuliah)
		r.Post("/mata-kuliah", adminHandler.CreateMataKuliah)

		// Pesan Masuk (Kotak Masuk Admin)
		r.Get("/pesan", pesanHandler.GetAllForAdmin)
		r.Put("/pesan/{id}/read", pesanHandler.MarkAsRead)
	})

	// 9. Berita Routes (Public & Admin)
	r.Get("/api/berita", beritaHandler.GetAll)
	r.Group(func(r chi.Router) {
		r.Use(middleware.Authenticate(os.Getenv("JWT_SECRET"), logger))
		r.Post("/api/admin/berita", beritaHandler.Create)
		r.Delete("/api/admin/berita/{id}", beritaHandler.Delete)
		
		// Endpoint Pesan (Untuk Mahasiswa/Dosen/Admin ngirim pesan)
		r.Post("/api/pesan", pesanHandler.Create)
	})

	// 10. Start Server
	port := os.Getenv("APP_PORT")
	logger.Info("Server starting", zap.String("port", port))
	if err := http.ListenAndServe(":"+port, r); err != nil {
		logger.Fatal("Server failed to start", zap.Error(err))
	}
}
