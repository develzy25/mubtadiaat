import * as schema from '../db/schema';
export class OfflineSyncService {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Menerima antrian data dari PWA/Mobile (Offline First)
     * Menyimpan ke dalam tabel offline_queue untuk diproses
     */
    async sync(userId, queues) {
        const results = [];
        for (const item of queues) {
            try {
                const queueId = crypto.randomUUID();
                await this.db.insert(schema.offlineQueue).values({
                    id: queueId,
                    userId,
                    action: item.action,
                    payload: JSON.stringify(item.payload),
                    status: 'PENDING',
                });
                results.push({ id: item.id, status: 'SYNCED', serverId: queueId });
            }
            catch (error) {
                results.push({ id: item.id, status: 'FAILED', error: error.message });
            }
        }
        return results;
    }
}
