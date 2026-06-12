#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/ks2-backend"
FRONTEND_DIR="$ROOT_DIR/ks2-frontend"

if [[ ! -d "$BACKEND_DIR" || ! -d "$FRONTEND_DIR" ]]; then
  echo "Error: ks2-backend or ks2-frontend folder not found in $ROOT_DIR"
  exit 1
fi

cleanup() {
  echo
  echo "Stopping applications..."
  jobs -pr | xargs -r kill
}
trap cleanup EXIT INT TERM

echo "Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install

echo "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install

echo "Running backend setup scripts..."
cd "$BACKEND_DIR"
npm run db:ensure
npm run migrate
npm run seed:undo
npm run seed

echo "Starting backend..."
npm run start &

# Give backend a short head-start before frontend attempts API calls.
sleep 2

echo "Starting frontend..."
cd "$FRONTEND_DIR"
npm run dev &

echo
echo "KS2 is running:"
echo "- Backend: http://localhost:3000"
echo "- Frontend: http://localhost:5173"
echo

wait -n
