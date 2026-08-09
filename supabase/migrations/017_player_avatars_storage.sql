-- 017_player_avatars_storage.sql
-- 1. Ensure avatar_url exists and add avatar_updated_at
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_updated_at TIMESTAMP WITH TIME ZONE;

-- 2. Create a new public storage bucket for player avatars
-- Path structure: {org_id}/{player_id}/avatar.webp

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'player-avatars',
    'player-avatars',
    true,
    5242880, -- 5MB limit
    ARRAY['image/png', 'image/jpeg', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS for player-avatars bucket
-- 1. Public Read Access
DROP POLICY IF EXISTS "Public Read Access for player-avatars" ON storage.objects;
CREATE POLICY "Public Read Access for player-avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'player-avatars' );

-- 2. Authenticated Insert (Must be in the organization)
DROP POLICY IF EXISTS "Authorized Org Members can insert player-avatars" ON storage.objects;
CREATE POLICY "Authorized Org Members can insert player-avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'player-avatars' AND
    (storage.foldername(name))[1] IN (SELECT (auth_user_orgs())::text)
);

-- 3. Authenticated Update (Must be in the organization)
DROP POLICY IF EXISTS "Authorized Org Members can update player-avatars" ON storage.objects;
CREATE POLICY "Authorized Org Members can update player-avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'player-avatars' AND
    (storage.foldername(name))[1] IN (SELECT (auth_user_orgs())::text)
)
WITH CHECK (
    bucket_id = 'player-avatars' AND
    (storage.foldername(name))[1] IN (SELECT (auth_user_orgs())::text)
);

-- 4. Authenticated Delete (Must be in the organization)
DROP POLICY IF EXISTS "Authorized Org Members can delete player-avatars" ON storage.objects;
CREATE POLICY "Authorized Org Members can delete player-avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'player-avatars' AND
    (storage.foldername(name))[1] IN (SELECT (auth_user_orgs())::text)
);
