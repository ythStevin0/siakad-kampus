package inspect_db

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
		log.Fatal(err)
	}
	defer db.Close()

	fmt.Println("--- DATA USERS ---")
	rowsU, _ := db.Query(context.Background(), "SELECT id, email, role FROM users")
	for rowsU.Next() {
		var id, email, role string
		rowsU.Scan(&id, &email, &role)
		fmt.Printf("ID: %s, Email: %s, Role: %s\n", id, email, role)
	}

	fmt.Println("\n--- DATA MAHASISWA ---")
	rowsM, _ := db.Query(context.Background(), "SELECT user_id, nim, nama_lengkap, program_studi FROM mahasiswa")
	for rowsM.Next() {
		var uid, nim, nama, prodi string
		rowsM.Scan(&uid, &nim, &nama, &prodi)
		fmt.Printf("UID: %s, NIM: %s, Nama: %s, Prodi: %s\n", uid, nim, nama, prodi)
	}

	fmt.Println("\n--- DATA DOSEN ---")
	rowsD, _ := db.Query(context.Background(), "SELECT user_id, nama_lengkap, departemen FROM dosen")
	for rowsD.Next() {
		var uid, nama, dept string
		rowsD.Scan(&uid, &nama, &dept)
		fmt.Printf("UID: %s, Nama: %s, Dept: %s\n", uid, nama, dept)
	}
}
