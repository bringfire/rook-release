---
name: plan-grasshopper
description: |
  Convert a Grasshopper design document into a tactical implementation plan with
  exact MCP tool call sequences. Use after /design-grasshopper produces a design
  doc, or when the user has a clear specification for a GH definition to implement.
  Triggers on: "plan grasshopper", "implementation plan for GH", or when passed
  a design document path.
argument-hint: "<path to design doc>"
---

# Plan Grasshopper Definition

Convert a validated design document into an exact, executable sequence of MCP tool calls organized into batches with checkpoints.

The plan is the **contract between design and execution**. By the time execute-grasshopper runs, there should be zero decisions left — just tool calls. Every GUID lookup, gotcha workaround, and canvas position is resolved here.

## The Process

### 1. Load and Validate Design

Read the design document from the argument path. Resolve to an absolute path first (the `Read` tool requires absolute paths):
```python
Read(file_path="<absolute path to design doc>")
```

Validate that all required sections are present:
- [ ] Components table (with GUIDs or knowledge references)
- [ ] Inputs table (sliders, panels, toggles)
- [ ] Wiring table (from.param → to.param)
- [ ] Constraints (gotchas, data tree rules)
- [ ] Layout (canvas grouping)
- [ ] Success criteria

If any section is missing or ambiguous, ask the user before proceeding.

### 2. Knowledge Lookup Per Component

For each component in the design, query the knowledge store:

```python
gh_knowledge_query(intent="<component name>", depth="context")
```

Collect:
- **GUIDs** — exact component GUIDs from the knowledge store
- **Gotchas** — failure modes that affect wiring or parameter setting
- **Data tree behavior** — does this component graft/flatten/maintain tree structure?
- **Parameter names** — exact input/output parameter names (not guessed)

If a component has no knowledge store entry, fall back to:
```python
gh_library(search="<component name>")
```

### 3. Generate Tool Call Sequence

Organize into batches. Each batch is a logical unit (e.g., "input controls", "core processing", "output geometry").

**Format:**
```markdown
## BATCH 1: Input Controls (x=100)

### Step 1: Create Radius Slider
```python
gh_execute_intent(intent="create number slider named Radius", x=100, y=100)
```
→ Record GUID as `$RADIUS_SLIDER`
→ Expected: slider component on canvas

### Step 2: Set Radius Range
```python
gh_set_value(guid=$RADIUS_SLIDER, value=5.0, min=0.1, max=50.0)
```

### Step 3: Create Height Slider
```python
gh_execute_intent(intent="create number slider named Height", x=100, y=200)
```
→ Record GUID as `$HEIGHT_SLIDER`

### Step 4: Set Height Range
```python
gh_set_value(guid=$HEIGHT_SLIDER, value=10.0, min=1.0, max=100.0)
```

---

## BATCH 2: Core Components (x=400)

### Step 5: Create Sphere
```python
gh_execute_intent(intent="create sphere component", x=400, y=100)
```
→ Record GUID as `$SPHERE`

### Step 6: Wire Radius to Sphere
```python
gh_edit(epoch=<current>, connect=["$RADIUS_SLIDER.O0>$SPHERE.I0"])
```

### CHECKPOINT
```python
gh_solve(delay=500)
gh_errors()
```
→ Expected: no errors, sphere visible in viewport with radius=5
→ If errors: check gotchas section, attempt fix, retry once
→ If still failing: stop and report

---

## BATCH N: Finalize

### Step N-1: Auto-organize canvas
```python
gh_canvas_cleanup()
```

### Step N: Group components
```python
gh_edit(epoch=<current>, groups=[
  {"action": "create", "nick": "Inputs", "colour": "#3366FF", "members": ["$RADIUS_SLIDER", "$HEIGHT_SLIDER"]},
  {"action": "create", "nick": "Geometry", "colour": "#33AA66", "members": ["$SPHERE", ...]}
])
```
```

### 4. Write Gotchas Section

At the top of the plan, list all gotchas that affect execution:

