-- Initialize database with UTF-8 support and Thai collation
-- This script runs automatically when PostgreSQL container starts

-- Set timezone to Bangkok
SET timezone = 'Asia/Bangkok';

-- Create extensions for better performance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for common queries (will be created by Prisma but we can optimize)
-- These are just examples - Prisma will handle the actual index creation
