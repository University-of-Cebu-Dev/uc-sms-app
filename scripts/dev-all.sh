#!/usr/bin/env bash
# Start Identity, SMS API, and this frontend together for local development.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UC_ROOT="$(cd "$ROOT/.." && pwd)"

IDENTITY_DIR="$UC_ROOT/uc-identity-service-api/UCIdentityService.Api"
API_DIR="$UC_ROOT/uc-sms-api/src/UCSMS.API"
APP_DIR="$ROOT"

for dir in "$IDENTITY_DIR" "$API_DIR" "$APP_DIR"; do
  if [[ ! -d "$dir" ]]; then
    echo "Missing project directory: $dir" >&2
    exit 1
  fi
done

PIDS=()

cleanup() {
  echo ""
  echo "Stopping all services..."
  for pid in "${PIDS[@]:-}"; do
    # Kill the process and any children (dotnet/node trees)
    pkill -P "$pid" 2>/dev/null || true
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting Identity  → https://localhost:7032"
(cd "$IDENTITY_DIR" && exec dotnet run --launch-profile https) &
PIDS+=($!)

echo "Starting SMS API   → https://localhost:7164"
(cd "$API_DIR" && exec dotnet run --launch-profile https) &
PIDS+=($!)

echo "Starting Frontend  → http://localhost:5173"
(cd "$APP_DIR" && exec npm run dev) &
PIDS+=($!)

echo ""
echo "All three running. Press Ctrl+C to stop."
wait
