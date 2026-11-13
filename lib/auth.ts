import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export type Me = { id: string; name: string; role: "admin" | "foreman" };
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET!);
export async function setSession(me: Me) {
  const t = await new SignJWT({ ...me }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("12h").sign(key());
  cookies().set("sess", t, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 43200 });
}
export async function getMe(): Promise<Me | null> {
  const t = cookies().get("sess")?.value; if (!t) return null;
  try { const { payload } = await jwtVerify(t, key()); return payload as unknown as Me; } catch { return null; }
}
export async function requireRole(role: Me["role"]) {
  const me = await getMe(); if (!me || me.role !== role) redirect("/staff"); return me;
}
