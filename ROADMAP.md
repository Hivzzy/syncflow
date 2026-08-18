# 🗺️ SyncFlow — Master Feature Implementation Checklist & Roadmap

Dokumen ini adalah **panduan eksekusi mandiri step-by-step** untuk membangun seluruh fitur SyncFlow dari awal hingga selesai tanpa membutuhkan bantuan eksternal. Ikuti urutan tahapan (*Phases*) secara bertahap.

---

## 🧭 Ringkasan Kemajuan (*Progress Overview*)

- [ ] **Phase 1**: Database & Backend Foundation (Raw SQL Queries & Migrations)
- [ ] **Phase 2**: Core API Endpoints (Single-Fetch Board & CRUD Operations)
- [ ] **Phase 3**: Global Navigation & Workspace Layout (Sidebar, Header, Breadcrumbs)
- [ ] **Phase 4**: Interactive Kanban Board (Drag-and-Drop + Zustand Optimistic UI)
- [ ] **Phase 5**: Rich Task Inspector / Drawer (Markdown, Priority, Assignee, Labels)
- [ ] **Phase 6**: Checklists, Subtasks & Activity Audit Trail
- [ ] **Phase 7**: Filter System, Search & Keyboard Shortcuts (`Cmd + K`)
- [ ] **Phase 8**: Real-Time Collaboration & Production Hardening

---

## 📌 Phase 1: Database & Backend Foundation

Tujuan: Memastikan database PostgreSQL terhubung dan data awal berhasil dimasukkan.

- [ ] **1.1. Setup Database Lokal**:
  - Buat database di PostgreSQL lokal: `CREATE DATABASE syncflow;`
  - Salin `.env.example` ke `.env.local` dan sesuaikan koneksi `DATABASE_URL`.
- [ ] **1.2. Jalankan Migrasi 17 Tabel**:
  - Jalankan `npm run db:migrate` untuk mengeksekusi `migrations/001_initial_schema.sql`.
  - Verifikasi tabel di database menggunakan `psql` atau DBeaver/TablePlus:
    `\dt` -> Harus menampilkan 17 tabel.
- [ ] **1.3. Jalankan Seeding Data**:
  - Jalankan `npm run db:seed`.
  - Verifikasi bahwa data user `Habbanma`, workspace `Acme Engineering`, board `ENG`, 5 kolom, dan 2 task awal sudah terisi.

---

## 📌 Phase 2: Core API Endpoints (Pure Raw SQL)

Tujuan: Membangun endpoint REST API yang aman dan cepat menggunakan driver `postgres.js`.

- [ ] **2.1. Endpoint Master Board Data (`GET /api/boards/[id]`)**:
  - File: `src/app/api/boards/[id]/route.ts`
  - Buat query SQL tunggal menggunakan `json_agg` dan `json_build_object` untuk mengambil:
    - Detail Board
    - Seluruh Kolom (diurutkan berdasarkan `position ASC`)
    - Seluruh Task dalam tiap kolom (diurutkan berdasarkan `position ASC`)
    - Assignees & Labels per task
- [ ] **2.2. Endpoint Task Creation (`POST /api/tasks`)**:
  - File: `src/app/api/tasks/route.ts`
  - Validasi payload menggunakan Zod (`title`, `column_id`, `board_id`, `priority`, `estimate_points`).
  - Ambil nomor urut task berikutnya: `SELECT COALESCE(MAX(task_number), 100) + 1 FROM tasks WHERE board_id = $1`.
  - Ambil posisi terakhir di kolom: `SELECT COALESCE(MAX(position), 0) + 1000 FROM tasks WHERE column_id = $1`.
  - Insert task baru dan catat ke `activity_logs` (`action = 'CREATED'`).
- [ ] **2.3. Endpoint Task Reorder & Move (`PATCH /api/tasks/[id]/move`)**:
  - File: `src/app/api/tasks/[id]/move/route.ts`
  - Menerima `targetColumnId`, `prevTaskPosition`, `nextTaskPosition`.
  - Hitung Fractional Index:
    - Jika diselipkan di antara 2 task: `(prev + next) / 2`
    - Jika di paling atas: `next / 2`
    - Jika di paling bawah: `prev + 1000`
  - Update `column_id` dan `position` task di database.
  - Catat log perubahan jika berpindah kolom (`action = 'MOVED_COLUMN'`).
- [ ] **2.4. Endpoint Task Update & Delete (`PATCH/DELETE /api/tasks/[id]`)**:
  - File: `src/app/api/tasks/[id]/route.ts`
  - Update: Title, Description, Priority, Due Date.
  - Delete: Lakukan Soft Delete (`UPDATE tasks SET deleted_at = NOW() WHERE id = $1`).

---

## 📌 Phase 3: Global Navigation & Layout (Linear Dark Aesthetic)

Tujuan: Membangun struktur layout aplikasi desktop yang modern, responsif, dan rapi.

- [ ] **3.1. Sidebar Component (`src/components/layout/Sidebar.tsx`)**:
  - Workspace Switcher dropdown di bagian atas.
  - Menu Navigasi:
    - 📋 Boards (Daftar boards aktif dengan badge identifier `ENG`, `DES`)
    - 📥 My Issues / Assigned to me
    - ⚙️ Workspace Settings
  - Tombol **+ New Board** dan tombol cipta task cepat.
- [ ] **3.2. Top Navigation Bar (`src/components/layout/Header.tsx`)**:
  - Breadcrumbs: `Workspace Name / Board Name`.
  - View Switcher Tabs: `[Board (Kanban)]` | `[List (Table)]`.
  - Member Avatars & Live Presence indicator.
  - Tombol Search (`Cmd + K`).
