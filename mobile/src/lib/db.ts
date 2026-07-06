import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const offlineQueue = sqliteTable('offline_queue', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  action: text('action').notNull(),
  payload: text('payload').notNull(),
  status: text('status', { enum: ['PENDING', 'SYNCED', 'FAILED'] }).notNull().default('PENDING'),
  createdAt: text('created_at').notNull(),
});

import { Platform } from 'react-native';

// Export a mock db if we are on web and SharedArrayBuffer is missing
let expoDb: any = null;
export let db: any = null;

try {
  if (Platform.OS !== 'web' || typeof SharedArrayBuffer !== 'undefined') {
    // Create expo-sqlite instance
    expoDb = SQLite.openDatabaseSync('mubtadiaat.db');

    // Enable WAL for better performance
    expoDb.execSync(
      'PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;'
    );

    // Create table if not exists (sync initialization)
    expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS offline_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        created_at TEXT NOT NULL
      );
    `);

    db = drizzle(expoDb);
  }
} catch (e) {
  console.warn('SQLite initialization failed (expected on Web without COOP/COEP headers). Offline queue will not work.');
}
