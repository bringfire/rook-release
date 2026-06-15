---
title: What Rook Touches
description: Plainly — what Rook runs on your machine, what it can reach, and what it deliberately won't do.
tableOfContents: true
sidebar:
  order: 2
---

You're giving Rook real access to your machine — it runs inside Rhino, talks to an
AI model, and works your files. That's worth being plain about. Here is what Rook
touches, what it can reach, and what it deliberately won't do. No fine print.

:::tip[The short version]
Rook runs **on your machine**. It talks only to the **AI provider you choose**, with
**your own key**, going **directly from your device**. The local pieces it runs are
reachable only from your own computer — not your network, not the internet. There's
no Rook account and no Rook server in the middle.
:::

## What runs on your machine

When Rook is installed, a few local pieces work together — all on your computer:

- **The Rhino plug-ins** — a native plug-in that does the geometry work, and a
  companion plug-in that handles Grasshopper and the panels.
- **A local server** — a small Python server (the "MCP server") that your AI
  assistant talks to. It's the translator between your assistant and Rhino.
- **A local chat helper** — when you use Rook's built-in chat panel, a small helper
  process runs alongside it.

None of these is a cloud service. There is no Rook back-end that your work passes
through.

## What it can reach

The only thing Rook reaches out to is **the AI model provider you configure** — for
example Anthropic (Claude), OpenAI (GPT), Google, or a local model through Ollama or
LM Studio. Those requests go **directly from your device to that provider, using your
own API key**. Rook does not relay them through any server of ours.

Everything else — your Rhino files, your prompts, the geometry and images Rook
produces, and the knowledge it builds up as you work — **stays on your device.** (See
the [Privacy Policy](/rook-release/legal/privacy/) for the full statement.)

## What it deliberately won't do

- **No keyboard automation.** Rook drives Rhino through its programming interface, not
  by simulating keystrokes or mouse clicks.
- **The panels can't browse the internet.** Rook's in-app panels are sandboxed; they
  load only their own bundled code and can't make outside network requests.
- **No account, no sign-in.** Rook doesn't require you to register with us.
- **No telemetry on your work.** Your designs, prompts, files, and keys are never
  collected. (Any optional diagnostic information excludes all of that — see
  [Privacy](/rook-release/legal/privacy/).)

## For your IT or security team

If you're reviewing Rook before rolling it out, here are the load-bearing properties.
These are stable invariants of how the software is built, not a list of patches.

**Network surface is loopback-only.** Every local server Rook runs binds to
`127.0.0.1` (your machine's loopback address). It is not reachable from your local
network or the internet. Ports are assigned by the operating system rather than
fixed, and the components find each other through small local discovery files — so
there is no well-known open port to target.

**The panels are sandboxed.** Rook's in-app surfaces are WebViews served from a
private virtual host, under a Content-Security-Policy that defaults to
`default-src 'none'`. In practice that means a panel can load only its own bundled
assets and **cannot make network requests** — there is no path for a panel to call
out to the internet.

**The local chat helper is gated by a secret, not just a port.** Every request to the
chat helper must carry a per-session token (`X-Rook-Session`) that's generated fresh
each time and shared only with Rook's own panel. A process that doesn't hold the
token is refused. (Cross-origin rules are a secondary hygiene layer; the token is the
real gate.)

**Operations are validated, not arbitrary.** Geometry and Grasshopper actions resolve
to typed routes that validate their inputs before running, rather than executing
free-form commands against your model.

**It's reviewed.** Rook's local surface has been security-audited and hardened, and we
treat that as ongoing work rather than a one-time checkbox.

---

Want the architecture rather than the trust boundaries? See
[Under the Hood](/rook-release/deeper/under-the-hood/). Want the data-handling
statement? See the [Privacy Policy](/rook-release/legal/privacy/).
