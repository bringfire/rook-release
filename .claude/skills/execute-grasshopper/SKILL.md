---
name: execute-grasshopper
description: |
  Execute a Grasshopper implementation plan by running MCP tool calls in
  batches with solve/error checkpoints between each batch. Use after
  /plan-grasshopper produces a plan doc, or when the user has an exact
  step-by-step tool call sequence to execute on the GH canvas.
argument-hint: "<path to plan doc>"
---

# Execute Grasshopper Definition

Execute an implementation plan by calling MCP tools in batches with verification checkpoints. This skill assumes all decisions have been made — it follows the plan exactly, adapting only when errors require course correction.

## The Process

### 1. Pre-flight Check

Before executing any tool calls:

```python
# Confirm Grasshopper is running
gh_status()

# Capture baseline canvas state
gh_snapshot()
```

Read the plan document from the argument path (resolve to absolute path first — `Read` requires absolute paths). Parse:
- The gotchas section (load into working memory for error handling)
- Each batch with its steps
- Checkpoint expectations
- Rollback strategy
- Success criteria

If the plan references an existing canvas state that doesn't match reality, stop and report the mismatch.

### 2. Initialize GUID Registry

Create a mapping from plan variable names to actual GUIDs:

```
GUID Registry:
  $RADIUS_SLIDER → (not yet assigned)
  $SPHERE        → (not yet assigned)
  ...
```

As each `gh_execute_intent` returns a GUID, update the registry. All subsequent tool calls that reference `$RADIUS_SLIDER` use the actual GUID from the registry.

### 3. Execute Batches

For each batch in the plan:

**Before the batch:**
- Announce: "Starting Batch N: <description> (N steps)"

**For each step:**

1. **`gh_execute_intent` calls:**
   - Execute with exact parameters from the plan
   - Capture the returned GUID
   - Map it in the GUID registry
   - If creation fails: check gotchas, attempt ONE fix, re-try
   - If still failing: mark as failed, skip wiring to this component

2. **`gh_set_value` calls:**
   - Execute immediately after the component it targets
   - Verify the value was set (check return)

3. **`gh_edit(connect=[...])` calls:**
   - Substitute actual short IDs from the registry for plan variable names
   - If either source or target is marked as failed: skip this connection
   - If connection fails: inspect both components with `gh_batch_component_info(names=[...])`

**At each checkpoint:**
```python
gh_solve(delay=500)
errors = gh_errors()
```

- **No errors:** Continue to next batch
- **Warnings only:** Note them, continue (warnings are usually acceptable)
- **Errors on a component:**
  1. Check if the error matches a gotcha from the plan
  2. If yes: apply the documented fix
  3. If no: inspect with `gh_batch_component_info(names=[<component_name>])`
  4. Attempt ONE fix (reconnect, change parameter, insert converter)
  5. Re-run checkpoint
  6. If error persists: log it and continue (unless it blocks downstream)

**After the batch:**
- Report: "Batch N complete: X components created, Y connections made, Z errors"

### 4. Error Escalation

Track consecutive errors. If **2 or more consecutive batches** have unresolved errors:
- Stop execution
- Report all accumulated errors to the user
- Suggest: which batch to roll back, what might fix the issue
- Wait for user guidance before continuing

### 5. Post-Execution

After all batches complete:

```python
# Auto-organize the canvas layout
gh_canvas_cleanup()

# Create visual groups as specified in the plan
gh_edit(epoch=<current>, groups=[
  {"action": "create", "nick": "Inputs", "colour": "#3366FF", "members": [...]},
  {"action": "create", "nick": "Processing", "colour": "#33AA66", "members": [...]},
  {"action": "create", "nick": "Output", "colour": "#FF8833", "members": [...]}
])

# Final verification
gh_solve(delay=500)
final_errors = gh_errors()
final_state = gh_snapshot()
```

**Report to user:**
```
Execution complete:
- Components created: 12
- Connections made: 15
- Groups created: 3
- Final errors: 0
- Canvas organized: yes

The definition should now show <success criteria from plan>.
```

### 6. Handoff to Consolidate

After reporting results:

**REQUIRED:** Invoke consolidate to record what was learned:
```python
Skill(skill="consolidate")
```

## Invariants

- **Never skip a checkpoint** — every batch must verify with solve + errors
- **Maintain the GUID registry** — plan variable → actual GUID, updated after every creation
- **If creation errors, don't wire** — skip connections to failed components
- **One fix attempt per error** — don't loop on the same error
- **2+ consecutive batch errors = stop** — ask user for guidance
- **Always canvas_cleanup before finishing** — even if there were errors
- **Report every batch** — the user should see progress, not just the final result

## Integration

**Cascades into:**
- **consolidate** (REQUIRED) — automatically invoked after execution completes

**Called by:**
- **plan-grasshopper** — after plan document is saved
- Direct user invocation (`/execute-grasshopper`)

## References

- See [checkpoint-protocol.md](./references/checkpoint-protocol.md) for error classification and recovery
