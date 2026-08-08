-- =================================================================================
-- Enterprise Match Schema Expansion (v3.0)
-- Adds comprehensive match settings and lifecycle metadata
-- =================================================================================

-- 1. Add missing Enterprise fields to matches
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS match_number INTEGER,
ADD COLUMN IF NOT EXISTS match_stage VARCHAR(50) DEFAULT 'Group', -- Group, Qualifier, Eliminator, Semi Final, Final
ADD COLUMN IF NOT EXISTS scorer_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS umpire_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS referee_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS weather VARCHAR(100),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS public_visibility BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS featured_match BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id);

-- 2. Activity Timeline (For Audit and Notifications)
CREATE TABLE IF NOT EXISTS activity_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    entity_type VARCHAR(50) NOT NULL, -- 'match', 'tournament', 'team'
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'MatchScheduled', 'TossCompleted', etc.
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on Activity Timeline
ALTER TABLE activity_timeline ENABLE ROW LEVEL SECURITY;

-- Activity Timeline RLS Policies
CREATE POLICY "Read Org Activity" ON activity_timeline FOR SELECT 
USING (org_id IN (SELECT user_orgs()));

-- In the previous migrations, we forgot to add RLS policies for `teams`, `tournaments` etc.
-- Let's add standard Tenant Isolation policies for the core tables if they don't exist yet, 
-- but since this is local dev we might just add them for teams and tournaments.

CREATE POLICY "Tenant Isolation: Read Teams" ON teams FOR SELECT 
USING (org_id IN (SELECT user_orgs()) AND deleted_at IS NULL);

CREATE POLICY "Tenant Isolation: Read Tournaments" ON tournaments FOR SELECT 
USING (org_id IN (SELECT user_orgs()) AND deleted_at IS NULL);
