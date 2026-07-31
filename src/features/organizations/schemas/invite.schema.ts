import { z } from 'zod';
import { ApiResponse } from '@/features/tournaments/schemas/tournament.schema';

// ============================================================================
// ORGANIZATION INVITATION SCHEMAS
// Strict validation for sending and managing workspace invites.
// ============================================================================

export const createInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'scorer', 'viewer']).default('viewer'),
  orgId: z.string().uuid('Invalid organization ID'),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(10, 'Invalid token'),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;

export type { ApiResponse };
