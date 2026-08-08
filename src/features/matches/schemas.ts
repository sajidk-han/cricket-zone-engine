import { z } from 'zod'

export const matchSettingsSchema = z.object({
  overs: z.number().min(1).max(50).default(20),
  matchFormat: z.enum(['t10', 't20', 'odi', 'test', 'custom']).default('t20'),
  powerplayOvers: z.number().min(0).default(6),
  superOver: z.boolean().default(true),
  dls: z.boolean().default(false),
  ballType: z.enum(['hard_tennis', 'leather', 'tape_ball']).default('hard_tennis'),
  pitchType: z.enum(['turf', 'mat', 'cement', 'mud']).default('mat'),
  customRules: z.string().optional()
})

export const ScheduleMatchSchema = z.object({
  tournament_id: z.string().uuid(),
  team1_id: z.string().uuid(),
  team2_id: z.string().uuid(),
  ground_id: z.string().uuid().optional().nullable(),
  scheduled_at: z.string().datetime(), // Requires valid ISO date string
  scheduled_overs: z.number().min(1).max(50),
  match_type: z.enum(['t10', 't20', 'odi', 'test', 'custom']),
  settings: matchSettingsSchema
}).refine(data => data.team1_id !== data.team2_id, {
  message: "Team 1 and Team 2 cannot be the same",
  path: ['team2_id']
})

export type ScheduleMatchInput = z.infer<typeof ScheduleMatchSchema>
