-- Migration 028: Organizer Role RBAC Policies

-- We will update teams, players, team_players, and tournament_teams policies
-- to properly support the new 'organizer' role.

-- 1. Teams Table
DROP POLICY IF EXISTS "Org members can insert teams" ON teams;
DROP POLICY IF EXISTS "Org owners and admins can insert teams" ON teams;
CREATE POLICY "Org owners, admins and organizers can insert teams" ON teams FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

DROP POLICY IF EXISTS "Org members can update teams" ON teams;
DROP POLICY IF EXISTS "Org owners and admins can update teams" ON teams;
CREATE POLICY "Org owners, admins and organizers can update teams" ON teams FOR UPDATE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

-- 2. Players Table
DROP POLICY IF EXISTS "Org members can insert players" ON players;
DROP POLICY IF EXISTS "Org owners and admins can insert players" ON players;
CREATE POLICY "Org owners, admins and organizers can insert players" ON players FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

DROP POLICY IF EXISTS "Org members can update players" ON players;
DROP POLICY IF EXISTS "Org owners and admins can update players" ON players;
CREATE POLICY "Org owners, admins and organizers can update players" ON players FOR UPDATE
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

-- 3. Team Players (Roster) Table
-- Organizers need to be able to add and remove players from rosters, so they get DELETE here, but NOT on players/teams.
DROP POLICY IF EXISTS "Org members can insert team players" ON team_players;
CREATE POLICY "Org owners, admins and organizers can insert team players" ON team_players FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

DROP POLICY IF EXISTS "Org members can update team players" ON team_players;
CREATE POLICY "Org owners, admins and organizers can update team players" ON team_players FOR UPDATE 
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

DROP POLICY IF EXISTS "Org members can delete team players" ON team_players;
CREATE POLICY "Org owners, admins and organizers can delete team players" ON team_players FOR DELETE 
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

-- 4. Tournament Teams Table
-- If an organizer creates a team for a tournament, they might need to assign it. We'll allow INSERT/DELETE for organizers here too.
DROP POLICY IF EXISTS "Org members can insert tournament teams" ON tournament_teams;
CREATE POLICY "Org owners, admins and organizers can insert tournament teams" ON tournament_teams FOR INSERT 
WITH CHECK (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

DROP POLICY IF EXISTS "Org members can update tournament teams" ON tournament_teams;
CREATE POLICY "Org owners, admins and organizers can update tournament teams" ON tournament_teams FOR UPDATE 
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));

DROP POLICY IF EXISTS "Org members can delete tournament teams" ON tournament_teams;
CREATE POLICY "Org owners, admins and organizers can delete tournament teams" ON tournament_teams FOR DELETE 
USING (org_id IN (SELECT public.auth_user_orgs()) AND public.auth_user_role(org_id) IN ('owner', 'admin', 'organizer'));
