import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
// เรียกทุกชั่วโมง: ส่ง LINE เตือนหัวหน้าช่างถ้ามีงานที่ไม่อัปเดตเกิน 1 ชม.
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new Response("unauthorized", { status: 401 });
  const cutoff = new Date(Date.now() - 3600000).toISOString();
  const { data } = await db.from("jobs").select("plate").neq("status", "done").lt("last_update", cutoff);
  if (data?.length && process.env.LINE_TOKEN && process.env.LINE_TO) {
    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.LINE_TOKEN}` },
      body: JSON.stringify({ to: process.env.LINE_TO, messages: [{ type: "text", text: "⏰ ถึงเวลาอัปเดตงานซ่อม: " + data.map((j) => j.plate).join(", ") }] }),
    });
  }
  return Response.json({ overdue: data?.length || 0 });
}
