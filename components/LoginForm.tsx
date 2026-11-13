"use client";
import { useFormState } from "react-dom";
import { login } from "@/app/actions";
export default function LoginForm() {
  const [err, act] = useFormState(login, "");
  return (
    <form action={act} className="card">
      <h1>เข้าสู่ระบบพนักงาน</h1>
      <div className="mu">กรอกรหัสประจำตัว</div>
      <label>รหัส</label>
      <input name="pin" type="password" inputMode="numeric" required autoFocus />
      <button className="big">เข้าสู่ระบบ</button>
      <div className="err">{err}</div>
    </form>
  );
}
