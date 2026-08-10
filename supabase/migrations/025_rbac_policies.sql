-- Migration 025: Role Based Access Control (RBAC)

-- 1. Create a helper function to get the user's role for a specific organization
CREATE OR REPLACE FUNCTION public.auth_user_role(check_org_id UUID)
RETURNS VARCHAR AS $$
  SELECT role FROM public.organization_members 
  WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1)
  AND org_id = check_org_id
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. Update Tournaments RBAC
-- Only Owner/Admin can create, update, or delete tournaments
DROP POLICY IF EXISTS "Org members can insert tournaments" ON tournaments;
CREATE POLICY "Org owners and admins can insert tournaments" ON tournaments FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Org members can update tournaments" ON tournaments;
CREATE POLICY "Org owners and admins can update tournaments" ON tournaments FOR UPDATE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Org members can delete tournaments" ON tournaments;
CREATE POLICY "Org owners and admins can delete tournaments" ON tournaments FOR DELETE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

-- 3. Update Teams RBAC
-- Only Owner/Admin can create, update, delete teams
DROP POLICY IF EXISTS "Org members can insert teams" ON teams;
CREATE POLICY "Org owners and admins can insert teams" ON teams FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Org members can update teams" ON teams;
CREATE POLICY "Org owners and admins can update teams" ON teams FOR UPDATE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Org members can delete teams" ON teams;
CREATE POLICY "Org owners and admins can delete teams" ON teams FOR DELETE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

-- 4. Update Players RBAC
-- Only Owner/Admin can manage players
DROP POLICY IF EXISTS "Org members can insert players" ON players;
CREATE POLICY "Org owners and admins can insert players" ON players FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Org members can update players" ON players;
CREATE POLICY "Org owners and admins can update players" ON players FOR UPDATE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Org members can delete players" ON players;
CREATE POLICY "Org owners and admins can delete players" ON players FOR DELETE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin'));

-- 5. Scorers can only manage match events and ball events
-- Note: 'scorer' role must be handled. For now, if role is 'scorer', they can only insert into ball_events and match_events.
DROP POLICY IF EXISTS "Org members can insert ball_events" ON ball_events;
CREATE POLICY "Scorers and Admins can insert ball_events" ON ball_events FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'scorer'));

DROP POLICY IF EXISTS "Org members can insert match_events" ON match_events;
CREATE POLICY "Scorers and Admins can insert match_events" ON match_events FOR INSERT 
WITH CHECK (
    match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT public.auth_user_orgs()))
    AND public.auth_user_role((SELECT org_id FROM matches WHERE id = match_id)) IN ('owner', 'admin', 'scorer')
);
