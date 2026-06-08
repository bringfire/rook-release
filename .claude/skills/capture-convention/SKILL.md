---
name: capture-convention
description: |
  Extract layer, material, and block organization conventions from a reference
  Rhino file and write a .rook/conventions.yaml file. Use this skill whenever
  the user mentions: "capture convention", "extract convention", "save layer
  template", "create convention file", "layer standards", "what are my
  conventions", or when /project-setup offers to capture from a reference file.
  Also use when the user opens a "template" or "standard" file and wants to
  formalize its structure for reuse across projects.
---

# Capture Convention

Analyze the currently open Rhino file, identify its organizational patterns,
confirm intent with the user, and write a `.rook/conventions.yaml` that
cleanup skills can consume.

The convention file separates **policy** (what "correct" looks like) from
**execution** (what cleanup skills do). This skill captures the policy.

## Prerequisites

- A Rhino file must be open (the reference file to capture from)
- The file should represent the user's intended structure — either a clean
  template or a working file whose patterns they want to formalize
- Rook MCP tools must be available (`rhino_ping` returns pong)

## Workflow

### Step 0: Preflight

1. Call `rhino_ping`. If no response, stop and tell the user to open Rhino.
2. Call `rhino_document` to get the file name, units, and tolerance.
3. Confirm with the user: "I'll analyze **{filename}** to extract your layer
   conventions. This file will be the reference — is that the right one?"

Wait for confirmation before proceeding. If the user wants a different file,
tell them to open it first.

### Step 1: Scan

Call all five audit tools in parallel — they're independent reads:

1. `rhino_layers` — full layer tree with properties (color, plotColor,
   plotWeight, linetype, material, visibility, locked)
2. `rhino_materials` — all materials with usage counts
3. `rhino_linetypes` — all linetypes with usage counts
4. `rhino_block_layer_census` — which layers each block's geometry lives on
5. `rhino_layer_dependencies` on any layers that look like they might be
   undeletable (high object count, many block references)

This gives you the complete picture of the file's structure. Don't present
raw data to the user — analyze it first.

### Step 2: Analyze

From the scan data, identify these patterns. Work through them internally
before presenting to the user.

**Category structure:**
- Are there numbered top-level layers? (`01-...`, `02-...`)
- What roles do they serve? (materials, options, entourage, utility, coordination)
- Are there stray top-level layers outside the category system?

**Naming conventions:**
- What casing is dominant? (ALL CAPS, Title Case, mixed)
- Are AIA/NCS prefixes used? (`A-`, `S-`, `I-`)
- What separator is used? (`-`, `_`, space)

**Material-layer principle:**
- Which layers hold actual geometry (objectCount > 0)?
- Do geometry-bearing layers follow a material naming pattern?
- Are material layers nested under a parent, or flat at root?
- Do material layers have render materials assigned?
- Are there material variants? (multiple glass types, stone types)

**Options structure:**
- Is there an options/iterations container?
- How are options organized? (spatial zone → numbered iterations?)
- Are block instances on option layers?
- Is there an active-option marker convention? (`***`, bold, etc.)

**Block organization:**
- Do blocks use material layers for their internal geometry?
- Or do they have dedicated sub-layer hierarchies?
- Are there Revit-imported blocks (long names with GUIDs)?
- How many blocks are unused (0 instances)?

**Coordination / imports:**
- Are there Revit/DWG import layers with AIA codes? (`A-_WALLPRTN_E`)
- Are they contained under a parent, or scattered at root?
- Is import geometry on these layers actual project data or coordination reference?

**Entourage and utility:**
- Are there layers for people, cars, plants, furniture?
- Are there clipping plane, reference, or detail layers?

### Step 3: Present Findings

Present your analysis to the user as a structured summary — NOT the raw
tool output. Organize by category:

```
Here's what I found in {filename}:

**Layer Structure:**
{N} top-level categories: {list them with roles}
{N} total layers, {N} with geometry

**Naming:**
Dominant casing: {UPPER/Title/mixed}
AIA prefixes: {yes/no, with examples}

**Materials:**
{N} material layers under {parent}
Material variants: {examples if found}
Render materials assigned: {yes/no/partial}

**Options:**
{N} option zones with {N} total iterations
Block instances on option layers: {yes/no}
Active marker: {pattern if found}

**Blocks:**
{N} block definitions ({N} used, {N} unused)
Block geometry on: {material layers / dedicated layers / mixed}

**Coordination:**
{Revit import layers found / none}
Location: {contained under parent / scattered}

**Issues found:**
- {any stray layers, naming inconsistencies, orphan layers, etc.}
```

