-- Migration 005: Public Projection Views

-- 1. live_match_view
-- Optimized read-only view for the public match feed (/public/live)
CREATE OR REPLACE VIEW live_match_view AS
SELECT 
    m.id,
    m.org_id,
    m.tournament_id,
    tr.name AS tournament_name,
    
    m.team1_id,
    t1.name AS team1_name,
    t1.short_name AS team1_short_name,
    t1.logo_url AS team1_logo,
    
    m.team2_id,
    t2.name AS team2_name,
    t2.short_name AS team2_short_name,
    t2.logo_url AS team2_logo,
    
    m.ground_id,
    g.name AS ground_name,
    g.city AS ground_city,
    
    m.scheduled_time,
    m.match_type,
    m.match_stage,
    m.status,
    m.toss_winner_id,
    m.toss_decision,
    
    m.current_innings,
    i.id AS current_innings_id,
    i.batting_team_id,
    i.total_runs,
    i.total_wickets,
    i.overs_bowled
FROM 
    matches m
JOIN 
    tournaments tr ON m.tournament_id = tr.id
JOIN 
    teams t1 ON m.team1_id = t1.id
JOIN 
    teams t2 ON m.team2_id = t2.id
LEFT JOIN
    grounds g ON m.ground_id = g.id
LEFT JOIN 
    innings i ON m.id = i.match_id AND m.current_innings = i.innings_number
WHERE 
    m.status != 'draft';

-- Grant access to authenticated and anon (public) users
GRANT SELECT ON live_match_view TO authenticated, anon;


-- 2. public_scorecard_view
CREATE OR REPLACE VIEW public_scorecard_view AS
SELECT 
    m.id,
    m.status,
    m.match_statistics,
    m.current_version,
    i.innings_number,
    i.batting_team_id,
    i.total_runs,
    i.total_wickets,
    i.overs_bowled
FROM matches m
LEFT JOIN innings i ON m.id = i.match_id
WHERE m.status != 'draft';

GRANT SELECT ON public_scorecard_view TO authenticated, anon;
