"use server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { setSession, requireRole } from "@/lib/auth";
import { norm } from "@/lib/consts";

export async function login(_prev: string, fd: FormData): Promise<string> {
  const pin = String(fd.get("pin") || "");
  const { data } = await db.from("staff").select("*");
  const u = data?.find((s) => bcrypt.compareSync(pin, s.pin_hash));
  if (!u) return "รหัสไม่ถูกต้อง";
  await setSession({ id: u.id, name: u.name, role: u.role });
  redirect(u.role === "admin" ? "/staff/admin" : "/staff/foreman");
}
export async function logout() { cookies().delete("sess"); redirect("/"); }

// แอดมิน: รับรถ + ประเมินราคา เท่านั้น
export async function createJob(fd: FormData) {
  const me = await requireRole("admin");
  const g = (k: string) => String(fd.get(k) || "").trim();
  const { data: j, error } = await db.from("jobs").insert({
    plate: g("plate"), plate_norm: norm(g("plate")), visit_date: g("date"), brand: g("brand"), cust_name: g("cust"), phone: g("phone"),
    work: g("work"), min_price: +g("min") || 0, max_price: +g("max") || 0, eta: g("eta"),
  }).select("id").single();
  if (error) throw error;
  await db.from("job_updates").insert({ job_id: j.id, status: "received", by_name: me.name, note: "รับรถเข้าอู่แล้ว" });
  revalidatePath("/staff/admin");
}

// หัวหน้าช่าง: ขอ URL อัปโหลดไฟล์ (วิดีโอใหญ่ อัปตรงเข้า Storage ไม่ผ่านเซิร์ฟเวอร์)
export async function signUpload(jobId: string, fileName: string) {
  await requireRole("foreman");
  const path = `${jobId}/${Date.now()}-${fileName.replace(/[^\w.\-]/g, "_")}`;
  const { data, error } = await db.storage.from("media").createSignedUploadUrl(path);
  if (error) throw error;
  return { path, token: data.token };
}

// หัวหน้าช่าง: อัปเดตสถานะ / ช่องซ่อม / ช่างที่ทำ / อะไหล่
export async function postUpdate(id: string, p: { status: string; bay: number; mechs: string[]; note: string; damage: string; parts: string; media: unknown[] }) {
  const me = await requireRole("foreman");
  if (!p.mechs.length || !p.note.trim()) return "กรุณาเลือกช่างและพิมพ์รายละเอียด";
  const { data: j } = await db.from("jobs").select("damage,parts").eq("id", id).single();
  const ls = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
  await db.from("jobs").update({
    status: p.status, bay: p.status === "done" ? 0 : p.bay,
    damage: [...(j?.damage || []), ...ls(p.damage)], parts: [...(j?.parts || []), ...ls(p.parts)],
    last_update: new Date().toISOString(),
  }).eq("id", id);
  await db.from("job_updates").insert({ job_id: id, status: p.status, by_name: me.name, mechs: p.mechs, note: p.note.trim(), media: p.media });
  revalidatePath("/staff/foreman"); revalidatePath(`/staff/foreman/${id}`);
}
