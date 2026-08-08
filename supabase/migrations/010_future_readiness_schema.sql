-- Migration 010: Future Readiness Schema
-- Prepares the database for Media, Awards, Analytics, and Fan Accounts

-- 1. Generic Awards Engine
CREATE TABLE IF NOT EXISTS tournament_awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    tournament_id UUID NOT NULL REFERENCES tournaments(id),
    name VARCHAR(255) NOT NULL, -- e.g., 'Orange Cap', 'Player of Tournament'
    description TEXT,
    award_type VARCHAR(100), -- 'batting', 'bowling', 'fielding', 'mvp'
    criteria_json JSONB, -- Engine rules for auto-calculation
    winner_player_id UUID REFERENCES players(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(tournament_id, name)
);

ALTER TABLE tournament_awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view awards of visible tournaments" ON tournament_awards FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM tournaments t WHERE t.id = tournament_awards.tournament_id AND t.visibility IN ('public', 'unlisted')
    ));

-- 2. Media Assets (Gallery, Documents, Sponsors)
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    entity_type VARCHAR(50) NOT NULL, -- 'tournament', 'player', 'team', 'match'
    entity_id UUID NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'photo', 'video', 'document', 'sponsor_logo'
    url TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for polymorphic queries
CREATE INDEX idx_media_assets_entity ON media_assets(entity_type, entity_id);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
-- Media visibility relies on the parent entity visibility which we can enforce in the app tier or via complex RLS.
-- For simplicity, public can view media if they know the URL, but querying requires a basic policy.
CREATE POLICY "Anyone can view media assets" ON media_assets FOR SELECT USING (true);

-- 3. Public Analytics (Page Views Tracking)
CREATE TABLE IF NOT EXISTS public_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    entity_type VARCHAR(50) NOT NULL, -- 'tournament', 'player', 'team', 'match'
    entity_id UUID NOT NULL,
    view_count BIGINT DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(entity_type, entity_id)
);

ALTER TABLE public_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view analytics" ON public_analytics FOR SELECT USING (true);
CREATE POLICY "Anyone can increment analytics" ON public_analytics FOR UPDATE USING (true);
-- In production, updates to analytics should ideally go through an RPC function to prevent abuse.

-- 4. Fan Accounts (Stub for future Fan features)
CREATE TABLE IF NOT EXISTS fan_profiles (
    id UUID PRIMARY KEY, -- links to auth.users
    username VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    favorite_team_id UUID REFERENCES teams(id),
    favorite_player_id UUID REFERENCES players(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fan_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id UUID NOT NULL REFERENCES fan_profiles(id),
    entity_type VARCHAR(50) NOT NULL, -- 'tournament', 'team', 'player'
    entity_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(fan_id, entity_type, entity_id)
);
