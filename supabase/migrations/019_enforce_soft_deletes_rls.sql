-- 019_enforce_soft_deletes_rls.sql

-- Fix "Org members can read" policies to exclude soft-deleted records for teams and players
-- Because policies are ORed together, if any policy allows reading, the row is returned.
-- The original org member policies were missing the `deleted_at IS NULL` check.

-- Teams
DROP POLICY IF EXISTS "Org members can read teams" ON teams;
CREATE POLICY "Org members can read teams" 
ON teams FOR SELECT 
USING (org_id IN (SELECT auth_user_orgs()) AND deleted_at IS NULL);

-- Players
DROP POLICY IF EXISTS "Org members can read players" ON players;
CREATE POLICY "Org members can read players" 
ON players FOR SELECT 
USING (org_id IN (SELECT auth_user_orgs()) AND deleted_at IS NULL);

-- To ensure complete cleanliness, if a user needs to fetch a specific soft-deleted team/player 
-- for historical matches, the public policies or a specific admin policy should be used, but
-- for now we want them globally hidden from standard views.
