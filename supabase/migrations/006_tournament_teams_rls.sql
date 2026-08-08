-- RLS Policies for Tournament Teams

ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view tournament teams" 
ON tournament_teams FOR SELECT 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can insert tournament teams" 
ON tournament_teams FOR INSERT 
WITH CHECK (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can update tournament teams" 
ON tournament_teams FOR UPDATE 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can delete tournament teams" 
ON tournament_teams FOR DELETE 
USING (org_id IN (SELECT user_orgs()));
