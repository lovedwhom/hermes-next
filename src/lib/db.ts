import Database from 'better-sqlite3';
import path from 'path';

// standalone build 中 process.cwd() 可能是 .next/server/，用 __dirname 更可靠
const DB_PATH = path.resolve('/root/project/hermes-next', 'data.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
  }
}