- [ ] **3.3. Main App Layout (`src/app/(dashboard)/layout.tsx`)**:
  - Bungkus halaman dengan Sidebar di kiri (lebar 240px) dan konten dinamis di kanan.

---

## 📌 Phase 4: Interactive Kanban Board (Drag & Drop + Zustand)

Tujuan: Membangun papan kanban interaktif dengan animasi halus dan *zero-latency perceived speed*.

- [ ] **4.1. Zustand Board Store (`src/stores/board-store.ts`)**:
  - State: `boardData`, `activeTask` (untuk drag overlay), `isLoading`, `error`.
  - Actions:
    - `setBoardData(data)`
    - `moveTaskOptimistic(taskId, sourceColId, targetColId, newIndex)`: Memindahkan posisi kartu di memori lokal secara instan sebelum request API selesai.
    - `rollbackBoard(previousState)`: Mengembalikan posisi jika request API gagal.
- [ ] **4.2. Kanban Components Hierarchy**:
  - `src/components/kanban/Board.tsx`: Komponen kontainer utama yang membungkus `DndContext`.
  - `src/components/kanban/Column.tsx`: Kolom status dengan badge jumlah kartu, tombol `+ Add Task`, dan `SortableContext`.
  - `src/components/kanban/Card.tsx`: Kartu tugas berisi:
    - Identifier Tiket (`ENG-101`)
    - Judul Task
    - Priority Icon (Urgent 🔥, High 🔴, Med 🟡, Low 🔵)
    - Labels / Tags (pill berwarna)
    - Avatar Assignee di pojok kanan bawah
    - Indikator checklist (`1/3`) & komentar (`2 💬`)
  - `src/components/kanban/DragOverlayCard.tsx`: Komponen visual kartu semi-transparan saat sedang diangkat/digeser kursor.
- [ ] **4.3. Integrasi `@dnd-kit` Handlers**:
  - Tangani event `onDragStart`, `onDragOver`, dan `onDragEnd`.
  - Panggil `moveTaskOptimistic` di `onDragEnd` lalu panggil API `PATCH /api/tasks/[id]/move`.

---

## 📌 Phase 5: Rich Task Inspector / Drawer

Tujuan: Memberikan panel detail kartu yang lengkap saat kartu diklik.

- [ ] **5.1. Task Detail Slide-Over (`src/components/modals/TaskDetailDrawer.tsx`)**:
  - Drawer yang muncul dari sisi kanan layar (atau dialog modal tengah).
- [ ] **5.2. Inline Editable Fields**:
  - Edit Judul Task langsung di tempat (*auto-save on blur*).
  - Markdown Description Editor dengan preview tab.
  - Priority Selector dropdown (None, Urgent, High, Medium, Low).
  - Assignee Multi-Picker dropdown.
  - Due Date & Start Date picker.
  - Story Points selector (1, 2, 3, 5, 8).
- [ ] **5.3. Label Manager Component**:
  - Tambah / hapus label pada kartu.
  - Dialog pembuatan label baru dengan pemilih warna (*color palette*).

---

## 📌 Phase 6: Subtasks, Checklists & Activity Audit Trail

Tujuan: Pelacakan granular pekerjaan dan transparansi riwayat perubahan.

- [ ] **6.1. Task Checklist / Subtasks Component**:
  - Tambah item checklist baru.
  - Checkbox selesai/belum dengan progress bar persentase penyelesaian (`33%`).
  - Hapus item checklist.
- [ ] **6.2. Task Comment Section**:
  - Form input komentar teks / markdown.
  - Daftar komentar terurut dengan avatar penulis dan waktu relatif (misal: *"2 hours ago"* via `date-fns`).
- [ ] **6.3. Activity Log Feed**:
  - Menampilkan timeline riwayat:
    - *"Habbanma created this task"*
    - *"Habbanma moved this task from To Do to In Progress"*
    - *"Habbanma changed priority from Medium to High"*

---

## 📌 Phase 7: Filter Bar, Search & Command Menu (`Cmd + K`)

Tujuan: Memudahkan navigasi dan pencarian tiket secara cepat bagi power user.

- [ ] **7.1. Global Filter Bar (`src/components/kanban/FilterBar.tsx`)**:
  - Filter berdasarkan Assignee (hanya kartu saya / rekan tertentu).
  - Filter berdasarkan Priority (hanya Urgent & High).
  - Filter berdasarkan Label (misal hanya label `Bug`).
  - Search input teks langsung memfilter kartu di papan secara instan (*client-side search*).
- [ ] **7.2. Command Menu (`Cmd + K`)**:
  - Shortcut keyboard global `Cmd + K` (atau `Ctrl + K`) untuk membuka palette pencarian.
  - Fitur:
    - Cari task berdasarkan ID (`ENG-101`) atau judul.
    - Quick Actions: Buat task baru, ganti tema, navigasi ke board lain.

---

## 📌 Phase 8: Hardening & Final Polish

- [ ] **8.1. Error Boundaries & Toast Notifications**:
  - Menampilkan notifikasi toast jika gagal menyimpan perubahan atau offline.
- [ ] **8.2. Empty States & Skeleton Loaders**:
  - Skeleton loading saat pertama kali memuat papan.
  - Empty state ilustrasi jika kolom belum memiliki kartu.
- [ ] **8.3. Export Features**:
  - Tombol export seluruh data board ke format **CSV** dan **JSON**.

