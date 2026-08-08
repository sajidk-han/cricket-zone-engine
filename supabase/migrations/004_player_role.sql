-- Add primary_role to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS primary_role VARCHAR(50);
