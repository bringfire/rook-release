---
title: Chirp
description: Native Grasshopper components powered by language models.
sidebar:
  order: 3
---

**Chirp** components are native Grasshopper nodes that run AI reasoning as part of
your definition. They take data in, think it through, and pass structured results
on — so a definition can make judgement calls, not just calculations.

## What they're for

Some steps in a design aren't pure geometry — they're decisions. *Which option
fits the brief? How should this be described? Is this result any good?* Chirp lets
you place that kind of reasoning right on the canvas, where it belongs, instead of
breaking out to a separate tool.

You stay in control of the structure; Chirp handles the judgement inside the box
you give it.

## Categories

Each Chirp component plays a role you'd recognize from a design team:

| Category | Role |
|----------|------|
| **Planner** | Breaks a goal into steps |
| **Interpreter** | Turns loose input into structured data |
| **Critic** | Reviews a result and flags issues |
| **Narrator** | Describes what's happening in plain language |
| **Classifier** | Sorts inputs into categories |
| **Gate** | Decides whether to pass or stop |
| **Editor** | Revises content against a goal |

## Cascades

Chain several Chirp components and they can share reasoning context — a *cascade* —
so a multi-step design stays coherent from one decision to the next. Ask Rook to
set one up by describing the chain you want.

## Connect a model

Chirp calls a language model with **your own key**. Without a key, Chirp components
still run: they return typed default values and show a warning, and any results you
froze with the **Freeze** pin keep replaying.

1. Open `%LOCALAPPDATA%\Rook\app\chirp\` in File Explorer.

2. Copy `.env.example` to a new file named `.env`, then replace `your-key-here` with
   your key:

   ```text
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Apply it. Chirp's background process reads `.env` only when it starts, and it keeps
   running after you close Rhino. Sign out of Windows and back in (or, in Task Manager →
   **Details**, end the `python.exe` processes whose command line contains
   `-m chirp --rook-managed`). The next Chirp component you **create** starts it again with
   your key.

Set your key before you build Chirp components if you can.

:::caution[Components you already have]
Each Chirp component remembers the exact address of the background process it was created
with, and every restart of that process (including a reboot) gets a new one. After a
restart, existing components don't reconnect when they recompute. They replay their frozen
result or return typed defaults, with the warning `adapter not running on localhost:…`.
To reconnect one, ask your agent to update the old port in that component's script to the
new one. That keeps its wires and its frozen results. Or ask it to recreate the component,
then rewire it; a recreated component starts with no frozen results.
:::

By default, planner components use `anthropic/claude-opus-5` and the other categories
use `anthropic/claude-sonnet-5`. To use another model or provider, set `CHIRP_MODEL` in
the same file (it replaces both defaults), with that provider's key:

| `CHIRP_MODEL` starts with | Key |
|---------------------------|-----|
| `anthropic/` | `ANTHROPIC_API_KEY` |
| `openai/` | `OPENAI_API_KEY` |
| `openrouter/` | `OPENROUTER_API_KEY` |
| `gemini/` | `GEMINI_API_KEY` |

For another OpenAI-compatible endpoint, describe it in `CHIRP_PROVIDERS`:

```text
CHIRP_MODEL=openai/my-model
CHIRP_PROVIDERS={"openai/my-model": {"api_base": "https://your-endpoint/v1", "api_key_env": "MY_ENDPOINT_KEY"}}
MY_ENDPOINT_KEY=...
```

:::caution[Keep a copy of your `.env`]
Installing a newer Rook over an existing one keeps your `.env`. **Uninstalling Rook
deletes it**, together with the rest of the Rook app folder.
:::

## How you make one

You don't configure Chirp by hand. Describe what the component should do:

> “Add a critic that checks each layout against the brief and flags the weak ones.”

Rook places and configures it.

:::tip[Try it — paste to your agent]
```text
Add a Chirp critic to my Grasshopper definition that reviews each layout option
against my brief and flags the weak ones.
```
:::

## Related

- [Rook in Grasshopper](/rook-release/modules/grasshopper/)
