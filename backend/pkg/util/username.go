package util

import (
	"fmt"
	"strings"
)

// GenerateUsername menghasilkan username dengan format: nama.belakangYY
// Contoh: "Stevino Adi Nugroho", 2024 -> stevino.nugroho24
func GenerateUsername(fullName string, year int) string {
	parts := strings.Fields(strings.ToLower(fullName))
	if len(parts) == 0 {
		return "user"
	}

	var username string
	if len(parts) == 1 {
		username = parts[0]
	} else {
		// Ambil kata pertama dan kata terakhir
		username = fmt.Sprintf("%s.%s", parts[0], parts[len(parts)-1])
	}

	// Ambil 2 digit terakhir tahun
	yearSuffix := year % 100
	return fmt.Sprintf("%s%02d", username, yearSuffix)
}
