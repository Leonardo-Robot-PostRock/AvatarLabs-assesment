-- Database Setup for Content Approval Engine
-- Run this in your Supabase SQL Editor

-- Create the content_pieces table
CREATE TABLE IF NOT EXISTS content_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  public_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by token
CREATE INDEX IF NOT EXISTS idx_content_pieces_public_token ON content_pieces(public_token);

-- Create index for sorting by created_at
CREATE INDEX IF NOT EXISTS idx_content_pieces_created_at ON content_pieces(created_at DESC);

-- Enable Row Level Security (optional - currently using public tokens for access)
-- ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (since we're using public_token for access)
-- Create a separate table later if you need authenticated admin access
-- DROP POLICY IF EXISTS "Allow all" ON content_pieces;
-- CREATE POLICY "Allow all" ON content_pieces FOR ALL USING (true) WITH CHECK (true);