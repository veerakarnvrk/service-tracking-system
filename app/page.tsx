import Shell from "@/components/Shell";
import { today } from "@/lib/consts";
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <Shell>
      <form action="/track" className="card">
        <h1>ตรวจสอบสถานะรถ</h1>
        <div className="mu">กรอกทะเบียนรถและวันที่นำรถเข้ารับบริการ</div>
        <label>ทะเบียนรถ</label>
        <input name="plate" required placeholder="เช่น 1กก 1234" autoComplete="off" />
        <label>วันที่นำรถเข้ารับบริการ</label>
        <input name="date" type="date" defaultValue={today()} required />
        <button className="big">ตรวจสอบ</button>
      </form>
      <div style={{ textAlign: "center" }}><a className="lk" href="/staff">สำหรับพนักงาน</a></div>
    </Shell>
  );
}
