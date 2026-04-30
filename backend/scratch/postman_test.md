# API Test Guide (Postman)

Untuk mengetes fitur filter dosen berdasarkan departemen mahasiswa, ikuti langkah-langkah berikut:

## 1. Login sebagai Mahasiswa (DKV)
*   **Method**: `POST`
*   **URL**: `http://localhost:8080/api/auth/login`
*   **Body (JSON)**:
    ```json
    {
        "email": "cepi24@mahasiswa.uisi.ac.id",
        "password": "password123" 
    }
    ```
*   **Action**: Salin `access_token` dari response.

## 2. Get Dosen List (Filter DKV)
*   **Method**: `GET`
*   **URL**: `http://localhost:8080/api/users/dosen`
*   **Headers**:
    *   `Authorization`: `Bearer <TOKEN_ANDA>`
*   **Expected Result**: Response harus berisi daftar dosen dengan `departemen: "DKV"`.

## 3. Login sebagai Mahasiswa (Informatika)
*   **Method**: `POST`
*   **URL**: `http://localhost:8080/api/auth/login`
*   **Body (JSON)**:
    ```json
    {
        "email": "stevino.nugroho24@mahasiswa.uisi.ac.id",
        "password": "password123"
    }
    ```
*   **Action**: Salin `access_token` baru.

## 4. Get Dosen List (Filter Informatika)
*   **Method**: `GET`
*   **URL**: `http://localhost:8080/api/users/dosen`
*   **Headers**:
    *   `Authorization`: `Bearer <TOKEN_BARU>`
*   **Expected Result**: Response harus berisi daftar dosen dengan `departemen: "Informatika"`.

---
**Catatan**: Jika menggunakan Postman, pastikan Server Backend sudah direstart (`go run cmd/api/main.go`).
