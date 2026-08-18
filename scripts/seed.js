import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/syncflow';
const sql = postgres(connectionString);

async function seed() {
  console.log('🌱 Seeding sample data...');
  try {
    // 1. Create User
    const [user] = await sql`
      INSERT INTO users (email, full_name, avatar_url)
      VALUES ('habban@syncflow.io', 'Habbanma', 'https://github.com/Hivzzy.png')
      ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
      RETURNING id
    `;

    // 2. Create User Preferences
    await sql`
      INSERT INTO user_preferences (user_id, theme)
      VALUES (${user.id}, 'dark')
      ON CONFLICT (user_id) DO NOTHING
    `;

    // 3. Create Workspace
    const [workspace] = await sql`
      INSERT INTO workspaces (name, slug, owner_id)
      VALUES ('Acme Engineering', 'acme-eng', ${user.id})
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;

    // 4. Add Member
    await sql`
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES (${workspace.id}, ${user.id}, 'owner')
      ON CONFLICT (workspace_id, user_id) DO NOTHING
    `;

    // 5. Create Board
    const [board] = await sql`
      INSERT INTO boards (workspace_id, name, identifier, description, icon, color, created_by)
      VALUES (${workspace.id}, 'Core Platform Sprint', 'ENG', 'Main sprint board for core features', 'kanban', '#3b82f6', ${user.id})
      ON CONFLICT (workspace_id, identifier) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;

    // 6. Create Default Columns
    const columnsData = [
      { name: 'Backlog', category: 'backlog', position: 1000, color: '#64748b' },
      { name: 'To Do', category: 'unstarted', position: 2000, color: '#38bdf8' },
      { name: 'In Progress', category: 'started', position: 3000, color: '#f59e0b' },
      { name: 'In Review', category: 'started', position: 4000, color: '#a855f7' },
      { name: 'Done', category: 'completed', position: 5000, color: '#22c55e' },
    ];

    const createdColumns = [];
    for (const col of columnsData) {
      const [c] = await sql`
        INSERT INTO columns (board_id, name, category, position, color)
        VALUES (${board.id}, ${col.name}, ${col.category}, ${col.position}, ${col.color})
        RETURNING id, name
      `;
      createdColumns.push(c);
    }

    // 7. Create Labels
    const [bugLabel] = await sql`
      INSERT INTO labels (workspace_id, name, color)
      VALUES (${workspace.id}, 'Bug', '#ef4444')
      ON CONFLICT (workspace_id, name) DO UPDATE SET color = EXCLUDED.color
      RETURNING id
    `;

    const [featLabel] = await sql`
      INSERT INTO labels (workspace_id, name, color)
      VALUES (${workspace.id}, 'Feature', '#3b82f6')
      ON CONFLICT (workspace_id, name) DO UPDATE SET color = EXCLUDED.color
      RETURNING id
    `;

    // 8. Create Sample Tasks
    const todoCol = createdColumns.find(c => c.name === 'To Do');
    const inProgressCol = createdColumns.find(c => c.name === 'In Progress');

    if (todoCol) {
      const [t1] = await sql`
        INSERT INTO tasks (board_id, column_id, task_number, title, description, priority, estimate_points, position, created_by)
        VALUES (${board.id}, ${todoCol.id}, 101, 'Design drag-and-drop Kanban interaction', 'Implement smooth dnd-kit drop zones with optimistic animation', 2, 5, 1000, ${user.id})
        ON CONFLICT (board_id, task_number) DO NOTHING
        RETURNING id
      `;

      if (t1) {
        await sql`INSERT INTO task_assignees (task_id, user_id) VALUES (${t1.id}, ${user.id}) ON CONFLICT DO NOTHING`;
        await sql`INSERT INTO task_labels (task_id, label_id) VALUES (${t1.id}, ${featLabel.id}) ON CONFLICT DO NOTHING`;
      }
    }

    if (inProgressCol) {
      const [t2] = await sql`
        INSERT INTO tasks (board_id, column_id, task_number, title, description, priority, estimate_points, position, created_by)
        VALUES (${board.id}, ${inProgressCol.id}, 102, 'Setup raw PostgreSQL connection pool', 'Configured postgres.js tagged templates for zero-overhead parameterized SQL', 1, 3, 1000, ${user.id})
        ON CONFLICT (board_id, task_number) DO NOTHING
        RETURNING id
      `;

      if (t2) {
        await sql`INSERT INTO task_assignees (task_id, user_id) VALUES (${t2.id}, ${user.id}) ON CONFLICT DO NOTHING`;
        await sql`INSERT INTO task_labels (task_id, label_id) VALUES (${t2.id}, ${bugLabel.id}) ON CONFLICT DO NOTHING`;
      }
    }

    console.log('✅ Seed data inserted successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sql.end();
  }
}

seed();
