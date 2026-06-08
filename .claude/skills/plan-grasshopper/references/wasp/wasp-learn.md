# wasp-learn — Rules From Aggregation

Extract rules from an existing aggregation rather than defining them from scratch.
Inverts the typical workflow: instead of "define rules → aggregate", this does
"show example → extract rules → re-aggregate at scale". A programming-by-demonstration
paradigm for discrete aggregation.

## When to Use

- When the user wants to **learn from an example arrangement**
- When manually placed parts should define the aggregation pattern
- When refining rules iteratively (aggregate → extract → modify → re-aggregate)
- When merging rule sets from different assemblies
- **Replaces wasp-rules** in the composition chain (extracted rules substitute for generated rules)

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Existing aggregation | wasp-aggregate output or wasp-save-load | Completed aggregation to learn from |
| Parts | wasp-parts output | Same parts used in the source aggregation |

## Recipe References

| Concept | Recipe ID | Curriculum Steps | Components |
|---------|-----------|-----------------|------------|
| Rules from aggregation | `0574c25d` | 6 steps | 138 |

## Workflow Pattern: Learn and Grow

```
1. User places 3-5 parts manually in desired arrangement
2. Skill wraps arrangement as a mini-aggregation
3. Rules From Aggregation extracts the implicit rules
4. (Optional) Rules Visualizer shows extracted rules for approval
5. User approves or modifies
6. Skill runs stochastic aggregation with extracted rules
7. Result: large assembly following the user's demonstrated pattern
```

## Tool Call Pattern

### Pattern A: Extract Rules from Existing Aggregation

```python
# BATCH: Rule Extraction

# Step 1: Create Rules From Aggregation component
gh_execute_intent(intent="create wasp rules from aggregation", x=1700, y=300)
# → Record as $RULES_FROM_AGG
# Wire: $AGGREGATION → RulesFromAgg.AGG

# Step 2 (optional): Visualize extracted rules
gh_execute_intent(intent="create wasp rules visualizer", x=1900, y=300)
# → Record as $RULES_VIZ
# Wire: $RULES_FROM_AGG → RulesVisualizer.RULES
# Wire: integer slider → RulesVisualizer.INDEX

# CHECKPOINT
gh_solve(delay=1000)
gh_errors()
# → Expected: extracted rules list from RulesFromAgg output
```

### Pattern B: Modify and Re-Aggregate

```python
# BATCH: Rule Modification + Re-Aggregation

# Step 1: Extract rules (Pattern A above)

# Step 2: Modify extracted rules (e.g., scale base part)
# Non-uniform scaling on base part transforms
gh_execute_intent(intent="create scale component", x=1900, y=400)
# → Record as $SCALE_MOD
# Wire: base part geometry → Scale.G
# Wire: scale factors → Scale.F

# Step 3: New aggregation with modified rules
gh_execute_intent(intent="create wasp aggregation", x=2100, y=350)
# → Record as $NEW_AGG
# Wire: parts → Aggregation.PART
# Wire: $RULES_FROM_AGG → Aggregation.RULE  (extracted rules, not RuleGenerator)
# Wire: count, seed, reset per wasp-aggregate pattern
```

### Pattern C: Iterative Refinement Loop

```python
# 1. Aggregate with initial rules (wasp-rules → wasp-aggregate)
# 2. Extract rules from best result (this sub-skill)
# 3. Modify extracted rules (scale, filter, weight)
# 4. Re-aggregate with modified rules
# 5. Repeat until satisfactory

# Save/load (wasp-save-load) enables checkpointing between iterations
```

## Gotchas

1. **Extracted rules reference parts by name** — if part names change between extraction
   and re-use, rules won't match. Keep part names stable across iterations.
2. **Rule extraction is deterministic** — same aggregation always produces same extracted rules.
3. **Extracted rules carry transform information** — not just connection topology but also
   relative positioning. This is what enables non-uniform scaling modification.
4. **Can mix with RuleGenerator rules** — extracted rules and generated rules can both
   feed into the same aggregation via a merge. Useful for combining learned patterns
   with auto-generated connection rules.
5. **Complex canvas** — the full learn-and-grow workflow uses ~138 components.
   Break into clear batches with checkpoints between extraction and re-aggregation.
6. **Not the same as wasp-rules grammar** — extracted rules are concrete connection
   instances, not abstract grammar rules. They describe specific part-to-part matings
   observed in the source aggregation.

## Outputs

- `$RULES_FROM_AGG` — Rules From Aggregation component GUID, output = extracted rule list
- Feeds into: wasp-aggregate (replaces or supplements wasp-rules output)
- Composes with: wasp-save-load (load → extract → modify → save cycle)
