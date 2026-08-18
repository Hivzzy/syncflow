import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { FullBoardData } from '@/types/database';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/boards/[id]
 * Single-query JSON aggregation returning Board, Columns, Tasks, Assignees, and Labels.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: boardId } = await context.params;

    if (!boardId) {
      return apiError('Board ID is required', 400);
    }

    const [board] = await sql<FullBoardData[]>`
      SELECT 
        b.id,
        b.workspace_id,
        b.name,
        b.identifier,
        b.description,
        b.icon,
        b.color,
        b.is_private,
        b.created_by,
        b.created_at,
        b.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'board_id', c.board_id,
              'name', c.name,
              'category', c.category,
              'position', c.position,
              'wip_limit', c.wip_limit,
              'color', c.color,
              'created_at', c.created_at,
              'updated_at', c.updated_at,
              'tasks', COALESCE(c_tasks.tasks_list, '[]'::json)
            ) ORDER BY c.position ASC
          ) FILTER (WHERE c.id IS NOT NULL), '[]'::json
        ) AS columns,
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', l.id, 'workspace_id', l.workspace_id, 'name', l.name, 'color', l.color, 'created_at', l.created_at))
            FROM labels l
            WHERE l.workspace_id = b.workspace_id
          ), '[]'::json
        ) AS labels,
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', u.id, 'full_name', u.full_name, 'avatar_url', u.avatar_url, 'email', u.email))
            FROM workspace_members wm
            JOIN users u ON u.id = wm.user_id
            WHERE wm.workspace_id = b.workspace_id
          ), '[]'::json
        ) AS members
      FROM boards b
      LEFT JOIN columns c ON c.board_id = b.id
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', t.id,
            'board_id', t.board_id,
            'column_id', t.column_id,
            'task_number', t.task_number,
            'title', t.title,
            'description', t.description,
            'priority', t.priority,
            'estimate_points', t.estimate_points,
            'position', t.position,
            'parent_id', t.parent_id,
            'due_date', t.due_date,
            'start_date', t.start_date,
            'created_by', t.created_by,
            'created_at', t.created_at,
            'updated_at', t.updated_at,
            'assignees', COALESCE(t_assignees.users_list, '[]'::json),
            'labels', COALESCE(t_labels.labels_list, '[]'::json),
            'checklist_count', json_build_object(
              'total', COALESCE(t_check.total, 0),
              'completed', COALESCE(t_check.completed, 0)
            ),
            'comments_count', COALESCE(t_comm.comments_total, 0)
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
          SELECT json_agg(json_build_object('id', l.id, 'workspace_id', l.workspace_id, 'name', l.name, 'color', l.color, 'created_at', l.created_at)) AS labels_list
          FROM task_labels tl
          JOIN labels l ON l.id = tl.label_id
          WHERE tl.task_id = t.id
        ) t_labels ON TRUE
        LEFT JOIN LATERAL (
          SELECT 
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE is_completed = true) AS completed
          FROM task_checklists
          WHERE task_id = t.id
        ) t_check ON TRUE
        LEFT JOIN LATERAL (
          SELECT COUNT(*) AS comments_total
          FROM task_comments
          WHERE task_id = t.id
        ) t_comm ON TRUE
        WHERE t.column_id = c.id AND t.deleted_at IS NULL
      ) c_tasks ON TRUE
      WHERE b.id = ${boardId}
      GROUP BY b.id;
    `;

    if (!board) {
      return apiError('Board not found', 404);
    }

    return apiSuccess(board);
  } catch (error) {
    return handleApiError(error);
  }
}
