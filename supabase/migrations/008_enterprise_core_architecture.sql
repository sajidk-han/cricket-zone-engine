-- Migration 008: Enterprise Core Architecture
-- Introduces Seasons, Slugs, and Visibility controls

-- 1. Helper function for backfilling slugs
CREATE OR REPLACE FUNCTION generate_slug(str text)
RETURNS text AS $$
BEGIN
    -- Trim whitespace, convert to lowercase, replace non-alphanumeric with hyphens
    RETURN trim(both '-' from lower(regexp_replace(trim(str), '[^a-zA-Z0-9]+', '-', 'g')));
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- 2. Seasons Table
CREATE TABLE IF NOT EXISTS seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL, -- e.g., "2026", "Season 1"
    slug VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(org_id, slug)
);

-- Backfill default seasons for existing organizations
INSERT INTO seasons (org_id, name, slug)
SELECT id, 'Inaugural Season', 'inaugural-season'
FROM organizations
ON CONFLICT DO NOTHING;

-- 3. Modify Tournaments
ALTER TABLE tournaments 
    ADD COLUMN season_id UUID REFERENCES seasons(id),
    ADD COLUMN slug VARCHAR(255),
    ADD COLUMN visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted'));

-- Backfill existing tournaments
UPDATE tournaments t
SET 
    season_id = (SELECT id FROM seasons s WHERE s.org_id = t.org_id LIMIT 1),
    slug = generate_slug(name) || '-' || substr(id::text, 1, 8) -- add short id to ensure uniqueness
WHERE slug IS NULL;

-- Enforce Constraints
ALTER TABLE tournaments 
    ALTER COLUMN slug SET NOT NULL,
    ALTER COLUMN visibility SET NOT NULL,
    ADD CONSTRAINT uk_tournaments_slug UNIQUE(org_id, slug);

-- 4. Modify Teams
ALTER TABLE teams 
    ADD COLUMN slug VARCHAR(255),
    ADD COLUMN visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted'));

UPDATE teams 
SET slug = generate_slug(name) || '-' || substr(id::text, 1, 8)
WHERE slug IS NULL;

ALTER TABLE teams 
    ALTER COLUMN slug SET NOT NULL,
    ALTER COLUMN visibility SET NOT NULL,
    ADD CONSTRAINT uk_teams_slug UNIQUE(org_id, slug);

-- 5. Modify Players
ALTER TABLE players 
    ADD COLUMN slug VARCHAR(255),
    ADD COLUMN visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted'));

UPDATE players 
SET slug = generate_slug(full_name) || '-' || substr(id::text, 1, 8)
WHERE slug IS NULL;

ALTER TABLE players 
    ALTER COLUMN slug SET NOT NULL,
    ALTER COLUMN visibility SET NOT NULL,
    ADD CONSTRAINT uk_players_slug UNIQUE(org_id, slug);

-- 6. Modify Matches
ALTER TABLE matches 
    ADD COLUMN visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted'));

UPDATE matches SET visibility = 'public' WHERE visibility IS NULL;
ALTER TABLE matches ALTER COLUMN visibility SET NOT NULL;

-- 7. Add Policies for Visibility
-- Drop the old policy we created in migration 006 if it exists
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone can view ball events" ON ball_events;
    DROP POLICY IF EXISTS "Anyone can view players" ON players;
    DROP POLICY IF EXISTS "Anyone can view live matches" ON matches;
EXCEPTION WHEN undefined_object THEN
    -- do nothing
END $$;

-- Public can view if visibility is 'public' or 'unlisted' (unlisted means accessible if you have the link/slug)
CREATE POLICY "Public can view visible tournaments" ON tournaments FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));

CREATE POLICY "Public can view visible teams" ON teams FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));

CREATE POLICY "Public can view visible players" ON players FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));

CREATE POLICY "Public can view visible matches" ON matches FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));

-- For ball events, a public user can view them if the match is visible.
CREATE POLICY "Public can view visible ball_events" ON ball_events FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM matches m WHERE m.id = ball_events.match_id AND m.visibility IN ('public', 'unlisted')
    ));
