import Dexie, { type EntityTable } from 'dexie';
import { DeliveryPayload } from '@/app/actions/scoring';

export type QueueStatus = 'queued' | 'processing' | 'synced' | 'failed' | 'conflict' | 'cancelled';

export interface PendingDelivery {
  request_id: string; // Primary Key
  match_id: string;
  innings_id: string;
  sequence_number: number;
  payload: DeliveryPayload;
  context: {
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    clientVersion: number;
  };
  status: QueueStatus;
  retry_count: number;
  created_at: string;
  checksum: string;
}

export interface MatchSnapshot {
  match_id: string; // Primary Key
  snapshot_version: number;
  snapshot_checksum: string;
  state_data: any; 
  ui_state: any;
  created_at: string;
}

export interface LocalAuditLog {
  id?: number; // Auto-increment PK
  match_id: string;
  action: string;
  description: string;
  timestamp: string;
  is_synced: boolean;
}

export interface ScoringSession {
  match_id: string; // Primary Key
  device_id: string;
  last_synced_sequence: number;
  lock_expires_at: string;
}

export interface SyncLog {
  id?: number;
  match_id: string;
  attempt_time: string;
  status: 'success' | 'failed' | 'conflict';
  details: string;
}

const db = new Dexie('CricketZoneOfflineDB') as Dexie & {
  pending_deliveries: EntityTable<PendingDelivery, 'request_id'>;
  match_snapshots: EntityTable<MatchSnapshot, 'match_id'>;
  local_audit_logs: EntityTable<LocalAuditLog, 'id'>;
  scoring_sessions: EntityTable<ScoringSession, 'match_id'>;
  sync_logs: EntityTable<SyncLog, 'id'>;
};

// Define Schema
db.version(2).stores({
  pending_deliveries: 'request_id, match_id, innings_id, status, sequence_number, created_at',
  match_snapshots: 'match_id',
  local_audit_logs: '++id, match_id, is_synced, timestamp',
  scoring_sessions: 'match_id',
  sync_logs: '++id, match_id, attempt_time'
});

export { db };

// Utility for Local Audit Log
export async function logLocalAudit(matchId: string, action: string, description: string) {
  try {
    await db.local_audit_logs.add({
      match_id: matchId,
      action,
      description,
      timestamp: new Date().toISOString(),
      is_synced: false
    })
  } catch (error) {
    console.error("Failed to write to local audit log", error)
  }
}
