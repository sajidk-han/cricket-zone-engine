-- 015_team_logo_storage.sql
-- Create a new public storage bucket for team logos
-- Path structure: {org_id}/{team_id}/logo.webp

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'team-logos',
    'team-logos',
    true,
    5242880, -- 5MB limit
    ARRAY['image/png', 'image/jpeg', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS for team-logos bucket
-- 1. Public Read Access
DROP POLICY IF EXISTS "Public Read Access for team-logos" ON storage.objects;
CREATE POLICY "Public Read Access for team-logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'team-logos' );

-- 2. Authenticated Insert (Must be in the organization)
DROP POLICY IF EXISTS "Authorized Org Members can insert team-logos" ON storage.objects;
CREATE POLICY "Authorized Org Members can insert team-logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'team-logos' AND
    (storage.foldername(name))[1] IN (SELECT auth_user_orgs())
);

-- 3. Authenticated Update (Must be in the organization)
DROP POLICY IF EXISTS "Authorized Org Members can update team-logos" ON storage.objects;
CREATE POLICY "Authorized Org Members can update team-logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'team-logos' AND
    (storage.foldername(name))[1] IN (SELECT auth_user_orgs())
)
WITH CHECK (
    bucket_id = 'team-logos' AND
    (storage.foldername(name))[1] IN (SELECT auth_user_orgs())
);

-- 4. Authenticated Delete (Must be in the organization)
DROP POLICY IF EXISTS "Authorized Org Members can delete team-logos" ON storage.objects;
CREATE POLICY "Authorized Org Members can delete team-logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'team-logos' AND
    (storage.foldername(name))[1] IN (SELECT auth_user_orgs())
);
