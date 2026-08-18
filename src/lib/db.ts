import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/syncflow';

// Global connection pool instance for Next.js hot reloading
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const sql =
  globalForDb.conn ??
  postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = sql;
}

export default sql;
