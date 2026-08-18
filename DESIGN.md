# 🏛️ SyncFlow — System Design & Architecture Specification

SyncFlow adalah platform kolaborasi dan manajemen alur kerja tim (Kanban Board) real-time dengan fokus pada kecepatan performa, UI minimalis modern (*Linear Dark-Mode Aesthetic*), dan integritas data berbasis **Raw SQL PostgreSQL**.

---

## 📐 1. System Architecture Overview

```mermaid
graph TD
    subgraph Client Layer
        Browser[Client Browser - Next.js 15]
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

## 🗄️ 2. Complete 17-Table Data Dictionary (Database Schema)

| No | Nama Tabel | Deskripsi & Peran |
|:---|:---|:---|
| 1 | **`users`** | Data akun, email unik, full name, avatar, password hash. |
| 2 | **`user_preferences`** | Preferensi tema (dark/light), pengaturan suara, email notifikasi. |
| 3 | **`workspaces`** | Multi-tenancy entity (organisasi/perusahaan), slug unik. |
| 4 | **`workspace_members`** | Relasi user & workspace dengan hak akses RBAC (`owner`, `admin`, `member`, `guest`). |
| 5 | **`workspace_invites`** | Token undangan keanggotaan via email beserta masa kedaluwarsa. |
| 6 | **`boards`** | Proyek / Papan Kanban, prefix identifier tiket (contoh `ENG`, `DES`). |
| 7 | **`board_members`** | Hak akses spesifik untuk Private Board (`editor`, `viewer`). |
| 8 | **`columns`** | Status alur kerja (`backlog`, `unstarted`, `started`, `completed`, `canceled`), WIP limits. |
| 9 | **`tasks`** | Entitas tiket utama, nomor urut tiket, priority (0-4), story points, fractional position. |
| 10 | **`task_assignees`** | Relasi many-to-many untuk penugasan multi-user pada satu task. |
| 11 | **`task_checklists`** | Sub-item checklist di dalam task. |
| 12 | **`labels`** | Kategori/tag warna di tingkat workspace (Bug, Feature, Urgent). |
| 13 | **`task_labels`** | Junction table relasi many-to-many label pada task. |
| 14 | **`task_comments`** | Kolom komentar dan diskusi berulir (*threaded discussion*). |
| 15 | **`task_attachments`** | Metadata file/gambar yang diunggah ke task. |
| 16 | **`activity_logs`** | Audit trail otomatis mencatat `old_value` dan `new_value` (JSONB). |
| 17 | **`notifications`** | Notifikasi in-app untuk penugasan, mention, atau perubahan status. |

---

## ⚡ 3. Algoritma Pengurutan (Fractional Indexing)

Untuk mencapai latensi mutasi $O(1)$ di database saat memindahkan kartu:
1. Setiap kartu memiliki kolom `position` bertipe `DOUBLE PRECISION`.
2. Saat kartu diselipkan di antara dua kartu:
   $$\text{position} = \frac{\text{position}_{\text{atas}} + \text{position}_{\text{bawah}}}{2}$$
3. Saat kartu dipindahkan ke posisi paling atas:
   $$\text{position} = \frac{\text{position}_{\text{pertama}}}{2}$$
4. Saat kartu dipindahkan ke posisi paling bawah:
   $$\text{position} = \text{position}_{\text{terakhir}} + 1000$$

Tidak diperlukan operasi update berantai ke kartu-kartu lain.

