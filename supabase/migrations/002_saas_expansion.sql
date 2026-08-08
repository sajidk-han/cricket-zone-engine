-- =================================================================================
-- Premium Cricket Zone - SaaS Expansion (v4.0)
-- Adds organization status, super admins, and subscription/quota readiness
-- =================================================================================

-- 1. Add status to organizations for approval workflow
ALTER TABLE organizations ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
-- update existing organizations to approved to avoid breaking current data
UPDATE organizations SET status = 'approved' WHERE status = 'pending';

-- 2. Add super admin flag to users
ALTER TABLE users ADD COLUMN is_super_admin BOOLEAN DEFAULT false;

-- 3. Subscription Plans
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) DEFAULT 0.00,
    price_yearly DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Seed basic plans
INSERT INTO plans (name, slug, description, price_monthly) VALUES
('Free Tier', 'free', 'Basic features for small clubs', 0.00),
('Pro', 'pro', 'Advanced features for District Associations', 49.99),
('Enterprise', 'enterprise', 'Unlimited scaling for major tournaments', 199.99);

-- 4. Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    status VARCHAR(50) DEFAULT 'active', -- active, past_due, canceled
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Quotas (Defined per plan or per subscription override)
CREATE TABLE quotas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES plans(id),
    org_id UUID REFERENCES organizations(id), -- If overriding plan quotas
    max_users INTEGER DEFAULT 5,
    max_tournaments INTEGER DEFAULT 1,
    max_teams INTEGER DEFAULT 10,
    max_players INTEGER DEFAULT 150,
    max_live_matches INTEGER DEFAULT 1,
    max_storage_mb INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed quotas for Free Tier
INSERT INTO quotas (plan_id, max_users, max_tournaments, max_teams, max_players, max_live_matches, max_storage_mb)
SELECT id, 5, 1, 10, 150, 1, 50 FROM plans WHERE slug = 'free';

-- Seed quotas for Pro
INSERT INTO quotas (plan_id, max_users, max_tournaments, max_teams, max_players, max_live_matches, max_storage_mb)
SELECT id, 20, 5, 50, 1000, 5, 500 FROM plans WHERE slug = 'pro';

-- Seed quotas for Enterprise
INSERT INTO quotas (plan_id, max_users, max_tournaments, max_teams, max_players, max_live_matches, max_storage_mb)
SELECT id, 9999, 9999, 9999, 9999, 9999, 5000 FROM plans WHERE slug = 'enterprise';

-- 6. Usage Tracking (To enforce quotas)
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    entity_type VARCHAR(50) NOT NULL, -- 'users', 'tournaments', 'teams', 'players', 'storage'
    current_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(org_id, entity_type)
);

-- RLS & Permissions
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Plans are public readable
CREATE POLICY "Public Read Plans" ON plans FOR SELECT USING (true);

-- Users can read their org's subscriptions, quotas, and usage
CREATE POLICY "Read Org Subscriptions" ON subscriptions FOR SELECT USING (org_id IN (SELECT user_orgs()));
CREATE POLICY "Read Org Quotas" ON quotas FOR SELECT USING (org_id IN (SELECT user_orgs()) OR plan_id IN (SELECT plan_id FROM subscriptions WHERE org_id IN (SELECT user_orgs())));
CREATE POLICY "Read Org Usage" ON usage_tracking FOR SELECT USING (org_id IN (SELECT user_orgs()));
