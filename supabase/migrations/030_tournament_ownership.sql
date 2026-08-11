-- Migration 030: Track ownership of Tournaments
-- Allows Organizers to delete ONLY the tournaments they created.

-- 1. Add created_by column to tournaments
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id);

-- 2. Create trigger to automatically set created_by on INSERT for tournaments
DROP TRIGGER IF EXISTS set_tournaments_created_by ON tournaments;
CREATE TRIGGER set_tournaments_created_by
  BEFORE INSERT ON tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by_to_current_user();

-- 3. Update DELETE policies for Tournaments to allow organizers to delete their OWN tournaments
DROP POLICY IF EXISTS "Org owners and admins can delete tournaments" ON tournaments;
CREATE POLICY "Org owners, admins and organizers (own) can delete tournaments" ON tournaments FOR DELETE
USING (
  org_id IN (SELECT public.auth_user_orgs()) 
  AND (
    public.auth_user_role(org_id) IN ('owner', 'admin')
    OR
    (public.auth_user_role(org_id) = 'organizer' AND created_by = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1))
  )
);
