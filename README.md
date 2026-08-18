# ⚡ SyncFlow — Real-Time Collaborative Kanban & Workflow Platform

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-15.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Raw_SQL-Zero_ORM-005571?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-5.0-443e38?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Knowledge_Graph-Graphify-6366F1?style=for-the-badge" />
</p>

> **SyncFlow** adalah platform manajemen alur kerja tim (Kanban Board) real-time yang terinspirasi dari estetika **Linear**, dirancang dengan fokus pada **kecepatan performa ekstrem, optimasi kueri Raw SQL murni, dan pengalaman interaktif modern (Zero Perceived Latency)**.

---

## 📑 Daftar Isi & Dokumentasi Lengkap

Proyek ini dilengkapi dengan dokumentasi arsitektur mandiri (*self-contained*):

| Dokumen | Deskripsi & Isi |
| :--- | :--- |
| 🗺️ **[ROADMAP.md](./ROADMAP.md)** | **Panduan Eksekusi Fitur Mandiri (Phase 1 s/d Phase 8)** dengan checklist `[ ]`. |
| 📜 **[RULES.md](./RULES.md)** | **Aturan Baku Pengembangan**: Larangan ORM, aturan parameterized query SQL, dan pola Optimistic UI. |
| 📡 **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** | **Kontrak REST API & Template Kueri SQL Murni** lengkap dengan payload JSON dan kueri `json_agg`. |
| 🏛️ **[DESIGN.md](./DESIGN.md)** | **Arsitektur Sistem & Data Dictionary**: Diagram Mermaid dan relasi 17 tabel database. |
| 🤖 **[AGENTS.md](./AGENTS.md)** | Standar dan batasan teknis bagi developer dan agen AI. |
| 🌐 **[graphify-out/graph.html](./graphify-out/graph.html)** | Visualisasi interaktif Knowledge Graph seluruh basis kode. |

---

## ✨ Fitur & Keunggulan Teknis

### 1. 🗄️ Arsitektur Raw SQL Murni (Zero-ORM)
* **Bebas ORM Overhead**: Menggunakan driver `postgres.js` berkinerja tinggi dengan koneksi *pooling* otomatis.
* **17 Tabel Terkunci**: Skema database yang dinormalisasi penuh untuk multi-tenancy, RBAC, boards, kolom, tiket, checklist, komentar, audit logs, dan notifikasi.
* **Single-Query Hierarchical Fetch**: Mengambil seluruh struktur papan (*Board ➡️ Columns ➡️ Tasks ➡️ Assignees ➡️ Labels*) dalam **1 kali kueri SQL** menggunakan fungsi agregasi `json_agg()` dan `json_build_object()`.

### 2. 🖐️ Fluid Drag-and-Drop & Optimistic UI
* Ditenagai oleh **`@dnd-kit/core`** dan **`@dnd-kit/sortable`**.
* **Zero Perceived Latency**: Perubahan posisi kartu langsung dirender secara instan di layar lokal melalui **Zustand store** sebelum request API selesai.
* **Instant Rollback**: Jika terjadi gangguan jaringan atau kegagalan server, posisi kartu otomatis dikembalikan ke asal dengan notifikasi kesalahan yang ramah pengguna.

### 3. 🔢 Fractional Indexing ($O(1)$ Reordering)
* Menggunakan algoritma indeks pecahan (*Fractional Indexing*) bertipe `DOUBLE PRECISION`.
* Memindahkan satu kartu di antara ribuan kartu lain **hanya membutuhkan satu operasi `UPDATE`** pada kartu tersebut ($O(1)$ write), tanpa perlu meng-update baris kartu lain di database.

### 4. 🎨 Linear Dark-Mode Aesthetic
* Menggunakan palet warna *Deep Obsidian* (`#090d16`) dan *Slate* dengan aksen *Sky Blue* (`#38bdf8`).
* Komponen micro-interactions halus, keyboard shortcut support (`Cmd + K`), dan markdown rich text support.

---

## 📐 Arsitektur Sistem

