# wasp-grammar-aggregate — Graph-Grammar Aggregation

Replaces the stochastic engine with a formal grammar that governs the aggregation
topology. Each step follows explicit production rules, enabling deterministic
construction sequences. Inherently reproducible — same grammar = same output,
no seed needed.

## When to Use

- When the user mentions **deterministic**, **sequence**, **construction order**,
  **grammar**, or **production rules**
- When the assembly must follow a prescribed construction logic
  (e.g., "column → beam → connector → column → ...")
- For construction documents where exact reproducibility is required
- When Chirp reasoning cascades should author the assembly logic
- **Use wasp-aggregate instead** for exploratory form-finding or organic patterns

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Parts | wasp-parts output | All parts for this aggregation |
| Rules | wasp-rules output | Connection compatibility rules |
| Production rules | Text (Panel or Chirp output) | Grammar defining construction sequence |
| Part count (N) | Integer slider | Target parts to place |
| Reset toggle | Boolean toggle | Required for re-solving |

## Two Levels of Grammar in Wasp

| Level | What It Governs | Where Defined | Sub-Skill |
|-------|----------------|---------------|-----------|
| **Connection grammar** | Which connection *types* can mate | RuleGenerator grammar mode | wasp-rules |
| **Aggregation grammar** | Which *parts* are placed in what *sequence* | Graph-Grammar Aggregation | **this sub-skill** |

Connection grammar is **filtering** — it removes invalid pairings.
Aggregation grammar is **directing** — it prescribes the construction sequence.

## Recipe References

| Concept | Recipe ID | Curriculum Steps | Components |
|---------|-----------|-----------------|------------|
| Graph-grammar aggregation | `981e2515` | 3 steps | 33 |
| Rule grammar (connection level) | `e1ce3524` | 6 steps | 47 |
| Graph grammar basics | `801f6d1e` | 8 steps | 45 |

## Architectural Grammar Patterns

### Steel Frame
```
Frame    → {Grid, {Bay, Bay, ..., Bay}}
Bay      → {Column, Column, Beam_Top, Beam_Bottom, Bracing?}
Column   → {Base_Plate, Shaft, Cap_Plate}
Bracing  → {Diagonal | Cross | None}
```

### Curtain Wall
```
Wall     → {Mullion_V, {Panel_Row, Panel_Row, ...}}
Panel_Row → {Mullion_H, {Panel, Panel, ...}, Mullion_H}
Panel    → {Glass | Spandrel | Operable}
```

### Modular Cluster Housing
```
Complex  → {Core, {Unit, Unit, ..., Unit}, Circulation}
Unit     → {Floor_Module, Wall_Module, Wall_Module, Ceiling_Module}
Core     → {Elevator, Stair, Mechanical}
```

## Tool Call Pattern

```python
# BATCH: Graph-Grammar Aggregation

# Step 1: Production rules as text panel
gh_execute_intent(intent="create panel", x=1100, y=100)
# → Record as $GRAMMAR_TEXT
# Set content with production rules, e.g.:
# "column > beam\nbeam > connector\nconnector > column"

# Step 2: Part count slider
gh_execute_intent(intent="create number slider named PartCount", x=1100, y=200)
# → Record as $PART_COUNT
gh_set_value(guid=$PART_COUNT, value=30, min=1, max=200)

# Step 3: Reset toggle
gh_execute_intent(intent="create boolean toggle", x=1100, y=300)
# → Record as $RESET

# Step 4: Create Graph-Grammar Aggregation component
gh_execute_intent(intent="create wasp graph grammar aggregation", x=1400, y=200)
# → Record as $GRAMMAR_AGG

# Step 5: Wire inputs
gh_connect(sourceGuid=$PARTS_MERGE, targetGuid=$GRAMMAR_AGG, targetParam="PART")
gh_connect(sourceGuid=$RULE_GEN, targetGuid=$GRAMMAR_AGG, targetParam="RULE")
gh_connect(sourceGuid=$GRAMMAR_TEXT, targetGuid=$GRAMMAR_AGG, targetParam="GR")
gh_connect(sourceGuid=$PART_COUNT, targetGuid=$GRAMMAR_AGG, targetParam="N")
gh_connect(sourceGuid=$RESET, targetGuid=$GRAMMAR_AGG, targetParam="RESET")

# Step 6 (optional): Wire constraints
# gh_connect(sourceGuid=$CONSTRAINT_MODE, targetGuid=$GRAMMAR_AGG, targetParam="MODE")

# Step 7 (optional): Wire field
# gh_connect(sourceGuid=$FIELD, targetGuid=$GRAMMAR_AGG, targetParam="FIELD")

# CHECKPOINT
gh_solve(delay=2000)
gh_errors()
# → Expected: deterministic assembly following production rules
```

### Chirp-Authored Grammar

When grammar rules should be designed by LLM reasoning:

```python
# Chirp cascade outputs production rules as text
# [Chirp Planner] → [Chirp Interpreter] → [Chirp Critic] → [Chirp Gate]
#                                                                │
#                                                        Reasoning pin
#                                                                │
#                                                                ▼
# [Panel] ──text──→ $GRAMMAR_TEXT ──→ Graph-Grammar Aggregation

# The Chirp cascade replaces the static text panel in Step 1.
# See chirp-cascade Pattern 6 (Grammar Authoring) for implementation.
# Plan phase creates Chirp components via /chirp-cascade skill,
# then wires the Gate's output to the Grammar Aggregation component.
```

## Gotchas

1. **Grammar governs topology, not just connections** — production rules define the
   construction *sequence*, not just which parts can connect. This is fundamentally
   different from RuleGenerator's connection grammar.
2. **Inherently deterministic** — same grammar always produces the same output.
   No fixed seed needed (unlike stochastic aggregation).
3. **Production rules as text** — grammar is defined as text input to the component.
   Syntax must match Wasp's expected format exactly.
4. **Grammar + Hierarchy = full power** — use this sub-skill for Phase 3 (macro level)
   of wasp-hierarchy when macro construction must follow a specific sequence.
5. **Constraints still apply** — Mode 1/2 constraints work with grammar-driven
   aggregation. Constraints are checked per-step during grammar execution.
6. **Fields can influence rule selection** — when multiple production rules are valid,
   field values can bias which rule fires. Combines generative with deterministic.
7. **RESET required after grammar changes** — modifying production rule text requires
   aggregation RESET before re-solving.

## Chirp Integration

Graph-Grammar Aggregation is where Chirp adds the most value:

| Chirp Component | Role | Output |
|----------------|------|--------|
| **Planner** | Interpret design brief → assembly strategy | High-level grammar structure |
| **Interpreter** | Translate strategy → production rules | Rule text for Grammar input |
| **Critic** | Evaluate grammar against criteria | Pass/fail + modifications |
| **Gate** | Approve or route back to Interpreter | Final grammar text |

This separates **design reasoning** (Chirp, LLM-driven) from **assembly execution**
(Wasp, rule-driven, deterministic).

## Outputs

- `$GRAMMAR_AGG` — Graph-Grammar Aggregation component GUID
- Output "GEO" = deterministically assembled geometry
- Ready for: wasp-hierarchy (as macro-level aggregation), post-processing,
  wasp-save-load, wasp-disco-export, Datasmith export
