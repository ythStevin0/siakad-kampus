// auth.ts
// Mengatur flow autentikasi di frontend

const TOKEN_KEY = "siakad_access_token";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  // Simpan di localStorage agar tetap ada setelah refresh halaman
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAccessToken = () => {
  // Kalau di memori ada, pakai itu (lebih cepat)
  // Kalau tidak (misal setelah refresh), ambil dari localStorage
  if (!accessToken) {
    accessToken = localStorage.getItem(TOKEN_KEY);
  }
  return accessToken;
};

// Response dari backend
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    email: string;
    role: string;
  };
  error?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Mengirim cookie juga untuk allowCredentials di backend jika diperlukan
      credentials: "omit", 
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.error || "Login gagal");
    }

    // Simpan access token di memori client
    setAccessToken(result.data.access_token);

    return result;
  } catch (err: any) {
    throw err;
  }
};

export const logout = async () => {
  try {
     await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "omit", // Cookie refresh_token dihapus di server
    });
    setAccessToken(null);
  } catch (err) {
    console.error("Logout gagal", err);
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const token = getAccessToken();
  if (!token) throw new Error("Tidak ada akses. Silakan login kembali.");

  const res = await fetch("http://localhost:8080/api/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Gagal mengubah password");
  }

  return result;
};

export const getPasswordHistory = async () => {
  const token = getAccessToken();
  if (!token) throw new Error("Tidak ada akses. Silakan login kembali.");

  const res = await fetch("http://localhost:8080/api/auth/password-history", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Gagal mengambil riwayat password");
  }

  return result.data as Array<{
    id: string;
    ip_address: string;
    info: string;
    created_at: string;
  }>;
};
