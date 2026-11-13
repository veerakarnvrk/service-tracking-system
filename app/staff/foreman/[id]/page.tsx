import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { StageRows, Timeline } from "@/components/JobView";
import UpdateForm from "./UpdateForm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { loadUpdates } from "@/lib/data";
import { overdue, type Job } from "@/lib/consts";
export const dynamic = "force-dynamic";

export default async function Detail({ params }: { params: { id: string } }) {
  const me = await requireRole("foreman");
  const { data } = await db.from("jobs").select("*").eq("id", params.id).maybeSingle();
  const j = data as Job | null;
  if (!j) notFound();
  const [ups, { data: ms }] = await Promise.all([loadUpdates(j.id), db.from("mechanics").select("name").order("name")]);
  return (
    <Shell me={me}>
      <div><Link className="lk" href="/staff/foreman">← กลับ</Link></div>
      <div className="card">
        <div className="plate">{j.plate}</div>
        <div className="mu">{j.brand} · {j.work}</div>
        {overdue(j) && <div className="err">เกิน 1 ชั่วโมงแล้วที่ยังไม่อัปเดต</div>}
      </div>
      <UpdateForm id={j.id} status={j.status} bay={j.bay} mechs={(ms || []).map((m) => m.name)} preset={ups.at(-1)?.mechs || []} />
      <div className="card"><h2>รายละเอียดแต่ละขั้นตอน</h2><StageRows job={j} ups={ups} /></div>
      <div className="card"><h2>ประวัติ</h2><div className="tl"><Timeline ups={ups} /></div></div>
    </Shell>
  );
}
