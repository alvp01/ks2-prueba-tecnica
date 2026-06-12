#!/usr/bin/env bash
set -euo pipefail

echo "[backend] Ensuring database exists..."
npm run db:ensure

echo "[backend] Running migrations..."
npm run migrate

if [[ "${SEED_ON_START:-true}" == "true" ]]; then
  echo "[backend] Refreshing seed data..."
  npm run seed:undo
  npm run seed
fi

echo "[backend] Starting server..."
exec npm run start
