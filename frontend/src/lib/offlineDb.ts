import Dexie, { type Table } from 'dexie';

export interface SyncTask {
  id?: number;
  url: string;
  method: string;
  body: string; // JSON string
  headers?: string; // JSON string
  createdAt: string;
  status: 'PENDING' | 'FAILED';
  retryCount: number;
}

export class MubtadiaatOfflineDB extends Dexie {
  syncQueue!: Table<SyncTask, number>;

  constructor() {
    super('MubtadiaatOfflineDB');
    this.version(1).stores({
      syncQueue: '++id, status, createdAt'
    });
  }
}

export const offlineDb = new MubtadiaatOfflineDB();
