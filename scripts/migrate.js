import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/syncflow';
const sql = postgres(connectionString);

async function runMigrations() {
  console.log('🚀 Running database migrations...');
  try {
    const migrationFile = path.resolve('migrations/001_initial_schema.sql');
    const sqlContent = fs.readFileSync(migrationFile, 'utf8');

    await sql.unsafe(sqlContent);
    console.log('✅ 17 Tables and Indexes created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sql.end();
  }
}

runMigrations();
