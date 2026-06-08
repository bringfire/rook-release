# Wasp Domain Context

Reference for the explore phase when the user's intent involves discrete aggregation
with the Wasp plugin. Load this alongside `explore-checklist.md` — it extends, not
replaces, the standard explore flow.

## Intent Detection

Load this context when the user mentions any of:

**Direct triggers:** wasp, discrete aggregation, modular assembly, connection rules,
stochastic aggregation, part-based design, aggregation rules

**Indirect triggers:** LEGO-like, snap-together, modular facade, modular housing,
discrete components, tessellation with rules, panel system with connections,
building blocks, habitat-style modules, plug-in architecture

**Advanced triggers:** graph grammar aggregation, hierarchical assembly, field-driven
placement, constraint-based aggregation, rules from aggregation, DisCo, VR assembly

---

## Concept Map

Wasp builds assemblies from discrete Parts that snap together at Connections
governed by Rules. Every Wasp workflow follows this core chain:

```
Geometry → Connections → Parts → Rules → Aggregation
```

Everything else (fields, constraints, hierarchy, grammar) modifies *how*
aggregation happens. Here's the full map:

```
                    ┌── RuleGenerator (auto-generate)
                    │       ├── basic (all-to-all)
Geometry ─→ Connections ─→ Parts ─→ Rules ──┤       ├── typed (connection types filter)
   │            │           │       │       └── grammar (explicit control)
   │            │           │       │
   │            │           │       ├── Rules From Aggregation (reverse-engineer)
   │            │           │       │
   │            │           ▼       ▼
   │            │     AdvancedPart ─→ Constraints
   │            │        │              ├── Local (Mode 1): supports, colliders,
   │            │        │              │   adjacency, exclusion, orientation
   │            │        │              └── Global (Mode 2): plane, mesh boundaries
   │            │        │
   │            │        └─→ Hierarchy (sub-parts + macro parts)
   │            │
   │            └─→ Part Catalog (distribution ratios)
   │
   └─→ Fields (influence placement)
         ├── from points/attractors
         ├── from curves
         ├── from surfaces
         ├── from expressions
         ├── from physics (Kangaroo)
         ├── multi-channel
         ├── orientable
         ├── volumetric
         └── save/load fields
```

### Aggregation Engines

Wasp has **two** aggregation engines — the choice is fundamental:

| Engine | When to Use | Behavior |
|--------|-------------|----------|
| **Stochastic** | Exploration, form-finding, organic patterns | Random placement from valid options. Needs fixed seed for reproducibility. |
| **Graph-Grammar** | Construction sequences, deterministic assembly, architectural programs | Each step follows a production rule. Inherently deterministic. |

**Default to stochastic** unless the user needs deterministic sequencing or
explicitly mentions grammar, sequence, or construction order.

---

## Decision Tree

Walk this tree based on the user's intent to select the right concept set.
At each leaf, the listed recipes demonstrate the pattern.

```
User intent
│
├── "Basic assembly" / "simple" / "stochastic"
│   Concepts: Parts, Connections, Rules, Stochastic Aggregation
│   Recipes: 098491b7 (basic), e1ce3524 (rule grammar)
│   Sub-skills: wasp-parts → wasp-rules → wasp-aggregate
│
├── "Multiple part types" / "variety" / "catalog" / "distribution"
│   Concepts: + Part Catalog, + Attributes
│   Recipes: 16f4319f (attributes), fe3d267c (catalog)
│   Sub-skills: + wasp-catalog
│
├── "Field-driven" / "gradient" / "density" / "attractor"
│   Concepts: + Fields
│   ├── Points/attractors → 7bb677d9 (field basics)
│   ├── Curves → 9d5169fc (field from curves)
│   ├── Surfaces → 084bb2d5 (field from surface)
│   ├── Math expression → da63ff29 (field from expression)
│   ├── Physics/Kangaroo → 8f250f41 (field from Kangaroo)
│   └── Multi-channel → 35afaaf5 (multi-channel field)
│   Sub-skills: + wasp-field
│
├── "Structural" / "buildable" / "constrained"
│   Concepts: + Constraints (requires AdvancedPart)
│   ├── Supports (gravity, ground contact) → 0780962c
│   ├── Extra colliders (tool clearance) → 8611659f
│   ├── Adjacency/exclusion rules → 823e6778
│   ├── Orientation constraint → a848220a
│   ├── Plane boundaries → 7b0ab1c4
│   └── Mesh containment volume → ecc3bcfb
│   Sub-skills: + wasp-constraints
│
├── "Deterministic" / "sequence" / "construction order" / "grammar"
│   Concepts: Graph-Grammar Aggregation
│   Recipe: 981e2515
│   Sub-skills: wasp-parts → wasp-rules → wasp-grammar-aggregate
│   Chirp: Grammar authoring cascade (pattern 3 in cascade-patterns.md)
│
├── "Hierarchical" / "multi-scale" / "nested" / "modules within modules"
│   Concepts: Hierarchy + AdvancedPart
│   Recipes: 18156490 (hierarchy), 0c7d6f00 (LEGO-style)
│   Sub-skills: wasp-parts → wasp-hierarchy → wasp-aggregate
│   Note: Graph-Grammar + Hierarchy = full-power Wasp
│
├── "Learn from example" / "extract rules" / "grow pattern"
│   Concepts: Rules From Aggregation
│   Recipe: 0574c25d
│   Sub-skills: wasp-learn
│
├── "Save / load" / "checkpoint" / "resume"
│   Concepts: Save/Load Aggregation
│   Recipe: 72d65814
│   Sub-skills: wasp-save-load
│
├── "VR" / "DisCo" / "multiplayer design"
│   Concepts: Wasp2DisCo export
│   Recipe: d3a3bfc0
│   Sub-skills: + wasp-disco-export
│   Note: Units MUST be meters. Geometry must be mesh, not NURBS.
│
└── "Visualization" / "UE5" / "Unreal" / "game engine"
    No Wasp-specific recipe — use existing Datasmith pipeline:
    rhino_tag_object_semantic → rhino_validate_export → rhino_prepare_for_game_export
    Post-aggregation workflow, not part of GH definition design.
```