```mermaid
graph TD
    subgraph Client Layer (Browser)
        Browser[Client UI - Next.js 15]
        ZustandStore[Zustand Board Store]
        DndKit[dnd-kit Drag Engine]
        Browser <--> ZustandStore
        ZustandStore <--> DndKit
    end

    subgraph API & Edge Layer
        RouteHandlers[Next.js App Route Handlers]
        ZodValidator[Zod Payload Validator]
        Browser -->|Optimistic HTTP PATCH/POST| RouteHandlers
        RouteHandlers --> ZodValidator
    end

    subgraph Database Layer (Raw SQL)
        PostgresPool[postgres.js Connection Pool]
        PG[(PostgreSQL 16 Enterprise DB)]
        ZodValidator --> PostgresPool
        PostgresPool <-->|Single-Query json_agg| PG
    end
```

---

## 🗄️ Ringkasan 17 Tabel Database

Seluruh skema telah didefinisikan secara komprehensif di [`migrations/001_initial_schema.sql`](./migrations/001_initial_schema.sql):

1. `users` — Data akun pengguna & avatar.
2. `user_preferences` — Pengaturan tema & preferensi notifikasi.
3. `workspaces` — Entitas organisasi/perusahaan (*multi-tenancy*).
4. `workspace_members` — Keanggotaan & hak akses RBAC (`owner`, `admin`, `member`, `guest`).
5. `workspace_invites` — Token undangan anggota via email.
6. `boards` — Papan proyek Kanban & identifier tiket (contoh: `ENG`, `DES`).
7. `board_members` — Hak akses spesifik untuk Private Board.
8. `columns` — Kolom status alur kerja & WIP limits.
9. `tasks` — Tiket tugas utama (priority, story points, due date, soft delete).
10. `task_assignees` — Penugasan multi-user per tiket.
11. `task_checklists` — Sub-item checklist di dalam tiket.
12. `labels` — Tag warna tingkat workspace (Bug, Feature, Urgent).
13. `task_labels` — Relasi many-to-many label pada tiket.
14. `task_comments` — Diskusi & komentar berulir (*threaded discussion*).
15. `task_attachments` — Metadata file lampiran.
16. `activity_logs` — Audit trail riwayat perubahan otomatis (`old_value` & `new_value` JSONB).
17. `notifications` — Notifikasi pengguna in-app.

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prasyarat:
* **Node.js**: versi 20+ atau 22+
* **PostgreSQL**: versi 14+ atau 16+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Hivzzy/syncflow.git
cd syncflow
npm install
```

### 2. Konfigurasi Database Environment
Salin template environment:
```bash
cp .env.example .env.local
```
Sesuaikan `DATABASE_URL` di file `.env.local`:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/syncflow
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Jalankan Migrasi & Seeding Data
Pastikan PostgreSQL berjalan dan database `syncflow` telah dibuat, lalu jalankan:
```bash
# Mengeksekusi DDL 17 tabel & indeks performa
npm run db:migrate

# Memasukkan data awal (User, Workspace, Board, Kolom, Sample Tasks)
npm run db:seed
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di **`http://localhost:3000`**! 🎉

---

## 📂 Struktur Direktori Proyek

```
syncflow/
├── migrations/         # Skrip DDL Raw SQL (001_initial_schema.sql)
├── scripts/            # Runner migrasi & seeding data (migrate.js, seed.js)
├── src/
│   ├── app/            # Next.js 15 App Router (Pages, Layouts, API Routes)
│   ├── components/     # Komponen UI & Kanban (Board, Column, Card, Modals)
│   ├── lib/            # db.ts (PostgreSQL connection pool) & utils
│   ├── stores/         # Zustand Store (board-store.ts untuk Optimistic UI)
│   └── types/          # database.ts (TypeScript interfaces lengkap)
├── graphify-out/       # Knowledge Graph & Laporan Analisis Kode
├── ROADMAP.md          # Panduan checklist pengerjaan mandiri
├── RULES.md            # Aturan baku arsitektur & coding
├── API_SPECIFICATION.md# Spesifikasi kontrak REST API & Kueri SQL
├── DESIGN.md           # Desain sistem & data dictionary
├── AGENTS.md           # Panduan otomatis agen AI
└── README.md           # Dokumentasi utama proyek
```

---

## 📜 Lisensi & Penulis

* **Author**: [Habbanma (Hivzzy)](https://github.com/Hivzzy)
* **License**: MIT License

