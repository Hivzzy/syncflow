export type UserRole = 'owner' | 'admin' | 'member' | 'guest';
export type ColumnCategory = 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled';
export type PriorityLevel = 0 | 1 | 2 | 3 | 4; // 0: None, 1: Urgent, 2: High, 3: Medium, 4: Low

export interface User {
  id: string;
  email: string;
  password_hash?: string | null;
  full_name: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  theme: 'dark' | 'light' | 'system';
  email_notifications: boolean;
  sound_effects: boolean;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Board {
  id: string;
  workspace_id: string;
  name: string;
  identifier: string;
  description?: string | null;
  icon: string;
  color: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BoardColumn {
  id: string;
  board_id: string;
  name: string;
  category: ColumnCategory;
  position: number;
  wip_limit: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  board_id: string;
  column_id: string;
  task_number: number;
  title: string;
  description?: string | null;
  priority: PriorityLevel;
  estimate_points?: number | null;
  position: number;
  parent_id?: string | null;
  due_date?: string | null;
  start_date?: string | null;
  created_by: string;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface TaskChecklist {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'id' | 'full_name' | 'avatar_url'>;
}

export interface ActivityLog {
  id: string;
  task_id: string;
  actor_id: string;
  action: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  created_at: string;
  actor?: Pick<User, 'id' | 'full_name' | 'avatar_url'>;
}

export interface AppNotification {
  id: string;
  user_id: string;
  actor_id: string;
  task_id?: string | null;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Aggregated full board view type for single-query fetch
export interface FullTask extends Task {
  assignees: Pick<User, 'id' | 'full_name' | 'avatar_url'>[];
  labels: Label[];
  checklist_count: { total: number; completed: number };
  comments_count: number;
}

export interface FullColumn extends BoardColumn {
  tasks: FullTask[];
}

export interface FullBoardData extends Board {
  columns: FullColumn[];
  labels: Label[];
  members: Pick<User, 'id' | 'full_name' | 'avatar_url' | 'email'>[];
}
