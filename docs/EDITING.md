# แก้ข้อความ / หน้าตา ต้องแก้ไฟล์ไหน

| อยากแก้ | ไฟล์ |
|---|---|
| หน้าแรกของลูกค้า (หัวข้อ ช่องกรอก ปุ่ม) | `app/page.tsx` |
| หน้าผลสถานะที่ลูกค้าเห็น (รวมข้อความ "ไม่พบข้อมูล") | `app/track/page.tsx` |
| หน้า login พนักงาน | `components/LoginForm.tsx` |
| ข้อความ error ตอน login ("รหัสไม่ถูกต้อง" ฯลฯ) | `app/actions.ts` |
| หน้าแอดมิน (ฟอร์มรับรถ) | `app/staff/admin/page.tsx` |
| หน้ารายการงานของหัวหน้าช่าง | `app/staff/foreman/page.tsx` |
| ฟอร์มอัปเดตงานของหัวหน้าช่าง | `app/staff/foreman/[id]/UpdateForm.tsx` |
| หัวหน้าหน้ารายละเอียดงาน | `app/staff/foreman/[id]/page.tsx` |
| โลโก้ที่มุมบน | `components/Shell.tsx` |
| ชื่อแท็บในเบราว์เซอร์ | `app/layout.tsx` (บรรทัด `title`) |
| ชื่อ 5 ขั้นตอน และชื่อสถานะ | `lib/consts.ts` (`STEPS` และ `STL`) |
| ป้ายในรายละเอียดแต่ละขั้นตอน เช่น "ช่างผู้ซ่อม" "อัปเดตโดย" | `components/JobView.tsx` |
| สี ฟอนต์ ระยะห่าง animation | `app/globals.css` |

## อยู่ในฐานข้อมูล (แก้ที่ Supabase → Table Editor ไม่ใช่ในโค้ด)

| อยากแก้ | ตาราง |
|---|---|
| ชื่อพนักงาน / บทบาท | `staff` |
| รหัส PIN | `staff` (แก้ด้วย SQL: `update staff set pin_hash = crypt('รหัสใหม่', gen_salt('bf')) where name = '...';`) |
| รายชื่อช่าง | `mechanics` |

## ข้อควรระวัง

- ใน `lib/consts.ts` แก้ได้เฉพาะข้อความภาษาไทยหลังเครื่องหมาย `:` เช่น `repair: "กำลังซ่อม"` ห้ามแก้คำหน้า `:` อย่าง `repair` เพราะโค้ดและฐานข้อมูลใช้อ้างอิง
- ใน `.tsx` ให้แก้เฉพาะข้อความระหว่างแท็ก เช่น `<h1>ตรวจสอบสถานะรถ</h1>` อย่าลบ `< > { }`
- อยากเปลี่ยนคำทั้งโปรเจกต์ (เช่น "ทะเบียนรถ") กด `Ctrl+Shift+F` ค้นหาทุกไฟล์
- ดูผลก่อน deploy: `npm run dev` แล้วเปิด `localhost:3000`
- แก้เสร็จแล้ว deploy: `git add .` → `git commit -m "chore: update text"` → `git push` (Vercel deploy ให้เอง)
- ค่าใน `.env.local` และตัวแปรใน Vercel ไม่เกี่ยวกับ git แก้ใน Vercel แล้วต้อง Redeploy
