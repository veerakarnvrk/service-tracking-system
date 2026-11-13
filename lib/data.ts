import { db } from "./db";
import type { Upd } from "./consts";
export async function loadUpdates(jobId: string): Promise<Upd[]> {
  const { data } = await db.from("job_updates").select("*").eq("job_id", jobId).order("created_at");
  const ups = (data || []) as Upd[];
  const paths = ups.flatMap((u) => u.media.map((m) => m.path));
  if (paths.length) {
    const { data: s } = await db.storage.from("media").createSignedUrls(paths, 3600);
    const map = new Map((s || []).map((x) => [x.path, x.signedUrl]));
    ups.forEach((u) => u.media.forEach((m) => { m.url = map.get(m.path) || undefined; }));
  }
  return ups;
}