```markdown
## Gotchas (apply during execution)

1. **Sweep1 requires open curves** — if input curve is closed, Split it first
2. **Number Slider min/max set AFTER creation** — gh_set_value must follow gh_execute_intent
3. **Data tree mismatch** — Flatten output of List component before connecting to Loft
```

### 5. Write Rollback Strategy

```markdown
## Rollback

If a batch fails and cannot be recovered:
1. Delete all components created in the failing batch:
   ```python
   gh_delete(guids=[$COMP1, $COMP2, ...])
   ```
2. Re-attempt the batch with adjusted parameters
3. If second attempt fails, stop and report to user
```

### 6. Canvas Position Strategy

Use consistent spacing:
- **Horizontal:** 300px between connected components (left to right = data flow)
- **Vertical:** 150px between parallel branches
- **Group spacing:** 100px gap between groups
- **Input column:** x=100
- **Processing columns:** x=400, x=700, x=1000 (as needed)
- **Output column:** rightmost

### 7. Write Plan Document

Save to:
```
docs/plans/YYYY-MM-DD-<name>-plan.md
```

**Document structure:**
```markdown
# <Definition Name> Implementation Plan

> **For Claude:** Use /execute-grasshopper to execute this plan.
> **Design doc:** <path to design doc>

## Gotchas
[Critical gotchas that affect execution]

## Rollback Strategy
[How to recover from batch failures]

## BATCH 1: <description>
[Steps with exact tool calls]

## CHECKPOINT
[Solve + errors check]

## BATCH 2: <description>
[Steps with exact tool calls]

...

## FINALIZE
[Canvas cleanup + grouping]

## Success Criteria
[What to verify at the end — from design doc]
```

### 8. Handoff

**Announce:** "Plan saved to `docs/plans/<filename>`. Proceeding to execute."

**REQUIRED:** Invoke the execute skill:
```python
Skill(skill="execute-grasshopper", args="docs/plans/<filename>")
```

## Invariants

- Every `gh_execute_intent` must have explicit `x, y` canvas positions
- Every slider gets `gh_set_value` immediately after creation
- Checkpoints (`gh_solve` + `gh_errors`) after every 3-5 component creations
- Variable names must be descriptive (`$SPHERE_COMP`, not `$VAR1`)
- No tool call may reference a GUID not assigned in a prior step
- The plan MUST end with `gh_canvas_cleanup()` + `gh_edit(groups=[...])` calls
- Wiring uses exact parameter names from knowledge store, never guessed

## Integration

**Cascades into:**
- **execute-grasshopper** (REQUIRED) — automatically invoked after plan is saved

**Called by:**
- **design-grasshopper** — after design document is validated
- Direct user invocation (`/plan-grasshopper`)

## References

- See [tool-call-patterns.md](./references/tool-call-patterns.md) for common tool call sequences
- See [wasp/](./references/wasp/) for Wasp discrete aggregation sub-skills — load when the design doc contains Wasp components, aggregation, or any concept from the Wasp domain context. Sub-skills are atomic plan fragments composable in sequence:
  - **Core (every Wasp workflow):** [wasp-parts.md](./references/wasp/wasp-parts.md), [wasp-rules.md](./references/wasp/wasp-rules.md), [wasp-aggregate.md](./references/wasp/wasp-aggregate.md)
  - **Optional layers:** [wasp-field.md](./references/wasp/wasp-field.md), [wasp-constraints.md](./references/wasp/wasp-constraints.md), [wasp-catalog.md](./references/wasp/wasp-catalog.md)
  - **Advanced:** [wasp-hierarchy.md](./references/wasp/wasp-hierarchy.md), [wasp-grammar-aggregate.md](./references/wasp/wasp-grammar-aggregate.md)
  - **Post-processing:** [wasp-save-load.md](./references/wasp/wasp-save-load.md), [wasp-learn.md](./references/wasp/wasp-learn.md), [wasp-disco-export.md](./references/wasp/wasp-disco-export.md)
