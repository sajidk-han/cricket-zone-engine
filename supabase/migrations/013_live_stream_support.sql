-- Migration 013: Live Stream Support
-- Adds a text column for live_stream_url to public.matches

ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS live_stream_url TEXT NULL;
