export const STEPS = ["รับรถแล้ว", "ตรวจเช็ก", "กำลังซ่อม", "ตรวจคุณภาพ", "เสร็จแล้ว"];
export const STL: Record<string, string> = { received: "รับรถแล้ว", inspect: "กำลังตรวจเช็ก", waitpart: "รออะไหล่", repair: "กำลังซ่อม", qc: "ตรวจคุณภาพ", done: "ซ่อมเสร็จ พร้อมรับรถ" };
export const STI: Record<string, number> = { received: 0, inspect: 1, waitpart: 1, repair: 2, qc: 3, done: 4 };
export type Job = { id: string; plate: string; visit_date: string; brand: string; cust_name: string; phone: string; work: string; min_price: number; max_price: number; eta: string; bay: number; status: string; damage: string[]; parts: string[]; last_update: string };
export type Media = { path: string; name: string; type: string; url?: string };
export type Upd = { id: string; status: string; by_name: string; mechs: string[]; note: string; media: Media[]; created_at: string };
const TZ = "Asia/Bangkok";
// ===== มาตรฐานวันที่/เวลาของทั้งโปรเจกต์ =====
// วันที่: วัน เดือน ปี พ.ศ. เช่น 14 พ.ย. 2569 | เวลา: 24 ชม. เช่น 16:03 (เขตเวลาไทย)
// ฟีเจอร์ใหม่ที่ต้องแสดงวันเวลา ให้ใช้ dateTh / timeTh / tm / dayTh เท่านั้น ห้ามจัดรูปแบบเอง
const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const parts = (t: string | number | Date) => {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(t));
  const v = (k: string) => p.find((x) => x.type === k)!.value;
  return { y: +v("year"), m: +v("month"), d: +v("day"), h: v("hour"), mi: v("minute") };
};
export const dateTh = (t: string | number | Date) => { const p = parts(t); return `${p.d} ${MONTHS[p.m - 1]} ${p.y + 543}`; };
export const timeTh = (t: string | number | Date) => { const p = parts(t); return `${p.h}:${p.mi}`; };
export const tm = (t: string | number | Date) => `${dateTh(t)} ${timeTh(t)}`;
export const dayTh = (ymd: string) => dateTh(`${ymd}T12:00:00+07:00`); // สำหรับวันที่ล้วน เช่น visit_date
export const dur = (ms: number) => { const m = Math.max(0, Math.round(ms / 60000)); return m < 60 ? `${m} นาที` : `${Math.floor(m / 60)} ชม.${m % 60 ? ` ${m % 60} นาที` : ""}`; };
export const baht = (n: number) => `${Number(n || 0).toLocaleString("th-TH")} บาท`;
export const norm = (s: string) => s.replace(/[\s\-.]/g, "").toLowerCase();
export const today = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });
export const overdue = (j: Job) => j.status !== "done" && Date.now() - new Date(j.last_update).getTime() > 3600000;
