# wasp-catalog — Part Catalog Configuration

Part Catalog controls the distribution ratios of different part types during
aggregation. Without a catalog, all parts are equally likely. With a catalog,
you can specify "70% panels, 20% columns, 10% connectors".

## When to Use

- When the user wants **controlled variety** or **distribution ratios**
- When certain part types should appear more/less frequently
- After wasp-parts, before wasp-aggregate (catalog feeds into aggregation)
- Often paired with multi-channel fields (each channel biases a part type)

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Parts | wasp-parts output | All part types |
| Ratios | Number sliders | One per part type, relative proportions |

## Recipe References

| Concept | Recipe ID | Curriculum Steps |
|---------|-----------|-----------------|
| Parts catalog | `fe3d267c` | Steps 1-3 |
| Part attributes | `16f4319f` | Steps 1-6 |

## Tool Call Pattern

```python
# BATCH: Part Catalog

# Step 1: Ratio sliders (one per part type)
gh_execute_intent(intent="create number slider named PanelRatio", x=1100, y=600)
# → Record as $RATIO_PANEL
gh_set_value(guid=$RATIO_PANEL, value=0.7, min=0.0, max=1.0)

gh_execute_intent(intent="create number slider named ColumnRatio", x=1100, y=700)
# → Record as $RATIO_COLUMN
gh_set_value(guid=$RATIO_COLUMN, value=0.2, min=0.0, max=1.0)

gh_execute_intent(intent="create number slider named ConnectorRatio", x=1100, y=800)
# → Record as $RATIO_CONNECTOR
gh_set_value(guid=$RATIO_CONNECTOR, value=0.1, min=0.0, max=1.0)

# Step 2: Create Part Catalog component
gh_execute_intent(intent="create wasp part catalog", x=1300, y=700)
# → Record as $CATALOG
# Wire: parts list → Catalog.PART
# Wire: ratio values → Catalog.RATIO (as matching list)

# Step 3: Wire catalog to aggregation
gh_connect(sourceGuid=$CATALOG, targetGuid=$AGGREGATION, targetParam="CATA")

# CHECKPOINT
gh_solve(delay=500)
gh_errors()
```

## Gotchas

1. **Ratios are relative, not absolute** — values of (0.7, 0.2, 0.1) and (7, 2, 1)
   produce the same distribution. They're normalized internally.
2. **Catalog depends on Parts being defined** — add all parts before creating catalog.
   Adding a part type later requires updating the catalog.
3. **Multi-channel fields + catalog** — each field channel maps to a part type.
   Without a catalog, multi-channel fields have no effect on part selection.
4. **Zero ratio = never placed** — setting a ratio to 0 effectively removes that part
   from the aggregation. Useful for A/B testing part variations.
5. **Ratios are targets, not guarantees** — connection compatibility and constraints
   may prevent exact ratio achievement, especially with low part counts.

## Outputs

- `$CATALOG` — Part Catalog component GUID
- Wire to Aggregation's CATA input
- Composes with: wasp-field (multi-channel), wasp-aggregate
