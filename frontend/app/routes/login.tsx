import {
  data,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { LoginForm } from "../components/auth/login-form";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

type LoginApiResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    role: string;
    email: string;
  } | null;
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return data(
      {
        success: false,
        message: "Login gagal",
        error: "Email dan password wajib diisi.",
      },
      { status: 400 },
    );
  }

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result: LoginApiResponse = await backendResponse.json();
    const headers = new Headers();
    const setCookie = backendResponse.headers.get("set-cookie");

    if (setCookie) {
      headers.append("Set-Cookie", setCookie);
    }

    if (!backendResponse.ok || !result.success || !result.data) {
      return data(
        {
          success: false,
          message: result.message || "Login gagal",
          error: result.error || "Email atau password tidak valid.",
        },
        {
          status: backendResponse.status || 401,
          headers,
        },
      );
    }

    return data(
      {
        success: true,
        message: result.message,
        user: {
          email: result.data.email,
          role: result.data.role,
        },
        accessToken: result.data.access_token,
      },
      {
        status: backendResponse.status,
        headers,
      },
    );
  } catch (_error) {
    return data(
      {
        success: false,
        message: "Login gagal",
        error: "Backend tidak dapat dijangkau. Pastikan server Go sedang berjalan.",
      },
      { status: 502 },
    );
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return <LoginForm actionData={actionData} isSubmitting={isSubmitting} />;
}
