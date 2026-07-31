-- ====================================================================
-- PHASE 5: Auth Triggers, Real-time Setup, and RLS Re-activation
-- ====================================================================

-- 1. Enable Real-time for Public Scorecards (Safe addition)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE matches;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if already added
END;
$$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE match_events;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if already added
END;
$$;


-- 2. Trigger to automatically sync Auth Users to public.users and add them to Default Org
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  default_org_id UUID;
BEGIN
  -- Insert into public.users
  INSERT INTO public.users (id, auth_id, email, full_name)
  VALUES (
    gen_random_uuid(), 
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );

  -- Get or Create Default Org
  SELECT id INTO default_org_id FROM public.organizations ORDER BY created_at ASC LIMIT 1;
  IF default_org_id IS NULL THEN
    INSERT INTO public.organizations (name, slug) VALUES ('Default Organization', 'default-org') RETURNING id INTO default_org_id;
  END IF;

  -- Add user as Admin to Default Org
  INSERT INTO public.organization_members (org_id, user_id, role)
  VALUES (
    default_org_id, 
    (SELECT id FROM public.users WHERE auth_id = new.id), 
    'admin'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. Re-Enable RLS on Core Tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies (Simplified for V1: Authenticated Users can read/write everything in their org)

-- Helper function to get the current user's orgs
CREATE OR REPLACE FUNCTION auth_user_orgs()
RETURNS SETOF UUID AS $$
  SELECT org_id FROM public.organization_members 
  WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1);
$$ LANGUAGE sql STABLE;

-- Organizations (Users can see orgs they belong to)
DROP POLICY IF EXISTS "Users can view their orgs" ON organizations;
CREATE POLICY "Users can view their orgs" ON organizations FOR SELECT USING (id IN (SELECT auth_user_orgs()));

-- Tournaments (Users can view/edit tournaments in their orgs)
DROP POLICY IF EXISTS "Org members can read tournaments" ON tournaments;
CREATE POLICY "Org members can read tournaments" ON tournaments FOR SELECT USING (org_id IN (SELECT auth_user_orgs()));

DROP POLICY IF EXISTS "Org members can insert tournaments" ON tournaments;
CREATE POLICY "Org members can insert tournaments" ON tournaments FOR INSERT WITH CHECK (org_id IN (SELECT auth_user_orgs()));

-- Teams
DROP POLICY IF EXISTS "Org members can read teams" ON teams;
CREATE POLICY "Org members can read teams" ON teams FOR SELECT USING (org_id IN (SELECT auth_user_orgs()));

DROP POLICY IF EXISTS "Org members can insert teams" ON teams;
CREATE POLICY "Org members can insert teams" ON teams FOR INSERT WITH CHECK (org_id IN (SELECT auth_user_orgs()));

-- Public Match View (Anyone can read matches, only org members can write)
DROP POLICY IF EXISTS "Anyone can view live matches" ON matches;
CREATE POLICY "Anyone can view live matches" ON matches FOR SELECT USING (true); -- Required for Public Scorecard!

DROP POLICY IF EXISTS "Org members can edit matches" ON matches;
CREATE POLICY "Org members can edit matches" ON matches FOR ALL USING (org_id IN (SELECT auth_user_orgs()));

-- Match Events
DROP POLICY IF EXISTS "Anyone can view match events" ON match_events;
CREATE POLICY "Anyone can view match events" ON match_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Org members can insert events" ON match_events;
CREATE POLICY "Org members can insert events" ON match_events FOR ALL USING (
  match_id IN (SELECT id FROM matches WHERE org_id IN (SELECT auth_user_orgs()))
);
