import {
  createCookieSessionStorage,
  redirect,
  type Session,
} from "react-router";

type AuthSessionUser = {
  email: string;
  role: string;
};

type AuthSessionData = {
  accessToken?: string;
  user?: AuthSessionUser;
};

const sessionSecret =
  process.env.SESSION_SECRET ??
  process.env.JWT_SECRET ??
  "dev-only-session-secret-change-me";

const authSessionStorage = createCookieSessionStorage<AuthSessionData>({
  cookie: {
    name: "__siakad_auth",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.APP_ENV === "production",
  },
});

export async function getAuthSession(request: Request) {
  return authSessionStorage.getSession(request.headers.get("Cookie"));
}

export async function commitAuthSession(session: Session<AuthSessionData>) {
  return authSessionStorage.commitSession(session);
}

export async function destroyAuthSession(session: Session<AuthSessionData>) {
  return authSessionStorage.destroySession(session);
}

export function setAuthSessionData(
  session: Session<AuthSessionData>,
  accessToken: string,
  user: AuthSessionUser,
) {
  session.set("accessToken", accessToken);
  session.set("user", user);
}

export function clearAuthSessionData(session: Session<AuthSessionData>) {
  session.unset("accessToken");
  session.unset("user");
}

export function getAuthUser(session: Session<AuthSessionData>) {
  return session.get("user");
}

export function getAccessToken(session: Session<AuthSessionData>) {
  return session.get("accessToken");
}

export async function requireAuthSession(request: Request) {
  const session = await getAuthSession(request);
  const accessToken = getAccessToken(session);
  const user = getAuthUser(session);

  if (!accessToken || !user) {
    throw redirect("/login");
  }

  return { session, accessToken, user };
}