### Combining Concepts

Most real projects combine multiple branches. Common combinations:

| Combination | Example Intent | Composition |
|-------------|---------------|-------------|
| Parts + Fields + Constraints | "Dense at center, buildable" | wasp-parts → wasp-rules → wasp-field → wasp-constraints → wasp-aggregate |
| Parts + Grammar + Hierarchy | "Modular cluster housing with shared cores" | wasp-parts (sub) → wasp-hierarchy → wasp-parts (macro) → wasp-rules → wasp-grammar-aggregate |
| Parts + Field + Catalog | "3 panel types, denser near edges" | wasp-parts → wasp-rules → wasp-field → wasp-catalog → wasp-aggregate |
| Parts + Constraints + DisCo | "Buildable assembly for VR review" | wasp-parts → wasp-rules → wasp-constraints → wasp-aggregate → wasp-disco-export |

---

## Composition Order

**This sequence is mandatory** — violating it causes runtime errors in Wasp:

```
1. Geometry (Rhino)              Must exist before GH definition starts
2. Connections                   Planes defining where parts mate
3. Parts (or AdvancedPart)       Wrap geometry + connections
4. Rules (via RuleGenerator)     Depend on Parts being defined
5. Fields (optional)             Independent of Rules, but must exist before Aggregation
6. Constraints (optional)        Depend on AdvancedPart (not basic Part)
7. Part Catalog (optional)       Depends on Parts
8. Aggregation                   Consumes all of the above
9. Post-processing               After aggregation solves
   ├── Attribute extraction
   ├── Rules From Aggregation
   ├── Save/Load
   ├── DisCo export
   └── Datasmith export (in Rhino, not GH)
```

**Critical ordering constraints:**
- Connections BEFORE Parts (Parts consume Connections as input)
- AdvancedPart INSTEAD OF Part when using constraints or hierarchy
- RuleGenerator AFTER all Parts are defined (it needs the full part set)
- Fields BEFORE Aggregation (Aggregation queries field at each placement)
- Part Catalog BEFORE Aggregation (controls distribution during aggregation)

---

## Wasp-Specific Explore Queries

During the explore phase, run these in addition to the standard checklist queries:

### Rhino Scene Preparation (BEFORE knowledge queries)

**Load [wasp-rhino-scaffold.md](wasp-rhino-scaffold.md)** and execute the full
Rhino preparation protocol:

```python
# 1. Inspect Rhino scene for candidate part geometry
rhino_objects()          # What's in the scene?
rhino_layers()           # How is it organized?
rhino_document()         # What units?

# 2. Validate candidate parts (per object)
rhino_is_closed(guid=...)     # Must be closed
rhino_brep_faces(guid=...)    # Enumerate faces for connection analysis
rhino_surface_normal(guid=...)  # Compute face normals for connection directions

# 3. Organize layers (create Wasp:: hierarchy)
rhino_layer_create(name="Wasp::Parts::PartA")
# ... see scaffold for full convention

# 4. Analyze + propose connections — ASK user to approve
# 5. Create auxiliary geometry (ground plane, attractors, etc.)
```

