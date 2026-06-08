# wasp-disco-export — DisCo VR Export

Export Wasp aggregation definitions to DisCo (Discrete Collaboration), a Unity-based
VR application for interactive assembly. Produces JSON setup files that DisCo loads
for multiplayer design sessions with physics and connection rules.

## When to Use

- When the user mentions **VR**, **DisCo**, **multiplayer design**, **interactive assembly**
- When a Wasp aggregation should be explored interactively in virtual reality
- Post-aggregation workflow — the definition must be complete before export
- Can be combined with Datasmith export (VR design review + UE5 production viz)

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Parts | wasp-parts output | All parts for DisCo scene |
| Rules | wasp-rules output | Connection rules for DisCo's rule engine |
| Constraints | wasp-constraints output (optional) | Carried into DisCo |
| Export path | Text panel | Directory for output JSON files |
| Rule groups | Text/panel (optional) | Group rules for DisCo's rule filtering UI |
| Environment settings | Various (optional) | Game world parameters |
| Player settings | Various (optional) | Multiplayer configuration |

## Critical Requirements

1. **Units MUST be meters** — DisCo works in meters. Rhino file must be in meters.
   If Rhino is in millimeters, scale geometry before export.
2. **Geometry must be mesh** — DisCo is mesh-based, not NURBS. Brep geometry must be
   meshed before Wasp2DisCo export (use Rhino's Mesh command or GH mesh component).

## Recipe References

| Concept | Recipe ID | Curriculum Steps | Components |
|---------|-----------|-----------------|------------|
| DisCo VR export | `d3a3bfc0` | 11 steps | 115 |

## Tool Call Pattern

```python
# BATCH: DisCo Export Setup

# Step 1: Ensure geometry is mesh (if using brep parts)
gh_execute_intent(intent="create mesh brep component", x=100, y=800)
# → Record as $MESH_CONVERT
# Wire: part geometry → MeshBrep.B
# Use meshed output for Part geometry in wasp-parts

# Step 2: Export path panel
gh_execute_intent(intent="create panel", x=1700, y=600)
# → Record as $DISCO_PATH
# Set content: "C:/path/to/disco_export/"

# Step 3: Create Wasp2DisCo component
gh_execute_intent(intent="create wasp to disco", x=1900, y=600)
# → Record as $WASP2DISCO
# Wire: parts → Wasp2DisCo.PART
# Wire: rules → Wasp2DisCo.RULE
# Wire: $DISCO_PATH → Wasp2DisCo.PATH

# Step 4 (optional): Rule groups for DisCo UI
gh_execute_intent(intent="create panel", x=1700, y=700)
# → Record as $RULE_GROUPS
# Set content: group definitions (text format)
# Wire: $RULE_GROUPS → Wasp2DisCo.RG

# Step 5 (optional): Environment settings
# Wire: gravity, boundaries, etc. to Wasp2DisCo environment inputs

# Step 6 (optional): Player settings
# Wire: player count, roles, etc. to Wasp2DisCo player inputs

# Step 7: Export trigger
gh_execute_intent(intent="create boolean toggle", x=1700, y=800)
# → Record as $EXPORT_TRIGGER
# Wire: $EXPORT_TRIGGER → Wasp2DisCo.SAVE

# CHECKPOINT
gh_solve(delay=1000)
gh_errors()
```

### Loading DisCo Results Back

```python
# BATCH: Import DisCo Aggregation

# Step 1: DisCo result file path
gh_execute_intent(intent="create panel", x=100, y=900)
# → Record as $DISCO_RESULT_PATH
# Set content: "C:/path/to/disco_aggregation.json"

# Step 2: Create LoadFromDisCo component
gh_execute_intent(intent="create wasp load from disco", x=300, y=900)
# → Record as $LOAD_DISCO
# Wire: $DISCO_RESULT_PATH → LoadFromDisCo.PATH

# Loaded aggregation can feed into:
# - wasp-learn (extract rules from VR-designed arrangement)
# - wasp-save-load (checkpoint for further iteration)
# - Datasmith export (VR design → production visualization)
```

## Dual Export Paths

A Wasp aggregation can flow through BOTH export paths simultaneously:

```
                    ┌── Wasp2DisCo ──→ DisCo (Unity VR)
                    │   Interactive design, physics, multiplayer
Wasp Aggregation ───┤
                    │
                    └── Datasmith ──→ UE5 (Engram)
                        Nanite, Lumen, production visualization
                        (via rhino_prepare_for_game_export pipeline)
```

For Datasmith export, use the existing Rook pipeline (not a Wasp-specific tool):
1. `rhino_tag_object_semantic` — tag aggregated parts with game metadata
2. `rhino_validate_export` — pre-flight geometry checks
3. `rhino_export_with_manifest` — export .3dm + manifest.json

## Gotchas

1. **Units MUST be meters** — the #1 DisCo failure mode. Check Rhino document units
   before export. If millimeters, add a Scale component (factor 0.001) before Part geometry.
2. **Mesh geometry required** — DisCo cannot use NURBS/Brep. Insert MeshBrep component
   in the geometry pipeline before Part creation.
3. **Rule groups affect DisCo UI** — in DisCo, players can toggle rule groups on/off.
   Group rules logically (e.g., "structural rules", "facade rules") for intuitive VR interaction.
4. **Export trigger is one-shot** — toggle true to export, then back to false.
   Leaving true causes repeated exports on every solve.
5. **Two output files** — `_setup.json` (parts, rules, constraints, environment) and
   `_player.json` (multiplayer configuration). Both must be in the same directory for DisCo.
6. **LoadFromDisCo imports VR results** — DisCo-designed assemblies can return to GH for
   structural analysis, rule extraction (wasp-learn), or production export (Datasmith).

## Outputs

- `$WASP2DISCO` — Wasp2DisCo component GUID
- `_setup.json` + `_player.json` files in export directory
- `$LOAD_DISCO` (optional) — LoadFromDisCo component for importing VR results
- Composes with: wasp-learn (extract rules from VR design), Datasmith pipeline
