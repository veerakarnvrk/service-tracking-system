import Shell from "@/components/Shell";
import { Steps, StageRows, Timeline } from "@/components/JobView";
import { db } from "@/lib/db";
import { loadUpdates } from "@/lib/data";
import { STL, baht, norm, type Job } from "@/lib/consts";
export const dynamic = "force-dynamic";

export default async function Track({ searchParams }: { searchParams: { plate?: string; date?: string } }) {
  const { data } = await db.from("jobs").select("*").eq("plate_norm", norm(searchParams.plate || "")).eq("visit_date", searchParams.date || "1970-01-01").order("created_at", { ascending: false }).limit(1).maybeSingle();
  const j = data as Job | null;
  if (!j) return (
    <Shell><div className="card"><h1>ไม่พบข้อมูล</h1><div className="mu">กรุณาตรวจสอบทะเบียนและวันที่อีกครั้ง หรือสอบถามที่หน้าร้าน</div><br /><a className="lk" href="/">← ลองใหม่</a></div></Shell>
  );
  const ups = await loadUpdates(j.id);
  const list = (a: string[], empty: string) => a.length ? <ul className="l">{a.map((x, i) => <li key={i}>{x}</li>)}</ul> : <div className="mu">{empty}</div>;
  return (
    <Shell>
      <div className="card res">
        <div className="plate">{j.plate}</div>
        <div className="mu">{j.brand} · เข้าซ่อม {j.visit_date}</div>
        <div style={{ margin: "10px 0" }}><span className={"badge" + (j.status === "waitpart" ? " w" : "")}>{STL[j.status]}</span></div>
        <Steps status={j.status} />
        <h3>รายละเอียดแต่ละขั้นตอน</h3><StageRows job={j} ups={ups} />
        <h3>งานที่มาซ่อม</h3><div>{j.work}</div>
        <h3>สิ่งที่ตรวจพบ</h3>{list(j.damage, "กำลังตรวจสอบ")}
        <h3>อะไหล่ที่ใช้</h3>{list(j.parts, "ยังไม่มี")}
        <h3>ราคาประเมินโดยประมาณ</h3>
        <div className="price">{baht(j.min_price)} – {baht(j.max_price)}</div>
        <div className="mu">ราคาจริงอาจเปลี่ยนตามผลตรวจ ช่างจะแจ้งก่อนซ่อมเพิ่มเสมอ</div>
        <h3>คาดว่าเสร็จ</h3><div>{j.eta}</div>
      </div>
      <div className="card res"><h2>ความคืบหน้า</h2><div className="tl"><Timeline ups={ups} /></div></div>
      <div style={{ textAlign: "center" }}><a className="lk" href="/">← ตรวจสอบรถคันอื่น</a></div>
    </Shell>
  );
}
