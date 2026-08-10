-- Migration 022: Add public read access to innings and ball_events for Realtime FanZone

-- Innings: Anyone can read (required for public realtime score updates)
DROP POLICY IF EXISTS "Anyone can view innings" ON innings;
CREATE POLICY "Anyone can view innings" ON innings FOR SELECT USING (true);

-- Ball Events: Anyone can read (required for public realtime ball-by-ball updates)
DROP POLICY IF EXISTS "Anyone can view ball_events" ON ball_events;
CREATE POLICY "Anyone can view ball_events" ON ball_events FOR SELECT USING (true);
