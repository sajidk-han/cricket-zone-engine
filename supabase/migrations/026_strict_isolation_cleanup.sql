-- Migration 026: Strict Isolation Cleanup & Super Admin Fix

-- 1. Ensure admin@cricket.com is added to super_admins (even if created after Migration 024)
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM public.users WHERE email = 'admin@cricket.com' LIMIT 1;
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.super_admins (user_id) 
        VALUES (admin_user_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Optional: Automatically make admin@cricket.com a super admin whenever they register
CREATE OR REPLACE FUNCTION public.auto_assign_super_admin()
RETURNS trigger AS $$
BEGIN
    IF NEW.email = 'admin@cricket.com' THEN
        INSERT INTO public.super_admins (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_assign_super_admin ON public.users;
CREATE TRIGGER trigger_auto_assign_super_admin
AFTER INSERT ON public.users
FOR EACH ROW EXECUTE FUNCTION public.auto_assign_super_admin();

-- 2. Completely Eradicate 'USING (true)' Public Policies that leak data
DROP POLICY IF EXISTS "Anyone can view players" ON players;
DROP POLICY IF EXISTS "Anyone can view live matches" ON matches;
DROP POLICY IF EXISTS "Anyone can view match events" ON match_events;
DROP POLICY IF EXISTS "Anyone can view ball events" ON ball_events;
DROP POLICY IF EXISTS "Anyone can view ball_events" ON ball_events;
DROP POLICY IF EXISTS "Anyone can view innings" ON innings;

-- Drop ANY lingering permissive policies on core tables
DROP POLICY IF EXISTS "Public can view visible tournaments" ON tournaments;
DROP POLICY IF EXISTS "Public can view visible teams" ON teams;
DROP POLICY IF EXISTS "Public can view visible players" ON players;
DROP POLICY IF EXISTS "Public can view visible matches" ON matches;
DROP POLICY IF EXISTS "Public can view visible ball_events" ON ball_events;
DROP POLICY IF EXISTS "Public can view standings of visible tournaments" ON tournament_standings;

-- 3. Re-enforce Strict Tenant Isolation for SELECT (Read)
-- Tournaments
DROP POLICY IF EXISTS "Org members can read tournaments" ON tournaments;
CREATE POLICY "Org members can read tournaments" ON tournaments FOR SELECT 
USING (org_id IN (SELECT public.auth_user_orgs()) AND deleted_at IS NULL);

-- Teams
DROP POLICY IF EXISTS "Org members can read teams" ON teams;
CREATE POLICY "Org members can read teams" ON teams FOR SELECT 
USING (org_id IN (SELECT public.auth_user_orgs()) AND deleted_at IS NULL);

-- Players
DROP POLICY IF EXISTS "Org members can read players" ON players;
CREATE POLICY "Org members can read players" ON players FOR SELECT 
USING (org_id IN (SELECT public.auth_user_orgs()) AND deleted_at IS NULL);

-- Matches
DROP POLICY IF EXISTS "Org members can read matches" ON matches;
CREATE POLICY "Org members can read matches" ON matches FOR SELECT 
USING (org_id IN (SELECT public.auth_user_orgs()) AND deleted_at IS NULL);

-- 4. Move ANY remaining users out of Default Org just in case the previous migration missed them
DO $$
DECLARE
    usr RECORD;
    new_org_id UUID;
    org_name VARCHAR(255);
    org_slug VARCHAR(100);
BEGIN
    FOR usr IN 
        SELECT u.id, u.full_name, u.email 
        FROM public.users u
        JOIN public.organization_members om ON u.id = om.user_id
        WHERE om.org_id = (SELECT id FROM public.organizations WHERE slug = 'default-org' LIMIT 1)
    LOOP
        org_name := COALESCE(usr.full_name, split_part(usr.email, '@', 1)) || '''s Isolated Org';
        org_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 8);
        
        INSERT INTO public.organizations (name, slug) VALUES (org_name, org_slug) RETURNING id INTO new_org_id;
        
        DELETE FROM public.organization_members WHERE user_id = usr.id AND org_id = (SELECT id FROM public.organizations WHERE slug = 'default-org' LIMIT 1);
        
        INSERT INTO public.organization_members (org_id, user_id, role) VALUES (new_org_id, usr.id, 'owner');
    END LOOP;
END $$;
