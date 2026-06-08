# wasp-constraints — Constraint Setup

Constraints enforce structural validity during aggregation — rejecting placements that
fail physics, adjacency, orientation, or boundary checks. This is the bridge between
generative form-finding and buildable architecture. **Requires AdvancedPart** (not basic Part).

## When to Use

- When the user mentions **structural**, **buildable**, **constrained**, **gravity**,
  **supported**, or **contained within**
- After wasp-parts (with AdvancedPart), before wasp-aggregate
- When aggregation should respect physical or spatial rules beyond connection compatibility
- Default ON for any architectural intent (Mode 1+)

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| AdvancedPart(s) | wasp-parts output | Basic Part does NOT support constraints |
| Constraint type | Design decision | Local (Mode 1) or Global (Mode 2) |
| Support geometry | Planes/meshes | For support checks |
| Collider geometry | Meshes (optional) | For collision checks |
| Boundary geometry | Plane or mesh | For containment checks |

## Constraint Modes

| Mode | Integer | Scope | What It Checks |
|------|---------|-------|----------------|
| **None** | 0 | — | No constraint checking (default) |
| **Local** | 1 | Per-part | Supports, colliders, adjacency, exclusion, orientation |
| **Global** | 2 | Whole aggregation | Plane boundaries, mesh volume containment |

**Modes 1 and 2 can be combined** — set Mode to the highest needed. Global mode
includes local checks.

## Local Constraint Types (Mode 1)

| Type | What It Does | Recipe ID |
|------|-------------|-----------|
| **Supports** | Part must contact ground or another supported part | `0780962c` |
| **Additional collider** | Extra collision geometry (tool clearance, spacing) | `8611659f` |
| **Adjacency** | Part must be adjacent to specific other parts | `823e6778` |
| **Exclusion** | Part must NOT be adjacent to specific other parts | `823e6778` |
| **Orientation** | Part orientation must fall within angular tolerance | `a848220a` |

## Global Constraint Types (Mode 2)

| Type | What It Does | Recipe ID |
|------|-------------|-----------|
| **Plane boundary** | Parts must stay on one side of a plane | `7b0ab1c4` |
| **Mesh containment** | Parts must stay inside a mesh volume | `ecc3bcfb` |

## Tool Call Pattern

### Pattern A: Support Constraints (Most Common for Architecture)

```python
# BATCH: Constraint Setup

# Step 1: Define support geometry (e.g., ground plane)
gh_execute_intent(intent="create plane parameter", x=900, y=500)
# → Record as $GROUND_PLANE
# Or reference existing Rhino geometry as support surface

# Step 2: Create Wasp supports component
gh_execute_intent(intent="create wasp supports", x=1100, y=500)
# → Record as $SUPPORTS
# Wire: $GROUND_PLANE → Supports.GEO

# Step 3: Wire supports to AdvancedPart (back in wasp-parts batch)
gh_connect(sourceGuid=$SUPPORTS, targetGuid=$PART_A, targetParam="SUP")

# Step 4: Set constraint mode on Aggregation
gh_set_value(guid=$CONSTRAINT_MODE, value=1)
# (Slider created in wasp-aggregate batch, wire to Aggregation.MODE)
```

### Pattern B: Additional Collider

```python
# Step 1: Collider geometry (mesh, slightly larger than part)
gh_execute_intent(intent="create mesh parameter", x=900, y=600)
# → Record as $COLLIDER_MESH

# Step 2: Wire to AdvancedPart
gh_connect(sourceGuid=$COLLIDER_MESH, targetGuid=$PART_A, targetParam="COL")
```

### Pattern C: Plane Boundary (Global)

```python
# Step 1: Boundary plane
gh_execute_intent(intent="create plane parameter", x=900, y=700)
# → Record as $BOUNDARY_PLANE

# Step 2: Create Wasp global constraint
gh_execute_intent(intent="create wasp global constraint plane", x=1100, y=700)
# → Record as $GLOBAL_CONSTRAINT
# Wire: $BOUNDARY_PLANE → GlobalConstraint.PLN

# Step 3: Wire to Aggregation
gh_connect(sourceGuid=$GLOBAL_CONSTRAINT, targetGuid=$AGGREGATION, targetParam="GC")

# Step 4: Set constraint mode to Global (2)
gh_set_value(guid=$CONSTRAINT_MODE, value=2)
```

### Pattern D: Mesh Containment (Global)

```python
# Step 1: Containment mesh (from Rhino)
gh_execute_intent(intent="create mesh parameter", x=900, y=700)
# → Record as $CONTAINMENT_MESH

# Step 2: Create Wasp global constraint mesh
gh_execute_intent(intent="create wasp global constraint mesh", x=1100, y=700)
# → Record as $GLOBAL_CONSTRAINT
# Wire: $CONTAINMENT_MESH → GlobalConstraint.MESH

# Step 3: Wire to Aggregation + set Mode 2
```

## Gotchas

1. **Requires AdvancedPart** — basic Part does not accept SUP or COL inputs.
   Cannot upgrade Part→AdvancedPart without full rewire. Choose in wasp-parts.
2. **Constraint Mode is an integer** — Mode 0=none, 1=local, 2=global. Default is 0.
   Must explicitly set to 1 or 2. Forgetting this means constraints are silently ignored.
3. **Constraints can stall aggregation** — if all valid placements are rejected, aggregation
   stops with fewer parts than requested. This is expected behavior, not an error.
   - Mitigation: start with fewer constraints, add progressively
   - Check "no valid placements" message — usually means constraints are too strict
4. **Adjacency vs exclusion** — same component (`823e6778`), different parameter.
   Adjacency = MUST be near; Exclusion = must NOT be near. Easy to mix up.
5. **Orientation constraint uses a line, not a plane** — defines an axis direction with
   angular tolerance (degrees). Parts whose orientation deviates more than tolerance are rejected.
6. **Support checking cascades** — a part is "supported" if it touches ground OR touches
   another supported part. Removal of a low part can invalidate parts above it.
7. **RESET required after constraint changes** — changing constraint mode, support geometry,
   or colliders requires aggregation RESET.

## Outputs

- `$SUPPORTS`, `$COLLIDER_MESH`, `$GLOBAL_CONSTRAINT` — constraint component GUIDs
- Constraint Mode slider wired to Aggregation.MODE
- Ready for: **wasp-aggregate** (constraints compose with rules and fields)
