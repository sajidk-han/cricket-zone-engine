-- Migration 006: Public Read Access for Fan Zone
-- Allow public access (anonymous users) to read ball_events and players for the Public Scorecard

CREATE POLICY "Anyone can view ball events" ON ball_events FOR SELECT USING (true);
CREATE POLICY "Anyone can view players" ON players FOR SELECT USING (true);
