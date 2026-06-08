---
name: clean-layers
description: |
  Compare a Rhino file's layer structure against its .rook/conventions.yaml
  and propose cleanup changes. Audit-first, never destructive without approval.
  Triggers: "clean layers", "cleanup layers", "fix layers", "organize layers",
  "layer cleanup", "apply convention", "check layer standards", or when the
  user has a conventions.yaml and wants to bring a file into compliance.
---

# Clean Layers

Compare the currently open Rhino file's layer structure against the project's
`.rook/conventions.yaml` and propose targeted changes to bring it into
compliance. Never makes changes without user approval.

This is the **execution** side of the convention system. `/capture-convention`
captures the policy; this skill enforces it.

## Prerequisites

- A Rhino file must be open
- A `.rook/conventions.yaml` must exist in the project directory
  (created by `/capture-convention` or written by hand)
- Rook MCP tools must be available (`rhino_ping` returns pong)

If no conventions.yaml exists, tell the user: "No convention file found.
Run `/capture-convention` first to define your layer standards, or place
a `.rook/conventions.yaml` in your project directory."

## Workflow

### Step 0: Preflight

1. Call `rhino_ping`. If no response, stop.
2. Call `rhino_document` to get the file name and path.
3. Look for `.rook/conventions.yaml` relative to the file's directory.
   If the file is at `C:\Projects\MyProject\model.3dm`, check
   `C:\Projects\MyProject\.rook\conventions.yaml`. Also check the
   current working directory.
4. Read and parse the conventions.yaml. If it fails to parse, report
   the error and stop.
5. **Offer to create a backup copy.** Layer cleanup is a multi-step
   operation and Ctrl+Z may not cleanly revert everything. Offer:
   "Before making changes, I can save a backup copy of **{filename}**
   as **{filename_without_ext}_BACKUP.3dm** in the same directory.
   If anything goes wrong, you can delete the modified file and rename
   the backup. Create a backup? (recommended)"

   If the user accepts, use `rhino_command` or `rhino_execute` to
   `SaveAs` to the backup path, then `SaveAs` back to the original
   path so the working file stays at its original location. Or simply
   copy the .3dm file on disk before any Rhino mutations begin.

   If the user declines, proceed without backup — their choice.

6. Tell the user: "I'll compare **{filename}** against the **{convention name}**
   convention. This is an audit — no changes until you approve."

### Step 1: Scan

Call the audit tools to read the current file state:

1. `rhino_layers` — full layer tree with all properties
2. `rhino_layer_dependencies` — on layers that might be hard to delete
3. `rhino_block_layer_census` — which blocks reference which layers

You don't need `rhino_materials` or `rhino_linetypes` for layer cleanup
specifically, but call them if the convention file has material-related
rules.

### Step 2: Analyze — Build the Change Plan

Compare the current file state against each section of the convention.
Build a structured change plan organized by priority. Work through this
analysis internally — don't present raw comparisons to the user.

**Priority 1 — Missing required categories:**
Check each category in `conventions.categories` where `required: true`.
If the top-level layer doesn't exist, propose creating it.

**Priority 2 — Naming violations:**
- Check `naming.case` — are any layers not in the correct case?
- Check `naming.aia_prefixes` — do material layers have the right prefix?
- Skip layers under 05-COORDINATION (import policy: preserve naming)

**Priority 3 — Structural violations (reparenting):**
- Material layers at root level that should be under 01-ARCHITECTURE
- Option layers at root level that should be under 02-OPTIONS
- Entourage layers at root level that should be under 03-ENTOURAGE
- Utility layers at root level that should be under 04-UTILITY
- Revit import layers at root that should be under 05-COORDINATION
  (or merged into MATERIALS if `merge_revit_layers: true`)
- Stray layers (`Default`, `Layer0`, `Layer00`, `Fbx_Root`) — handle
  per `stray_toplevel_policy`
- Duplicate containers (`BLOCKS` + `A-BLOCKS`, `MATERIAL` + `MATERIALS`)

**Priority 4 — Revit layer handling:**
If `cleanup.merge_revit_layers: true`:
- For each Revit-coded layer (pattern: `X-_XXXX----_X`), check if there's
  a matching material layer it can merge into
- `A-_WALLPRTN_E` → candidate merge into `A-WALL`
- `A-_FLOR----_E` → candidate merge into `A-FLOOR`
- `A-_DOOR----_E` → stays as-is (no clear material equivalent) → 05-COORDINATION
- `S-_COLN----_E` → candidate merge into `S-STRUCTURE`
- For layers that CAN'T be merged, propose moving to 05-COORDINATION

**IMPORTANT:** Before proposing any merge or delete, check
`rhino_layer_dependencies` for that layer. If it has block definition
references, the merge will fail. Flag these with specific guidance:
"Layer X has geometry in block definition Y. Use `rhino_block_set_layers`
to remap block geometry before merging."