If the Rhino scene is empty, propose creating starter geometry from the user's
description. Always ask before creating.

### Knowledge Store Queries

```python
# 1. Query for relevant Wasp recipes
gh_query_patterns(intent="wasp <user's concept>")

# 2. Check what Wasp components are available
gh_knowledge_query(intent="wasp part", depth="context")
gh_knowledge_query(intent="wasp aggregation", depth="context")

# 3. If field-driven:
gh_knowledge_query(intent="wasp field", depth="context")

# 4. If constrained:
gh_knowledge_query(intent="wasp constraint", depth="context")
gh_knowledge_query(intent="wasp advanced part", depth="context")

# 5. Check for existing Wasp components on canvas
gh_snapshot()  # Look for components with "Wasp_" prefix
```

---

## Wasp-Specific Gotchas (Cross-Cutting)

These apply across ALL Wasp workflows — include in every Wasp design doc's
Constraints section:

1. **Units matter for DisCo** — if VR export is planned, Rhino file must be in meters
2. **AdvancedPart vs Part** — use AdvancedPart when ANY of: constraints, hierarchy,
   smart attributes, additional colliders are needed. Cannot upgrade later without
   rewiring.
3. **RuleGenerator needs ALL parts** — if you add a part type later, rules must be
   regenerated. Wire all Parts into RuleGenerator as a merged list.
4. **Connection direction matters** — the direction vector of a Connection determines
   which face mates. Reversed direction = no valid placements.
5. **Stochastic aggregation is non-deterministic** — use Fixed Seed (integer input)
   for reproducibility. Without it, every solve produces different results.
6. **Aggregation must be RESET after changes** — changing parts, rules, or constraints
   requires clicking the Reset button (boolean toggle wired to RESET input).
7. **Constraint Mode is an integer** — Mode 0 = none, Mode 1 = local, Mode 2 = global.
   Default is 0 (no constraints). Must explicitly set to 1 or 2.
8. **Fields don't filter — they bias** — a field makes some placements more likely,
   but doesn't prevent placements outside the field influence.
9. **Hierarchy: always reset when changing levels** — macro and micro aggregations
   are coupled. Changing one invalidates the other.
10. **Mesh geometry for DisCo** — DisCo is mesh-based. NURBS/Brep geometry must be
    meshed before Wasp2DisCo export.

---

## Chirp Integration Points

When the design requires intelligence beyond recipe replay, integrate a Chirp cascade.

### When to Add Chirp

| Scenario | Chirp Adds Value | Without Chirp |
|----------|------------------|---------------|
| User specifies exact parts, rules, counts | No | Recipe replay + manual parameters |
| User describes abstract intent ("housing complex") | **Yes** — translate intent to parameters | Would require extensive Q&A to extract numbers |
| Grammar-driven aggregation | **Yes** — author production rules from design brief | User must write grammar rules manually |
| Multi-objective (density + structure + views) | **Yes** — balance competing constraints | Single field or constraint, not balanced |

### Available Cascade Patterns

**Pattern 3 (existing): Wasp Aggregation Config**
- Single Chirp component outputs: part ratios, field parameters, constraint mode
- Feeds directly into Wasp Part Catalog, Field, and Aggregation components
- Use for: parameter-driven aggregation where intent maps to numbers

**Pattern 6 (to be created): Grammar Authoring**
- Planner → Interpreter → Critic → Gate chain
- Final output: production rules as text → Wasp Grammar input
- Use for: Graph-Grammar Aggregation where construction sequence needs design reasoning

**Pattern 5 (existing) + Wasp: Hybrid Fan-out + Critic**
- Planner fans out to Structure/Envelope/Program interpreters
- Each interpreter outputs Wasp parameters for its domain
- Critic cross-checks for coherence
- Use for: complex multi-discipline projects

### Wiring Chirp to Wasp

Chirp outputs are typed pins (float, int, string, bool). Wire directly to
Wasp component inputs:

```
[Chirp Planner]
    ├── WallRatio:float ──→ [Wasp Part Catalog].ratio_wall
    ├── FieldStrength:float ──→ [Wasp Field].strength
    ├── ConstraintMode:int ──→ [Wasp Aggregation].MODE
    └── Reasoning:string ──→ [Panel] (for audit trail)
```

---

## Design Doc Additions for Wasp

When producing the design document (Step 5 of design-grasshopper), add these
Wasp-specific sections:

