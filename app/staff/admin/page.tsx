import Shell from "@/components/Shell";
import { createJob } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { STL, overdue, today, type Job } from "@/lib/consts";
export const dynamic = "force-dynamic";

export default async function Admin() {
  const me = await requireRole("admin");
  const { data } = await db.from("jobs").select("*").order("created_at", { ascending: false }).limit(100);
  const jobs = (data || []) as Job[];
  const act = jobs.filter((j) => j.status !== "done");
  return (
    <Shell me={me} wide>
      <h1>รับรถ / ประสานงานลูกค้า</h1>
      <form action={createJob} className="card">
        <h2>รับรถใหม่</h2>
        <div className="row"><div><label>ทะเบียนรถ</label><input name="plate" required /></div><div><label>วันที่เข้าซ่อม</label><input name="date" type="date" defaultValue={today()} required /></div></div>
        <div className="row"><div><label>ยี่ห้อ / รุ่น</label><input name="brand" /></div><div><label>ชื่อลูกค้า</label><input name="cust" /></div><div><label>เบอร์โทร</label><input name="phone" /></div></div>
        <label>งานที่มาซ่อม / อาการ</label><textarea name="work" required />
        <div className="row"><div><label>ราคาประเมินต่ำสุด (บาท)</label><input name="min" type="number" /></div><div><label>ราคาประเมินสูงสุด (บาท)</label><input name="max" type="number" /></div></div>
        <label>คาดว่าเสร็จ</label><input name="eta" placeholder="เช่น พรุ่งนี้ 14:00 น." />
        <button className="big">บันทึกรับรถ</button>
      </form>
      <div className="card">
        <h2>ช่องซ่อม ({act.filter((j) => j.bay).length}/10)</h2>
        <div className="bays">{Array.from({ length: 10 }, (_, k) => { const j = act.find((x) => x.bay === k + 1); return <div key={k} className={"bay" + (j ? (overdue(j) ? " o" : " u") : "")}>ช่อง {k + 1}<br /><b>{j ? j.plate : "ว่าง"}</b></div>; })}</div>
      </div>
      <div className="card">
        <h2>รถทั้งหมด</h2>
        {jobs.map((j) => (
          <div className="job" key={j.id} style={{ cursor: "default" }}>
            <div><b>{j.plate}</b> <span className="mu">{j.brand}</span><div className="mu">{j.work}</div></div>
            <div style={{ textAlign: "right" }}><span className={"badge" + (j.status === "waitpart" ? " w" : "")}>{STL[j.status]}</span>{overdue(j) && <div className="err">ยังไม่อัปเดตเกิน 1 ชม.</div>}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
