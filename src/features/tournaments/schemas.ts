import { z } from 'zod'

export const tournamentStatusEnum = z.enum([
  'draft',
  'registration_open',
  'registration_closed',
  'upcoming',
  'live',
  'completed',
  'archived'
])

export const tournamentSettingsSchema = z.object({
  overs_per_match: z.number().min(1).max(100).default(20),
  match_format: z.enum(['t10', 't20', 'odi', 'test', 'custom']).default('t20'),
  win_points: z.number().min(0).default(2),
  tie_points: z.number().min(0).default(1),
  no_result_points: z.number().min(0).default(1),
  super_over_enabled: z.boolean().default(true),
  dls_enabled: z.boolean().default(false),
  allow_player_transfers: z.boolean().default(false),
  max_squad_size: z.number().min(11).max(30).default(15),
  max_playing_xi: z.number().min(7).max(11).default(11),
  registration_deadline: z.string().nullable().default(null),
  logo_url: z.string().url().nullable().default(null)
})

export const createTournamentSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters").max(100, "Tournament name is too long"),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date" }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date" }),
  settings: tournamentSettingsSchema.optional()
}).refine(data => new Date(data.end_date) >= new Date(data.start_date), {
  message: "End date must be on or after start date",
  path: ["end_date"]
})

export type TournamentSettings = z.infer<typeof tournamentSettingsSchema>
export type CreateTournamentInput = z.infer<typeof createTournamentSchema>
export type TournamentStatus = z.infer<typeof tournamentStatusEnum>
