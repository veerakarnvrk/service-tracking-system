"use client";
import { useEffect, useState } from "react";
const P = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const };
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark((document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark"); }, []);
  const flip = () => {
    const n = dark ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem("aes_theme", n); } catch {}
    setDark(!dark);
  };
  return (
    <button id="tg" onClick={flip} aria-label="สลับโหมดมืด/สว่าง" title="สลับโหมดมืด/สว่าง">
      {dark
        ? <svg key="s" {...P}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        : <svg key="m" {...P} strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>}
    </button>
  );
}
