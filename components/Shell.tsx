import { logout } from "@/app/actions";
import type { Me } from "@/lib/auth";
export default function Shell({ children, me, wide }: { children: React.ReactNode; me?: Me | null; wide?: boolean }) {
  return (
    <div className={"wrap" + (wide ? " wide" : "")}>
      <header>
        <div className="logo">ALL <b>EV</b> SERVICE</div>
        {me && (
          <div className="row" style={{ flex: "none", alignItems: "center" }}>
            <span className="mu">{me.name}</span>
            <form action={logout}><button className="g sm">ออก</button></form>
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
