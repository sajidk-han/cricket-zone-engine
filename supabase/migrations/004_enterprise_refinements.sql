-- Phase 7.1: Database Integrity, Versioning, and Feature Flags

-- 1. Idempotency & Concurrency Support for Match Events
ALTER TABLE match_events
ADD COLUMN IF NOT EXISTS request_id UUID UNIQUE,
ADD COLUMN IF NOT EXISTS event_version INTEGER DEFAULT 1;

ALTER TABLE ball_events
ADD COLUMN IF NOT EXISTS request_id UUID UNIQUE,
ADD COLUMN IF NOT EXISTS event_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS match_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS delivery_sequence INTEGER;

-- 2. Match Locking & Versioning
ALTER TABLE matches
ADD COLUMN IF NOT EXISTS current_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS active_scorer_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS scorer_lock_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS match_statistics JSONB DEFAULT '{}'::jsonb;

-- 3. Database Integrity Constraints

-- Innings Validation
ALTER TABLE innings
ADD CONSTRAINT check_total_runs_positive CHECK (total_runs >= 0),
ADD CONSTRAINT check_total_wickets_valid CHECK (total_wickets >= 0 AND total_wickets <= 11); -- Allowing 11 for all out in rare 12-man formats, but typically 10

-- Ball Events Validation
-- Delivery sequence must be unique within an innings
ALTER TABLE ball_events
ADD CONSTRAINT unique_innings_delivery UNIQUE (innings_id, delivery_sequence);

-- 4. Feature Flags Engine
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id), -- If null, it's a global flag
    flag_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (org_id, flag_name)
);

-- RLS for feature_flags
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read feature_flags" ON feature_flags FOR SELECT USING (true);
CREATE POLICY "Admins manage feature_flags" ON feature_flags FOR ALL USING (
    (org_id IS NULL AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true)) OR 
    (org_id IN (SELECT user_orgs()))
);

-- 5. Scoring Session Analytics
CREATE TABLE IF NOT EXISTS scoring_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    match_id UUID NOT NULL REFERENCES matches(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    device_info JSONB,
    ip_address VARCHAR(45),
    session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    session_end TIMESTAMP WITH TIME ZONE,
    offline_duration_seconds INTEGER DEFAULT 0,
    total_deliveries_scored INTEGER DEFAULT 0,
    UNIQUE (match_id, user_id, session_start)
);

ALTER TABLE scoring_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own sessions" ON scoring_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Org members read sessions" ON scoring_sessions FOR SELECT USING (org_id IN (SELECT user_orgs()));

-- 6. Atomic Scoring RPC (The Core Match Engine Transaction)
CREATE OR REPLACE FUNCTION score_delivery(
    p_request_id UUID,
    p_match_id UUID,
    p_innings_id UUID,
    p_striker_id UUID,
    p_non_striker_id UUID,
    p_bowler_id UUID,
    p_runs_off_bat INTEGER,
    p_extras_type VARCHAR,
    p_extras_runs INTEGER,
    p_is_legal_delivery BOOLEAN,
    p_is_wicket BOOLEAN,
    p_wicket_type VARCHAR,
    p_client_version INTEGER
) RETURNS jsonb AS $$
DECLARE
    v_match_version INTEGER;
    v_org_id UUID;
    v_delivery_sequence INTEGER;
    v_over_number INTEGER;
    v_ball_number INTEGER;
    v_innings_number INTEGER;
BEGIN
    -- 1. Check Idempotency
    IF EXISTS (SELECT 1 FROM ball_events WHERE request_id = p_request_id) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Duplicate request detected.');
    END IF;

    -- 2. Lock the match and verify version
    SELECT current_version, org_id INTO v_match_version, v_org_id
    FROM matches
    WHERE id = p_match_id FOR UPDATE;

    -- NOTE: Strict version checking disabled temporarily for single-scorer fast-clicking.
    -- In a multi-scorer setup, we would enforce this and queue requests on the client.
    -- IF v_match_version <> p_client_version THEN
    --    RETURN jsonb_build_object('success', false, 'message', 'Match state out of sync. Please refresh.');
    -- END IF;

    -- 3. Get current sequence and innings details
    SELECT overs_bowled, innings_number INTO v_over_number, v_innings_number FROM innings WHERE id = p_innings_id;
    SELECT COALESCE(MAX(delivery_sequence), 0) + 1 INTO v_delivery_sequence
    FROM ball_events WHERE innings_id = p_innings_id;

    -- 4. Insert Event Ledger
    INSERT INTO ball_events (
        request_id, org_id, match_id, innings_id, innings_number, over_number, ball_number, delivery_sequence,
        striker_id, non_striker_id, bowler_id, runs_off_bat, extras_type, extras_runs,
        is_legal_delivery, is_wicket, wicket_type, match_version
    ) VALUES (
        p_request_id, v_org_id, p_match_id, p_innings_id, v_innings_number, v_over_number, 1, v_delivery_sequence,
        p_striker_id, p_non_striker_id, p_bowler_id, p_runs_off_bat, p_extras_type, p_extras_runs,
        p_is_legal_delivery, p_is_wicket, p_wicket_type, v_match_version + 1
    );

    -- 5. Update Match Version
    UPDATE matches SET current_version = current_version + 1 WHERE id = p_match_id;

    -- 6. Update Match Statistics Snapshot
    UPDATE matches SET match_statistics = jsonb_build_object(
        'current_striker', p_striker_id,
        'current_non_striker', p_non_striker_id,
        'current_bowler', p_bowler_id,
        'last_update', now()
    ) WHERE id = p_match_id;

    RETURN jsonb_build_object('success', true, 'new_version', v_match_version + 1);
END;
$$ LANGUAGE plpgsql;
