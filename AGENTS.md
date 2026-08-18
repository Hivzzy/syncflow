# 🤖 SyncFlow — Agent Guidelines & Engineering Standards

Proyek ini adalah **Enterprise-Grade Real-Time Collaborative Project Management System** yang dibangun menggunakan arsitektur **Raw SQL (PostgreSQL)**, **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Zustand**.

---

## 🔒 Aturan Mutlak Arsitektur (Immutable Rules)

### 1. Raw SQL Only (DILARANG Menggunakan ORM)
* **Dilarang keras menginstal atau mengimpor ORM** (seperti Prisma, Drizzle, TypeORM, dsb).
* Semua komunikasi database wajib menggunakan driver `postgres` (`import { sql } from '@/lib/db'`).
* **Wajib selalu menggunakan Parameterized Query / Tagged Template Literals**:
  ```typescript
  // ✅ BENAR & AMAN:
  const tasks = await sql`SELECT * FROM tasks WHERE board_id = ${boardId}`;

  // ❌ DILARANG (Rentan SQL Injection):
  const tasks = await sql.unsafe(`SELECT * FROM tasks WHERE board_id = '${boardId}'`);
  ```
* Gunakan fungsi agregasi bawaan PostgreSQL seperti `json_agg()`, `json_build_object()`, dan `COALESCE()` untuk mengambil data hierarkis bersarang (Board -> Columns -> Tasks) dalam 1 query kencang.

### 2. Skema Database Terkunci (Database Schema is Frozen)
* Seluruh 17 tabel inti telah didefinisikan secara lengkap di `migrations/001_initial_schema.sql`.
* Dilarang menambah tabel baru secara sembarangan. Gunakan kolom `JSONB` yang sudah tersedia (`old_value`, `new_value`, dsb) jika membutuhkan fleksibilitas atribut dinamis.

### 3. State Management & Optimistic UI
* Gunakan **Zustand** (`src/stores/board-store.ts`) untuk mengelola state interaktif kanban di sisi klien.
* Semua aksi drag-and-drop harus menerapkan **Optimistic Update**:
  1. Perbarui state visual di layar secara instan.
  2. Kirim request HTTP PATCH ke backend di background.
  3. Jika backend mengembalikan error, lakukan *rollback* state ke posisi sebelum di-drag.

### 4. Fractional Indexing untuk Pengurutan
* Jangan pernah melakukan looping `UPDATE ... SET position = position + 1` pada banyak baris database.
* Urutan kartu dan kolom dihitung menggunakan angka pecahan (`DOUBLE PRECISION`):
  $$\text{newPosition} = \frac{\text{prevCard.position} + \text{nextCard.position}}{2}$$

---

## 📂 Konvensi Struktur Folder
```
syncflow/
├── migrations/         # Skrip DDL Raw SQL (001_initial_schema.sql)
├── scripts/            # Script migration & seed runner (migrate.js, seed.js)
├── src/
│   ├── app/            # Next.js 15 App Router pages & API route handlers
│   ├── components/     # Reusable UI & Kanban components
│   │   ├── kanban/     # Board, Column, Card, DragOverlay
│   │   ├── modals/     # Task detail drawer, New task modal
│   │   └── ui/         # Base design system components
│   ├── lib/            # db.ts (Postgres pool), utils.ts
│   ├── stores/         # Zustand client stores
│   └── types/          # database.ts (TypeScript interfaces)
├── AGENTS.md           # Aturan pengerjaan agen
├── DESIGN.md           # Dokumen arsitektur & data dictionary lengkap
└── README.md           # Dokumentasi & panduan lokal
```

