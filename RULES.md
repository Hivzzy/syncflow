# 📜 SyncFlow — Development Guidelines & Strict Rules

Semua kode yang ditulis pada proyek SyncFlow **wajib mematuhi aturan baku berikut** demi menjaga performa maksimal, keamanan data, dan kebersihan basis kode.

---

## 🚫 1. Aturan Mutlak Database (Raw SQL Only)

1. **DILARANG MENGGUNAKAN ORM**:
   * Jangan menginstal atau mengimpor Prisma, Drizzle, TypeORM, Mongoose, dsb.
   * Semua kueri SQL wajib menggunakan driver `postgres.js`:
     ```typescript
     import { sql } from '@/lib/db';
     ```
2. **WAJIB PARAMETERIZED QUERY (Cegah SQL Injection)**:
   * Gunakan Tagged Template Literals bawaan driver:
     ```typescript
     // ✅ AMAN:
     const user = await sql`SELECT * FROM users WHERE email = ${email}`;

     // ❌ DILARANG KERAS (SQL Injection Risk):
     const user = await sql.unsafe(`SELECT * FROM users WHERE email = '${email}'`);
     ```
3. **TRANSAKSI UNTUK MULTI-STEP WRITE**:
   * Jika satu aksi mengubah lebih dari 1 tabel (misal: Insert Task + Insert Assignee + Insert Activity Log), wajib gunakan blok `sql.begin`:
     ```typescript
     await sql.begin(async (sql) => {
       const [task] = await sql`INSERT INTO tasks (...) VALUES (...) RETURNING id`;
       await sql`INSERT INTO task_assignees (task_id, user_id) VALUES (${task.id}, ${userId})`;
       await sql`INSERT INTO activity_logs (task_id, actor_id, action) VALUES (${task.id}, ${userId}, 'CREATED')`;
     });
     ```

---

## ⚡ 2. Aturan Frontend & State Management (Next.js 15 & Zustand)

1. **Next.js 15 App Router Best Practices**:
   * Halaman utama (`page.tsx`) dan layout adalah **Server Components** secara default.
   * Gunakan `'use client'` hanya pada komponen interaktif yang membutuhkan event handler, hooks, atau drag-and-drop (`Board.tsx`, `Card.tsx`, `Drawer.tsx`).
2. **Optimistic UI Pattern**:
   * Setiap aksi pengguna (drag kartu, ubah priority, toggle checklist) harus langsung merender perubahan di layar **seketika** melalui Zustand store.
   * Selalu simpan referensi state sebelumnya untuk melakukan *rollback* otomatis jika request API gagal.
3. **Fractional Indexing Math**:
   * Kolom `position` bertipe `DOUBLE PRECISION`.
   * Saat menyisipkan kartu di antara dua posisi $A$ dan $B$, hitung:
     $$\text{newPosition} = \frac{A + B}{2}$$
   * Jangan pernah meng-update baris kartu lain di database.

---

## 🎨 3. Aturan Desain & Styling (Linear Dark Aesthetic)

1. **Gunakan Tailwind CSS & Design Tokens**:
   * Background Utama: `#090d16` (Deep Obsidian / Dark Navy).
   * Background Card: `#0f172a` (Slate 900) dengan border `#1e293b` (Slate 800).
   * Warna Aksen Primer: `#38bdf8` (Sky Blue).
   * Status Colors:
     * Urgent: `#ef4444` (Rose / Red)
     * High: `#f97316` (Orange)
     * Medium: `#f59e0b` (Amber / Yellow)
     * Low: `#3b82f6` (Blue)
2. **Micro-Interactions**:
   * Gunakan transisi halus (`transition-all duration-150 ease-out`).
   * Berikan efek visual saat kartu di-hover (`hover:border-slate-700 hover:shadow-lg`).

---

## 🔒 4. Aturan Type Safety & Validasi

1. **Strict TypeScript**:
   * Hindari penggunaan `any`. Semua entitas database wajib merujuk ke interface di `@/types/database.ts`.
2. **Validasi Request Body**:
   * Semua API Route Handlers wajib memvalidasi data masuk menggunakan skema **Zod** sebelum dieksekusi ke database.

