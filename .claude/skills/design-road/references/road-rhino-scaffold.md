# Road Rhino Scaffold — Creating Road Geometry from Scratch

When the user doesn't have existing geometry (Path B), Rook creates the road centerline
and supporting geometry using its Rhino tools before entering the RoadCreator pipeline.

This mirrors the Wasp Rhino scaffold: inspect → validate → organize → create → handoff.

---

## When This Applies

- User says "create a road" but the scene is empty
- User describes a path in words ("a road curving east then north")
- User wants to test road creation on fresh geometry

When the user already has a curve → skip to "Handoff to Pipeline" below.

---

## Step 1: Understand the Road Path

Extract from the user's description:
- **Direction changes** → number of PIs (Points of Intersection)
- **Approximate lengths** → tangent segment lengths
- **Curve tightness** → radius values for transitions
- **Elevation changes** → grades in percent or absolute heights
- **Context** → urban (tight turns, sidewalks) vs rural (sweeping, guardrails)

**Example mapping:**
```
"A road that goes straight for 200m, curves right, then straight for 150m"
→ 3 PIs: (0,0), (200,0), (200+R_offset, 150)
→ 1 transition at PI_2: R=150m, L=70m
→ Flat elevation (no terrain)
```

---

## Step 2: Create the Tangent Polygon

Build the baseline polyline from the user's description.

```python
# Create PI points
rhino_create(type="point", location="0,0,0")    # PI_1 (start)
rhino_create(type="point", location="200,0,0")  # PI_2 (direction change)
rhino_create(type="point", location="200,150,0") # PI_3 (end)

# Create tangent lines between PIs
rhino_create(type="line", start="0,0,0", end="200,0,0")
rhino_create(type="line", start="200,0,0", end="200,150,0")
```

**Or create as a polyline and let RC_TangentPolygon process it:**
```python
rhino_create(type="polyline", points=["0,0,0", "200,0,0", "200,150,0"])
```

**Important:** All points must be at Z=0 for horizontal alignment.

---

## Step 3: Layer Organization

Create the RoadCreator layer hierarchy before running commands:

```python
rhino_layer_create(name="RoadCreator")
rhino_layer_create(name="RoadCreator::Road_1")
rhino_layer_create(name="RoadCreator::Road_1::Tangent Polygon")
```

Move the tangent geometry to the correct layer:
```python
# After creating tangent lines, move them to the correct layer
rhino_execute_intent(intent="move objects to layer RoadCreator::Road_1::Tangent Polygon")
```

**Note:** RC_TangentPolygon creates its own layers. If you run it instead of manually
creating geometry, you can skip layer setup.

---

## Step 4: Elevation Strategy

Three approaches depending on available information:

### 4a. Flat Road (no terrain, no elevation data)
```python
# Create simple flat grade line in profile space
# X = chainage (m), Y = elevation × 10
# For a flat road at elevation 0:
rhino_create(type="line",
    start="0,0,0",
    end=f"{total_chainage},0,0")
```

### 4b. Constant Grade
```python
# For a 2% uphill grade over 350m, starting at elevation 100m:
# Start Y = 100 × 10 = 1000
# End Y = (100 + 350 × 0.02) × 10 = 1070
rhino_create(type="line",
    start="0,1000,0",
    end="350,1070,0")
```

### 4c. Variable Grade (with terrain)
```python
# Sample terrain elevations along the horizontal alignment
# This requires RC_LongitudinalProfile (Phase 5) to extract terrain profile
# Then design grade line to follow terrain with smoothing
```

---

## Step 5: Handoff to Pipeline

Once geometry exists in the correct layers, enter the standard pipeline:

```
Phase 1 done → tangent polygon on RoadCreator::Road_N::Tangent Polygon
Phase 2 done → grade line on RoadCreator::Road_N::Grade Line
→ Phase 3: RC_Assemble3DRoute (auto-detects)
→ Phase 4: rc_road_3d (MCP tool)
→ Phase 5-6: accessories via scripted commands
```

---

## Common Road Shapes

### Straight Road
```
PIs: 2 (start, end)
Transitions: 0
Grade: constant or flat
```
```python
rhino_create(type="line", start="0,0,0", end="500,0,0")
```

### Single Curve
```
PIs: 3 (start, apex, end)
Transitions: 1 clothoid pair (L=70, R=150)
```

### S-Curve
```
PIs: 4 (start, right turn, left turn, end)
Transitions: 2 clothoid pairs
```

### Roundabout Approach
```
PIs: 3+ with tight final curve
Transitions: R=50-80m (urban)
Needs: RC_Roundabout at terminus
```

### Highway On-Ramp
```
PIs: 3-4 with decreasing radius
Transitions: clothoid pairs, R=200→100m
Lane widening at merge
```

---

## Coordinate Conventions

- **Horizontal alignment:** X-Y plane, Z=0
- **Profile space:** X=chainage (m), Y=elevation×10, Z=0
- **3D route:** X-Y from horizontal, Z from profile (real elevation)
- **Units:** meters (RoadCreator assumes metric)
- **Orientation:** right-hand rule, Y=north convention typical

---

## Checklist Before Entering Pipeline

Before running Phase 3 (assembly), verify:

1. [ ] Tangent polygon exists on `RoadCreator::Road_N::Tangent Polygon` layer
2. [ ] All transition curves inserted (if needed) — no raw PI corners remaining
3. [ ] Grade line exists on `RoadCreator::Road_N::Grade Line` layer
4. [ ] Vertical curves inserted at grade changes (if needed)
5. [ ] Stationing points exist (created by RC commands)
6. [ ] `rc_roads()` returns the road name
