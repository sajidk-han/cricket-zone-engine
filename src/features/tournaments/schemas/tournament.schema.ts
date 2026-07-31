import { z } from 'zod';

// ============================================================================
// TOURNAMENT SCHEMAS (API Contract)
// Defines strict input validation for the Tournament feature module.
// ============================================================================

export const createTournamentSchema = z.object({
  name: z.string().min(3, 'Tournament name must be at least 3 characters').max(100),
  location: z.string().max(255).optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  format: z.enum(['T20', 'ODI', 'Test', 'T10', 'Hundred']).default('T20'),
  overs: z.number().int().min(1).max(90).default(20),
});

export const updateTournamentSchema = createTournamentSchema.partial().extend({
  id: z.string().uuid('Invalid tournament ID'),
  status: z.enum(['draft', 'scheduled', 'ongoing', 'completed', 'archived']).optional(),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;

// Standard API Response Wrapper
export type ApiResponse<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };
