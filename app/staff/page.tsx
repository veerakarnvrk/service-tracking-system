import { redirect } from "next/navigation";
import Shell from "@/components/Shell";
import LoginForm from "@/components/LoginForm";
import { getMe } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function Staff() {
  const me = await getMe();
  if (me) redirect(me.role === "admin" ? "/staff/admin" : "/staff/foreman");
  return <Shell><LoginForm /><div style={{ textAlign: "center" }}><a className="lk" href="/">กลับหน้าลูกค้า</a></div></Shell>;
}
