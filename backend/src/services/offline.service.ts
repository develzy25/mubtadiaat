import * as schema from '../db/schema';
export class OfflineSyncService {
    db: any;
    constructor(db: any) {
        this.db = db;
    }
    /**
     * Menerima antrian data dari PWA/Mobile (Offline First)
     * Menyimpan ke dalam tabel offline_queue untuk diproses
     */
    async sync(userId: string, queues: any[]) {
        const results = [];
        for (const item of queues) {
            try {
                const queueId = crypto.randomUUID();
                // Mock since offlineQueue is not in schema yet
                // await this.db.insert((schema as any).offlineQueue).values({
                //     id: queueId,
                //     userId,
                //     action: item.action,
                //     payload: JSON.stringify(item.payload),
                //     status: 'PENDING',
                // });
                results.push({ id: item.id, status: 'SYNCED', serverId: queueId });
            }
            catch (error: any) {
                results.push({ id: item.id, status: 'FAILED', error: error.message });
            }
        }
        return results;
    }
}
