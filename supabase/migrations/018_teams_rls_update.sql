-- 018_teams_rls_update.sql

-- Add missing UPDATE policy for teams
-- This allows organization members to update (and soft delete) teams in their org

DROP POLICY IF EXISTS "Org members can update teams" ON teams;

CREATE POLICY "Org members can update teams" 
ON teams FOR UPDATE 
TO authenticated
USING (org_id IN (SELECT auth_user_orgs()))
WITH CHECK (org_id IN (SELECT auth_user_orgs()));
