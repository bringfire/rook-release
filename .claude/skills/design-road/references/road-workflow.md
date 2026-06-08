# Road Design Workflow — 6-Phase Pipeline

Condensed reference for the `/design-road` skill. Each phase builds on the previous.
Source: RoadCreator WORKFLOW.md.

---

## Phase 1: Horizontal Alignment (2D, Z=0)

**Goal:** Define the road's path in plan view.

### Step 1.1 — Tangent Polygon

The tangent polygon is a polyline of straight tangent segments between Points of Intersection (PIs). Each PI is where the road changes direction.

**Scripted command:**
```
_-RC_TangentPolygon <click points> _Enter
```

**Outputs:**
- Layer: `RoadCreator::Road_N::Tangent Polygon`
- Named segments: `Road_N 1`, `Road_N 2`, etc.
- ZU (start) marker at first point with chainage label

**If creating programmatically (Path B):**
1. Create a polyline from the user's description using `rhino_create`
2. Place on appropriate layer
3. Or: provide the curve and let RC_TangentPolygon process it

### Step 1.2 — Transition Curves

Insert a smooth transition between each pair of adjacent tangent segments.

**Clothoid (Euler spiral) — preferred:**
```python
# Compute geometry (pure math, no document change)
rc_clothoid(L=70, R=150)
# Returns: points[], largeTangent, shift, xs

# Create in document (scripted command)
# Pre-select two tangent segments, then:
rhino_command(command="_-RC_Clothoid 70 150 _Enter")
```

**Cubic parabola — alternative:**
```python
rc_cubic_parabola(L=60, R=200)  # Constraint: L < 2R
```

**Transition parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| L | 70 m | Transition curve length |
| R | 150 m | Circular arc radius |

**Outputs:**
- Joined curve replacing tangent segments
- Stationing points: ZP (transition start), PO (arc start), OP (arc end), KP (transition end)

**After Phase 1:** Continuous horizontal alignment curve with stationing points.

---

## Phase 2: Vertical Alignment (Profile Space)

**Goal:** Define the road's elevation profile.

**Coordinate system:** X = chainage (m), Y = elevation × 10 (10:1 vertical exaggeration).

### Step 2.1 — Elevation Polygon

Grade segments defining slope changes in profile space.

**Scripted:**
```
_-RC_ElevationPolygon _Enter
```

**Outputs:**
- Layer: `RoadCreator::Road_N::Grade Line`
- Named segments: `Road_N grade 1`, `Road_N grade 2`, etc.
- Slope labels at segment midpoints

### Step 2.2 — Vertical Curves

Smooth parabolic curves at grade transitions.

```python
# Compute (pure math)
rc_vertical_curve(R=2000, grade1=2.5, grade2=-1.5, vertexChainage=500, vertexElevation=105)
# Returns: profilePoints[], ZZ/V/KZ points, tangentLength, sag/crest flag

# Create in document
rhino_command(command="_-RC_ParabolicCurve 2000 _Enter")
```

**Parameters:**
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| R | 2000 m | 50–100,000 | Vertical curve radius |

**Curve type:** sag (grade1 < grade2, concave up) or crest (grade1 > grade2, convex up)

**After Phase 2:** Continuous grade line in profile space.

---

## Phase 3: 3D Route Assembly

**Goal:** Merge horizontal + vertical into a single 3D centerline.

**Preferred — scripted command (auto-detects from layers):**
```python
rhino_command(command="_-RC_Assemble3DRoute _Enter")
```

**Alternative — computation tool (if you have the raw data):**
```python
rc_assemble_route(
    horizontalPoints=[{"x": 0, "y": 0, "z": 0}, ...],
    elevations=[100.0, 100.5, 101.2, ...]
)
```

**Algorithm:**
1. Divide horizontal curve into 2m stations
2. At each station: sample grade line at that chainage
3. Convert profile Y to real elevation: Z = datum + profile_Y / 10
4. Interpolate cubic spline through 3D points
5. Project stationing points to 3D

**Outputs:**
- Layer: `RoadCreator::Road_N::3D Route`
- Curve: `Road_N 3D_route`
- Important points on sublayer (all stationing in 3D)

**After Phase 3:** 3D centerline curve — the rail for road surface generation.

---

## Phase 4: 3D Road Surface

**Goal:** Generate complete road surface by sweeping cross-sections.

**Two paths — MCP tool vs scripted command:**

