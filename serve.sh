#!/usr/bin/env bash
#
# Local dev server.
#
# Every link on this site is root-relative (/about, /shared/assets/...), which
# is correct for GitHub Pages serving at a domain root. Reaching the site as a
# subdirectory instead (e.g. 192.168.1.107/jackewers/) breaks all of them:
# /about resolves to 192.168.1.107/about, not .../jackewers/about.
#
# A <base href> does NOT fix this - the URL spec has root-relative paths
# discard the base's path entirely, so only genuinely relative hrefs are
# affected. The fix has to be at the serving layer: make this directory the
# document root, which is exactly what this script does.
#
# Usage:  ./serve.sh [port]
set -euo pipefail

PORT="${1:-8080}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT"

# Best-effort LAN address, just for the printout.
LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
: "${LAN_IP:=localhost}"

cat <<BANNER
Serving $ROOT at http://0.0.0.0:$PORT

  http://${LAN_IP}:${PORT}/                 -> index
  http://${LAN_IP}:${PORT}/about/           -> about
  http://${LAN_IP}:${PORT}/certificates/    -> certificates
  http://${LAN_IP}:${PORT}/app/             -> projects

Root-relative links resolve here the same way they do on jackewers.com.
Ctrl-C to stop.
BANNER

exec python3 -m http.server "$PORT" --bind 0.0.0.0
