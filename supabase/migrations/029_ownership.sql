-- Migration 029: Ownership tracking for Teams and Players
-- Allows Organizers to delete ONLY the teams and players they created.

-- 1. Add created_by column to teams and players
ALTER TABLE teams ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id);
ALTER TABLE players ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id);

-- 2. Create a trigger function to automatically set created_by on INSERT
CREATE OR REPLACE FUNCTION public.set_created_by_to_current_user()
RETURNS trigger AS $$
BEGIN
  -- Only set if not already provided (or you can force it)
  IF NEW.created_by IS NULL THEN
    NEW.created_by := (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Apply trigger to teams and players
DROP TRIGGER IF EXISTS set_teams_created_by ON teams;
CREATE TRIGGER set_teams_created_by
  BEFORE INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by_to_current_user();

DROP TRIGGER IF EXISTS set_players_created_by ON players;
CREATE TRIGGER set_players_created_by
  BEFORE INSERT ON players
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by_to_current_user();

-- 4. Update DELETE policies for Teams to allow organizers to delete their OWN teams
DROP POLICY IF EXISTS "Org owners and admins can delete teams" ON teams;
CREATE POLICY "Org owners, admins and organizers (own) can delete teams" ON teams FOR DELETE
USING (
  org_id IN (SELECT public.auth_user_orgs()) 
  AND (
    public.auth_user_role(org_id) IN ('owner', 'admin')
    OR
    (public.auth_user_role(org_id) = 'organizer' AND created_by = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1))
  )
);

-- 5. Update DELETE policies for Players to allow organizers to delete their OWN players
DROP POLICY IF EXISTS "Org owners and admins can delete players" ON players;
CREATE POLICY "Org owners, admins and organizers (own) can delete players" ON players FOR DELETE
USING (
  org_id IN (SELECT public.auth_user_orgs()) 
  AND (
    public.auth_user_role(org_id) IN ('owner', 'admin')
    OR
    (public.auth_user_role(org_id) = 'organizer' AND created_by = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1))
  )
);
