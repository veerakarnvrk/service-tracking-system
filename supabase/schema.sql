create extension if not exists pgcrypto;
create table staff(id uuid primary key default gen_random_uuid(), name text not null, role text not null check (role in ('admin','foreman')), pin_hash text not null);
create table mechanics(id uuid primary key default gen_random_uuid(), name text not null unique);
create table jobs(
  id uuid primary key default gen_random_uuid(),
  plate text not null, plate_norm text not null, visit_date date not null,
  brand text default '', cust_name text default '', phone text default '', work text not null,
  min_price int default 0, max_price int default 0, eta text default '',
  bay int default 0, status text default 'received',
  damage text[] default '{}', parts text[] default '{}',
  last_update timestamptz default now(), created_at timestamptz default now());
create index on jobs(plate_norm, visit_date);
create table job_updates(
  id uuid primary key default gen_random_uuid(), job_id uuid references jobs(id) on delete cascade,
  status text not null, by_name text not null, mechs text[] default '{}', note text default '',
  media jsonb default '[]', created_at timestamptz default now());
create index on job_updates(job_id, created_at);
-- เปิด RLS โดยไม่ใส่ policy = ห้าม anon เข้าถึงตรงๆ ทุกอย่างผ่านเซิร์ฟเวอร์ (service role) เท่านั้น
alter table staff enable row level security; alter table mechanics enable row level security;
alter table jobs enable row level security; alter table job_updates enable row level security;
insert into storage.buckets(id,name,public) values('media','media',false) on conflict do nothing;
-- ข้อมูลเริ่มต้น: เปลี่ยน PIN ก่อนใช้งานจริง
insert into staff(name,role,pin_hash) values
 ('แอดมิน นิ่ม','admin',crypt('1111',gen_salt('bf'))),
 ('แอดมิน บอล','admin',crypt('2222',gen_salt('bf'))),
 ('หัวหน้าช่าง สมชาย','foreman',crypt('9999',gen_salt('bf')));
insert into mechanics(name) values ('ช่างเอก'),('ช่างบี'),('ช่างชาติ'),('ช่างดำ'),('ช่างต้น');
