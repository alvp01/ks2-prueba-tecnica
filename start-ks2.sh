#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/ks2-backend"
FRONTEND_DIR="$ROOT_DIR/ks2-frontend"

if [[ ! -d "$BACKEND_DIR" || ! -d "$FRONTEND_DIR" ]]; then
  echo "Error: ks2-backend or ks2-frontend folder not found in $ROOT_DIR"
  exit 1
fi

ensure_port_available() {
  local port="$1"

  if ! command -v lsof >/dev/null 2>&1; then
    echo "Warning: lsof is not installed. Port $port will not be auto-cleaned."
    return
  fi

  local pids
  pids="$(lsof -ti tcp:"$port" || true)"

  if [[ -z "$pids" ]]; then
    return
  fi

  echo "Port $port is in use. Stopping existing process(es)..."
  kill $pids 2>/dev/null || true
  sleep 1

  local still_used
  still_used="$(lsof -ti tcp:"$port" || true)"

  if [[ -n "$still_used" ]]; then
    echo "Port $port is still in use. Force stopping process(es)..."
    kill -9 $still_used 2>/dev/null || true
  fi
}

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

ensure_port_available 3000
ensure_port_available 5173

echo "Starting backend..."
npm run start &
BACKEND_PID=$!

# Give backend a short head-start before frontend attempts API calls.
sleep 2

echo "Starting frontend..."
cd "$FRONTEND_DIR"
npm run dev -- --port 5173 --strictPort &
FRONTEND_PID=$!

echo
echo "KS2 is running:"
echo "- Backend: http://localhost:3000"
echo "- Frontend: http://localhost:5173"
echo

wait "$BACKEND_PID" "$FRONTEND_PID"
