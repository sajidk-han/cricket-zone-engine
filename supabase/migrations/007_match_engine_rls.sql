-- RLS Policies for Match Engine Tables (Day 3)

-- 1. match_playing_xi
ALTER TABLE match_playing_xi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view match_playing_xi" 
ON match_playing_xi FOR SELECT 
USING (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));

CREATE POLICY "Org members can insert match_playing_xi" 
ON match_playing_xi FOR INSERT 
WITH CHECK (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));

CREATE POLICY "Org members can update match_playing_xi" 
ON match_playing_xi FOR UPDATE 
USING (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));

CREATE POLICY "Org members can delete match_playing_xi" 
ON match_playing_xi FOR DELETE 
USING (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));

-- 2. innings
ALTER TABLE innings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view innings" 
ON innings FOR SELECT 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can insert innings" 
ON innings FOR INSERT 
WITH CHECK (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can update innings" 
ON innings FOR UPDATE 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can delete innings" 
ON innings FOR DELETE 
USING (org_id IN (SELECT user_orgs()));

-- 3. ball_events
ALTER TABLE ball_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view ball_events" 
ON ball_events FOR SELECT 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can insert ball_events" 
ON ball_events FOR INSERT 
WITH CHECK (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can update ball_events" 
ON ball_events FOR UPDATE 
USING (org_id IN (SELECT user_orgs()));

CREATE POLICY "Org members can delete ball_events" 
ON ball_events FOR DELETE 
USING (org_id IN (SELECT user_orgs()));

-- 4. match_events (Timeline)
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view match_events" 
ON match_events FOR SELECT 
USING (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));

CREATE POLICY "Org members can insert match_events" 
ON match_events FOR INSERT 
WITH CHECK (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));

CREATE POLICY "Org members can update match_events" 
ON match_events FOR UPDATE 
USING (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));

CREATE POLICY "Org members can delete match_events" 
ON match_events FOR DELETE 
USING (match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT user_orgs())));
