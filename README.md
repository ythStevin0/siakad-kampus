Set-Content C:\siakad\README.md @"
# SIAKAD Kampus

Sistem Informasi Akademik berbasis web untuk pengelolaan data akademik mahasiswa, dosen, dan administrasi kampus.

## Tech Stack

- **Frontend**: React Router v7, Tailwind CSS
- **Backend**: Go (chi, zap, pgx)
- **Database**: PostgreSQL
- **Deployment**: Vercel (frontend), Railway (backend + database)

## Struktur Proyek

\`\`\`
siakad/
├── frontend/    # React Router v7
├── backend/     # Go REST API
└── docs/        # Dokumentasi
\`\`\`

## Cara Menjalankan Lokal

### Prasyarat
- Go 1.21+
- Node.js 18+
- Docker Desktop

### Backend
\`\`\`bash
cd backend
cp .env.example .env
docker-compose up -d
go run cmd/api/main.go
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npx react-router typegen
npm run dev
\`\`\`

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/health | Cek status server dan database |
"@