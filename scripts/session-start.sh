#!/usr/bin/env bash
# Rook Plugin — SessionStart hook
# Re-injects routed skill guidance after compaction or new session start.
# Follows the same pattern as Engram's build-blueprint-reminder.sh

set -euo pipefail

escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

context="Chirp component categories are available: planner, interpreter, critic, narrator, classifier, gate, editor. When creating Chirp components, use the /chirp skill for single components or /chirp-cascade for multi-component workflows. The chirp_create MCP tool REQUIRES a category parameter. Correction input pin and Reasoning output pin are auto-added to all components — do NOT include them in pins_in/pins_out.

Route Grasshopper work by need. For a clear, bounded build or modification, use /execute-grasshopper directly: admit the live document with a fresh snapshot, resolve exact components and ports, mutate only execution-owned state, and verify. For an ambiguous or open-ended brief, use the read-only /design-grasshopper skill and stop for the user's material decisions. /plan-grasshopper is an optional read-only stage for large, destructive, cross-session, preservation-sensitive, or high-risk work. Skills do not invoke the next stage automatically. When an admitted tool is hidden, use rook_tools_search, rook_tools_read, and rook_tools_call.

Other skill: /twisted-column (parametric columns)."

escaped=$(escape_for_json "$context")

echo "rook-session-start hook fired" >&2

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<EXTREMELY_IMPORTANT>\n${escaped}\n</EXTREMELY_IMPORTANT>"
  }
}
EOF