Then ask: **"Which of these patterns are intentional conventions you want
to enforce? Anything you want to change?"**

This is the key interview moment. The user will tell you which patterns
are deliberate (capture them) vs organic drift (don't capture). Listen
carefully — what they say here determines the convention file.

### Step 4: Interview

Based on the user's response to Step 3, ask focused follow-up questions
**one at a time**. Only ask about things that are ambiguous — don't re-ask
about patterns the user already confirmed or rejected.

Common follow-ups:

- "Your material layers use mixed naming (some have A- prefix, some don't).
  Should the convention require AIA prefixes on all material layers?"

- "The options are organized by spatial zone ({examples}). Should all
  projects follow this pattern, or is zone-based organization optional?"

- "There are {N} Revit import layers scattered at the root level. Should
  these go under a 05-COORDINATION container?"

- "I found {N} unused block definitions (Revit import artifacts). Should
  the convention include a policy to purge these?"

- "Layer colors vary ({examples}). Should the convention enforce specific
  colors per material type, or leave colors to project preference?"

Keep the interview short. 2-4 follow-up questions maximum. If the user
says "looks good" to the initial summary, skip directly to generation.

### Step 5: Generate

Read the schema reference at `.rook/conventions.schema.yaml` in the repo
root to understand all available fields. Then build the conventions.yaml
with these sections:

1. **Metadata** — schema_version, name, source (filename, date, notes)
2. **Naming** — case, aia_prefixes, prefix_separator (from analysis)
3. **Categories** — the top-level structure with roles and children policies
4. **Materials** — parent_category, allow_variants, variant_style
5. **Blocks** — instance_parent, definition_layers, naming
6. **Document** — units, tolerance, angle_tolerance (from rhino_document)
7. **Cleanup** — protected_layers, orphan_policy, stray_toplevel_policy

Present the generated YAML to the user section by section for validation.
Don't dump the entire file at once — show each section, explain what it
means, and confirm before moving to the next.

### Step 6: Write

1. Write the convention file to `.rook/conventions.yaml` in the current
   working directory (the project root).
2. If `.rook/` doesn't exist, create it.
3. Print confirmation: "Convention file written to `.rook/conventions.yaml`.
   Cleanup skills like `/clean-layers` will use this as their definition
   of 'correct' for this project."

If a conventions.yaml already exists, ask before overwriting: "A convention
file already exists. Replace it, or merge the new findings into it?"

## Handling Edge Cases

- **Clean template file (no geometry):** The scan will show empty layers.
  That's fine — the layer structure IS the convention. Skip material usage
  analysis and focus on the tree structure, naming, and categories.

- **Messy real file:** Many layers will be outside the expected categories.
  Focus on identifying the intended structure (what's organized) vs drift
  (what grew organically). The interview in Step 4 is where the user
  separates signal from noise.

- **Mixed Revit + Rhino file:** The Podium pattern — Revit import layers
  coexisting with Rhino-native structure. Identify both systems and ask
  whether import layers should be containerized under 05-COORDINATION.

- **No clear pattern:** If the file has no discernible organizational
  system (everything on Default, random layer names), tell the user:
  "This file doesn't have a clear layer convention. Would you like to
  start from the firm template instead?" Then offer to generate a
  conventions.yaml from the standard schema.

- **User wants to copy conventions from another project:** If they say
  "use the same conventions as project X", ask them to point to the
  other project's `.rook/conventions.yaml` and copy it. This skill
  captures from a live file, not from existing YAML.

## Key Principles

- **Infer aggressively, confirm explicitly.** Do the analysis work before
  asking questions. Present what you found and let the user correct.
  Don't make them describe their conventions from scratch.

- **One question at a time.** Don't present a 10-item questionnaire.
  Each follow-up should be a single focused question.

- **Distinguish convention from state.** The convention file describes
  the target structure, not the current file's exact state. A messy file
  can still have clear conventions — the mess is drift, not intent.

- **Respect the schema.** The conventions.yaml must follow the schema
  defined in `.rook/conventions.schema.yaml`. Read it before generating.

- **Don't overcapture.** Only capture patterns the user confirms as
  intentional. An observation like "most layers are green" is not a
  convention unless the user says "yes, we always use green for X."