**Path A: MCP tool `rc_road_3d`** (simpler, fewer outputs):
```python
rc_road_3d(
    road="Road_1",
    category="S 7.5",      # Exact format from rc_standards() — spaces + dots required
    crossfallStraight=2.5,  # % banking on straights
    crossfallCurve=4.0,     # % superelevation in curves
    includeVerge=False
)
```
- Uses Loft at ~5m station intervals
- Creates road BREP only — **no boundary curves**
- Layer: `RoadCreator::Road_N::3D Road`

**Path B: Scripted command `RC_Road3D`** (full output):
```python
rhino_command(command="_-RC_Road3D _Enter")
```
- Uses SweepOneRail at 2m station intervals (finer resolution)
- Creates road BREP + boundary curves + cross-section profiles
- Outputs:
  - Surface BREP: `Road_N 3D_model`
  - Boundary curves: `Road_N boundary` (left and right edges)
  - Cross-sections on locked sublayer

**Use Path B when accessories are planned** — guardrails, poles, slopes all require boundary curves.

**To generate a section (subset) instead:**
```python
rhino_command(command="_-RC_Road3DSection _Enter")
```

**After Phase 4:** 3D road surface on `RoadCreator::Road_N::3D Road` layer. Boundary curves exist only from Path B.

---

## Phase 5: Terrain & Slopes (Optional)

Requires a terrain surface/mesh in the scene.

### Longitudinal Profile
```python
rhino_command(command="_-RC_LongitudinalProfile _Enter")
```
Projects route onto terrain → 2D terrain profile in profile space.

### Slopes (Earthworks)
```python
rhino_command(command="_-RC_Slopes _Enter")
```
Generates cut/fill slopes from road edges to terrain. Default slope ratio: 1:1.75.

Parameters: fill slope, cut slope, ditches (yes/no), ditch depth, ditch width.

---

## Phase 6: Accessories & Landscape (Optional)

All accessory commands operate on the boundary curves from Phase 4.

### Safety Equipment
| Command | Description | Key Input |
|---------|-------------|-----------|
| `RC_GuardrailSingle` | W-beam guardrail, one side | Boundary curve + direction |
| `RC_GuardrailDouble` | Both sides | Center line curve |
| `RC_ConcreteBarrier` | Concrete posts + rods | Guide curve, spacing (2.5m) |
| `RC_DeltaBlokBarrier` | Delta Blok barrier | Guide curve, variant |
| `RC_RoadPolesSingle` | Delineator poles, one side | Edge curve |
| `RC_RoadPolesDouble` | Both sides | Two edge curves |

### Urban Elements
| Command | Description |
|---------|-------------|
| `RC_Sidewalk` | Raised curb + sidewalk (0.2m curb) |
| `RC_ZebraCrossing` | Striped crossing (0.5m stripes) |
| `RC_Roundabout` | Full roundabout with arms |
| `RC_SimpleIntersection` | Multi-arm intersection |

### Landscape
| Command | Description |
|---------|-------------|
| `RC_Forest` | Grid-based tree placement |
| `RC_ForestSilhouette` | 3-row tree line along edge |
| `RC_Grass` | Grass patches along edge |
| `RC_UtilityPoles` | Poles at 10m spacing |
| `RC_TrafficSign` | Sign from database |

---

## Layer Hierarchy

Every road produces this structure:
```
RoadCreator/
  Road_N/
    Tangent Polygon/           — tangent segments
      Stationing/              — tick marks, labels (locked)
        Stationing Points/     — ZU, ZP, PO, OP, KP (locked)
      Legend/                  — curve annotations (locked)
    Grade Line/                — grade segments
      Stationing/              — distance & slope labels (locked)
      Important Points/        — ZZ, V, KZ (locked)
    3D Route/                  — 3D centerline
      Important Points/        — all stationing in 3D
      Points/                  — station points every 2m
    3D Road/                   — road surface, boundary curves
      Cross Sections/          — profile polylines (locked)
    Slopes/                    — earthwork surfaces
    Guardrail/                 — guardrail geometry
    RoadPoles/                 — delineator poles
    ...                        — other accessories
```

---

## Object Naming Convention

```
Road_1 1 R ZP 45.000000
  │    │ │ │  └── chainage (m, 6 decimal places)
  │    │ │ └── type code (ZU/ZP/PO/OP/KP/ZZ/V/KZ)
  │    │ └── side (R=right, L=left, LM/PM=transitions)
  │    └── segment index
  └── road name
```