**Priority 5 — Empty layer cleanup:**
- Identify empty layers (objectCount == 0) not in `cleanup.protected_layers`
- Check dependencies — even empty layers can be held alive by block defs
- Propose deletion only for truly orphaned empty layers
- Respect `cleanup.orphan_policy` — if "report", only flag, don't propose delete

**Priority 6 — Block cleanup:**
- If `blocks.standard_container` is defined and a different container exists,
  propose consolidating (e.g., merge `BLOCKS` into `A-BLOCKS`)
- Report unused block definition count (376 in the Podium file) and suggest
  `rhino_block_purge` with `{"unused": true}`

### Step 3: Present the Change Plan

Present the plan grouped by priority, with counts:

```
## Layer Cleanup Report for {filename}

**Convention:** {convention name}

### Missing Categories (Priority 1)
- Create "01-ARCHITECTURE" (required, not found)
[or: All required categories present ✓]

### Naming Fixes (Priority 2)
{N} layers need case correction (→ UPPER)
{N} layers need AIA prefix added
[list the first 5-10, then "...and N more"]

### Structural Moves (Priority 3)
{N} layers to reparent:
- "MATERIALS" → rename to "01-ARCHITECTURE" or reparent under it
- "A-GLASS" → move under "01-ARCHITECTURE"
- "OPTIONS" → rename to "02-OPTIONS"
[list all proposed moves]

### Revit Layer Handling (Priority 4)
{N} Revit import layers found:
- Merge candidates: {list with proposed target}
- Containerize (no merge target): {list → 05-COORDINATION}
- Blocked by block refs: {list with block names}

### Empty Layer Cleanup (Priority 5)
{N} empty layers eligible for deletion
{N} empty layers protected by convention
{N} empty layers held alive by block definitions

### Block Cleanup (Priority 6)
{N} unused block definitions (suggest purge)
{N} block containers to consolidate
```

Then ask: **"Which changes should I apply? You can approve all, approve
by category (e.g., 'do naming and structural'), or reject specific items."**

### Step 4: Execute Approved Changes

Execute changes in dependency order — this matters:

1. **Create missing categories first** — other reparenting depends on them
   Use `rhino_layer_create_batch` for efficiency.

2. **Reparent layers** — use `rhino_layer_set_properties` with `parent`
   Do these before renames so paths resolve correctly.

3. **Rename layers** — use `rhino_layer_rename` or `rhino_layer_set_properties`
   with `rename`. Do after reparenting so parent paths are stable.

4. **Merge layers** — use `rhino_layer_merge` for layers being consolidated.
   Only after block geometry has been remapped if needed.

5. **Delete empty layers** — use `rhino_layer_delete` only on layers with
   no objects, no children, and no block references.

6. **Purge unused blocks** — `rhino_block_purge` with `{"unused": true}`
   Do last — it frees layers held by orphan block definitions.

After each batch, report what was done:
"Applied {N} changes: {summary}. {N} remaining."

If any operation fails, report the error and continue with the rest.
Don't stop the entire batch on a single failure.

### Step 5: Verify

After all changes are applied:

1. Call `rhino_layers` again to get the updated state
2. Compare against the convention one more time
3. Report remaining discrepancies:
   "Cleanup complete. {N} of {M} issues resolved. {remaining issues}."

If there are remaining issues (typically block-held layers or complex
merges), provide specific next-step guidance for each.

## Handling Edge Cases

- **No convention file:** Don't guess. Tell the user to run
  `/capture-convention` first. This skill requires explicit policy.

- **Convention references layers that don't exist:** That's fine — the
  convention is the target, not the current state. Propose creating
  missing layers.

- **Layer has geometry and needs merging:** Use `rhino_layer_move_objects`
  to move geometry to the target layer first, then delete the source.
  This is what `rhino_layer_merge` does atomically.

- **Block definition geometry on a layer being merged:** This is the
  hardest case. The layer can't be deleted until block geometry is
  remapped. Report this clearly with the specific block names and tell
  the user to remap with `rhino_block_set_layers` or accept the layer
  staying for now.

- **Current layer is in the cleanup list:** Can't delete or merge the
  current layer. Propose setting a different current layer first.

- **Very large file (500+ layers):** Break the report into pages.
  Present Priority 1-3 first, ask for approval, execute, then show
  Priority 4-6.

## Key Principles

- **Audit before action.** Never modify anything before presenting the
  full plan and getting approval.

- **Dependency order matters.** Create parents before reparenting children.
  Reparent before renaming. Merge after block geometry is remapped.

- **Fail gracefully.** If one operation fails, report it and continue.
  A partial cleanup is better than no cleanup.

- **Respect the convention.** Don't improvise beyond what the convention
  file specifies. If the convention says `orphan_policy: report`, report
  orphans but don't propose deleting them.

- **Block refs are the hard part.** Always check `rhino_layer_dependencies`
  before proposing any merge or delete. The dependency data is the
  difference between a clean operation and a "failed to delete" error.

- **This is a tool, not an opinion.** The convention file is the policy.
  This skill is the engine. Don't second-guess the user's conventions.
