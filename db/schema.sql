-- DEEP SEA HACKATHON SCHEMA
-- Last Updated: April 19, 2026

-- User profiles and their current progress
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    current_depth_meters INT DEFAULT 0,
    total_trash_collected INT DEFAULT 0
);

-- Catalog of all unlockable deep-sea trash
CREATE TABLE trash_catalog (
    id SERIAL PRIMARY KEY,
    zone_name TEXT NOT NULL,         -- 'Sunlight', 'Twilight', 'Midnight', etc.
    item_name TEXT NOT NULL,         -- 'Plastic Bottle', 'Fishing Net'
    impact_fact TEXT,                -- Educational info
    required_unlock_depth INT,       -- Depth at which it appears
    image_url TEXT                   -- Static asset URL
);

-- Verification log for user submissions
CREATE TABLE user_cleanups (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    trash_id INT REFERENCES trash_catalog(id),
    evidence_photo_url TEXT,         -- URL from Vercel Blob
    is_verified BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Marine life affected by each pollution item
CREATE TABLE marine_life (
    id SERIAL PRIMARY KEY,
    trash_id INT REFERENCES trash_catalog(id),
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    zone_name TEXT NOT NULL,
    how_affected TEXT NOT NULL,
    image_url TEXT
);