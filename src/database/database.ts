import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'minhas-series.db';
let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database !== null) {
    return database;
  }
  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await runMigrations(database);
  return database;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS serie (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo     TEXT    NOT NULL,
      plataforma TEXT    NOT NULL,
      temporadas INTEGER NOT NULL,
      nota       INTEGER CHECK (nota BETWEEN 1 AND 5),
      concluida  INTEGER NOT NULL DEFAULT 0 CHECK (concluida IN (0, 1)),
      createdAt  TEXT    NOT NULL
    );
  `);
}