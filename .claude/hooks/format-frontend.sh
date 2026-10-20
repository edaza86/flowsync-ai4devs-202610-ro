#!/usr/bin/env bash
# PostToolUse (Write|Edit|MultiEdit): formatea con Prettier el fichero editado
# si está dentro de frontend/src/. Lee el JSON del hook por stdin.
set -euo pipefail

root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
file="$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')"

case "$file" in
  "$root"/frontend/src/*) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

prettier="$root/frontend/node_modules/.bin/prettier"
[ -x "$prettier" ] || { echo "Prettier no instalado: ejecuta 'npm install' en frontend/" >&2; exit 1; }

cd "$root/frontend"
"$prettier" --write --ignore-unknown --log-level warn "$file"
