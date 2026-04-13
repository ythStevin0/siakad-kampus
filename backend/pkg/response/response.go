package response

import (
	"encoding/json"
	"net/http"
)

// Response adalah format standar semua API kita
// Konsisten di seluruh endpoint — frontend
// selalu tahu struktur yang diterima
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// JSON menulis response ke http.ResponseWriter
func JSON(w http.ResponseWriter, status int, success bool, message string, data interface{}, errMsg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(Response{
		Success: success,
		Message: message,
		Data:    data,
		Error:   errMsg,
	})
}

// Success shortcut untuk response berhasil
func Success(w http.ResponseWriter, status int, message string, data interface{}) {
	JSON(w, status, true, message, data, "")
}

// Error shortcut untuk response gagal
func Error(w http.ResponseWriter, status int, message string, err string) {
	JSON(w, status, false, message, nil, err)
}