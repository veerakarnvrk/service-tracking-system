import Link from "next/link";
import Shell from "@/components/Shell";
import AutoRefresh from "@/components/AutoRefresh";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { STL, overdue, tm, type Job } from "@/lib/consts";
export const dynamic = "force-dynamic";

export default async function Foreman() {
  const me = await requireRole("foreman");
  const { data } = await db.from("jobs").select("*").neq("status", "done").order("last_update");
  const jobs = (data || []) as Job[];
  const od = jobs.filter(overdue);
  return (
    <Shell me={me}>
      <AutoRefresh />
      <h1>งานของฉัน</h1>
      {od.length > 0 && <div className="alert">⏰ ถึงเวลาอัปเดตแล้ว {od.length} คัน: {od.map((j) => j.plate).join(", ")}</div>}
      <div className="card">
        {jobs.map((j) => (
          <Link key={j.id} href={`/staff/foreman/${j.id}`} className="job">
            <div><b>{j.plate}</b> <span className="mu">ช่อง {j.bay || "-"}</span><div className="mu">{j.brand} · {j.work}</div></div>
            <div style={{ textAlign: "right" }}><span className={"badge" + (overdue(j) ? " e" : j.status === "waitpart" ? " w" : "")}>{overdue(j) ? "รออัปเดต" : STL[j.status]}</span><div className="mu">อัปเดตล่าสุด {tm(j.last_update)}</div></div>
          </Link>
        ))}
        {!jobs.length && <div className="mu">ไม่มีงานค้าง</div>}
      </div>
    </Shell>
  );
}
