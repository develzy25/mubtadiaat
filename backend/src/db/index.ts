import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// In a Cloudflare Worker environment, the D1 database is accessed via env.DB
// We use a mutable export here that gets initialized per request or globally.
export let db: ReturnType<typeof drizzle>;

export const initDb = (envDb: any) => {
  db = drizzle(envDb, { schema });
};