```markdown
## Wasp Configuration
| Setting | Value | Rationale |
|---------|-------|-----------|
| Aggregation Engine | Stochastic / Graph-Grammar | ... |
| Constraint Mode | 0 / 1 / 2 | ... |
| Fixed Seed | <int> or none | ... |
| Field Source | points / curves / surface / expression / none | ... |
| Part Count | <target N> | ... |
| Hierarchy Levels | 1 / 2 / N | ... |

## Part Definitions
| Part Name | Geometry Source | Connection Count | Connection Types | Advanced? |
|-----------|---------------|-----------------|-----------------|-----------|
| wall_A | Rhino brep ref | 4 | ["floor", "wall", "wall", "ceiling"] | Yes |
| column | Rhino brep ref | 2 | ["floor", "ceiling"] | Yes |

## Recipes Referenced
| Concept | Recipe ID | Curriculum Steps Used |
|---------|-----------|----------------------|
| Basic aggregation | 098491b7 | 1-6 |
| Field from curves | 9d5169fc | 1-5 |
```

---

## Recipe Index (Concept → Recipe ID)

Quick lookup for the plan phase. Recipe IDs are PatternStore pattern_ids,
replayable via `gh_replay_recipe(pattern_id)`.

### Series 0: Basics
| Concept | Recipe ID | Components | Curriculum |
|---------|-----------|------------|------------|
| Basic aggregation | `098491b7` | 35 | 6 steps |
| Rule grammar (text-based) | `e1ce3524` | 47 | 6 steps |
| Graph grammar (vertex/edge) | `801f6d1e` | 45 | 8 steps |
| Geometry replacement | `2fe5805e` | 55 | 6 steps |
| Transform start point | `fba88cfa` | 45 | 6 steps |
| Part attributes | `16f4319f` | 42 | 6 steps |
| Save/load aggregation | `72d65814` | 39 | 4 steps |
| Fixed seed | `17ccaf31` | 27 | 4 steps |
| Parts catalog | `fe3d267c` | 39 | 3 steps |
| Aggregation graph | `48a1b9fb` | 35 | 3 steps |

### Series 1: RuleGenerator
| Concept | Recipe ID | Components | Curriculum |
|---------|-----------|------------|------------|
| RuleGenerator basics | `c5ac8ffa` | 37 | 3 steps |
| Connection types | `c9f10925` | 30 | 4 steps |
| Rules grammar mode | `8487fbeb` | 57 | 4 steps |
| Rules visualizer | `c46205e4` | 81 | 8 steps |
| Rules from aggregation | `0574c25d` | 138 | 6 steps |

### Series 2: Fields
| Concept | Recipe ID | Components | Curriculum |
|---------|-----------|------------|------------|
| Field basics | `7bb677d9` | 48 | 7 steps |
| Field boundaries | `fa2528c3` | 48 | 4 steps |
| Field from curves | `9d5169fc` | 51 | 5 steps |
| Field from expression | `da63ff29` | 62 | 8 steps |
| Field from Kangaroo | `8f250f41` | 74 | 5 steps |
| Multi-channel field | `35afaaf5` | 88 | 9 steps |
| Save/load fields | `4e918d2c` | 40 | 4 steps |
| Orientable fields | `fdf0db8a` | 59 | 4 steps |
| Field from surface | `084bb2d5` | 77 | 2 steps |
| Volumetric field | `e1e6f130` | 53 | 2 steps |
| Combining fields | `9fdfcd0f` | 105 | 2 steps |

### Series 4: Constraints + Advanced
| Concept | Recipe ID | Components | Curriculum |
|---------|-----------|------------|------------|
| Local: supports | `0780962c` | 51 | 6 steps |
| Local: additional collider | `8611659f` | 61 | 7 steps |
| Local: adjacency/exclusion | `823e6778` | 81 | 4 steps |
| Local: orientation | `a848220a` | 57 | 3 steps |
| Global: plane boundary | `7b0ab1c4` | 68 | 5 steps |
| Global: mesh containment | `ecc3bcfb` | 45 | 5 steps |
| DisCo VR export | `d3a3bfc0` | 115 | 11 steps |
| Smart attributes | `a8db9228` | 62 | 4 steps |
| Graph-grammar aggregation | `981e2515` | 33 | 3 steps |

### Series 5: Hierarchy
| Concept | Recipe ID | Components | Curriculum |
|---------|-----------|------------|------------|
| Hierarchical aggregation | `18156490` | 80 | 13 steps |
| Hierarchical LEGO | `0c7d6f00` | 109 | 8 steps |
