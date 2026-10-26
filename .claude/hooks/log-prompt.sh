#!/usr/bin/env bash
# UserPromptSubmit: añade cada prompt, tal cual se lanzó, al final de docs/prd/prompts.md.
# PROMPTS_FILE permite apuntar a otro fichero (para probar el hook).
input=$(cat)
file="${PROMPTS_FILE:-$CLAUDE_PROJECT_DIR/docs/prd/prompts.md}"
[ -f "$file" ] || exit 0

prompt=$(jq -r '.prompt // empty' <<<"$input")
[ -n "$prompt" ] || exit 0

# El modelo no viene en el input del hook: se toma del último mensaje del asistente en el transcript.
transcript=$(jq -r '.transcript_path // empty' <<<"$input")
model=""
if [ -f "$transcript" ]; then
  model=$(jq -r 'select(.message.model? and .message.model != "<synthetic>") | .message.model' "$transcript" 2>/dev/null | tail -n 1)
fi

n=$(( $(grep -c '^## Prompt ' "$file") + 1 ))
fence='```'
while grep -qF "$fence" <<<"$prompt"; do fence="$fence\`"; done

printf '\n## Prompt %d\n\n**Modelo:** %s\n**Herramienta:** Claude Code\n\n%s\n%s\n%s\n' \
  "$n" "${model:-desconocido}" "$fence" "$prompt" "$fence" >>"$file"
exit 0
