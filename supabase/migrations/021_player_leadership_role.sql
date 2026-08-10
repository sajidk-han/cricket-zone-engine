-- Migration 021: Add leadership_role to players table

ALTER TABLE players ADD COLUMN IF NOT EXISTS leadership_role VARCHAR(50);
