import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
export const metadata = { title: "ALL EV Service – ติดตามงานซ่อม" };
const init = `try{var t=localStorage.getItem("aes_theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script dangerouslySetInnerHTML={{ __html: init }} />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700&display=swap" />
      </head>
      <body><ThemeToggle />{children}</body>
    </html>
  );
}
