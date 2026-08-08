-- Migration: 012_transactional_finalization.sql

CREATE OR REPLACE FUNCTION finalize_match_transactional(
    p_match_id UUID,
    p_status VARCHAR,
    p_player_stats JSONB,
    p_tournament_id UUID,
    p_standings JSONB
) RETURNS jsonb AS $$
BEGIN
    -- 1. Update Match Status (Idempotent: Only update if not already matching)
    UPDATE matches 
    SET status = p_status, 
        current_version = current_version + 1,
        match_statistics = jsonb_set(COALESCE(match_statistics, '{}'::jsonb), '{finalized_at}', to_jsonb(now()))
    WHERE id = p_match_id;

    -- 2. Upsert Player Match Stats safely
    IF p_player_stats IS NOT NULL AND jsonb_array_length(p_player_stats) > 0 THEN
        INSERT INTO player_match_stats (
            match_id, player_id, team_id, org_id, runs_scored, balls_faced, fours, sixes, 
            wickets_taken, runs_conceded, overs_bowled, maidens
        )
        SELECT 
            p_match_id,
            (rec->>'player_id')::UUID,
            (rec->>'team_id')::UUID,
            (rec->>'org_id')::UUID,
            COALESCE((rec->>'runs_scored')::INTEGER, 0),
            COALESCE((rec->>'balls_faced')::INTEGER, 0),
            COALESCE((rec->>'fours')::INTEGER, 0),
            COALESCE((rec->>'sixes')::INTEGER, 0),
            COALESCE((rec->>'wickets_taken')::INTEGER, 0),
            COALESCE((rec->>'runs_conceded')::INTEGER, 0),
            COALESCE((rec->>'overs_bowled')::NUMERIC, 0.0),
            COALESCE((rec->>'maidens')::INTEGER, 0)
        FROM jsonb_array_elements(p_player_stats) AS rec
        ON CONFLICT (match_id, player_id) DO UPDATE SET
            runs_scored = EXCLUDED.runs_scored,
            balls_faced = EXCLUDED.balls_faced,
            fours = EXCLUDED.fours,
            sixes = EXCLUDED.sixes,
            wickets_taken = EXCLUDED.wickets_taken,
            runs_conceded = EXCLUDED.runs_conceded,
            overs_bowled = EXCLUDED.overs_bowled,
            maidens = EXCLUDED.maidens;
    END IF;

    -- 3. Upsert Tournament Standings
    IF p_standings IS NOT NULL AND jsonb_array_length(p_standings) > 0 THEN
       INSERT INTO tournament_standings (
           tournament_id, team_id, matches_played, matches_won, matches_lost, matches_tied, no_result, points, net_run_rate
       )
       SELECT
           p_tournament_id,
           (rec->>'team_id')::UUID,
           COALESCE((rec->>'matches_played')::INTEGER, 0),
           COALESCE((rec->>'matches_won')::INTEGER, 0),
           COALESCE((rec->>'matches_lost')::INTEGER, 0),
           COALESCE((rec->>'matches_tied')::INTEGER, 0),
           COALESCE((rec->>'no_result')::INTEGER, 0),
           COALESCE((rec->>'points')::INTEGER, 0),
           COALESCE((rec->>'net_run_rate')::NUMERIC, 0.0)
       FROM jsonb_array_elements(p_standings) AS rec
       ON CONFLICT (tournament_id, team_id) DO UPDATE SET
           matches_played = EXCLUDED.matches_played,
           matches_won = EXCLUDED.matches_won,
           matches_lost = EXCLUDED.matches_lost,
           matches_tied = EXCLUDED.matches_tied,
           no_result = EXCLUDED.no_result,
           points = EXCLUDED.points,
           net_run_rate = EXCLUDED.net_run_rate;
    END IF;

    RETURN jsonb_build_object('success', true, 'message', 'Match finalized transactionally');
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;
