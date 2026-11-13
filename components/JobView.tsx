import { STEPS, STL, STI, tm, dur, type Job, type Upd } from "@/lib/consts";

export function Steps({ status }: { status: string }) {
  const i = STI[status];
  return (
    <div className="steps">
      {STEPS.map((s, k) => (
        <div key={k} className={"st" + (k <= i ? " on" : "") + (k === i ? " cur" : "")} style={{ ["--i" as string]: k }}><i />{s}</div>
      ))}
    </div>
  );
}

// เวลาเริ่ม–จบ, ระยะเวลา, ช่างผู้ซ่อม, ผู้อัปเดต ของแต่ละขั้นตอน
export function StageRows({ job, ups }: { job: Job; ups: Upd[] }) {
  const cur = STI[job.status];
  return (
    <>
      {STEPS.map((name, k) => {
        const us = ups.filter((u) => STI[u.status] === k);
        if (!us.length) return null;
        const nx = ups.find((u) => STI[u.status] > k);
        const live = !nx && k === cur && job.status !== "done";
        const s = new Date(us[0].created_at).getTime();
        const e = nx ? new Date(nx.created_at).getTime() : live ? Date.now() : new Date(us[us.length - 1].created_at).getTime();
        const mechs = [...new Set(us.flatMap((u) => u.mechs))];
        const by = [...new Set(us.map((u) => u.by_name))];
        return (
          <div className="sl" key={k}>
            <div className="sn">{name}{live && <> <span className="badge">กำลังทำ</span></>}</div>
            <div className="mu"><b>เวลา</b> {tm(s)}{k < 4 && <> – {live ? "ตอนนี้" : tm(e)} · ใช้เวลา {dur(e - s)}</>}</div>
            {mechs.length > 0 && <div className="mu"><b>ช่างผู้ซ่อม</b> {mechs.join(", ")}</div>}
            <div className="mu"><b>{k === 0 ? "รับรถโดย" : "อัปเดตโดย"}</b> {by.join(", ")}</div>
          </div>
        );
      })}
    </>
  );
}

export function Timeline({ ups }: { ups: Upd[] }) {
  return (
    <>
      {[...ups].reverse().map((u) => (
        <div key={u.id}>
          <div className="t">{tm(u.created_at)} · {STL[u.status]}</div>
          {u.note}
          <div className="who">
            {u.mechs.length > 0 && <><b>ช่างผู้ซ่อม</b> {u.mechs.join(", ")} · </>}
            <b>{u.status === "received" ? "รับรถโดย" : "อัปเดตโดย"}</b> {u.by_name}
          </div>
          {u.media.map((m) => m.url && (m.type === "video"
            ? <video key={m.path} src={m.url} controls preload="metadata" style={{ width: "100%", borderRadius: 12, marginTop: 8 }} />
            : <img key={m.path} src={m.url} alt="" style={{ width: "100%", borderRadius: 12, marginTop: 8 }} />))}
        </div>
      ))}
    </>
  );
}
