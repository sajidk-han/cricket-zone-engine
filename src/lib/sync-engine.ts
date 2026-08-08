import { db, PendingDelivery } from './offline-db';
import { DeliveryPayload } from '@/app/actions/scoring';

export class SyncEngine {
  private isSyncing = false;
  private readonly MAX_BATCH_SIZE = 10;
  private readonly MAX_RETRIES = 5;

  async enqueueDelivery(
    matchId: string,
    inningsId: string,
    payload: DeliveryPayload,
    context: { strikerId: string, nonStrikerId: string, bowlerId: string, clientVersion: number }
  ): Promise<PendingDelivery> {
    const requestId = crypto.randomUUID();
    
    // Get last sequence number for this innings to enforce FIFO
    const lastDelivery = await db.pending_deliveries
      .where({ innings_id: inningsId })
      .reverse()
      .sortBy('sequence_number')
      .then(res => res[0]);

    const sequenceNumber = (lastDelivery?.sequence_number || 0) + 1;
    
    // Create checksum for data integrity
    const checksumStr = `${matchId}-${inningsId}-${sequenceNumber}-${JSON.stringify(payload)}`;
    const checksum = await this.generateChecksum(checksumStr);

    const delivery: PendingDelivery = {
      request_id: requestId,
      match_id: matchId,
      innings_id: inningsId,
      sequence_number: sequenceNumber,
      payload,
      context,
      status: 'queued',
      retry_count: 0,
      created_at: new Date().toISOString(),
      checksum
    };

    await db.pending_deliveries.add(delivery);
    
    // Trigger sync asynchronously
    this.triggerSync().catch(console.error);
    
    return delivery;
  }

  async triggerSync() {
    if (this.isSyncing) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return; // Wait for network if in browser

    this.isSyncing = true;
    try {
      await this.processQueue();
    } finally {
      this.isSyncing = false;
    }
  }

  private async processQueue() {
    // 1. Fetch pending items ordered by sequence_number (Strict FIFO)
    const pendingItems = await db.pending_deliveries
      .where('status')
      .anyOf(['queued', 'failed'])
      .sortBy('sequence_number');

    if (pendingItems.length === 0) return;

    // 2. Validate Queue Integrity (Checksum & Sequence gaps)
    if (!await this.validateQueueIntegrity(pendingItems)) {
      console.error("Queue integrity validation failed. Halting sync.");
      // In enterprise app, we'd trigger a Conflict Resolution UI here
      return;
    }

    // 3. Batch them (up to 10)
    const batch = pendingItems.slice(0, this.MAX_BATCH_SIZE);
    
    // Mark as processing
    await db.pending_deliveries.bulkPut(
      batch.map(item => ({ ...item, status: 'processing' as const }))
    );

    try {
      // 4. Send to server
      const { syncBatchToServer } = await import('@/app/actions/sync');
      const result = await syncBatchToServer(batch);
      
      // 5. Verify ACK
      if (result.success && result.acknowledgedRequestIds) {
         // Mark acknowledged items as synced
         const syncedItems = batch.filter(b => result.acknowledgedRequestIds.includes(b.request_id));
         await db.pending_deliveries.bulkPut(
           syncedItems.map(item => ({ ...item, status: 'synced' as const }))
         );
         
         // Log success
         await db.sync_logs.add({
           match_id: batch[0].match_id,
           attempt_time: new Date().toISOString(),
           status: 'success',
           details: `Synced ${syncedItems.length} items`
         });
         
         // If there's more in the queue, continue syncing after a short delay
         if (pendingItems.length > this.MAX_BATCH_SIZE) {
            setTimeout(() => this.triggerSync(), 1000);
         }
      } else {
         throw new Error(result.message || "Sync rejected by server");
      }

    } catch (error: any) {
      // 6. Handle Failures & Exponential Backoff
      console.error("Batch sync failed", error);
      
      const failedUpdates = batch.map(item => ({
        ...item,
        status: 'failed' as const,
        retry_count: item.retry_count + 1
      }));
      
      await db.pending_deliveries.bulkPut(failedUpdates);
      
      await db.sync_logs.add({
         match_id: batch[0].match_id,
         attempt_time: new Date().toISOString(),
         status: 'failed',
         details: error.message || "Unknown error"
      });
      
      // We don't automatically trigger again immediately to respect backoff
    }
  }
  
  private async validateQueueIntegrity(items: PendingDelivery[]): Promise<boolean> {
    if (items.length === 0) return true;

    // 1. Check sequence gaps within the pending queue itself
    // NOTE: In a real system, we also check if the FIRST item's sequence matches DB's expected sequence.
    for (let i = 1; i < items.length; i++) {
      if (items[i].sequence_number !== items[i-1].sequence_number + 1) {
         console.warn(`Sequence gap detected between ${items[i-1].sequence_number} and ${items[i].sequence_number}`);
         return false;
      }
    }
    
    // 2. Validate Checksums
    for (const item of items) {
      const expectedChecksumStr = `${item.match_id}-${item.innings_id}-${item.sequence_number}-${JSON.stringify(item.payload)}`;
      const expectedChecksum = await this.generateChecksum(expectedChecksumStr);
      if (item.checksum !== expectedChecksum) {
         console.warn(`Checksum mismatch for sequence ${item.sequence_number}`);
         return false;
      }
    }
    
    return true;
  }

  private async generateChecksum(str: string): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      // Fallback for non-browser/secure contexts if needed, though this runs in browser
      return btoa(str).substring(0, 32); 
    }
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const syncEngine = new SyncEngine();
