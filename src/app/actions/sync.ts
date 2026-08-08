"use server"

import { createClient } from '@/lib/supabase-server'
import { scoreDelivery, DeliveryPayload } from './scoring'
import { getDefaultOrgId } from './org'

export async function syncBatchToServer(batch: any[]) {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const acknowledgedRequestIds: string[] = []

    // Process sequentially to respect strict FIFO ordering
    for (const item of batch) {
      const payload: DeliveryPayload = item.payload
      
      // We pass the stored clientVersion to ensure OCC (Optimistic Concurrency Control)
      // Though in offline sync, the client version might lag behind if other clients scored.
      // But for a single scorer offline-first app, this provides idempotency.
      const result = await scoreDelivery(
        item.match_id,
        item.innings_id,
        item.request_id,
        item.context.clientVersion || 0,
        item.context.strikerId, 
        item.context.nonStrikerId,
        item.context.bowlerId,
        payload
      )

      if (result.success || result.message?.includes('Duplicate request')) {
        // If it succeeds or was already processed (Idempotent), we ACK it.
        acknowledgedRequestIds.push(item.request_id)
      } else {
        console.error(`Failed to sync item ${item.request_id}:`, result.message)
        // If an item fails in a FIFO queue, we MUST halt processing the rest of the batch 
        // to prevent sequence gaps on the server.
        break;
      }
    }

    return { 
      success: acknowledgedRequestIds.length > 0, 
      acknowledgedRequestIds,
      message: acknowledgedRequestIds.length === batch.length ? 'Fully synced' : 'Partially synced'
    }

  } catch (error: any) {
    console.error("syncBatchToServer error:", error)
    return { success: false, message: "Server encountered an error while syncing batch" }
  }
}
