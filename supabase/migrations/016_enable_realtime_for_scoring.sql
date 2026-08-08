-- Add innings and ball_events to Supabase Realtime publication
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'innings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE innings;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'ball_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE ball_events;
    END IF;
END $$;

COMMIT;
