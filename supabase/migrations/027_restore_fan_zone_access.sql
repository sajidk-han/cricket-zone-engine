-- Migration 027: Restore Fan Zone Access (Visibility Policies)
-- Restores public access to matches, players, and events that are explicitly marked as public or unlisted.
-- This allows the Fan Zone to work correctly without compromising the strict dashboard tenant isolation.

-- Tournaments
CREATE POLICY "Public can view visible tournaments" ON tournaments FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));
    
-- Teams
CREATE POLICY "Public can view visible teams" ON teams FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));

-- Players
CREATE POLICY "Public can view visible players" ON players FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));
    
-- Matches
CREATE POLICY "Public can view visible matches" ON matches FOR SELECT 
    USING (visibility IN ('public', 'unlisted'));

-- Ball Events
CREATE POLICY "Public can view visible ball_events" ON ball_events FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM matches m WHERE m.id = ball_events.match_id AND m.visibility IN ('public', 'unlisted')
    ));

-- Match Events
CREATE POLICY "Public can view visible match_events" ON match_events FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM matches m WHERE m.id = match_events.match_id AND m.visibility IN ('public', 'unlisted')
    ));

-- Innings
CREATE POLICY "Public can view visible innings" ON innings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM matches m WHERE m.id = innings.match_id AND m.visibility IN ('public', 'unlisted')
    ));

-- Tournament Standings
CREATE POLICY "Public can view standings of visible tournaments" ON tournament_standings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tournaments t WHERE t.id = tournament_standings.tournament_id AND t.visibility IN ('public', 'unlisted')
    ));
