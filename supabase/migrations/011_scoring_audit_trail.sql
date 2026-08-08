-- 1. Create Event Status Enum
DO $$ BEGIN
    CREATE TYPE event_status_enum AS ENUM ('ACTIVE', 'UNDONE', 'VOID', 'CORRECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add event_status to ball_events
ALTER TABLE public.ball_events 
ADD COLUMN IF NOT EXISTS event_status event_status_enum DEFAULT 'ACTIVE' NOT NULL;

-- 3. Add match_version to matches
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS match_version INTEGER DEFAULT 1 NOT NULL;

-- 4. Create Audit Log Table
CREATE TABLE IF NOT EXISTS public.scoring_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    correlation_id UUID,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    ball_id UUID REFERENCES public.ball_events(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL, -- e.g., 'BALL_RECORDED', 'BALL_UNDONE'
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Enable RLS and Policies for Audit Log
ALTER TABLE public.scoring_audit_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Anyone can read audit logs" ON public.scoring_audit_log
        FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Service role can insert audit logs" ON public.scoring_audit_log
        FOR INSERT WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
