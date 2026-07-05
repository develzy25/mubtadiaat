import Dexie, { type EntityTable } from 'dexie';

// We can define the offline queue schema
export interface OfflineAction {
  id?: number;
  action: string;
  payload: any;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  createdAt: string;
}

export interface LocalSantri {
  id: string;
  name: string;
  nis: string | null;
  classId: string;
  // add more fields as needed for offline display
}

const db = new Dexie('e-mubtadiaat-pwa') as Dexie & {
  offlineQueue: EntityTable<
    OfflineAction,
    'id'
  >;
  localSantri: EntityTable<
    LocalSantri,
    'id'
  >;
};

// Schema declaration:
db.version(1).stores({
  offlineQueue: '++id, action, status, createdAt', // Primary key and indexed props
  localSantri: 'id, classId, name, nis' // For fast offline search
});

export type { db };
export default db;
