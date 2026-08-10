-- Migration 023: Re-enable Row Level Security (RLS) on all core tables
-- This reverses the changes made in fix_permissions.sql which disabled RLS
-- and caused a critical security vulnerability where any user could view, update,
-- and delete any other user's data.

-- Re-enable RLS on all previously disabled tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE grounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ball_events ENABLE ROW LEVEL SECURITY;

-- We don't revoke the GRANT ALL from fix_permissions.sql because Supabase uses these roles natively (postgres, anon, authenticated, service_role).
-- RLS policies will act as the correct gatekeeper for row-level access.
