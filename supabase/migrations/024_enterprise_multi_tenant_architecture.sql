-- Migration 024: Strict Multi-Tenant Isolation & Super Admin Architecture

-- 1. Create super_admins table
CREATE TABLE IF NOT EXISTS public.super_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES public.users(id)
);

-- 2. Create is_super_admin() function
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM public.super_admins sa
        JOIN public.users u ON sa.user_id = u.id
        WHERE u.auth_id = auth.uid()
    ) INTO is_admin;
    RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Seed admin@cricket.com as Super Admin (if they exist)
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

-- 4. Create Security Audit Logs Table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    organization_id UUID REFERENCES public.organizations(id),
    action VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Update Registration Flow (handle_new_user)
-- Fixes the critical bug where everyone was assigned to a shared Default Organization
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  new_org_id UUID;
  new_user_id UUID;
  org_name VARCHAR(255);
  org_slug VARCHAR(100);
BEGIN
  -- Insert into public.users
  INSERT INTO public.users (id, auth_id, email, full_name)
  VALUES (
    gen_random_uuid(), 
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  ) RETURNING id INTO new_user_id;

  -- Generate Unique Organization Name and Slug
  org_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)) || '''s Organization';
  org_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 8);

  -- Create Isolated Personal Organization
  INSERT INTO public.organizations (name, slug) 
  VALUES (org_name, org_slug) 
  RETURNING id INTO new_org_id;

  -- Add user as Owner to their new Isolated Org
  INSERT INTO public.organization_members (org_id, user_id, role)
  VALUES (new_org_id, new_user_id, 'owner');

  -- Log action
  INSERT INTO public.security_audit_logs (user_id, organization_id, action, metadata)
  VALUES (new_user_id, new_org_id, 'organization_created', jsonb_build_object('trigger', 'handle_new_user'));

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Existing Users Migration
-- Move users out of the shared 'default-org' or users with NO org into their own isolated orgs
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
        LEFT JOIN public.organization_members om ON u.id = om.user_id
        WHERE om.id IS NULL OR om.org_id = (SELECT id FROM public.organizations WHERE slug = 'default-org' LIMIT 1)
    LOOP
        -- Create isolated organization
        org_name := COALESCE(usr.full_name, split_part(usr.email, '@', 1)) || '''s Organization';
        org_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 8);
        
        INSERT INTO public.organizations (name, slug) 
        VALUES (org_name, org_slug) 
        RETURNING id INTO new_org_id;
        
        -- Delete old membership if they were in default-org
        DELETE FROM public.organization_members WHERE user_id = usr.id;
        
        -- Assign as Owner
        INSERT INTO public.organization_members (org_id, user_id, role)
        VALUES (new_org_id, usr.id, 'owner');

        -- Log
        INSERT INTO public.security_audit_logs (user_id, organization_id, action, metadata)
        VALUES (usr.id, new_org_id, 'organization_created', jsonb_build_object('migration', '024_existing_user'));
    END LOOP;
END $$;

-- 7. Implement Super Admin God Mode Policies
-- Super Admin can view and manage all core data.
CREATE POLICY "Super Admins can do everything on organizations" ON organizations FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on organization_members" ON organization_members FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on tournaments" ON tournaments FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on teams" ON teams FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on players" ON players FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on matches" ON matches FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on match_events" ON match_events FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on ball_events" ON ball_events FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super Admins can do everything on innings" ON innings FOR ALL USING (public.is_super_admin());
