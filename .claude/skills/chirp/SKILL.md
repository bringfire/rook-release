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
- `Freeze` (bool, optional) — When true, the component replays its frozen result
  and never calls the model; with no frozen result it uses deterministic defaults
  and warns. Default false.
- `Frozen` (string, optional) — The frozen store: one entry per list item (the
  last successful model response for that item), written by the component itself
  into this pin's persistent data so it is saved in the `.gh` file and travels with
  it. Leave it unconnected; wire a Panel only to supply a store by hand.

`Freeze` and `Frozen` are reserved names. `deterministic_only` components get
neither (they never call the model).

## Workflow

### Step 0: Preflight

1. **Rhino**: Call `rhino_ping`. If no response → tell user to open Rhino, stop.
2. **Chirp adapter**: Do not probe with a throwaway `chirp_create`; it mutates on success. The first user-authorized creation performs Chirp health admission before source generation or Grasshopper mutation. Classify any failure using the contract below.
3. **Grasshopper**: Call `gh_status` or `gh_snapshot`. If GH not open → tell user, stop.

Confirm Rhino and Grasshopper before proceeding. Chirp is admitted by the first authorized creation.

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

### Failure handling

- `chirp_invalid_inference_timeout`: Chirp is disabled by invalid timeout configuration. Report the configuration error and do not mutate Grasshopper.
- `chirp_inference_timeout`: Chirp exhausted its total inference budget. Report an inference timeout, not a compilation failure.
- `chirp_transport_timeout`: The generated client reached its outer transport ceiling. Verify Chirp/provider health before deciding whether to retry.
- `component_errors`: Report the messages returned by the Grasshopper component.
- `model_unavailable` (adapter 503, no credential for the model): creation still succeeds and the
  component still solves — it replays its frozen result or uses deterministic defaults (see below).
  Tell the user which model needs a key and where it goes; do not report a failed component.

After partial creation, take a fresh snapshot and retry only missing work. Never replay already successful creation or wiring.

## Frozen Results and No-Model Fallback

A Chirp component never turns red because a model is missing. Every solve takes one of four paths,
and the Reasoning output says which:

| Path | When | Reasoning prefix |
|---|---|---|
| live | model answered | none; the component then stores the response as its frozen result |
| frozen | `Freeze` is true and a frozen result exists | `[frozen]` |
| frozen replay | model unreachable or unavailable, frozen result exists | `[frozen replay: reason]` plus a runtime warning; adds "inputs changed since capture" when they did |
| deterministic fallback | model unavailable and nothing frozen, or `Freeze` is true with nothing frozen for that item | `[deterministic fallback: reason]` plus a runtime warning; outputs are typed zero values (0, 0.0, false, "") |

Each path is decided per list item: a component fed three briefs keeps three frozen entries and
can replay some items while others run live. Inference and transport timeouts are not fallbacks;
they remain hard errors (`chirp_inference_timeout`, `chirp_transport_timeout`) for the failure handling above.

Author `deterministic_code` runs after outputs on every path, so it can supply real defaults.
When creating a component that must solve on machines without a model, give it
`deterministic_code` that assigns sensible values when Reasoning starts with `[deterministic`.

Frozen results make definitions portable: a `.gh` solved once with a model reproduces the same
outputs on a machine with no key. Set `Freeze` to true to pin a result and stop paying for
re-solves; set it back to false to let the model run again.

## Signature Design Rules

- Output pin names become DSPy field names (snake_cased)
- Field names carry semantic weight: `structural_span_m` > `span` > `value1`
- Planners: signature starts with brief → domain params
- Interpreters: signature starts with reasoning → domain params
- Critics: signature starts with multiple reasoning inputs → conflicts, score, coherent
- Keep signatures focused: 2-4 inputs, 3-6 outputs
- The Correction, Freeze, Frozen and Reasoning pins are NOT in the signature — they're handled by the adapter and the generated component

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
