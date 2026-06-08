---
name: chirp
description: >
  Create a single Chirp component on the Grasshopper canvas. Requires a category
  (planner, interpreter, critic, narrator, classifier, gate, editor) and a design
  context. Triggers: "chirp component", "add a chirp", "create a chirp planner",
  "chirp interpreter", "I need a critic", "add a gate", "chirp editor", or any
  request to create a single LLM-embedded Grasshopper component.
---

# Chirp — Single Component

Create one Chirp component on the GH canvas with the correct category, pins,
signature, and visual treatment. Every component gets a Reasoning output and
an optional Correction input automatically.

<HARD-GATE>
You MUST determine the category BEFORE calling chirp_create. Do NOT create
a Chirp component without selecting a category from the list below.
</HARD-GATE>

## Categories

| Category | Purpose | DSPy Module | Typical Inputs | Typical Outputs |
|---|---|---|---|---|
| **planner** | Brief → structured parameters | ChainOfThought | Brief (string) | Domain-specific params (typed) |
| **interpreter** | Upstream Reasoning → domain-specific parameters | ChainOfThought | Reasoning (string) + context | Domain-specific params (typed) |
| **critic** | Multiple Reasonings → conflict detection | MultiChainComparison | 2+ Reasoning inputs | Conflicts (string), Score (float), Coherent (bool) |
| **narrator** | Multiple Reasonings → design narrative | ChainOfThought | 2+ Reasoning inputs | Narrative (string), Summary (string) |
| **classifier** | Data → categorical decision | Predict | Data + optional Intent (string) | Category (string), Confidence (float) |
| **gate** | Reasoning → rule activations | Predict | Reasoning (string) | Boolean/enum flags |
| **editor** | Reasoning + Correction → reconciled Reasoning | ChainOfThought | Reasoning (string) + Correction (string) | Reasoning only (reconciled) |

## Universal Pins (auto-added to ALL categories)

**Outputs:**
- `Reasoning` (string) — LLM chain-of-thought. Always present. Reserved name.

**Inputs:**
- `Correction` (string, optional) — Human override. When empty, no effect.
  When connected to a Panel with text, the LLM prioritizes it over upstream
  assumptions and explains the reconciliation in its Reasoning output.

## Workflow

### Step 0: Preflight

1. **Rhino**: Call `rhino_ping`. If no response → tell user to open Rhino, stop.
2. **Chirp adapter**: Call `chirp_create` with a trivial test or check Rook MCP status. Chirp is auto-managed by Rook's chirp_manager — if the adapter isn't running, the MCP server will start it automatically via CHIRP_HOME discovery. If it fails, tell user to check their Chirp installation.
3. **Grasshopper**: Call `gh_status` or `gh_snapshot`. If GH not open → tell user, stop.

All three confirmed before proceeding.

### Step 1: Determine Category

If the user specified a category (e.g., "add a critic"), use it directly.

If not, determine from context:
- Translating a brief into parameters? → **planner**
- Reading upstream Reasoning through a domain lens? → **interpreter**
- Checking consistency across reasoning streams? → **critic**
- Producing a design narrative? → **narrator**
- Classifying data into categories? → **classifier**
- Activating/deactivating rules based on reasoning? → **gate**
- Adding a human review checkpoint? → **editor**

Present your category choice and get user confirmation before proceeding.

### Step 2: Design the Component

Based on category, design:

1. **Domain**: What discipline or purpose (e.g., "structural", "drainage", "coherence check")
2. **Domain-specific input pins**: Beyond the universal Correction pin
   - Planners: Brief (string) + any constraint inputs
   - Interpreters: Upstream Reasoning (string) + domain context inputs
   - Critics: 2+ named Reasoning inputs (e.g., StructureReasoning, EnvelopeReasoning)
   - Editors: Upstream Reasoning (string) — Correction is already universal
3. **Domain-specific output pins**: Beyond the universal Reasoning pin
   - Use descriptive names — they become DSPy signature fields
   - `beam_depth` communicates differently than `depth`. Be specific.
   - Keep focused: 3-6 outputs per component
4. **Signature**: The DSPy signature string derived from pins
5. **NickName**: Short, descriptive (e.g., "Structure Interpreter", "Drainage Gate")

Present the design to the user. Get approval before creating.

### Step 3: Create

1. Call `chirp_create` with:
   - `pins_in`: domain-specific inputs (Correction is auto-added)
   - `pins_out`: domain-specific outputs (Reasoning is auto-added)
   - `signature`: the DSPy signature string
   - `category`: the selected category
   - `name`: the NickName
2. Verify creation succeeded via `gh_snapshot`
3. If this component should receive upstream Reasoning from an existing component,
   wire it using `gh_edit`

### Step 4: Verify

1. If the component has inputs available (connected upstream or Panel values), trigger a solve
2. Read the Reasoning output — does it reflect the category's purpose?
3. Check typed outputs — do they make sense for the domain?
4. If outputs are wrong, check:
   - Signature field names (they ARE the prompt — rename for clarity)
   - Whether the component needs additional context inputs
   - Whether the adapter is running the right DSPy module for this category

## Signature Design Rules

- Output pin names become DSPy field names (snake_cased)
- Field names carry semantic weight: `structural_span_m` > `span` > `value1`
- Planners: signature starts with brief → domain params
- Interpreters: signature starts with reasoning → domain params
- Critics: signature starts with multiple reasoning inputs → conflicts, score, coherent
- Keep signatures focused: 2-4 inputs, 3-6 outputs
- The Correction and Reasoning pins are NOT in the signature — they're handled by the adapter

## Per-Node Corrections

The Correction pin is **per-node, not global**. Correcting one component does not
affect siblings in a fan-out. This allows steering individual disciplines independently.

Three states:
1. **Disconnected**: Component reasons normally. Zero overhead.
2. **Connected, Panel empty**: Same as disconnected.
3. **Connected, Panel has text**: LLM reconciles upstream reasoning with human
   correction. Output Reasoning explains the reconciliation.

## Key Principles

- **Categories are required.** Every Chirp component has one. No freeform creation.
- **The user describes the problem.** You determine the category.
- **Signatures are prompts.** Name fields to convey design intent.
- **Reasoning is always present.** It's the shared context bus, not debug output.
- **Correction is always available.** Optional but universal — the human can steer any node.
- **One component at a time.** For multi-component workflows, use `/chirp-cascade`.
