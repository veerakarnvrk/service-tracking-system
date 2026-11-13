"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { postUpdate, signUpload } from "@/app/actions";
import { STL } from "@/lib/consts";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function UpdateForm({ id, status, bay, mechs, preset }: { id: string; status: string; bay: number; mechs: string[]; preset: string[] }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(fd: FormData) {
    setBusy(true); setErr("");
    try {
      const media: { path: string; name: string; type: string }[] = [];
      for (const f of fd.getAll("files") as File[]) {
        if (!f.size) continue;
        const { path, token } = await signUpload(id, f.name);
        const { error } = await sb.storage.from("media").uploadToSignedUrl(path, token, f);
        if (error) throw error;
        media.push({ path, name: f.name, type: f.type.startsWith("video") ? "video" : "image" });
      }
      const e = await postUpdate(id, {
        status: String(fd.get("status")), bay: +(fd.get("bay") || 0), mechs: fd.getAll("mech").map(String),
        note: String(fd.get("note") || ""), damage: String(fd.get("damage") || ""), parts: String(fd.get("parts") || ""), media,
      });
      if (e) setErr(e); else { (document.getElementById("uf") as HTMLFormElement).reset(); router.refresh(); }
    } catch (x) { setErr(x instanceof Error ? x.message : "อัปโหลดไม่สำเร็จ"); }
    setBusy(false);
  }

  return (
    <form id="uf" action={submit} className="card">
      <h2>อัปเดตความคืบหน้า</h2>
      <label>สถานะ</label>
      <select name="status" defaultValue={status}>{Object.entries(STL).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
      <label>ช่องซ่อม</label>
      <select name="bay" defaultValue={bay}>{Array.from({ length: 11 }, (_, k) => <option key={k} value={k}>{k ? `ช่อง ${k}` : "ยังไม่เข้าช่อง"}</option>)}</select>
      <label>ช่างที่ทำในขั้นตอนนี้</label>
      <div className="chips">{mechs.map((m) => <label className="chip" key={m}><input type="checkbox" name="mech" value={m} defaultChecked={preset.includes(m)} /><span>{m}</span></label>)}</div>
      <label>รายละเอียด</label><textarea name="note" placeholder="ตอนนี้ทำอะไรอยู่ เจออะไรเพิ่ม" />
      <label>วิดีโอ / รูป</label><input name="files" type="file" accept="video/*,image/*" capture="environment" multiple />
      <label>เพิ่มสิ่งที่ตรวจพบ (บรรทัดละ 1 รายการ)</label><textarea name="damage" />
      <label>เพิ่มอะไหล่ที่ใช้ (บรรทัดละ 1 รายการ)</label><textarea name="parts" />
      <button className="big" disabled={busy}>{busy ? "กำลังส่ง..." : "ส่งอัปเดต"}</button>
      <div className="err">{err}</div>
    </form>
  );
}
