# ⚡ SyncFlow — Real-Time Collaborative Kanban & Workflow Platform

> A production-grade, Linear-inspired collaborative project management platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Pure Raw SQL (PostgreSQL)**.

---

## ✨ Fitur Unggulan
* 🎯 **Zero-ORM Raw SQL Architecture**: Menggunakan kueri SQL murni berkinerja tinggi dengan agregasi JSON (`json_agg`).
* 🖐️ **Fluid Drag-and-Drop**: Ditenagai oleh `@dnd-kit` dengan animasi yang responsif.
* ⚡ **Optimistic UI with Instant Rollback**: Perubahan posisi kartu instan di layar tanpa jeda loading.
* 🔢 **Fractional Indexing ($O(1)$ Reordering)**: Memindahkan kartu tanpa membebani database dengan update berantai.
* 🎨 **Linear-Inspired Aesthetic**: Tampilan Dark Mode modern yang minimalis dan elegan.
* 📊 **Audit Trail & Activity History**: Pencatatan riwayat perubahan otomatis ke tabel `activity_logs`.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 15 (App Router & Turbopack)
* **Language**: TypeScript
* **Database**: PostgreSQL 16
* **Database Driver**: `postgres.js` (Zero-overhead parameterized raw SQL)
* **State Management**: Zustand
* **Drag and Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
* **Styling**: Tailwind CSS + Lucide Icons

---

## 🚀 Quick Start (Panduan Menjalankan Lokal)

### 1. Salin Environment Variables
```bash
cp .env.example .env.local
```
*Pastikan `DATABASE_URL` di file `.env.local` sudah mengarah ke database PostgreSQL Anda.*

### 2. Jalankan Migrasi Database (17 Tabel)
```bash
npm run db:migrate
```

### 3. Masukkan Data Sampel (Seeding)
```bash
npm run db:seed
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di **`http://localhost:3000`**! 🎉

