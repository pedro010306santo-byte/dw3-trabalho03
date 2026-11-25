ALTER TABLE piquete
    ADD COLUMN IF NOT EXISTS areausada numeric
    CHECK (areausada > 0 AND areausada < 'Infinity'::numeric);
