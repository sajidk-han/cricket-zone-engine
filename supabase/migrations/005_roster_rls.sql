-- RLS Policies for Roster Management

-- 1. Players Table RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view players" 
ON players FOR SELECT 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can insert players" 
ON players FOR INSERT 
WITH CHECK (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can update players" 
ON players FOR UPDATE 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can delete players" 
ON players FOR DELETE 
USING (org_id IN (SELECT user_orgs()));

-- 2. Team Players Table RLS
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view team players" 
ON team_players FOR SELECT 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can insert team players" 
ON team_players FOR INSERT 
WITH CHECK (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can update team players" 
ON team_players FOR UPDATE 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can delete team players" 
ON team_players FOR DELETE 
USING (org_id IN (SELECT user_orgs()));
