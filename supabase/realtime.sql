-- Enable Realtime for content_pieces table
-- Run this in your Supabase SQL Editor

-- Enable replication for the table
ALTER PUBLICATION supabase_realtime ADD TABLE content_pieces;

-- Or create a specific publication for realtime
CREATE PUBLICATION content_updates FOR TABLE content_pieces;