import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = () =>
  new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret");

const COOKIE_NAME = "slotbook-admin";

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(SECRET());

  return token;
}

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    await jwtVerify(token, SECRET());
    return true;
  } catch {
    return false;
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
