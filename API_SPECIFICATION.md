# 📡 SyncFlow — Complete REST API Specification

Dokumen ini berisi spesifikasi lengkap seluruh endpoint API, format payload JSON, status code, dan referensi kueri Raw SQL yang digunakan.

---

## 1. Master Board Endpoint

### `GET /api/boards/[id]`
Mengambil seluruh hierarki data papan (Board + Kolom + Tasks + Assignees + Labels) dalam **1 single query SQL**.

#### Request:
* Path Param: `id` (UUID)

#### SQL Implementation:
```sql
SELECT 
    b.id,
    b.workspace_id,
    b.name,
    b.identifier,
    b.description,
    b.icon,
    b.color,
    COALESCE(
        json_agg(
            json_build_object(
                'id', c.id,
                'name', c.name,
                'category', c.category,
                'position', c.position,
                'wip_limit', c.wip_limit,
                'color', c.color,
                'tasks', COALESCE(c_tasks.tasks_list, '[]'::json)
            ) ORDER BY c.position ASC
        ) FILTER (WHERE c.id IS NOT NULL), '[]'::json
    ) AS columns
FROM boards b
LEFT JOIN columns c ON c.board_id = b.id
LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object(
            'id', t.id,
            'task_number', t.task_number,
            'title', t.title,
            'description', t.description,
            'priority', t.priority,
            'estimate_points', t.estimate_points,
            'position', t.position,
            'due_date', t.due_date,
            'assignees', COALESCE(t_assignees.users_list, '[]'::json),
            'labels', COALESCE(t_labels.labels_list, '[]'::json)
        ) ORDER BY t.position ASC
    ) AS tasks_list
    FROM tasks t
    LEFT JOIN LATERAL (
        SELECT json_agg(json_build_object('id', u.id, 'full_name', u.full_name, 'avatar_url', u.avatar_url)) AS users_list
        FROM task_assignees ta
        JOIN users u ON u.id = ta.user_id
        WHERE ta.task_id = t.id
    ) t_assignees ON TRUE
    LEFT JOIN LATERAL (
        SELECT json_agg(json_build_object('id', l.id, 'name', l.name, 'color', l.color)) AS labels_list
        FROM task_labels tl
        JOIN labels l ON l.id = tl.label_id
        WHERE tl.task_id = t.id
    ) t_labels ON TRUE
    WHERE t.column_id = c.id AND t.deleted_at IS NULL
) c_tasks ON TRUE
WHERE b.id = $1
GROUP BY b.id;
```

#### Response (200 OK):
```json
{
  "id": "b1a2c3d4-...",
  "name": "Core Platform Sprint",
  "identifier": "ENG",
  "columns": [
    {
      "id": "c1...",
      "name": "To Do",
      "category": "unstarted",
      "position": 1000,
      "tasks": [
        {
          "id": "t1...",
          "task_number": 101,
          "title": "Design Kanban UI",
          "priority": 2,
          "position": 1000,
          "assignees": [{ "id": "u1...", "full_name": "Habbanma", "avatar_url": "..." }],
          "labels": [{ "id": "l1...", "name": "Feature", "color": "#3b82f6" }]
        }
      ]
    }
  ]
}
```

---

## 2. Tasks Endpoints

### `POST /api/tasks` (Buat Task Baru)
* **Payload**:
  ```json
  {
    "board_id": "b1...",
    "column_id": "c1...",
    "title": "Fix navbar mobile responsiveness",
    "description": "Ensure drawer closes on item click",
    "priority": 2,
    "estimate_points": 3
  }
  ```
* **SQL Logic**:
  ```sql
  -- 1. Get next task number
  SELECT COALESCE(MAX(task_number), 100) + 1 AS next_no FROM tasks WHERE board_id = $1;
  -- 2. Get next position
  SELECT COALESCE(MAX(position), 0) + 1000 AS next_pos FROM tasks WHERE column_id = $2;
  -- 3. Insert task
  INSERT INTO tasks (board_id, column_id, task_number, title, description, priority, estimate_points, position, created_by)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
  ```

---

### `PATCH /api/tasks/[id]/move` (Reorder / Pindah Kolom)
* **Payload**:
  ```json
  {
    "target_column_id": "c2...",
    "new_position": 2500.0
  }
  ```
* **SQL Logic**:
  ```sql
  UPDATE tasks 
  SET column_id = $1, position = $2, updated_at = NOW() 
  WHERE id = $3 
  RETURNING id, column_id, position;
  ```

---

### `PATCH /api/tasks/[id]` (Update Atribut Task)
* **Payload** (opsional):
  ```json
  {
    "title": "New Title",
    "description": "Updated Markdown Content",
    "priority": 1,
    "due_date": "2026-09-01T00:00:00Z"
  }
  ```

---

### `DELETE /api/tasks/[id]` (Soft Delete)
* **SQL Logic**:
  ```sql
  UPDATE tasks SET deleted_at = NOW() WHERE id = $1 RETURNING id;
  ```

---

## 3. Comments & Checklist Endpoints

### `GET /api/tasks/[id]/comments`
```sql
SELECT c.id, c.content, c.created_at, 
       json_build_object('id', u.id, 'full_name', u.full_name, 'avatar_url', u.avatar_url) AS user
FROM task_comments c
JOIN users u ON u.id = c.user_id
WHERE c.task_id = $1
ORDER BY c.created_at ASC;
```

### `POST /api/tasks/[id]/comments`
```sql
INSERT INTO task_comments (task_id, user_id, content) 
VALUES ($1, $2, $3) RETURNING *;
```

### `POST /api/tasks/[id]/checklists`
```sql
INSERT INTO task_checklists (task_id, title, position) 
VALUES ($1, $2, (SELECT COALESCE(MAX(position), 0) + 1000 FROM task_checklists WHERE task_id = $1))
RETURNING *;
```

### `PATCH /api/checklists/[id]` (Toggle Status)
```sql
UPDATE task_checklists SET is_completed = $1 WHERE id = $2 RETURNING *;
```

