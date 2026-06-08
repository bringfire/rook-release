# wasp-rules — RuleGenerator Modes

RuleGenerator auto-generates valid aggregation rules from a set of Parts.
Eliminates manual rule enumeration — the primary scaling bottleneck in discrete
aggregation (2 parts x 3 connections = 36 rules; 5 parts x 4 connections = 400 rules).

## When to Use

- **After wasp-parts** — Parts must exist before rules can be generated
- **Before wasp-aggregate** or **wasp-grammar-aggregate** — rules feed into aggregation
- When the user does NOT want to manually specify every part-to-part connection rule
- Skip this sub-skill only when using **wasp-learn** (Rules From Aggregation extracts rules instead)

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Parts | wasp-parts output | All Part/AdvancedPart components, merged into one list |
| Mode | Design decision | Basic (0), Typed (1), or Grammar (2) |
| Connection types | Part definitions | Only needed for Typed/Grammar modes |
| Grammar text | Panel/Chirp | Only needed for Grammar mode |

## RuleGenerator Modes

### Mode 0: Basic (All-to-All)
Every connection can mate with every other connection. Simplest, most permissive.

**Use when:** Part geometry naturally constrains valid placements (e.g., LEGO studs
only fit LEGO holes). No need for explicit filtering.

### Mode 1: Typed (Connection Types)
Connections with matching type labels can mate. Type = string label on each connection.

**Use when:** Parts have named connection types (e.g., "floor", "wall", "ceiling")
and only same-type connections should mate. Typical for architectural assemblies.

### Mode 2: Grammar
Explicit text grammar defining which connection types can mate with which.
Grammar syntax: `type_A > type_B` (A can connect to B).

**Use when:** Fine-grained control needed. E.g., "floor connects to ceiling but not
to wall". Also used when Chirp authoring cascade generates connection rules.

**Note:** This is **connection grammar** (filtering which connections mate), distinct from
**aggregation grammar** in wasp-grammar-aggregate (which governs placement sequence).

## Recipe References

| Concept | Recipe ID | Curriculum Steps |
|---------|-----------|-----------------|
| RuleGenerator basics | `c5ac8ffa` | Steps 1-3 |
| Connection types | `c9f10925` | Steps 1-4 |
| Rules grammar mode | `8487fbeb` | Steps 1-4 |
| Rules visualizer | `c46205e4` | Steps 1-8 |

## Tool Call Pattern

```python
# BATCH: Rule Generation

# Step 1: Merge all parts into a single list
gh_execute_intent(intent="create merge component", x=800, y=100)
# → Record as $PARTS_MERGE
# Wire: $PART_A → Merge.D1, $PART_B → Merge.D2, ...

# Step 2: Create RuleGenerator
gh_execute_intent(intent="create wasp rule generator", x=1000, y=100)
# → Record as $RULE_GEN
# Wire: $PARTS_MERGE → RuleGenerator.PART

# Step 3 (Mode 1 — Typed): Set grammar mode
# Connection types are already defined in wasp-parts via Connection components
# RuleGenerator auto-filters by matching types — no extra wiring needed

# Step 3 (Mode 2 — Grammar): Add grammar text
gh_execute_intent(intent="create panel", x=800, y=250)
# → Record as $GRAMMAR_PANEL
# Set content: "floor > floor\nwall > wall\nceiling > ceiling"
# Wire: $GRAMMAR_PANEL → RuleGenerator.GRAMMAR

# CHECKPOINT
gh_solve(delay=500)
gh_errors()
# → Expected: RuleGenerator produces a list of Rule objects
```

### Adding Rules Visualizer (Optional, for Debugging)

```python
# After RuleGenerator, add visualizer to inspect generated rules
gh_execute_intent(intent="create wasp rules visualizer", x=1200, y=100)
# → Record as $RULES_VIZ
# Wire: $RULE_GEN → RulesVisualizer.RULES
# Wire: integer slider → RulesVisualizer.INDEX (to browse rules)
```

## Gotchas

1. **Wire ALL parts before generating** — RuleGenerator needs the complete part set.
   Adding a part later requires regenerating rules (rewire the merged list)
2. **Connection types are case-sensitive** — "Floor" != "floor"
3. **Grammar mode syntax** — each line is `type_A > type_B`. Use `>` not `→` or `->`
4. **Rules Visualizer is display-only** — it shows rules but doesn't filter them.
   To select specific rules by index, wire an integer slider to its INDEX input
5. **Two levels of grammar in Wasp** — connection grammar (this sub-skill, filtering)
   vs aggregation grammar (wasp-grammar-aggregate, directing sequence). Don't confuse them

## Outputs

- `$RULE_GEN` — RuleGenerator component GUID, output is a list of Rule objects
- Ready for: **wasp-aggregate** or **wasp-grammar-aggregate** (next in composition order)
- Optional: **wasp-field**, **wasp-constraints**, **wasp-catalog** can be composed in parallel
