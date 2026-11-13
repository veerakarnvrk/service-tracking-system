"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AutoRefresh({ sec = 60 }: { sec?: number }) {
  const r = useRouter();
  useEffect(() => { const t = setInterval(() => r.refresh(), sec * 1000); return () => clearInterval(t); }, [r, sec]);
  return null;
}
