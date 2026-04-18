// auth.ts
// Mengatur flow autentikasi di frontend

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => {
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
